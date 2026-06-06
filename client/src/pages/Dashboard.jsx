import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Zap, Car, Utensils, TrendingDown, TrendingUp, CheckCircle, ListChecks } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useCarbon from '../hooks/useCarbon';
import SkeletonLoader from '../components/SkeletonLoader';

import AtmosphereData from '../components/AtmosphereData';
import LiveEmissions from '../components/LiveEmissions';
import WorldPollutionStats from '../components/WorldPollutionStats';
import PersonalScore from '../components/PersonalScore';
import CalculatorCTA from '../components/CalculatorCTA';
import ProgressChart from '../components/ProgressChart';
import GoalCard from '../components/GoalCard';
import StreakBadge from '../components/StreakBadge';
import { TIPS } from '../constants/tips';

// Quick tips data for the "How to Reduce" highlight section
const REDUCE_HIGHLIGHTS = [
  {
    icon: Zap,
    title: 'Switch to Renewables',
    description: 'Choose a green energy provider or install solar panels. Could save up to 800 kg CO₂/year.',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/15',
  },
  {
    icon: Car,
    title: 'Rethink Transport',
    description: 'Bike, carpool, or switch to an EV. Short car trips replaced with cycling save 600 kg/yr.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/15',
  },
  {
    icon: Utensils,
    title: 'Eat More Plants',
    description: 'Reducing meat to 2 meals/week saves up to 900 kg CO₂/year. Small shifts, big impact.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/15',
  },
];

export const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { entries, loading: carbonLoading, fetchHistory } = useCarbon();

  // Fetch history if user is logged in — fetch more entries for chart and stats
  useEffect(() => {
    if (user) {
      fetchHistory(1, 50).catch(() => {});
    }
  }, [user, fetchHistory]);

  const hasEntries = entries && entries.length > 0;
  const latestEntry = hasEntries ? entries[0] : null;
  const previousEntry = (entries && entries.length >= 2) ? entries[1] : null;

  // Compute personal best & worst from entries
  const personalBest = hasEntries
    ? entries.reduce((min, e) => (e.totalKg < min.totalKg ? e : min), entries[0])
    : null;
  const personalWorst = hasEntries
    ? entries.reduce((max, e) => (e.totalKg > max.totalKg ? e : max), entries[0])
    : null;

  // Tip adoption stats
  const adoptedTips = user?.settings?.adoptedTips || [];
  const adoptedCount = adoptedTips.length;
  const totalTips = TIPS.length;
  const adoptedTipObjects = TIPS.filter(t => adoptedTips.includes(t.id));
  const potentialSavings = adoptedTipObjects.reduce((sum, t) => sum + (t.estimatedSavingKg || 0), 0);

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SkeletonLoader type="dashboard" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
    <h1 style={{color:"red",fontSize:"40px"}}>
    TEST DEPLOYMENT
    </h1>
      
      {/* SECTION 1 — Global Atmosphere Data */}
      <AtmosphereData />

      {/* SECTION 2 — Live CO₂ Emissions Counter */}
      <LiveEmissions />

      {/* SECTION 3 — World Footprint & Top Polluters */}
      <WorldPollutionStats />

      {/* SECTION 3.5 — How to Reduce Your Footprint (3-card highlight) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              How to Reduce Your Footprint
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Start with these high-impact actions. Every step counts.
            </p>
          </div>
          <Link
            to="/learn"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <BookOpen size={14} /> View all 20 techniques →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REDUCE_HIGHLIGHTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all duration-300"
              >
                <div className={`p-2.5 rounded-xl ${item.bg} ${item.color} w-fit mb-3`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile "View All" link */}
        <div className="sm:hidden text-center">
          <Link
            to="/learn"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400"
          >
            <BookOpen size={14} /> Explore all 20 techniques →
          </Link>
        </div>
      </section>

      {/* SECTION 4 — Your Score Card (if logged in) */}
      {user && carbonLoading && !hasEntries ? (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <SkeletonLoader type="dashboard" />
        </section>
      ) : (
        <PersonalScore 
          user={user} 
          latestEntry={latestEntry} 
          previousEntry={previousEntry} 
        />
      )}

      {/* ================================================================= */}
      {/* SECTION 5 — Enhanced Dashboard for Logged-in Users with History    */}
      {/* ================================================================= */}
      {user && hasEntries && (
        <>
          {/* Streak Badge Row */}
          <section className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm animate-[slideIn_0.5s_ease-out]">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Tracking Streak
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
                Consecutive months with at least one calculation
              </p>
            </div>
            <StreakBadge entries={entries} />
          </section>

          {/* Progress Chart (6-month bar chart) */}
          <ProgressChart entries={entries} />

          {/* Goal + Personal Best/Worst Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Goal Card */}
            <GoalCard latestEntry={latestEntry} />

            {/* Personal Best & Worst Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Personal Best */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between animate-[slideIn_0.6s_ease-out]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
                    <TrendingDown size={18} className="stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Personal Best
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {personalBest?.totalKg?.toLocaleString() || '0'} <span className="text-sm text-slate-400 font-bold">kg</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                    Grade {personalBest.grade} • {new Date(personalBest.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Personal Worst */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between animate-[slideIn_0.7s_ease-out]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl">
                    <TrendingUp size={18} className="stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Personal Worst
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                    {personalWorst?.totalKg?.toLocaleString() || '0'} <span className="text-sm text-slate-400 font-bold">kg</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                    Grade {personalWorst.grade} • {new Date(personalWorst.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Adoption Tracker */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 animate-[slideIn_0.8s_ease-out]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-violet-50 dark:bg-violet-950/20 text-violet-500 rounded-xl">
                  <ListChecks size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Tip Adoption Tracker
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Track your progress on eco tips
                  </p>
                </div>
              </div>
              <Link
                to="/learn"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Browse Tips →
              </Link>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">
                <span>{adoptedCount} of {totalTips} tips adopted</span>
                <span>{Math.round((adoptedCount / totalTips) * 100)}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-700 rounded-full"
                  style={{ width: `${(adoptedCount / totalTips) * 100}%` }}
                />
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-slate-850/30 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-800/50">
                <div className="text-lg font-black text-violet-600 dark:text-violet-400">
                  {adoptedCount}
                </div>
                <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Adopted
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-850/30 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-800/50">
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {potentialSavings.toLocaleString()}
                </div>
                <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  kg Saveable
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-850/30 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-800/50">
                <div className="text-lg font-black text-slate-700 dark:text-slate-300">
                  {totalTips - adoptedCount}
                </div>
                <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Remaining
                </div>
              </div>
            </div>

            {/* Adopted tips list (compact, max 4) */}
            {adoptedCount > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Your Adopted Tips
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {adoptedTipObjects.slice(0, 4).map(tip => (
                    <div
                      key={tip.id}
                      className="flex items-center gap-2 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl px-3 py-2"
                    >
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {tip.title}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 ml-auto whitespace-nowrap">
                        -{tip.estimatedSavingKg} kg
                      </span>
                    </div>
                  ))}
                </div>
                {adoptedCount > 4 && (
                  <p className="text-[10px] text-slate-400 font-bold text-center">
                    +{adoptedCount - 4} more adopted
                  </p>
                )}
              </div>
            )}
          </section>
        </>
      )}

      {/* SECTION 6 — Start Calculation CTA */}
      <CalculatorCTA user={user} hasEntries={hasEntries} />

    </div>
  );
};

export default Dashboard;
