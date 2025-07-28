# Production Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the ViticultWhisky platform to production.

## Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or other cloud MongoDB provider)
- Domain name and SSL certificates
- Cloud hosting accounts (Vercel/Netlify for frontend, Render/Railway for backend)
- SendGrid or similar email service account
- Cloudflare account (optional but recommended)

## Backend Deployment

### 1. Database Setup (MongoDB Atlas)
1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster (choose a region close to your users)
3. Set up database user with strong password
4. Whitelist IP addresses (or allow access from anywhere for cloud hosting)
5. Get your connection string

### 2. Environment Variables
Update the production environment variables in your hosting platform:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whisky-investment?retryWrites=true&w=majority
JWT_SECRET=<generate-secure-random-string-min-32-chars>
# ... (see .env.production for full list)
```

### 3. Deploy to Render.com
1. Create account at https://render.com
2. Connect your GitHub repository
3. Create new Web Service
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Add all production environment variables
5. Deploy

### 4. Deploy to Railway.app (Alternative)
1. Create account at https://railway.app
2. Create new project from GitHub
3. Add MongoDB plugin
4. Configure environment variables
5. Deploy

## Frontend Deployment

### 1. Update API URL
In `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### 2. Build for Production
```bash
cd frontend
npm run build
```

### 3. Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in frontend directory
3. Follow prompts
4. Set environment variables in Vercel dashboard

### 4. Deploy to Netlify (Alternative)
1. Create account at https://netlify.com
2. Drag and drop `build` folder or connect GitHub
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Add environment variables

## DNS and SSL Configuration

### 1. Domain Setup
1. Point your domain to hosting provider
2. Configure DNS records:
   - A record for apex domain
   - CNAME for www subdomain
   - MX records for email

### 2. SSL Certificates
- Vercel/Netlify: Automatic SSL
- Custom hosting: Use Let's Encrypt or Cloudflare

## Security Checklist

### Backend
- [x] JWT secret is strong and unique
- [x] MongoDB connection uses SSL
- [x] Rate limiting is configured
- [x] CORS is properly configured
- [x] Helmet.js is enabled
- [x] Input validation on all endpoints
- [x] Error messages don't leak sensitive info
- [x] Dependencies are up to date

### Frontend
- [x] API keys are in environment variables
- [x] No sensitive data in client code
- [x] Content Security Policy headers
- [x] HTTPS enforced

## Monitoring Setup

### 1. Error Tracking (Sentry)
1. Create account at https://sentry.io
2. Create new project
3. Get DSN
4. Add to environment variables
5. Install Sentry packages (already included)

### 2. Analytics (Google Analytics)
1. Create GA4 property
2. Get tracking ID
3. Add to frontend environment variables

### 3. Uptime Monitoring
- Use Render/Railway built-in monitoring
- Or set up external monitoring (Uptime Robot, Pingdom)

## Performance Optimization

### Backend
1. Enable MongoDB indexes:
```javascript
// Run in MongoDB shell
db.users.createIndex({ email: 1 })
db.contacts.createIndex({ createdAt: -1 })
// Add other indexes as needed
```

2. Enable Redis for sessions (optional):
```javascript
// Add Redis URL to environment variables
REDIS_URL=redis://...
```

### Frontend
1. Enable CDN for static assets
2. Optimize images (use WebP format)
3. Enable gzip compression
4. Set cache headers

## Backup Strategy

### Database Backups
1. Enable MongoDB Atlas automated backups
2. Configure retention period (30 days recommended)
3. Test restore procedure

### Code Backups
1. Use Git tags for releases: `git tag -a v1.0.0 -m "Initial release"`
2. Keep multiple deployment environments (staging, production)

## Deployment Commands

### Backend
```bash
# Production build and start
npm run build
npm start

# With PM2 (recommended)
pm2 start server.js --name whisky-backend
pm2 save
pm2 startup
```

### Frontend
```bash
# Production build
npm run build

# Serve locally for testing
npx serve -s build
```

## Post-Deployment

### 1. Testing
- [ ] Test all API endpoints
- [ ] Test form submissions
- [ ] Test email delivery
- [ ] Test payment flow (when implemented)
- [ ] Check mobile responsiveness
- [ ] Test error pages

### 2. Monitoring
- [ ] Set up alerts for errors
- [ ] Monitor API response times
- [ ] Track user analytics
- [ ] Monitor database performance

### 3. Maintenance
- [ ] Schedule regular dependency updates
- [ ] Plan for database migrations
- [ ] Document deployment process
- [ ] Create rollback plan

## Troubleshooting

### Common Issues

1. **CORS errors**
   - Check ALLOWED_ORIGINS in backend
   - Ensure frontend URL is whitelisted

2. **Database connection issues**
   - Verify MongoDB whitelist IPs
   - Check connection string format

3. **Email not sending**
   - Verify SMTP credentials
   - Check email service limits

4. **Slow performance**
   - Enable caching
   - Optimize database queries
   - Use CDN for assets

## Rollback Procedure

1. Keep previous version tagged in Git
2. In hosting platform, redeploy previous commit
3. Restore database from backup if needed
4. Notify team of rollback

## Support

For deployment support:
- Check hosting platform documentation
- Review error logs
- Contact: devops@whiskytradingco.com