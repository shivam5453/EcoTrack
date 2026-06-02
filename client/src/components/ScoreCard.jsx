import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { formatCarbonValue } from '../utils/formatters';
import { getGradeMeta } from '../utils/grading';
import CategoryBar from './CategoryBar';

/**
 * ScoreCard (Dashboard Section 1)
 * Renders user's latest total CO2 emission score, grade badge, percentage changes,
 * and the stacked CategoryBar distribution.
 */
export const ScoreCard = ({ currentScore = 0, previousScore = 0, breakdown = {}, grade = 'C', unit = 'kg' }) => {
  const meta = getGradeMeta(grade);

  // Calculate percentage change
  let pctChange = 0;
  let isWorse = false;
  if (previousScore > 0) {
    const diff = currentScore - previousScore;
    pctChange = Math.abs((diff / previousScore) * 100).toFixed(0);
    isWorse = diff > 0;
  }

  const hasMultipleEntries = previousScore > 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between gap-6">
      
      {/* Top Half: Grade & Score */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Left Side: Score Display */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Your Carbon Score
          </p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              {formatCarbonValue(currentScore, unit, false)}
            </h2>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {unit === 'tonnes' ? 'tonnes CO₂/yr' : 'kg CO₂/yr'}
            </span>
          </div>
        </div>

        {/* Right Side: Grade Badge & Percentage Trend */}
        <div className="flex items-center gap-3">
          {/* Grade Badge */}
          <div className={`
            px-4 py-2.5 rounded-2xl border text-center flex flex-col items-center justify-center font-black min-w-[70px]
            ${meta.bgColor} ${meta.borderColor} ${meta.color}
          `}>
            <span className="text-2xl leading-none">{grade}</span>
            <span className="text-[9px] font-bold tracking-widest mt-0.5 opacity-80 uppercase leading-none">GRADE</span>
          </div>

          {/* Trend Badge */}
          {hasMultipleEntries && (
            <div className={`
              flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border
              ${isWorse 
                ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-550/10 text-rose-600 dark:text-rose-400' 
                : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-550/10 text-emerald-600 dark:text-emerald-450'
              }
            `}>
              {isWorse ? (
                <>
                  <TrendingUp size={14} />
                  <span>{pctChange}% worse</span>
                </>
              ) : (
                <>
                  <TrendingDown size={14} />
                  <span>{pctChange}% better</span>
                </>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Description text */}
      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
        {meta.description}
      </p>

      {/* Separator */}
      <span className="h-px bg-slate-100 dark:bg-slate-800" />

      {/* Stacked Category Percentage Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-slate-400 dark:text-slate-500">
          <span>EMISSION CATEGORY BREAKDOWN</span>
          <span>Share (%)</span>
        </div>
        <CategoryBar breakdown={breakdown} total={currentScore} />
      </div>

    </div>
  );
};

export default ScoreCard;
