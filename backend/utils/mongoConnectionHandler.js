const mongoose = require('mongoose');
const logger = require('./logger');

/**
 * Enhanced MongoDB connection handler with retry logic for delete operations
 * Addresses recurring delete query interruption issues
 */
class MongoConnectionHandler {
  constructor() {
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.reconnectDelay = 1000; // 1 second
  }

  /**
   * Check if MongoDB is connected and ready for operations
   * @returns {boolean} Connection status
   */
  isConnected() {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Wait for MongoDB connection to be ready
   * @param {number} timeout - Maximum wait time in milliseconds
   * @returns {Promise<boolean>} Connection success
   */
  async waitForConnection(timeout = 5000) {
    return new Promise((resolve) => {
      if (this.isConnected()) {
        resolve(true);
        return;
      }

      const startTime = Date.now();
      const checkConnection = () => {
        if (this.isConnected()) {
          resolve(true);
          return;
        }

        if (Date.now() - startTime >= timeout) {
          resolve(false);
          return;
        }

        setTimeout(checkConnection, 100);
      };

      checkConnection();
    });
  }

  /**
   * Attempt to reconnect to MongoDB
   * @returns {Promise<boolean>} Reconnection success
   */
  async attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached');
      return false;
    }

    this.reconnectAttempts++;
    logger.info(`Attempting MongoDB reconnection (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    try {
      await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));
      
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/viticult-whisky', {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          maxPoolSize: 10,
          minPoolSize: 2,
          maxIdleTimeMS: 30000,
          family: 4 // Force IPv4 to avoid IPv6 connection issues
        });
      }

      const connected = await this.waitForConnection(3000);
      if (connected) {
        logger.info('MongoDB reconnection successful');
        this.reconnectAttempts = 0;
        return true;
      }

      return false;
    } catch (error) {
      logger.error(`MongoDB reconnection attempt ${this.reconnectAttempts} failed:`, error.message);
      return false;
    }
  }

  /**
   * Execute a delete operation with connection retry logic
   * @param {Function} deleteOperation - The delete operation to execute
   * @param {string} operationType - Type of operation for logging
   * @returns {Promise<any>} Operation result
   */
  async executeDeleteWithRetry(deleteOperation, operationType = 'delete') {
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;

      try {
        // Check connection before operation
        if (!this.isConnected()) {
          logger.warn(`MongoDB not connected before ${operationType} operation, attempting reconnection`);
          const reconnected = await this.attemptReconnect();
          
          if (!reconnected) {
            throw new Error('Failed to establish MongoDB connection');
          }
        }

        // Execute the delete operation
        const result = await deleteOperation();
        logger.info(`${operationType} operation completed successfully`);
        return result;

      } catch (error) {
        logger.error(`${operationType} operation attempt ${attempts} failed:`, {
          error: error.message,
          code: error.code,
          name: error.name
        });

        // Check if it's a connection-related error
        const isConnectionError = 
          error.name === 'MongoNetworkError' ||
          error.name === 'MongoTimeoutError' ||
          error.name === 'MongoServerSelectionError' ||
          error.code === 'ECONNREFUSED' ||
          error.message.includes('connection') ||
          error.message.includes('timeout');

        if (isConnectionError && attempts < maxAttempts) {
          logger.info(`Connection error detected, attempting retry for ${operationType} operation`);
          await this.attemptReconnect();
          continue;
        }

        // Re-throw non-connection errors or if max attempts reached
        throw error;
      }
    }
  }

  /**
   * Enhanced delete operation wrapper for individual documents
   * @param {Model} Model - Mongoose model
   * @param {string} id - Document ID to delete
   * @param {string} operationType - Operation description for logging
   * @returns {Promise<Object>} Delete result with document details
   */
  async safeDelete(Model, id, operationType = 'document') {
    return this.executeDeleteWithRetry(async () => {
      // Validate ObjectId format
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid document ID format');
      }

      // Find document first to get details for logging
      const document = await Model.findById(id);
      if (!document) {
        throw new Error('Document not found');
      }

      // Perform the delete operation
      await Model.findByIdAndDelete(id);

      return {
        success: true,
        deletedId: id,
        deletedDocument: document
      };
    }, `${operationType} delete`);
  }

  /**
   * Enhanced bulk delete operation wrapper
   * @param {Model} Model - Mongoose model
   * @param {Array} ids - Array of document IDs to delete
   * @param {string} operationType - Operation description for logging
   * @returns {Promise<Object>} Bulk delete result
   */
  async safeBulkDelete(Model, ids, operationType = 'documents') {
    return this.executeDeleteWithRetry(async () => {
      // Validate all IDs format
      const invalidIds = ids.filter(id => !id || !id.match(/^[0-9a-fA-F]{24}$/));
      if (invalidIds.length > 0) {
        throw new Error(`Invalid ID format: ${invalidIds.join(', ')}`);
      }

      // Get documents before deleting for logging
      const documentsToDelete = await Model.find({ _id: { $in: ids } }).select('_id');
      
      // Perform bulk delete
      const result = await Model.deleteMany({ _id: { $in: ids } });

      return {
        success: true,
        deletedCount: result.deletedCount,
        requestedCount: ids.length,
        deletedIds: documentsToDelete.map(doc => doc._id)
      };
    }, `${operationType} bulk delete`);
  }
}

// Export singleton instance
module.exports = new MongoConnectionHandler();