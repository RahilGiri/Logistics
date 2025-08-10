module.exports = {
  // Database Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/transcore_logistics',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    }
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    trustProxy: true
  },

  // Security Configuration
  security: {
    corsOrigin: process.env.CORS_ORIGIN || '*',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }
  },

  // Logging Configuration
  logging: {
    level: 'info',
    format: 'combined'
  },

  // Environment
  env: process.env.NODE_ENV || 'production'
};
