/**
 * EcoTrack Client Emission Factors Constants
 * These match the exact specifications required by the carbon calculator.
 */
export const EMISSION_FACTORS = {
  // Transport coefficients
  car: 0.21,              // kg CO₂ per km
  shortFlight: 150,       // kg CO₂ per flight
  longFlight: 400,        // kg CO₂ per flight
  transit: {
    never: 0,
    sometimes: 80,        // kg CO₂ per year
    daily: 250            // kg CO₂ per year
  },

  // Home Energy coefficients
  electricity: 0.233,     // kg CO₂ per kWh
  gas: 2.04,              // kg CO₂ per m³
  homeSize: {
    small: 100,           // kg CO₂ per year
    medium: 300,          // kg CO₂ per year
    large: 600            // kg CO₂ per year
  },

  // Diet habits coefficients (kg CO₂ per year)
  diet: {
    daily: 1500,          // daily meat
    weekly: 600,          // weekly meat
    rarely: 200,          // rarely meat
    never: 50             // vegan
  },
  
  // Food waste level coefficients (kg CO₂ per year)
  foodWaste: {
    high: 200,
    medium: 100,
    low: 20
  },

  // Shopping & Lifestyle coefficients
  onlineOrder: 2.5,       // kg CO₂ per order
  clothes: 15,            // kg CO₂ per item
  electronics: 80         // kg CO₂ per item
};

export default EMISSION_FACTORS;
