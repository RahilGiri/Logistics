# 🚚 Transcore Logistics - Professional Logistics Website

A modern, responsive logistics website with real-time shipment tracking, admin panel, and comprehensive logistics services.

## ✨ **Features**

- 🌐 **Responsive Design**: Mobile-first, modern UI/UX
- 📦 **Shipment Tracking**: Real-time consignment tracking system
- 🔐 **Admin Panel**: Secure admin interface for shipment updates
- 🚛 **Service Showcase**: Comprehensive logistics services
- 📱 **Mobile Optimized**: Works perfectly on all devices
- 🚀 **Production Ready**: Optimized for online deployment

## 🛠️ **Tech Stack**

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, Rate Limiting
- **Performance**: Compression, Connection Pooling
- **Deployment**: Docker, Heroku, Railway, Render ready

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### **Installation**
```bash
# Clone the repository
git clone <your-repo-url>
cd Logistics

# Install dependencies
npm install

# Create environment file
cp env.example .env
# Edit .env with your database and configuration

# Start development server
npm run dev
```

### **Production Start**
```bash
# Start in production mode
./start.sh

# Or manually
NODE_ENV=production node server.js
```

## 🌍 **Online Deployment Options**

### **1. Heroku (Recommended)**
```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Deploy
./deploy.sh heroku
```

### **2. Railway**
```bash
# Deploy to Railway
./deploy.sh railway
```

### **3. Render**
```bash
# Deploy to Render
./deploy.sh render
```

### **4. Docker**
```bash
# Build and run with Docker
docker-compose up -d
```

## 📁 **Project Structure**

```
Logistics/
├── 📄 HTML Pages
│   ├── index.html          # Homepage
│   ├── about.html          # About Us
│   ├── services.html       # Services
│   ├── network.html        # Network
│   ├── careers.html        # Careers
│   ├── contact.html        # Contact
│   └── tracking.html       # Tracking System
├── 🎨 Assets
│   ├── css/
│   │   ├── style.css       # Main styles
│   │   └── tracking.css    # Tracking styles
│   ├── js/
│   │   ├── script.js       # Main scripts
│   │   └── tracking.js     # Tracking logic
│   └── images/             # Optimized images
├── ⚙️ Configuration
│   ├── config/
│   │   ├── database.js     # Database connection
│   │   └── production.js   # Production config
│   ├── server.js           # Main server
│   ├── package.json        # Dependencies
│   └── .env               # Environment variables
├── 🚀 Deployment
│   ├── Dockerfile          # Docker configuration
│   ├── docker-compose.yml  # Local development
│   ├── Procfile           # Heroku deployment
│   ├── deploy.sh          # Deployment script
│   └── start.sh           # Production start
└── 📚 Documentation
    ├── README.md           # This file
    ├── DEPLOYMENT.md       # Deployment guide
    └── DEPLOYMENT_CHECKLIST.md # Pre-deployment checklist
```

## 🔌 **API Endpoints**

### **Tracking API**
- `POST /api/track` - Track shipment by consignment number

### **Admin API**
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/update` - Update shipment details

### **Health Check**
- `GET /health` - Application health status

## 👥 **Admin Access**

**Default Admin Users:**
- Username: `Vikas`, Password: `Vikas`
- Username: `Anshul`, Password: `Anshul`
- Username: `Sujal`, Password: `Sujal`
- Username: `Rahil`, Password: `Rahil`

⚠️ **Important**: Change these passwords in production!

## 🧪 **Development Scripts**

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run prod       # Start in production mode
npm run deploy     # Deploy to production
```

## 🔒 **Security Features**

- **Rate Limiting**: API protection against abuse
- **CORS Protection**: Secure cross-origin requests
- **Security Headers**: Helmet middleware
- **Input Validation**: Request data sanitization
- **Connection Pooling**: Database security

## 📊 **Monitoring & Health**

- **Health Endpoint**: `/health` for monitoring
- **Graceful Shutdown**: Proper database disconnection
- **Error Logging**: Comprehensive error handling
- **Performance**: Compression and optimization

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Database Connection Failed**
   - Check MongoDB URI in `.env`
   - Ensure MongoDB service is running
   - Verify network connectivity

2. **Port Already in Use**
   - Change PORT in `.env`
   - Kill existing processes: `pkill -f "node server.js"`

3. **Admin Login Issues**
   - Verify admin credentials
   - Check browser console for errors
   - Ensure server is running

### **Logs**
```bash
# View server logs
npm start

# Check health endpoint
curl http://localhost:3000/health
```

## 📞 **Support**

For technical support or questions:
- Check the `DEPLOYMENT.md` guide
- Review the deployment checklist
- Check server logs for errors

## 📄 **License**

This project is proprietary software for Transcore Logistics.

---

**Happy Deploying! 🚀**
