/**
 * EcoTrack Carbon Calculation Engine (Backend Utility)
 * 
 * Computes yearly CO2 emissions in kg based on strict GHG protocol scope definitions
 */

const calculateCarbon = (inputs) => {
  const { scope1 = {}, scope2 = {}, scope3 = {} } = inputs;

  // --- SCOPE 1: Direct Emissions ---
  const carFuel = (Number(scope1.carLitresWeek) || 0) * 2.31 * 52;
  const motoFuel = (Number(scope1.motorbikeLitresWeek) || 0) * 2.31 * 52;
  const homeGas = (Number(scope1.gasKgMonth) || 0) * 3.0 * 12;
  const heatingOil = (Number(scope1.oilLitresMonth) || 0) * 2.68 * 12;
  const generator = (Number(scope1.generatorLitresMonth) || 0) * 2.68 * 12;

  const scope1Total = carFuel + motoFuel + homeGas + heatingOil + generator;

  // --- SCOPE 2: Indirect Energy ---
  const rawElectricity = (Number(scope2.electricityKwhMonth) || 0) * 0.233 * 12;
  const renewablePercent = Number(scope2.renewablePercent) || 0;
  const effectiveElectricity = rawElectricity * (1 - (renewablePercent / 100));
  
  const districtHeating = (Number(scope2.districtHeatingKwhMonth) || 0) * 0.18 * 12;

  const scope2Total = effectiveElectricity + districtHeating;

  // --- SCOPE 3: Value Chain / Lifestyle ---
  // 3a. Travel
  const shortFlights = (Number(scope3.shortFlightsYear) || 0) * 150;
  const longFlights = (Number(scope3.longFlightsYear) || 0) * 400;
  const transit = (Number(scope3.transitKmWeek) || 0) * 0.089 * 52;
  const taxi = (Number(scope3.taxiKmWeek) || 0) * 0.21 * 52;
  const travelTotal = shortFlights + longFlights + transit + taxi;

  // 3b. Diet
  let meat = 600; // weekly
  if (scope3.meatFrequency === 'daily') meat = 1500;
  else if (scope3.meatFrequency === 'rarely') meat = 200;
  else if (scope3.meatFrequency === 'vegan') meat = 50;

  let dairy = 200; // medium
  if (scope3.dairyConsumption === 'high') dairy = 400;
  else if (scope3.dairyConsumption === 'low') dairy = 80;
  else if (scope3.dairyConsumption === 'none') dairy = 0;

  let waste = 100; // medium
  if (scope3.foodWaste === 'high') waste = 200;
  else if (scope3.foodWaste === 'low') waste = 20;

  const rawDiet = meat + dairy + waste;
  const localPercent = Number(scope3.localFoodPercent) || 0;
  const dietTotal = rawDiet * (1 - (localPercent / 100 * 0.10));

  // 3c. Shopping & Goods
  const onlineOrders = (Number(scope3.onlineOrdersMonth) || 0) * 2.5 * 12;
  const clothes = (Number(scope3.clothesYear) || 0) * 15;
  const electronics = (Number(scope3.electronicsYear) || 0) * 80;
  const furniture = (Number(scope3.furnitureYear) || 0) * 60;
  const shoppingTotal = onlineOrders + clothes + electronics + furniture;

  // 3d. Waste
  const rawWaste = (Number(scope3.wasteBagsWeek) || 0) * 11 * 52;
  let recycleFactor = 1; // none
  if (scope3.recyclingLevel === 'some') recycleFactor = 0.8;
  else if (scope3.recyclingLevel === 'most') recycleFactor = 0.5;
  else if (scope3.recyclingLevel === 'all') recycleFactor = 0.2;
  const wasteTotal = rawWaste * recycleFactor;

  const scope3Total = travelTotal + dietTotal + shoppingTotal + wasteTotal;

  // Category division breakdown rounded to integers
  const breakdown = {
    scope1: Math.round(scope1Total),
    scope2: Math.round(scope2Total),
    scope3: Math.round(scope3Total)
  };

  // Grand total CO2 in kg per year
  const totalKg = breakdown.scope1 + breakdown.scope2 + breakdown.scope3;

  // Letter Grade assignment (A-F) based on realistic targets
  // Target is < 2000, World is 4000.
  let grade = 'F';
  if (totalKg < 2000) grade = 'A';
  else if (totalKg >= 2000 && totalKg < 3000) grade = 'B';
  else if (totalKg >= 3000 && totalKg < 4000) grade = 'C';
  else if (totalKg >= 4000 && totalKg < 8000) grade = 'D';
  else if (totalKg >= 8000 && totalKg < 15000) grade = 'E';

  return {
    breakdown,
    totalKg,
    grade
  };
};

module.exports = {
  calculateCarbon
};
