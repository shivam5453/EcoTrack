const mongoose = require('mongoose');

const CarbonEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  reportTitle: {
    type: String,
    default: 'Untitled Report'
  },
  inputs: {
    scope1: {
      carLitresWeek: { type: Number, required: true },
      motorbikeLitresWeek: { type: Number, required: true },
      gasKgMonth: { type: Number, required: true },
      oilLitresMonth: { type: Number, required: true },
      generatorLitresMonth: { type: Number, required: true }
    },
    scope2: {
      electricityKwhMonth: { type: Number, required: true },
      renewablePercent: { type: Number, required: true },
      districtHeatingKwhMonth: { type: Number, required: true }
    },
    scope3: {
      shortFlightsYear: { type: Number, required: true },
      longFlightsYear: { type: Number, required: true },
      transitKmWeek: { type: Number, required: true },
      taxiKmWeek: { type: Number, required: true },
      meatFrequency: { type: String, enum: ['daily', 'weekly', 'rarely', 'vegan'], required: true },
      dairyConsumption: { type: String, enum: ['high', 'medium', 'low', 'none'], required: true },
      foodWaste: { type: String, enum: ['high', 'medium', 'low'], required: true },
      localFoodPercent: { type: Number, required: true },
      onlineOrdersMonth: { type: Number, required: true },
      clothesYear: { type: Number, required: true },
      electronicsYear: { type: Number, required: true },
      furnitureYear: { type: Number, required: true },
      wasteBagsWeek: { type: Number, required: true },
      recyclingLevel: { type: String, enum: ['none', 'some', 'most', 'all'], required: true }
    }
  },
  breakdown: {
    scope1: { type: Number, required: true },
    scope2: { type: Number, required: true },
    scope3: { type: Number, required: true }
  },
  totalKg: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F'],
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('CarbonEntry', CarbonEntrySchema);
