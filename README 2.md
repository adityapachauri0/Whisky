# ViticultWhisky - Premium Whiskey Investment Platform

A modern, responsive web application for whiskey cask investment, built with React and Node.js.

## 🥃 Overview

This platform connects investors with premium whiskey cask opportunities, providing a seamless experience from initial consultation to portfolio management.

## 🚀 Features

- **Elegant Design**: Premium UI/UX inspired by luxury investment platforms
- **Responsive Layout**: Mobile-first design that works on all devices
- **Investment Packages**: Multiple tiers from starter to exclusive
- **Content Management**: Blog system for market insights and education
- **Contact System**: Form submissions with email notifications
- **Consultation Booking**: Schedule meetings with investment specialists
- **SEO Optimized**: Built with best practices for search engines
- **Performance**: Optimized for speed with lazy loading and caching

## 🛠️ Tech Stack

### Frontend
- React 18+ with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Hook Form for forms
- Axios for API calls
- React Helmet Async for SEO

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for emails
- Express Rate Limit for security
- Helmet for security headers

## 📁 Project Structure

```
whiskey-investment-site/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── assets/       # Images and static files
│   └── public/           # Public assets
│
└── backend/              # Node.js API
    ├── controllers/      # Route controllers
    ├── models/          # MongoDB models
    ├── routes/          # API routes
    ├── middleware/      # Custom middleware
    └── utils/           # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd whiskey-investment-site
```

2. Install backend dependencies:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install --legacy-peer-deps
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application

1. Start MongoDB (if running locally):
```bash
mongod
```

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. In a new terminal, start the frontend:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🌐 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables
4. Deploy

### Backend (Render/Heroku)
1. Create a new web service
2. Connect your GitHub repo
3. Set environment variables
4. Deploy

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/whiskey-investment
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📱 Features in Detail

### Investment Packages
- **Starter**: €5,000 minimum investment
- **Premium**: €25,000 minimum investment
- **Exclusive**: €50,000+ investment

### Pages
- **Home**: Hero section, features, testimonials
- **About**: Company story, team, values
- **How It Works**: Step-by-step investment process
- **FAQ**: Comprehensive Q&A section
- **Blog**: Market insights and education
- **Contact**: Contact form and consultation booking

## 🔐 Security

- Rate limiting on API endpoints
- Input validation and sanitization
- Secure headers with Helmet
- Environment variable protection
- CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with passion for premium web experiences.

---

*Note: This is a demonstration project. Always seek professional financial advice before making investment decisions.*