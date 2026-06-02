import React from 'react';
import { ArrowUpRight, ArrowDownRight, Globe, Flame } from 'lucide-react';
import { formatCarbonValue } from '../utils/formatters';

/**
 * GlobalCompare (Dashboard Section 2)
 * Compares user CO2 score against international benchmarks.
 */
export const GlobalCompare = ({ userScore = 0, unit = 'kg' }) => {
  const worldAvg = 4000;
  const indiaAvg = 1700;

  const worldDiff = userScore - worldAvg;
  const worldIsAbove = worldDiff > 0;
  const worldDiffPct = Math.abs((worldDiff / worldAvg) * 100).toFixed(0);

  const indiaDiff = userScore - indiaAvg;
  const indiaIsAbove = indiaDiff > 0;
  const indiaDiffPct = Math.abs((indiaDiff / indiaAvg) * 100).toFixed(0);

  const dataRows = [
    { country: 'United States', score: 16000, desc: 'High fossil fuel & large home energy dependencies' },
    { country: 'Germany', score: 8900, desc: 'Industrialized economy, progressing on green grids' },
    { country: 'Global Average', score: 4000, desc: 'United Nations global baseline target' },
    { country: 'India Average', score: 1700, desc: 'Developing baseline, low average travel usage' },
    { country: 'YOU', score: userScore, isUser: true, desc: 'Your current calculated carbon footprint' }
  ];

  // Sort reference table descending to place user in correct context
  const sortedRows = [...dataRows].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      
      {/* 1. Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* World Average Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Globe size={20} />
          </div>
          <div className="space-y-1.5 flex-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
              vs World Average
            </p>
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-sm font-black text-slate-800 dark:text-white">4,000 kg</span>
            </div>

            {/* Above / Below Indicator */}
            <div className={`
              flex items-center gap-1 text-[11px] font-bold mt-1.5
              ${worldIsAbove 
                ? 'text-rose-600 dark:text-rose-400' 
                : 'text-emerald-600 dark:text-emerald-450'
              }
            `}>
              {worldIsAbove ? (
                <>
                  <ArrowUpRight size={14} />
                  <span>{worldDiffPct}% ABOVE world avg</span>
                </>
              ) : (
                <>
                  <ArrowDownRight size={14} />
                  <span>{worldDiffPct}% BELOW world avg</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* India Average Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <Flame size={20} />
          </div>
          <div className="space-y-1.5 flex-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
              vs India Average
            </p>
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-sm font-black text-slate-800 dark:text-white">1,700 kg</span>
            </div>

            {/* Above / Below Indicator */}
            <div className={`
              flex items-center gap-1 text-[11px] font-bold mt-1.5
              ${indiaIsAbove 
                ? 'text-rose-600 dark:text-rose-455' 
                : 'text-emerald-600 dark:text-emerald-450'
              }
            `}>
              {indiaIsAbove ? (
                <>
                  <ArrowUpRight size={14} />
                  <span>{indiaDiffPct}% ABOVE India avg</span>
                </>
              ) : (
                <>
                  <ArrowDownRight size={14} />
                  <span>{indiaDiffPct}% BELOW India avg</span>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 2. Reference Comparison Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
          Global Sustainability Rankings
        </h3>

        <div className="overflow-hidden border border-slate-100 dark:border-slate-800/80 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850/50 text-[10px] font-extrabold text-slate-450 dark:text-slate-450 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/60">
                <th className="px-4 py-3">Entity / Nation</th>
                <th className="px-4 py-3 hidden md:table-cell">General Carbon Context</th>
                <th className="px-4 py-3 text-right">Footprint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs font-semibold text-slate-650 dark:text-slate-400">
              {sortedRows.map((row) => (
                <tr 
                  key={row.country}
                  className={`
                    transition-colors
                    ${row.isUser 
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100 border-l-4 border-l-emerald-500 font-extrabold' 
                      : 'hover:bg-slate-50/50 dark:hover:bg-slate-850/20'
                    }
                  `}
                >
                  <td className="px-4 py-3.5 flex items-center gap-2">
                    {row.isUser && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />}
                    {row.country}
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-slate-450 dark:text-slate-500">{row.desc}</td>
                  <td className={`px-4 py-3.5 text-right font-bold ${row.isUser ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-300'}`}>
                    {formatCarbonValue(row.score, unit, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default GlobalCompare;
