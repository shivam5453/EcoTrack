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
    const { reportTitle, scope1 = {}, scope2 = {}, scope3 = {} } = req.body;

    const calculation = calculateCarbon({ scope1, scope2, scope3 });

    // Category calculation details matching carbonCalculator.js logic
    const carFuel = (Number(scope1.carLitresWeek) || 0) * 2.31 * 52;
    const motoFuel = (Number(scope1.motorbikeLitresWeek) || 0) * 2.31 * 52;
    const homeGas = (Number(scope1.gasKgMonth) || 0) * 3.0 * 12;
    const heatingOil = (Number(scope1.oilLitresMonth) || 0) * 2.68 * 12;
    const generator = (Number(scope1.generatorLitresMonth) || 0) * 2.68 * 12;

    const rawElectricity = (Number(scope2.electricityKwhMonth) || 0) * 0.233 * 12;
    const renewablePercent = Number(scope2.renewablePercent) || 0;
    const effectiveElectricity = rawElectricity * (1 - (renewablePercent / 100));
    const districtHeating = (Number(scope2.districtHeatingKwhMonth) || 0) * 0.18 * 12;

    const shortFlights = (Number(scope3.shortFlightsYear) || 0) * 150;
    const longFlights = (Number(scope3.longFlightsYear) || 0) * 400;
    const transit = (Number(scope3.transitKmWeek) || 0) * 0.089 * 52;
    const taxi = (Number(scope3.taxiKmWeek) || 0) * 0.21 * 52;

    let meat = 600;
    if (scope3.meatFrequency === 'daily') meat = 1500;
    else if (scope3.meatFrequency === 'rarely') meat = 200;
    else if (scope3.meatFrequency === 'vegan') meat = 50;

    let dairy = 200;
    if (scope3.dairyConsumption === 'high') dairy = 400;
    else if (scope3.dairyConsumption === 'low') dairy = 80;
    else if (scope3.dairyConsumption === 'none') dairy = 0;

    let waste = 100;
    if (scope3.foodWaste === 'high') waste = 200;
    else if (scope3.foodWaste === 'low') waste = 20;

    const rawDiet = meat + dairy + waste;
    const localPercent = Number(scope3.localFoodPercent) || 0;
    const dietTotal = rawDiet * (1 - (localPercent / 100 * 0.10));

    const onlineOrders = (Number(scope3.onlineOrdersMonth) || 0) * 2.5 * 12;
    const clothes = (Number(scope3.clothesYear) || 0) * 15;
    const electronics = (Number(scope3.electronicsYear) || 0) * 80;
    const furniture = (Number(scope3.furnitureYear) || 0) * 60;
    const shoppingTotal = onlineOrders + clothes + electronics + furniture;

    const rawWaste = (Number(scope3.wasteBagsWeek) || 0) * 11 * 52;
    let recycleFactor = 1;
    if (scope3.recyclingLevel === 'some') recycleFactor = 0.8;
    else if (scope3.recyclingLevel === 'most') recycleFactor = 0.5;
    else if (scope3.recyclingLevel === 'all') recycleFactor = 0.2;
    const wasteTotal = rawWaste * recycleFactor;

    const transport = Math.round(carFuel + motoFuel + shortFlights + longFlights + transit + taxi);
    const energy = Math.round(homeGas + heatingOil + generator + effectiveElectricity + districtHeating);
    const diet = Math.round(dietTotal);
    const food = Math.round(dietTotal);
    const shopping = Math.round(shoppingTotal + wasteTotal);

    const entry = await CarbonEntry.create({
      userId: req.user._id,
      reportTitle: reportTitle || 'Untitled Report',
      inputs: { scope1, scope2, scope3 },
      breakdown: {
        scope1: calculation.breakdown.scope1,
        scope2: calculation.breakdown.scope2,
        scope3: calculation.breakdown.scope3,
        transport,
        energy,
        diet,
        food,
        shopping
      },
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
