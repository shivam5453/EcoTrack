const CarbonRecord = require('../models/CarbonRecord');

/**
 * @desc    Get user dashboard stats (Current, Monthly Avg, Annual Projection, Improvement %)
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getStats = async (req, res) => {
  try {
    // Get last two records to calculate current and improvement %
    const records = await CarbonRecord.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(2);

    if (records.length === 0) {
      return res.json({
        success: true,
        data: {
          currentFootprint: 0,
          monthlyAverage: 0,
          annualProjection: 0,
          improvementPercentage: 0,
          hasRecords: false
        }
      });
    }

    const latestRecord = records[0];
    const currentFootprint = latestRecord.totalEmission;
    const annualProjection = currentFootprint * 12;

    // Calculate Monthly Average across all records
    const allRecords = await CarbonRecord.find({ userId: req.user._id });
    const totalEmissionsSum = allRecords.reduce((sum, rec) => sum + rec.totalEmission, 0);
    const monthlyAverage = Number((totalEmissionsSum / allRecords.length).toFixed(2));

    // Calculate Improvement % against the previous calculation
    let improvementPercentage = 0;
    if (records.length > 1) {
      const previousRecord = records[1];
      const prevEmission = previousRecord.totalEmission;
      
      if (prevEmission > 0) {
        // Positive means reduction in footprint (which is good)
        improvementPercentage = Number((((prevEmission - currentFootprint) / prevEmission) * 100).toFixed(2));
      }
    }

    res.json({
      success: true,
      data: {
        currentFootprint,
        monthlyAverage,
        annualProjection: Number(annualProjection.toFixed(2)),
        improvementPercentage,
        hasRecords: true
      }
    });
  } catch (error) {
    console.error('Stats controller error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving dashboard statistics' });
  }
};

/**
 * @desc    Compare latest user emission with Global, India and Sustainable Target
 * @route   GET /api/dashboard/comparison
 * @access  Private
 */
const getComparison = async (req, res) => {
  try {
    const latestRecord = await CarbonRecord.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (!latestRecord) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No carbon records found. Please calculate your footprint first.'
      });
    }

    const userEmission = latestRecord.totalEmission;
    const globalAverage = 400; // 400 kg CO2/month (approx 4.8 tons/year)
    const indiaAverage = 160;  // 160 kg CO2/month (approx 1.9 tons/year)
    const sustainableTarget = 150; // 150 kg CO2/month (approx 1.8 tons/year target)

    // Calculate percentage differences: Positive means user emits MORE, Negative means user emits LESS
    const vsGlobal = Number((((userEmission - globalAverage) / globalAverage) * 100).toFixed(2));
    const vsIndia = Number((((userEmission - indiaAverage) / indiaAverage) * 100).toFixed(2));
    const vsSustainable = Number((((userEmission - sustainableTarget) / sustainableTarget) * 100).toFixed(2));

    res.json({
      success: true,
      data: {
        userEmission,
        globalAverage,
        indiaAverage,
        sustainableTarget,
        vsGlobal,
        vsIndia,
        vsSustainable
      }
    });
  } catch (error) {
    console.error('Comparison controller error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving comparison data' });
  }
};

module.exports = {
  getStats,
  getComparison
};
