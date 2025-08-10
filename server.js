const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { connectDB, closeDB } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security and Performance Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS and Body Parser
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// MongoDB Connection
connectDB().then(() => {
  initializeDefaultData();
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// Initialize default data
const Shipment = require('./models/shipment');

async function initializeDefaultData() {
  try {
    const count = await Shipment.countDocuments();
    if (count === 0) {
      const defaultShipments = [
        {
          consignmentNo: 'TC001',
          origin: 'Mumbai, Maharashtra',
          destination: 'Delhi, NCR',
          status: 'In Transit',
          dispatchDate: '2025-01-10',
          expectedDelivery: '2025-01-15',
          currentLocation: 'Nagpur, Maharashtra',
          latitude: 21.1458,
          longitude: 79.0882,
          timeline: [
            {
              location: 'Mumbai, Maharashtra',
              time: '2025-01-10 08:00 AM',
              description: 'Shipment picked up from origin',
              completed: true
            },
            {
              location: 'Pune, Maharashtra',
              time: '2025-01-10 02:00 PM',
              description: 'In transit to destination',
              completed: true
            },
            {
              location: 'Nagpur, Maharashtra',
              time: '2025-01-11 10:30 AM',
              description: 'Currently at Nagpur hub',
              completed: true
            },
            {
              location: 'Bhopal, Madhya Pradesh',
              time: '2025-01-12 09:00 AM',
              description: 'Expected to reach Bhopal',
              completed: false
            },
            {
              location: 'Delhi, NCR',
              time: '2025-01-15 11:00 AM',
              description: 'Expected delivery',
              completed: false
            }
          ]
        },
        {
          consignmentNo: 'TC002',
          origin: 'Bangalore, Karnataka',
          destination: 'Chennai, Tamil Nadu',
          status: 'Out for Delivery',
          dispatchDate: '2025-01-08',
          expectedDelivery: '2025-01-13',
          currentLocation: 'Chennai, Tamil Nadu',
          latitude: 13.0827,
          longitude: 80.2707,
          timeline: [
            {
              location: 'Bangalore, Karnataka',
              time: '2025-01-08 09:00 AM',
              description: 'Shipment picked up from origin',
              completed: true
            },
            {
              location: 'Hosur, Tamil Nadu',
              time: '2025-01-09 03:00 PM',
              description: 'In transit to destination',
              completed: true
            },
            {
              location: 'Chennai, Tamil Nadu',
              time: '2025-01-10 11:00 AM',
              description: 'Arrived at destination hub',
              completed: true
            },
            {
              location: 'Chennai, Tamil Nadu',
              time: '2025-01-13 08:00 AM',
              description: 'Out for delivery',
              completed: true
            }
          ]
        },
        {
          consignmentNo: 'TC003',
          origin: 'Kolkata, West Bengal',
          destination: 'Hyderabad, Telangana',
          status: 'Delivered',
          dispatchDate: '2025-01-07',
          expectedDelivery: '2025-01-12',
          currentLocation: 'Delivered to recipient',
          latitude: 17.3850,
          longitude: 78.4867,
          timeline: [
            {
              location: 'Kolkata, West Bengal',
              time: '2025-01-07 10:00 AM',
              description: 'Shipment picked up from origin',
              completed: true
            },
            {
              location: 'Bhubaneswar, Odisha',
              time: '2025-01-08 02:00 PM',
              description: 'In transit to destination',
              completed: true
            },
            {
              location: 'Visakhapatnam, Andhra Pradesh',
              time: '2025-01-09 11:00 AM',
              description: 'In transit to destination',
              completed: true
            },
            {
              location: 'Hyderabad, Telangana',
              time: '2025-01-10 09:00 AM',
              description: 'Arrived at destination hub',
              completed: true
            },
            {
              location: 'Hyderabad, Telangana',
              time: '2025-01-12 02:30 PM',
              description: 'Successfully delivered to recipient',
              completed: true
            }
          ]
        },
        {
          consignmentNo: 'TC004',
          origin: 'Ahmedabad, Gujarat',
          destination: 'Pune, Maharashtra',
          status: 'Delayed',
          dispatchDate: '2025-01-09',
          expectedDelivery: '2025-01-14',
          currentLocation: 'Surat, Gujarat',
          latitude: 21.1702,
          longitude: 72.8311,
          timeline: [
            {
              location: 'Ahmedabad, Gujarat',
              time: '2025-01-09 08:00 AM',
              description: 'Shipment picked up from origin',
              completed: true
            },
            {
              location: 'Surat, Gujarat',
              time: '2025-01-09 06:00 PM',
              description: 'In transit to destination',
              completed: true
            },
            {
              location: 'Surat, Gujarat',
              time: '2025-01-10 09:00 AM',
              description: 'Delayed due to weather conditions',
              completed: true
            },
            {
              location: 'Mumbai, Maharashtra',
              time: '2025-01-11 10:00 AM',
              description: 'Expected to resume journey',
              completed: false
            },
            {
              location: 'Pune, Maharashtra',
              time: '2025-01-14 11:00 AM',
              description: 'Expected delivery',
              completed: false
            }
          ]
        }
      ];

      await Shipment.insertMany(defaultShipments);
      console.log('Default shipment data initialized successfully!');
    }
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
}

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Database Status Route
app.get('/api/status', async (req, res) => {
  try {
    const totalShipments = await Shipment.countDocuments();
    const recentShipments = await Shipment.find({})
      .sort({ _id: -1 })
      .limit(5)
      .select('consignmentNo origin destination status currentLocation');
    
    res.json({
      success: true,
      database: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        totalShipments,
        recentShipments
      }
    });
  } catch (error) {
    console.error('Error getting database status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/tracking.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'tracking.html'));
});

// Track shipment API
app.post('/api/track', async (req, res) => {
  try {
    const { consignmentNo, shipmentDate } = req.body;
    
    console.log('Tracking request received:', { consignmentNo, shipmentDate });
    
    if (!consignmentNo) {
      console.log('Tracking failed: Missing consignment number');
      return res.status(400).json({ error: 'Consignment number is required' });
    }
    
    const shipment = await Shipment.findOne({ consignmentNo: consignmentNo.toUpperCase() });
    
    if (!shipment) {
      console.log('Tracking failed: Shipment not found:', consignmentNo);
      return res.status(404).json({ success: false, error: 'Shipment not found' });
    }
    
    console.log('Tracking successful:', shipment.consignmentNo);
    res.json({ success: true, shipment });
  } catch (error) {
    console.error('Error tracking shipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin login API
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Define admin users
    const adminUsers = [
      { username: 'Vikas', password: 'Vikas' },
      { username: 'Anshul', password: 'Anshul' },
      { username: 'Sujal', password: 'Sujal' },
      { username: 'Rahil', password: 'Rahil' }
    ];
    
    // Check if credentials match any admin user
    const isValidUser = adminUsers.some(user => 
      user.username === username && user.password === password
    );
    
    if (isValidUser) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update or Create shipment API
app.post('/api/admin/update', async (req, res) => {
  try {
    const { consignmentNo, origin, destination, dispatchDate, currentLocation, status, expectedDelivery, timeline } = req.body;
    
    console.log('Update/Create request received:', req.body);
    
    if (!consignmentNo || !origin || !destination || !dispatchDate || !currentLocation || !status || !expectedDelivery) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Try to find existing shipment
    let shipment = await Shipment.findOne({ consignmentNo: consignmentNo.toUpperCase() });
    
    if (!shipment) {
      console.log('Creating new shipment:', consignmentNo);
      // Create new shipment if it doesn't exist
      shipment = new Shipment({
        consignmentNo: consignmentNo.toUpperCase(),
        origin,
        destination,
        status,
        dispatchDate,
        expectedDelivery,
        currentLocation,
        latitude: 23.5937, // Default coordinates (center of India)
        longitude: 78.9629,
        timeline: [{
          location: currentLocation,
          time: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          description: `Shipment created at ${currentLocation}`,
          completed: true
        }]
      });
    }
    
    // Add new timeline entry only if there are meaningful changes
    const newEntry = {
      location: currentLocation,
      time: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      description: `Status updated: ${status} at ${currentLocation}`,
      completed: true
    };
    
    // Update shipment fields
    shipment.origin = origin;
    shipment.destination = destination;
    shipment.currentLocation = currentLocation;
    shipment.status = status;
    shipment.dispatchDate = dispatchDate;
    shipment.expectedDelivery = expectedDelivery;
    
    // Add timeline entry only if location or status changed
    const lastEntry = shipment.timeline[shipment.timeline.length - 1];
    if (!lastEntry || 
        lastEntry.location !== currentLocation || 
        lastEntry.description !== `Status updated: ${status} at ${currentLocation}`) {
      shipment.timeline.push(newEntry);
    }
    
    await shipment.save();
    
    const isNewShipment = !shipment._id;
    console.log(`Shipment ${isNewShipment ? 'created' : 'updated'} successfully:`, shipment.consignmentNo);
    
    res.json({
      success: true,
      message: `Shipment ${isNewShipment ? 'created' : 'updated'} successfully`,
      isNewShipment,
      shipment: {
        consignmentNo: shipment.consignmentNo,
        origin: shipment.origin,
        destination: shipment.destination,
        currentLocation: shipment.currentLocation,
        status: shipment.status,
        dispatchDate: shipment.dispatchDate,
        expectedDelivery: shipment.expectedDelivery,
        latitude: shipment.latitude,
        longitude: shipment.longitude,
        timeline: shipment.timeline
      }
    });
  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Get all shipments API
app.get('/api/admin/shipments', async (req, res) => {
  try {
    const shipments = await Shipment.find({});
    res.json({ success: true, shipments });
  } catch (error) {
    console.error('Error getting shipments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new shipment API (for admin use only)
app.post('/api/admin/create', async (req, res) => {
  try {
    const { consignmentNo, origin, destination, dispatchDate, currentLocation, status, expectedDelivery } = req.body;
    
    console.log('Create shipment request received:', req.body);
    
    if (!consignmentNo || !origin || !destination || !dispatchDate || !currentLocation || !status || !expectedDelivery) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if shipment already exists
    const existingShipment = await Shipment.findOne({ consignmentNo: consignmentNo.toUpperCase() });
    if (existingShipment) {
      return res.status(409).json({ error: 'Shipment with this consignment number already exists' });
    }
    
    // Create new shipment
    const newShipment = new Shipment({
      consignmentNo: consignmentNo.toUpperCase(),
      origin: origin,
      destination: destination,
      status: status,
      dispatchDate: dispatchDate,
      expectedDelivery: expectedDelivery,
      currentLocation: currentLocation,
      latitude: 23.5937, // Default coordinates (center of India)
      longitude: 78.9629,
      timeline: [{
        location: currentLocation,
        time: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        description: `Shipment created at ${currentLocation}`,
        completed: true
      }]
    });
    
    await newShipment.save();
    console.log('New shipment created successfully:', newShipment.consignmentNo);
    
    res.json({
      success: true,
      message: 'Shipment created successfully',
      shipment: newShipment
    });
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Cleanup fake shipments API (for development/testing only)
app.delete('/api/admin/cleanup', async (req, res) => {
  try {
    // Only allow in development mode
    if (NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Cleanup not allowed in production' });
    }
    
    const { consignmentNumbers } = req.body;
    
    if (!consignmentNumbers || !Array.isArray(consignmentNumbers)) {
      return res.status(400).json({ error: 'Array of consignment numbers required' });
    }
    
    const result = await Shipment.deleteMany({ 
      consignmentNo: { $in: consignmentNumbers.map(cn => cn.toUpperCase()) } 
    });
    
    console.log(`Cleanup completed: ${result.deletedCount} shipments removed`);
    
    res.json({
      success: true,
      message: `${result.deletedCount} shipments removed`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 Server URL: ${NODE_ENV === 'production' ? 'https://yourdomain.com' : `http://localhost:${PORT}`}`);
  console.log('👥 Admin Users:');
  console.log('- Username: Vikas, Password: Vikas');
  console.log('- Username: Anshul, Password: Anshul');
  console.log('- Username: Sujal, Password: Sujal');
  console.log('- Username: Rahil, Password: Rahil');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  closeDB().then(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  closeDB().then(() => {
    process.exit(0);
  });
}); 