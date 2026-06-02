import EMISSION_FACTORS from '../constants/emissionFactors';

/**
 * EcoTrack Client-Side Carbon Footprint Calculator Engine
 * Calculates emissions based on exact values in kg CO2/year.
 */
export const calculateCarbonFootprint = (inputs) => {
  const { transport, energy, diet, shopping } = inputs;

  // 1. Transport Emissions
  const carKmWeek = Number(transport.carKmWeek) || 0;
  const shortFlights = Number(transport.shortFlights) || 0;
  const longFlights = Number(transport.longFlights) || 0;
  const transitUse = transport.transitUse || 'never';

  const transitFactor = EMISSION_FACTORS.transit[transitUse] || 0;
  const transportTotal = (carKmWeek * 52 * EMISSION_FACTORS.car) + 
                         (shortFlights * EMISSION_FACTORS.shortFlight) + 
                         (longFlights * EMISSION_FACTORS.longFlight) + 
                         transitFactor;

  // 2. Home Energy Emissions
  const electricityKwh = Number(energy.electricityKwh) || 0;
  const gasM3 = Number(energy.gasM3) || 0;
  const homeSize = energy.homeSize || 'medium';

  const homeSizeFactor = EMISSION_FACTORS.homeSize[homeSize] || 300;
  const energyTotal = (electricityKwh * 12 * EMISSION_FACTORS.electricity) + 
                      (gasM3 * 12 * EMISSION_FACTORS.gas) + 
                      homeSizeFactor;

  // 3. Diet Emissions
  const meatFrequency = diet.meatFrequency || 'weekly';
  const foodWaste = diet.foodWaste || 'medium';

  const meatFactor = EMISSION_FACTORS.diet[meatFrequency] || 600;
  const wasteFactor = EMISSION_FACTORS.foodWaste[foodWaste] || 100;
  const dietTotal = meatFactor + wasteFactor;

  // 4. Shopping & Lifestyle Emissions
  const onlineOrders = Number(shopping.onlineOrders) || 0;
  const clothesPerYear = Number(shopping.clothesPerYear) || 0;
  const electronicsPerYear = Number(shopping.electronicsPerYear) || 0;

  const shoppingTotal = (onlineOrders * 12 * EMISSION_FACTORS.onlineOrder) + 
                         (clothesPerYear * EMISSION_FACTORS.clothes) + 
                         (electronicsPerYear * EMISSION_FACTORS.electronics);

  // Group emissions into rounded whole kilograms
  const breakdown = {
    transport: Math.round(transportTotal),
    energy: Math.round(energyTotal),
    diet: Math.round(dietTotal),
    shopping: Math.round(shoppingTotal)
  };

  // Grand total CO2 in kg per year
  const totalKg = breakdown.transport + breakdown.energy + breakdown.diet + breakdown.shopping;

  // Grade calculation
  let grade = 'F';
  if (totalKg < 1500) grade = 'A';
  else if (totalKg >= 1500 && totalKg < 2500) grade = 'B';
  else if (totalKg >= 2500 && totalKg < 4000) grade = 'C';
  else if (totalKg >= 4000 && totalKg < 6000) grade = 'D';
  else if (totalKg >= 6000 && totalKg <= 10000) grade = 'E';

  return {
    breakdown,
    totalKg,
    grade
  };
};

export default calculateCarbonFootprint;
