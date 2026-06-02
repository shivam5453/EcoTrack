/**
 * Carbon Footprint Calculation Constants & Engine
 * All calculations are converted to monthly kilograms of CO2 equivalent (kg CO2e)
 */

const FACTORS = {
  transport: {
    car: 0.18,      // kg CO2 per km (average petrol car)
    bike: 0.04,     // kg CO2 per km (average motor bike)
    bus: 0.06,      // kg CO2 per km (average public transit bus)
    train: 0.03,    // kg CO2 per km (electric passenger train)
    flight: 0.15    // kg CO2 per km (aviation short/long haul mix)
  },
  energy: {
    electricity: 0.82, // kg CO2 per kWh (India/Global mixed grid intensity)
    lpg: 2.98         // kg CO2 per kg LPG
  },
  food: {
    vegetarian: 100,      // kg CO2 per month
    mixed: 180,           // kg CO2 per month
    nonVegetarian: 280    // kg CO2 per month
  },
  waste: {
    baseFactor: 0.5       // kg CO2 per kg waste generated
  }
};

/**
 * Calculates emissions for transportation in kg CO2/month
 */
const calculateTransportation = (inputs) => {
  const {
    carDistance = 0,
    bikeDistance = 0,
    busDistance = 0,
    trainDistance = 0,
    flightTravel = 0
  } = inputs;

  const carEmissions = carDistance * FACTORS.transport.car;
  const bikeEmissions = bikeDistance * FACTORS.transport.bike;
  const busEmissions = busDistance * FACTORS.transport.bus;
  const trainEmissions = trainDistance * FACTORS.transport.train;
  // Flight travel input is km/year, converted to monthly
  const flightEmissions = (flightTravel * FACTORS.transport.flight) / 12;

  return Number((carEmissions + bikeEmissions + busEmissions + trainEmissions + flightEmissions).toFixed(2));
};

/**
 * Calculates emissions for home energy in kg CO2/month
 */
const calculateEnergy = (inputs) => {
  const {
    electricity = 0,
    lpgUsage = 0,
    renewableRatio = 0
  } = inputs;

  // Reduce electricity emission based on renewable energy percentage
  const renewableSavingsFactor = 1 - Math.min(100, Math.max(0, renewableRatio)) / 100;
  const electricityEmissions = electricity * FACTORS.energy.electricity * renewableSavingsFactor;
  const lpgEmissions = lpgUsage * FACTORS.energy.lpg;

  return Number((electricityEmissions + lpgEmissions).toFixed(2));
};

/**
 * Calculates emissions for food habits in kg CO2/month
 */
const calculateFood = (inputs) => {
  const { dietType = 'mixed' } = inputs;
  let factor = FACTORS.food.mixed;
  
  if (dietType === 'vegetarian') {
    factor = FACTORS.food.vegetarian;
  } else if (dietType === 'non-vegetarian') {
    factor = FACTORS.food.nonVegetarian;
  }
  
  return factor;
};

/**
 * Calculates emissions for waste management in kg CO2/month
 */
const calculateWaste = (inputs) => {
  const {
    wasteGenerated = 0,
    recyclingRatio = 0
  } = inputs;

  // Reduce waste emission based on recycling percentage
  const recyclingSavingsFactor = 1 - Math.min(100, Math.max(0, recyclingRatio)) / 100;
  const wasteEmissions = wasteGenerated * FACTORS.waste.baseFactor * recyclingSavingsFactor;

  return Number(wasteEmissions.toFixed(2));
};

/**
 * Generates personalized, actionable recommendations based on emissions profile
 */
const generateRecommendations = (breakdown) => {
  const recommendations = [];
  const { transport, energy, food, waste } = breakdown;
  
  // Dynamic recommendations sorted by highest emission contributor
  const categories = [
    { name: 'Transportation', value: transport, list: [
      'Use public transportation (buses, trains) or carpool at least twice a week.',
      'Consider switching to an electric or hybrid vehicle for commute.',
      'Reduce short trips by car - walk or cycle instead.',
      'Limit long-haul flights or purchase verified carbon offsets for necessary travel.'
    ]},
    { name: 'Home Energy', value: energy, list: [
      'Replace incandescent bulbs with high-efficiency LED lights.',
      'Install solar panels or subscribe to a renewable energy grid plan.',
      'Unplug idle electronic devices and appliances to prevent phantom loads.',
      'Upgrade to 5-star BEE energy-efficient cooling and heating appliances.'
    ]},
    { name: 'Dietary Choices', value: food, list: [
      'Incorporate more plant-based meals into your weekly diet.',
      'Reduce consumption of red meat and dairy, which have high methane footprints.',
      'Minimize food waste by planning meals and composting organic remains.',
      'Support locally sourced and seasonal organic farm produce.'
    ]},
    { name: 'Waste Management', value: waste, list: [
      'Practice strict segregation of dry, wet, and hazardous household waste.',
      'Increase your recycling percentage by separating paper, glass, plastic, and metal.',
      'Avoid single-use plastic cups, containers, and packaging bags.',
      'Set up a home composting system for kitchen scraps and garden waste.'
    ]}
  ];

  // Sort categories by highest emission contributor
  categories.sort((a, b) => b.value - a.value);

  // Take top recommendations first
  categories.forEach((cat) => {
    // Add recommendations from the category
    recommendations.push(...cat.list.slice(0, 2));
  });

  return recommendations;
};

/**
 * Main calculation engine function
 */
const calculateCarbonFootprint = (inputs) => {
  const transport = calculateTransportation(inputs);
  const energy = calculateEnergy(inputs);
  const food = calculateFood(inputs);
  const waste = calculateWaste(inputs);

  const total = Number((transport + energy + food + waste).toFixed(2));

  const breakdown = {
    transport,
    energy,
    food,
    waste
  };

  const recommendations = generateRecommendations(breakdown);

  return {
    breakdown,
    total,
    recommendations
  };
};

module.exports = {
  calculateTransportation,
  calculateEnergy,
  calculateFood,
  calculateWaste,
  calculateCarbonFootprint,
  generateRecommendations
};
