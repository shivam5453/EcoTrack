import React from 'react';
import { Link } from 'react-router-dom';
import { User, ArrowDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const PersonalScore = ({ user, latestEntry, previousEntry }) => {

  if (!user) {
    return (
      <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-sm animate-[slideIn_0.6s_ease-out]">
        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto">
          <User size={28} />
        </div>
        <div className="space-y-2 max-w-sm mx-auto">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Your Personal Score</h2>
          <p className="text-sm font-semibold text-slate-500">Sign in to see your personal carbon score and track your progress</p>
        </div>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link to="/login" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition-colors">
            Log In
          </Link>
          <Link to="/register" className="px-6 py-2.5 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-black text-sm rounded-xl transition-colors">
            Create Account
          </Link>
        </div>
      </section>
    );
  }

  if (user && !latestEntry) {
    return (
      <section className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-8 text-center space-y-6 shadow-sm animate-[slideIn_0.6s_ease-out]">
        <div className="space-y-2 max-w-sm mx-auto">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Your Personal Score</h2>
          <p className="text-sm font-bold text-slate-500">You haven't calculated your footprint yet</p>
        </div>
        <div className="flex justify-center text-emerald-500 animate-bounce pt-2">
          <ArrowDown size={32} strokeWidth={3} />
        </div>
      </section>
    );
  }

  // If user and latestEntry
  const score = latestEntry.totalKg;
  let percentChange = 0;
  let changeType = 'none';
  if (previousEntry && previousEntry.totalKg > 0) {
    percentChange = ((score - previousEntry.totalKg) / previousEntry.totalKg) * 100;
    if (percentChange > 0) changeType = 'increase';
    else if (percentChange < 0) changeType = 'decrease';
  }

  const { transport, energy, food, shopping } = latestEntry.breakdown;
  const totalBreakdown = transport + energy + food + shopping || 1;

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-[slideIn_0.6s_ease-out]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Your Personal Score</h2>
          <p className="text-xs font-bold text-slate-500 mt-1">
            You are {score < 1700 ? 'below' : 'above'} the India average and {score < 4000 ? 'below' : 'above'} the World average.
          </p>
        </div>
        <Link to="/history" className="text-xs font-black text-emerald-600 dark:text-emerald-500 hover:underline">
          See full dashboard &rarr;
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        
        {/* Score & Grade */}
        <div className="flex items-center gap-6 pr-6 md:border-r border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-900 dark:bg-black text-white flex items-center justify-center text-3xl font-black shadow-inner shadow-emerald-500/20 border-4 border-slate-800 dark:border-slate-700">
            {latestEntry.grade}
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {score.toLocaleString()} <span className="text-sm text-slate-400">kg/yr</span>
            </div>
            {changeType !== 'none' ? (
              <div className={`text-xs font-bold flex items-center gap-1 mt-1 ${changeType === 'decrease' ? 'text-emerald-500' : 'text-red-500'}`}>
                {changeType === 'decrease' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                {Math.abs(percentChange).toFixed(1)}% vs last
              </div>
            ) : (
              <div className="text-xs font-bold flex items-center gap-1 mt-1 text-slate-400">
                <Minus size={14} /> No previous data
              </div>
            )}
          </div>
        </div>

        {/* Breakdown Mini-bar */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
            <span>Transport ({Math.round((transport/totalBreakdown)*100)}%)</span>
            <span>Energy ({Math.round((energy/totalBreakdown)*100)}%)</span>
            <span>Diet ({Math.round((food/totalBreakdown)*100)}%)</span>
            <span>Shopping ({Math.round((shopping/totalBreakdown)*100)}%)</span>
          </div>
          <div className="h-4 w-full rounded-full overflow-hidden flex">
            <div className="h-full bg-blue-500" style={{ width: `${(transport / totalBreakdown) * 100}%` }} title="Transport" />
            <div className="h-full bg-amber-500" style={{ width: `${(energy / totalBreakdown) * 100}%` }} title="Energy" />
            <div className="h-full bg-emerald-500" style={{ width: `${(food / totalBreakdown) * 100}%` }} title="Diet" />
            <div className="h-full bg-purple-500" style={{ width: `${(shopping / totalBreakdown) * 100}%` }} title="Shopping" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default PersonalScore;
