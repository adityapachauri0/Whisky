// MongoDB Authentication Setup Script
// Run this script on your VPS to secure MongoDB

// First, connect to MongoDB without auth and run this script:
// mongo < setup-mongodb-auth.js

// Switch to admin database
use admin

// Create admin user
db.createUser({
  user: "whiskyAdmin",
  pwd: "CHANGE_THIS_STRONG_PASSWORD",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})

// Switch to application database
use whisky-investment

// Create application user with limited permissions
db.createUser({
  user: "whiskyApp",
  pwd: "CHANGE_THIS_APP_PASSWORD",
  roles: [
    { role: "readWrite", db: "whisky-investment" }
  ]
})

print("MongoDB users created successfully!");
print("Next steps:");
print("1. Update mongod.conf to enable authentication:");
print("   security:");
print("     authorization: enabled");
print("2. Restart MongoDB: sudo systemctl restart mongod");
print("3. Update your connection string in .env.production:");
print("   MONGODB_URI=mongodb://whiskyApp:YOUR_APP_PASSWORD@localhost:27017/whisky-investment?authSource=whisky-investment");
print("4. Test connection: mongo -u whiskyApp -p YOUR_APP_PASSWORD --authenticationDatabase whisky-investment");