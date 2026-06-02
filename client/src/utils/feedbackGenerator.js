/**
 * feedbackGenerator.js
 * Generates dynamic, personalized feedback text based on
 * the user's grade (A–F) and their highest-emitting scope.
 */

const SCOPE_LABELS = {
  scope1: 'Scope 1 (Direct Emissions)',
  scope2: 'Scope 2 (Energy)',
  scope3: 'Scope 3 (Lifestyle)',
};

const QUICK_WINS = {
  scope1: [
    { action: 'Switch to an EV or hybrid vehicle', savingKg: 1200 },
    { action: 'Carpool or bike 2 days/week', savingKg: 600 },
    { action: 'Replace gas stove with induction', savingKg: 350 },
    { action: 'Service your vehicle regularly for fuel efficiency', savingKg: 200 },
  ],
  scope2: [
    { action: 'Switch to a 100% renewable energy provider', savingKg: 800 },
    { action: 'Install LED lighting throughout your home', savingKg: 150 },
    { action: 'Use a smart thermostat to cut heating/cooling waste', savingKg: 400 },
    { action: 'Unplug phantom loads and use power strips', savingKg: 100 },
  ],
  scope3: [
    { action: 'Reduce meat to 2 meals/week', savingKg: 900 },
    { action: 'Buy secondhand clothing instead of new', savingKg: 200 },
    { action: 'Replace 1 long-haul flight with a train trip', savingKg: 400 },
    { action: 'Start composting food waste', savingKg: 150 },
    { action: 'Shop local produce to cut food miles', savingKg: 120 },
  ],
};

const GRADE_MESSAGES = {
  A: {
    emoji: '🌟',
    headline: 'Outstanding!',
    detail: "You're well within sustainable limits. Your footprint is lighter than the Paris Agreement target. Keep inspiring others!",
    tone: 'celebrate',
  },
  B: {
    emoji: '💚',
    headline: 'Great work!',
    detail: "You're below the world average. A few small optimizations could push you into the elite A-grade territory.",
    tone: 'encourage',
  },
  C: {
    emoji: '🌍',
    headline: 'Room to grow.',
    detail: "You're around the global average. Targeted changes in your highest scope can make a real difference.",
    tone: 'guide',
  },
  D: {
    emoji: '⚠️',
    headline: 'Above average.',
    detail: 'Your footprint is higher than most. Focus on your biggest emission source to move the needle fast.',
    tone: 'warn',
  },
  E: {
    emoji: '🔴',
    headline: 'Significantly high.',
    detail: 'Immediate action is recommended. Even one major change can cut your footprint by 20% or more.',
    tone: 'urgent',
  },
  F: {
    emoji: '🚨',
    headline: 'Critical level.',
    detail: 'Your footprint is far above sustainable targets. Start with the quick wins below — every action counts.',
    tone: 'critical',
  },
};

/**
 * Determines which scope is the highest emitter.
 * @param {{ scope1: number, scope2: number, scope3: number }} breakdown
 * @returns {'scope1' | 'scope2' | 'scope3'}
 */
function getHighestScope(breakdown) {
  const { scope1 = 0, scope2 = 0, scope3 = 0 } = breakdown;
  if (scope1 >= scope2 && scope1 >= scope3) return 'scope1';
  if (scope2 >= scope1 && scope2 >= scope3) return 'scope2';
  return 'scope3';
}

/**
 * Generates a complete feedback object.
 *
 * @param {string} grade - Letter grade (A–F)
 * @param {{ scope1: number, scope2: number, scope3: number }} breakdown
 * @returns {{
 *   emoji: string,
 *   headline: string,
 *   detail: string,
 *   tone: string,
 *   highestScope: string,
 *   highestScopeLabel: string,
 *   quickWin: { action: string, savingKg: number },
 *   allTips: Array<{ action: string, savingKg: number }>
 * }}
 */
export function generateFeedback(grade, breakdown) {
  const gradeInfo = GRADE_MESSAGES[grade] || GRADE_MESSAGES['F'];
  const highestScope = getHighestScope(breakdown);
  const tips = QUICK_WINS[highestScope] || QUICK_WINS.scope3;

  // Pick the top quick-win (highest saving)
  const sortedTips = [...tips].sort((a, b) => b.savingKg - a.savingKg);
  const quickWin = sortedTips[0];

  return {
    emoji: gradeInfo.emoji,
    headline: gradeInfo.headline,
    detail: gradeInfo.detail,
    tone: gradeInfo.tone,
    highestScope,
    highestScopeLabel: SCOPE_LABELS[highestScope],
    quickWin,
    allTips: sortedTips.slice(0, 3), // Top 3 tips
  };
}

/**
 * Returns a single-line summary string for compact displays.
 */
export function getFeedbackSummary(grade, breakdown) {
  const fb = generateFeedback(grade, breakdown);
  return `${fb.emoji} ${fb.headline} Your biggest area is ${fb.highestScopeLabel}. Quick win: ${fb.quickWin.action} (~${fb.quickWin.savingKg} kg/yr saved).`;
}
