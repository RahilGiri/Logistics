const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  consignmentNo: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  origin: { 
    type: String, 
    required: true,
    trim: true
  },
  destination: { 
    type: String, 
    required: true,
    trim: true
  },
  status: { 
    type: String, 
    required: true,
    enum: ['Dispatched', 'In Transit', 'Out for Delivery', 'Delivered', 'Delayed']
  },
  dispatchDate: { 
    type: String, 
    required: true 
  },
  expectedDelivery: { 
    type: String, 
    required: true 
  },
  currentLocation: { 
    type: String, 
    required: true,
    trim: true
  },
  latitude: { 
    type: Number, 
    required: true,
    min: -90,
    max: 90
  },
  longitude: { 
    type: Number, 
    required: true,
    min: -180,
    max: 180
  },
  timeline: [{
    location: { 
      type: String, 
      required: true,
      trim: true
    },
    time: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true,
      trim: true
    },
    completed: { 
      type: Boolean, 
      default: false 
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
shipmentSchema.index({ consignmentNo: 1 }, { unique: true });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ dispatchDate: 1 });

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;
