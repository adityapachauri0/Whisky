#!/bin/bash

# Database Backup Script
# Automated MongoDB backup with compression and retention

PROJECT_NAME="viticult-whisky"
BACKUP_DIR="/var/backups/$PROJECT_NAME/database"
DB_NAME="viticult-whisky"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mongodb_backup_$TIMESTAMP.gz"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "$(date): Starting MongoDB backup..."

# Create backup with compression
if mongodump --db $DB_NAME --archive=$BACKUP_FILE --gzip; then
    echo "$(date): Backup successful: $BACKUP_FILE"
    
    # Get backup size
    BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
    echo "$(date): Backup size: $BACKUP_SIZE"
    
    # Remove old backups (keep last 30 days)
    find $BACKUP_DIR -name "mongodb_backup_*.gz" -mtime +$RETENTION_DAYS -delete
    echo "$(date): Old backups cleaned up (older than $RETENTION_DAYS days)"
    
    # Send success notification (optional - configure email)
    # echo "MongoDB backup successful - $BACKUP_SIZE" | mail -s "Backup Success" admin@viticultwhisky.co.uk
    
else
    echo "$(date): ERROR - Backup failed!"
    # Send failure notification
    # echo "MongoDB backup FAILED at $(date)" | mail -s "Backup FAILED" admin@viticultwhisky.co.uk
    exit 1
fi

echo "$(date): Backup process completed"