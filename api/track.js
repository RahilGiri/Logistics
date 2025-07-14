const mongoose = require('mongoose');

// Connection URI (replace with your production MongoDB URI or use environment variable)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transcore_logistics';

// Mongoose connection caching for serverless
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Shipment Schema (must be re-declared in serverless)
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
  timeline: [
    {
      location: { type: String, required: true },
      time: { type: String, required: true },
      description: { type: String, required: true },
      completed: { type: Boolean, default: false },
    },
  ],
});

const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectToDatabase();

  try {
    const { consignmentNo } = req.body;
    if (!consignmentNo) {
      return res.status(400).json({ error: 'Consignment number is required' });
    }
    const shipment = await Shipment.findOne({ consignmentNo: consignmentNo.toUpperCase() });
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} 