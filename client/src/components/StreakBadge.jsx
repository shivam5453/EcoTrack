import React from 'react';

export function calculateStreak(entries) {
  if (!entries || entries.length === 0) return 0;
  
  // Sort entries descending by date
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const prevMonthStart = new Date(currentMonthStart);
  prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);

  // Parse all entry dates into year-month keys
  const entryMonths = new Set(sorted.map(entry => {
    const d = new Date(entry.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }));

  const curKey = `${currentMonthStart.getFullYear()}-${String(currentMonthStart.getMonth() + 1).padStart(2, '0')}`;
  const prevKey = `${prevMonthStart.getFullYear()}-${String(prevMonthStart.getMonth() + 1).padStart(2, '0')}`;
  
  if (!entryMonths.has(curKey) && !entryMonths.has(prevKey)) {
    return 0;
  }

  let checkDate = entryMonths.has(curKey) ? new Date(currentMonthStart) : new Date(prevMonthStart);
  let streak = 0;

  while (true) {
    const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}`;
    if (entryMonths.has(key)) {
      streak++;
      checkDate.setMonth(checkDate.getMonth() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export const StreakBadge = ({ entries = [] }) => {
  const streak = calculateStreak(entries);

  if (streak === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-405">
        ✨ Start your streak — calculate this month!
      </span>
    );
  }

  if (streak >= 6) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-500 text-white animate-pulse shadow-md shadow-red-500/20">
        🏆 {streak} month streak!
      </span>
    );
  }

  if (streak >= 3) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-orange-500 text-white shadow-md shadow-orange-500/20 animate-[bounce_1s_infinite_alternate]">
        🔥 {streak} month streak
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
      🔥 {streak} month streak
    </span>
  );
};

export default StreakBadge;
