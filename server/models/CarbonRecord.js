const mongoose = require('mongoose');

const CarbonRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inputs: {
    carDistance: { type: Number, default: 0 },
    bikeDistance: { type: Number, default: 0 },
    busDistance: { type: Number, default: 0 },
    trainDistance: { type: Number, default: 0 },
    flightTravel: { type: Number, default: 0 },
    electricity: { type: Number, default: 0 },
    lpgUsage: { type: Number, default: 0 },
    renewableRatio: { type: Number, default: 0 },
    dietType: { type: String, default: 'mixed' },
    wasteGenerated: { type: Number, default: 0 },
    recyclingRatio: { type: Number, default: 0 }
  },
  transportationEmission: {
    type: Number,
    required: true
  },
  energyEmission: {
    type: Number,
    required: true
  },
  foodEmission: {
    type: Number,
    required: true
  },
  wasteEmission: {
    type: Number,
    required: true
  },
  totalEmission: {
    type: Number,
    required: true
  },
  recommendations: [
    {
      type: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CarbonRecord', CarbonRecordSchema);
