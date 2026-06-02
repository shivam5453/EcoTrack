const CarbonEntry = require('../models/CarbonEntry');
const { calculateCarbon } = require('../utils/carbonCalculator');
const { selectTips } = require('../utils/tipEngine');

/**
 * @desc    Calculate carbon footprint without saving
 * @route   POST /api/carbon/calculate
 * @access  Protected
 */
const calculateFootprint = async (req, res, next) => {
  try {
    const { reportTitle, scope1, scope2, scope3 } = req.body;

    const calculation = calculateCarbon({ scope1, scope2, scope3 });
    const recommendedTips = selectTips(calculation.breakdown);

    res.status(200).json({
      success: true,
      data: {
        inputs: { scope1, scope2, scope3 },
        breakdown: calculation.breakdown,
        totalKg: calculation.totalKg,
        grade: calculation.grade,
        tips: recommendedTips
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save carbon footprint entry to database
 * @route   POST /api/carbon/save
 * @access  Protected
 */
const saveEntry = async (req, res, next) => {
  try {
    const { reportTitle, scope1, scope2, scope3 } = req.body;

    const calculation = calculateCarbon({ scope1, scope2, scope3 });

    const entry = await CarbonEntry.create({
      userId: req.user._id,
      reportTitle: reportTitle || 'Untitled Report',
      inputs: { scope1, scope2, scope3 },
      breakdown: calculation.breakdown,
      totalKg: calculation.totalKg,
      grade: calculation.grade,
      date: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Carbon footprint logged successfully!',
      data: entry
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all carbon entries for the logged-in user (paginated)
 * @route   GET /api/carbon/history
 * @access  Protected
 */
const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const entries = await CarbonEntry.find({ userId: req.user._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CarbonEntry.countDocuments({ userId: req.user._id });

    res.status(200).json({
      success: true,
      count: entries.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalEntries: total
      },
      data: entries
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get carbon entry details by ID
 * @route   GET /api/carbon/history/:id
 * @access  Protected
 */
const getEntryById = async (req, res, next) => {
  try {
    const entry = await CarbonEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Carbon record not found.' });
    }

    // Verify ownership
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(451).json({ success: false, message: 'Unauthorized. This record does not belong to you.' });
    }

    // Attach custom tips
    const recommendedTips = selectTips(entry.breakdown);

    res.status(200).json({
      success: true,
      data: {
        ...entry.toObject(),
        tips: recommendedTips
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a carbon entry
 * @route   DELETE /api/carbon/:id
 * @access  Protected
 */
const deleteEntry = async (req, res, next) => {
  try {
    const entry = await CarbonEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Carbon record not found.' });
    }

    // Verify ownership
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized. You cannot delete this record.' });
    }

    await entry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Carbon footprint record deleted.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateFootprint,
  saveEntry,
  getHistory,
  getEntryById,
  deleteEntry
};
