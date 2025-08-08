// Test script for bulk delete visitors functionality
const axios = require('axios');

async function testBulkDelete() {
  try {
    console.log('🔑 Step 1: Logging in as admin...');
    
    // Login first to get auth token
    const loginResponse = await axios.post('http://localhost:5001/api/auth/admin/login', {
      email: 'admin@viticultwhisky.co.uk',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful! Token received.');
    
    // Get current visitors
    console.log('\n📊 Step 2: Fetching current visitors...');
    const visitorsResponse = await axios.get('http://localhost:5001/api/tracking/captured-data');
    const visitors = visitorsResponse.data.visitors || [];
    console.log(`Found ${visitors.length} visitors`);
    
    if (visitors.length === 0) {
      console.log('⚠️  No visitors to delete. Test complete.');
      return;
    }
    
    // Show first few visitors
    console.log('\nFirst 3 visitors:');
    visitors.slice(0, 3).forEach(v => {
      console.log(`  - ${v.visitorId}: ${v.name || 'Anonymous'} (${v.email || 'No email'})`);
    });
    
    // Test bulk delete with first 2 visitors
    const visitorIdsToDelete = visitors.slice(0, 2).map(v => v.visitorId);
    
    console.log(`\n🗑️  Step 3: Testing bulk delete of ${visitorIdsToDelete.length} visitors...`);
    console.log('Visitor IDs to delete:', visitorIdsToDelete);
    
    const deleteResponse = await axios.delete('http://localhost:5001/api/tracking/visitors/bulk', {
      data: { visitorIds: visitorIdsToDelete },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Delete response:', deleteResponse.data);
    
    // Verify deletion
    console.log('\n🔍 Step 4: Verifying deletion...');
    const afterDeleteResponse = await axios.get('http://localhost:5001/api/tracking/captured-data');
    const remainingVisitors = afterDeleteResponse.data.visitors || [];
    console.log(`Remaining visitors: ${remainingVisitors.length}`);
    console.log(`Deleted: ${visitors.length - remainingVisitors.length} visitors`);
    
    console.log('\n✨ Test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('URL:', error.config?.url);
    }
  }
}

// Run the test
console.log('🚀 Starting bulk delete test...\n');
testBulkDelete();