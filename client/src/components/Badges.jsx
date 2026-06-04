import React from 'react';
import {
  Calculator,
  Globe,
  Leaf,
  Award,
  Flame,
  TrendingDown,
  Star,
  Lock
} from 'lucide-react';
import { calculateStreak } from './StreakBadge';

const ICON_MAP = {
  'ti-calculator': Calculator,
  'ti-world': Globe,
  'ti-leaf': Leaf,
  'ti-award': Award,
  'ti-flame': Flame,
  'ti-trending-down': TrendingDown,
  'ti-star': Star
};

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800'
  },
  green: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  teal: {
    bg: 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-800'
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800'
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800'
  }
};

const BADGES = [
  {
    id: 'first_calc',
    title: 'First Step',
    desc: 'Completed your first calculation',
    icon: 'ti-calculator',
    color: 'blue',
    condition: (history) => history.length >= 1
  },
  {
    id: 'below_world',
    title: 'World Beater',
    desc: 'Your score is below the world average (4,000 kg)',
    icon: 'ti-world',
    color: 'green',
    condition: (history) => history.some(e => e.totalKg < 4000)
  },
  {
    id: 'below_india',
    title: 'Eco Indian',
    desc: 'Your score is below India average (1,700 kg)',
    icon: 'ti-leaf',
    color: 'teal',
    condition: (history) => history.some(e => e.totalKg < 1700)
  },
  {
    id: 'grade_a',
    title: 'Green Champion',
    desc: 'Achieved Grade A (under 2,000 kg CO₂/yr)',
    icon: 'ti-award',
    color: 'green',
    condition: (history) => history.some(e => e.grade === 'A')
  },
  {
    id: 'streak_3',
    title: '3 Month Streak',
    desc: 'Calculated for 3 consecutive months',
    icon: 'ti-flame',
    color: 'amber',
    condition: (history, streak) => streak >= 3
  },
  {
    id: 'improving',
    title: 'On the Way Down',
    desc: 'Reduced your score 3 calculations in a row',
    icon: 'ti-trending-down',
    color: 'teal',
    condition: (history) => {
      if (history.length < 3) return false;
      const last3 = history.slice(0, 3);
      return last3[0].totalKg < last3[1].totalKg && last3[1].totalKg < last3[2].totalKg;
    }
  },
  {
    id: 'five_calcs',
    title: 'Committed',
    desc: 'Completed 5 calculations',
    icon: 'ti-star',
    color: 'purple',
    condition: (history) => history.length >= 5
  }
];

export const Badges = ({ history = [] }) => {
  const streak = calculateStreak(history);
  
  // Calculate which badges are earned
  const badgeStatus = BADGES.map(badge => {
    const earned = badge.condition(history, streak);
    return { ...badge, earned };
  });

  const earnedCount = badgeStatus.filter(b => b.earned).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Achievements
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Earn badges by logging calculations and reducing your emissions footprint
          </p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black px-3 py-1.5 rounded-xl w-fit">
          {earnedCount} of {BADGES.length} badges earned
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badgeStatus.map((badge) => {
          const Icon = ICON_MAP[badge.icon] || Star;
          const colors = COLOR_MAP[badge.color] || COLOR_MAP.blue;
          
          return (
            <div
              key={badge.id}
              className={`relative border rounded-3xl p-5 flex flex-col items-center text-center justify-between gap-3 transition-all duration-300 ${
                badge.earned
                  ? `bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800 hover:shadow-md hover:scale-[1.02]`
                  : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/60 opacity-60'
              }`}
            >
              {/* Lock overlay for unearned badges */}
              {!badge.earned && (
                <div className="absolute top-3 right-3 text-slate-400" title="Locked">
                  <Lock size={14} />
                </div>
              )}

              {/* Badge Icon */}
              <div className={`p-3.5 rounded-2xl ${badge.earned ? colors.bg : 'bg-slate-200 dark:bg-slate-800 text-slate-400'} w-fit`}>
                <Icon size={24} />
              </div>

              {/* Text */}
              <div className="space-y-1">
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  {badge.title}
                </h4>
                <p className="text-xs text-slate-500 leading-normal max-w-[150px] font-semibold">
                  {badge.desc}
                </p>
              </div>

              {/* Condition */}
              {!badge.earned && (
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  Locked
                </div>
              )}
              {badge.earned && (
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded-lg">
                  Unlocked
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Badges;
