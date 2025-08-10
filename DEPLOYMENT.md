# 🚀 Deployment Guide for Transcore Logistics

This guide will help you deploy your logistics website online.

## 🌐 Deployment Options

### 1. **Heroku (Recommended for beginners)**
- Free tier available
- Easy MongoDB Atlas integration
- Automatic deployments from GitHub

### 2. **Railway**
- Simple deployment
- Good free tier
- Built-in MongoDB support

### 3. **Render**
- Free tier available
- Easy setup
- Good for Node.js apps

### 4. **DigitalOcean App Platform**
- More control
- Reasonable pricing
- Professional hosting

## 📋 Pre-Deployment Checklist

- [ ] Update environment variables
- [ ] Set up MongoDB Atlas (cloud database)
- [ ] Configure CORS for your domain
- [ ] Update Firebase configuration
- [ ] Test locally with production settings

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Choose free tier (M0)
   - Select cloud provider (AWS/Google Cloud/Azure)
   - Choose region closest to your users

3. **Set Up Database Access**
   - Create database user with read/write permissions
   - Note username and password

4. **Set Up Network Access**
   - Add IP address `0.0.0.0/0` (allows all IPs)
   - Or add specific IPs for security

5. **Get Connection String**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database_name`

## 🔧 Environment Variables Setup

Create a `.env` file in your project root:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/transcore_logistics

# Server
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your_very_long_random_secret_key_here
SESSION_SECRET=another_very_long_random_secret_key_here

# CORS
CORS_ORIGIN=https://yourdomain.com

# Firebase (update with your actual values)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

## 🚀 Heroku Deployment

### Step 1: Install Heroku CLI
```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Create Heroku App
```bash
heroku create your-logistics-app-name
```

### Step 4: Set Environment Variables
```bash
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set NODE_ENV="production"
heroku config:set CORS_ORIGIN="https://yourdomain.com"
```

### Step 5: Deploy
```bash
git add .
git commit -m "Prepare for production deployment"
git push heroku main
```

### Step 6: Open App
```bash
heroku open
```

## 🌍 Railway Deployment

1. **Connect GitHub Repository**
   - Go to [Railway](https://railway.app/)
   - Connect your GitHub account
   - Select your repository

2. **Configure Environment**
   - Add environment variables
   - Set `MONGODB_URI` to your MongoDB Atlas connection string

3. **Deploy**
   - Railway will automatically deploy on push
   - Get your app URL from dashboard

## 🔒 Security Considerations

### 1. **Environment Variables**
- Never commit `.env` files to Git
- Use platform-specific secret management
- Rotate secrets regularly

### 2. **Database Security**
- Use strong passwords
- Enable MongoDB Atlas security features
- Regular backups

### 3. **API Security**
- Rate limiting enabled
- CORS properly configured
- Input validation

## 📱 Domain Configuration

### 1. **Custom Domain Setup**
- Purchase domain from provider (GoDaddy, Namecheap, etc.)
- Configure DNS settings
- Point to your hosting platform

### 2. **SSL Certificate**
- Most platforms provide free SSL
- Enable HTTPS for security
- Update CORS_ORIGIN to use HTTPS

## 🧪 Testing Deployment

### 1. **Health Check**
```bash
curl https://yourapp.herokuapp.com/
```

### 2. **API Testing**
```bash
# Test tracking API
curl -X POST https://yourapp.herokuapp.com/api/track \
  -H "Content-Type: application/json" \
  -d '{"consignmentNo":"TC001"}'
```

### 3. **Admin Panel**
- Test admin login functionality
- Verify shipment updates work

## 📊 Monitoring & Maintenance

### 1. **Logs**
```bash
# Heroku
heroku logs --tail

# Railway
# View in dashboard
```

### 2. **Performance**
- Monitor response times
- Check database performance
- Set up alerts for downtime

### 3. **Updates**
- Regular dependency updates
- Security patches
- Feature updates

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check MongoDB Atlas network access
   - Verify connection string
   - Check credentials

2. **CORS Errors**
   - Update CORS_ORIGIN in environment
   - Check browser console for errors

3. **Build Failures**
   - Check package.json scripts
   - Verify all dependencies
   - Check platform-specific requirements

## 📞 Support

- **Heroku**: [Dev Center](https://devcenter.heroku.com/)
- **Railway**: [Documentation](https://docs.railway.app/)
- **MongoDB Atlas**: [Documentation](https://docs.atlas.mongodb.com/)

## 🎯 Next Steps

After successful deployment:

1. Set up monitoring and alerts
2. Configure custom domain
3. Set up CI/CD pipeline
4. Implement backup strategies
5. Plan scaling strategy

---

**Happy Deploying! 🚀**
