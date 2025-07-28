# ViticultWhisky - Premium Whisky Investment Platform

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd Whisky
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   cd ..
   ```

3. **Set up admin credentials**
   ```bash
   ./setup-admin.sh
   ```
   
   Default credentials:
   - Email: `admin@viticultwhisky.co.uk`
   - Password: `admin123`

4. **Start the application**
   ```bash
   ./start-servers.sh
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin/login
   - Backend API: http://localhost:5001

## 📋 Admin Panel

### First Time Login
1. Run `./setup-admin.sh` to configure admin credentials
2. Navigate to http://localhost:3000/admin/login
3. Enter your email and password
4. Click "Sign in"

### Forgot Password?
```bash
./reset-admin-password.sh
```

### Admin Features
- View and manage contact inquiries
- Export data to CSV
- Manage sell whisky submissions
- Configure site settings
- Change admin password

## 🛠 Common Tasks

### Change Admin Password
```bash
./reset-admin-password.sh
# Follow the prompts
```

### Setup New Admin
```bash
./setup-admin.sh
# Enter new email and password when prompted
```

### Check Server Status
```bash
ps aux | grep -E "node|react" | grep -v grep
```

### View Logs
```bash
tail -f backend.log    # Backend logs
tail -f frontend.log   # Frontend logs
```

## 📁 Project Structure
```
Whisky/
├── backend/           # Express.js API server
│   ├── controllers/   # Route controllers
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── utils/        # Utilities
│   └── server.js     # Main server file
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── public/
├── scripts/          # Utility scripts
├── setup-admin.sh    # Admin setup script
├── reset-admin-password.sh  # Password reset
└── start-servers.sh  # Start both servers
```

## 🔧 Configuration

### Environment Variables
Backend configuration is stored in `backend/.env`:
```env
NODE_ENV=development
ADMIN_EMAIL=admin@viticultwhisky.co.uk
ADMIN_PASSWORD_HASH=[bcrypt hash]
JWT_SECRET=[generated secret]
MONGODB_URI=mongodb://localhost:27017/viticultwhisky
```

### Ports
- Frontend: 3000
- Backend: 5001
- MongoDB: 27017

## 🚨 Troubleshooting

### Login Issues
1. Run `./setup-admin.sh` to reset credentials
2. Check if servers are running: `ps aux | grep node`
3. Verify MongoDB is running: `brew services list`
4. Check logs: `tail -f backend.log`

### Port Conflicts
```bash
# Kill processes on specific ports
lsof -ti:3000,5001 | xargs kill -9
```

### MongoDB Issues
```bash
# Start MongoDB
brew services start mongodb-community

# Check MongoDB status
brew services list
```

## 📚 Documentation
- [Admin Login Guide](./ADMIN_LOGIN_GUIDE.md)
- [Deployment Guide](./VPS_DEPLOYMENT_GUIDE.md)
- [Security Guide](./SECURITY.md)

## 🔒 Security
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Environment variables for sensitive data
- HTTPS enforced in production

## 📞 Support
For issues or questions:
1. Check the [Admin Login Guide](./ADMIN_LOGIN_GUIDE.md)
2. Review logs in `backend.log` and `frontend.log`
3. Run `./setup-admin.sh` for credential issues