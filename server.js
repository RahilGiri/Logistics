const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/transcore_logistics', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully!');
  initializeDefaultData();
});

// Shipment Schema
const shipmentSchema = new mongoose.Schema({
  consignmentNo: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, required: true },
  dispatchDate: { type: String, required: true },
  expectedDelivery: { type: String, required: true },
  currentLocation: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timeline: [{
    location: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }]
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

// Initialize default data
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
    
    if (!consignmentNo) {
      return res.status(400).json({ error: 'Consignment number is required' });
    }
    
    const shipment = await Shipment.findOne({ consignmentNo: consignmentNo.toUpperCase() });
    
    if (!shipment) {
      return res.status(404).json({ success: false, error: 'Shipment not found' });
    }
    
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

// Update shipment API
app.post('/api/admin/update', async (req, res) => {
  try {
    const { consignmentNo, origin, destination, dispatchDate, currentLocation, status, expectedDelivery, timeline } = req.body;
    
    console.log('Update request received:', req.body);
    
    if (!consignmentNo || !origin || !destination || !dispatchDate || !currentLocation || !status || !expectedDelivery || !timeline) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if shipment exists
    let shipment = await Shipment.findOne({ consignmentNo: consignmentNo.toUpperCase() });
    
    if (!shipment) {
      // Create new shipment if it doesn't exist
      console.log('Creating new shipment:', consignmentNo);
      shipment = new Shipment({
        consignmentNo: consignmentNo.toUpperCase(),
        origin: origin,
        destination: destination,
        status: status,
        dispatchDate: dispatchDate,
        expectedDelivery: expectedDelivery,
        currentLocation: currentLocation,
        latitude: 23.5937, // Default coordinates (center of India)
        longitude: 78.9629,
        timeline: []
      });
    }
    
    // Add new timeline entry
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
      description: `Location updated: ${currentLocation}`,
      completed: true
    };
    
    // Update shipment
    shipment.origin = origin;
    shipment.destination = destination;
    shipment.currentLocation = currentLocation;
    shipment.status = status;
    shipment.dispatchDate = dispatchDate;
    shipment.expectedDelivery = expectedDelivery;
    shipment.timeline.push(newEntry);
    
    await shipment.save();
    
    console.log('Shipment updated successfully:', shipment.consignmentNo);
    
    res.json({
      success: true,
      message: 'Shipment updated successfully',
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Admin Users:');
  console.log('- Username: Vikas, Password: Vikas');
  console.log('- Username: Anshul, Password: Anshul');
  console.log('- Username: Sujal, Password: Sujal');
  console.log('- Username: Rahil, Password: Rahil');
}); 