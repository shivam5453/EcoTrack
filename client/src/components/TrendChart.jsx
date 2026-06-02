import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingDown, TrendingUp, BarChart3, HelpCircle } from 'lucide-react';
import { formatCarbonValue, formatDate } from '../utils/formatters';
import CategoryBar from './CategoryBar';

/**
 * TrendChart (Dashboard Section 3)
 * Renders Recharts bar chart of the last 6 submissions, calculates trend slope,
 * and handles interactive details on bar-selection events.
 */
export const TrendChart = ({ entries = [], unit = 'kg' }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);

  if (!entries || entries.length === 0) return null;

  // Take the last 6 records, sorted Chronologically (oldest to newest) for chart progression
  const lastSix = [...entries]
    .slice(0, 6)
    .reverse()
    .map((e) => ({
      ...e,
      formattedDate: formatDate(e.date),
      // support unit conversions directly in chart
      displayTotal: unit === 'tonnes' ? Number((e.totalKg / 1000).toFixed(2)) : e.totalKg
    }));

  // Determine trend slope based on first vs last of the 6 records
  let isImproving = true;
  let slopeText = 'Improving';
  
  if (lastSix.length >= 2) {
    const firstVal = lastSix[0].totalKg;
    const lastVal = lastSix[lastSix.length - 1].totalKg;
    isImproving = lastVal <= firstVal;
    slopeText = isImproving ? 'Improving' : 'Worsening';
  }

  // Handle bar clicks to reveal details
  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const entry = data.activePayload[0].payload;
      setSelectedEntry(entry);
    }
  };

  const activeEntryToShow = selectedEntry || lastSix[lastSix.length - 1];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Your Carbon Trend
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">History of your last 6 calculations</p>
          </div>
        </div>

        {/* Auto Trend Badge */}
        {lastSix.length >= 2 && (
          <div className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border sm:self-center
            ${isImproving 
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/10 text-emerald-600 dark:text-emerald-450' 
              : 'bg-rose-50 dark:bg-rose-950/20 border-rose-500/10 text-rose-600 dark:text-rose-455'
            }
          `}>
            {isImproving ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            <span>Trend: {slopeText}</span>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={lastSix} 
            onClick={handleBarClick}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 10, fontWeight: 700, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              className="text-slate-400 dark:text-slate-500"
            />
            <YAxis 
              tick={{ fontSize: 10, fontWeight: 700, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              className="text-slate-400 dark:text-slate-500"
            />
            <Tooltip 
              cursor={{ fill: 'rgba(16, 185, 129, 0.04)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white dark:bg-slate-950 px-3.5 py-2.5 rounded-2xl border border-slate-800 shadow-2xl text-xs space-y-1">
                      <p className="font-bold uppercase tracking-wider opacity-60 text-[9px]">{payload[0].payload.formattedDate}</p>
                      <p className="font-black text-emerald-400">{formatCarbonValue(payload[0].value, unit, true)}</p>
                      <p className="text-[9px] text-slate-400">Click bar for full breakdown</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="displayTotal" 
              radius={[6, 6, 0, 0]} 
              cursor="pointer"
            >
              {lastSix.map((entry, idx) => {
                const isActive = activeEntryToShow && activeEntryToShow._id === entry._id;
                return (
                  <Cell 
                    key={`cell-${idx}`} 
                    fill={isActive ? '#10b981' : '#94a3b8'} 
                    opacity={isActive ? 1 : 0.45}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Entry Breakdown */}
      {activeEntryToShow && (
        <div className="bg-slate-50 dark:bg-slate-850/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3.5">
          <div className="flex justify-between items-center text-xs font-bold text-slate-450 dark:text-slate-500">
            <span className="flex items-center gap-1">
              RECORDS DETAILS: <span className="text-slate-700 dark:text-slate-300">{activeEntryToShow.formattedDate}</span>
            </span>
            <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 font-bold">
              Grade {activeEntryToShow.grade}
            </span>
          </div>

          <CategoryBar breakdown={activeEntryToShow.breakdown} total={activeEntryToShow.totalKg} />
        </div>
      )}

    </div>
  );
};

export default TrendChart;
