/**
 * EcoTrack Client UI Formatters
 */

/**
 * Formats emission weight based on user preferred unit (kg or tonnes)
 * @param {number} kgVal - Weight in kg
 * @param {string} unit - Preferred unit ('kg' or 'tonnes')
 * @param {boolean} showLabel - If true, appends 'kg CO₂/yr' or 'tonnes CO₂/yr'
 */
export const formatCarbonValue = (kgVal, unit = 'kg', showLabel = true) => {
  const roundedVal = Math.round(kgVal);
  
  if (unit === 'tonnes') {
    const tonnesVal = (roundedVal / 1000).toFixed(2);
    return showLabel ? `${tonnesVal} t CO₂/yr` : tonnesVal;
  }
  
  const formattedVal = new Intl.NumberFormat('en-IN').format(roundedVal);
  return showLabel ? `${formattedVal} kg CO₂/yr` : formattedVal;
};

/**
 * Formats date into readable string (e.g. "Jun 1, 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Capitalizes first letter of any text
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
