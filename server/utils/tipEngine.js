const TIPS = [
  // Scope 1 (Direct fuel burn: cars, home heating)
  { id: 's1-1', scope: 'scope1', title: 'Cycle or walk for short trips', description: 'For distances under 3km, opt to walk or bike.', estimatedSavingKg: 400 },
  { id: 's1-2', scope: 'scope1', title: 'Carpool with colleagues', description: 'Share rides to work to halve your commuting emissions.', estimatedSavingKg: 600 },
  { id: 's1-3', scope: 'scope1', title: 'Switch to electric vehicle', description: 'When buying your next car, choose electric or hybrid models.', estimatedSavingKg: 2400 },
  { id: 's1-4', scope: 'scope1', title: 'Improve home insulation', description: 'Insulate your home to burn less gas/oil for heating.', estimatedSavingKg: 600 },
  
  // Scope 2 (Indirect electricity)
  { id: 's2-1', scope: 'scope2', title: 'Switch to renewable electricity provider', description: 'Switch your utility plan to 100% wind or solar.', estimatedSavingKg: 1500 },
  { id: 's2-2', scope: 'scope2', title: 'Install solar panels', description: 'Generate your own clean renewable electricity.', estimatedSavingKg: 1200 },
  { id: 's2-3', scope: 'scope2', title: 'Use energy-efficient appliances', description: 'Upgrade to 5-star rated appliances.', estimatedSavingKg: 300 },
  { id: 's2-4', scope: 'scope2', title: 'Switch off standby devices', description: 'Unplug TVs, monitors, and chargers.', estimatedSavingKg: 100 },

  // Scope 3 (Lifestyle, Diet, Shopping, Flights)
  { id: 's3-1', scope: 'scope3', title: 'Reduce meat to 3 days/week', description: 'Commit to plant-based meals multiple days a week.', estimatedSavingKg: 900 },
  { id: 's3-2', scope: 'scope3', title: 'Reduce flights, take trains instead', description: 'Avoid short-haul domestic flights.', estimatedSavingKg: 1800 },
  { id: 's3-3', scope: 'scope3', title: 'Go fully plant-based', description: 'Transition fully to plant-based diets.', estimatedSavingKg: 1500 },
  { id: 's3-4', scope: 'scope3', title: 'Buy second-hand clothing', description: 'Buy clothes from thrift stores instead of fast-fashion.', estimatedSavingKg: 400 },
  { id: 's3-5', scope: 'scope3', title: 'Reduce food waste by meal planning', description: 'Plan meals to avoid throwing away fresh food.', estimatedSavingKg: 300 },
];

const selectTips = (breakdown) => {
  // Find highest category emission value
  const categories = Object.keys(breakdown); // ['scope1', 'scope2', 'scope3']
  let maxCat = 'scope3';
  let maxVal = breakdown.scope3 || 0;

  categories.forEach((cat) => {
    if ((breakdown[cat] || 0) > maxVal) {
      maxVal = breakdown[cat];
      maxCat = cat;
    }
  });

  const matchedTips = TIPS.filter((t) => t.scope === maxCat);
  return matchedTips.sort((a, b) => b.estimatedSavingKg - a.estimatedSavingKg).slice(0, 3);
};

module.exports = { TIPS, selectTips };
