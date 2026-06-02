import { TIPS } from '../constants/tips';

/**
 * Custom Tip Selector Algorithm (Client-Side)
 * Auto-selects 3 personalized tips matching the user's highest emission category,
 * sorted by descending estimatedSavingKg.
 * 
 * @param {Object} breakdown - Category breakdown (e.g. { transport, energy, diet, shopping })
 * @returns {Array} List of 3 selected tips
 */
export const selectTips = (breakdown) => {
  if (!breakdown) return [];

  const categories = Object.keys(breakdown); // ['transport', 'energy', 'diet', 'shopping']
  
  let maxCat = 'transport';
  let maxVal = breakdown.transport || 0;

  // Identify category with highest emissions
  categories.forEach((cat) => {
    const value = breakdown[cat] || 0;
    if (value > maxVal) {
      maxVal = value;
      maxCat = cat;
    }
  });

  // Filter tips by the highest-emitting category
  const matchedTips = TIPS.filter((tip) => tip.category === maxCat);

  // Sort matching tips by estimatedSavingKg descending
  const sortedTips = matchedTips.sort((a, b) => b.estimatedSavingKg - a.estimatedSavingKg);

  // Take the top 3 recommendations
  return sortedTips.slice(0, 3);
};

export default selectTips;
