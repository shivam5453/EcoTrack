import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ArrowDown, ArrowUp, Info } from 'lucide-react';

export const ProgressChart = ({ entries = [] }) => {
  if (!entries || entries.length === 0) {
    return null;
  }

  // Take the last 6 entries (they come sorted newest first from backend)
  const last6 = entries.slice(0, 6);
  // Reverse to display chronologically (left to right)
  const chronological = [...last6].reverse();

  // Latest and previous calculations for trend comparison
  const latest = last6[0];
  const previous = last6[1];

  let trendText = '';
  let trendType = 'neutral'; // 'improving', 'worsening', 'neutral'

  if (last6.length === 1) {
    trendText = 'Complete more calculations to see your trend';
  } else if (latest && previous) {
    const diff = latest.totalKg - previous.totalKg;
    const pct = previous.totalKg > 0 ? (Math.abs(diff) / previous.totalKg) * 100 : 0;
    
    if (diff < 0) {
      trendType = 'improving';
      trendText = `↓ Improving — down ${pct.toFixed(1)}% from last calculation`;
    } else if (diff > 0) {
      trendType = 'worsening';
      trendText = `↑ Worsening — up ${pct.toFixed(1)}% from last calculation`;
    } else {
      trendText = 'Stable — same footprint as last calculation';
    }
  }

  // Format data for Recharts
  const data = chronological.map((entry, idx) => {
    let color = '#3b82f6'; // Blue fallback (first entry or no change)
    if (idx > 0) {
      const prevVal = chronological[idx - 1].totalKg;
      if (entry.totalKg < prevVal) {
        color = '#10b981'; // Green (improving)
      } else if (entry.totalKg > prevVal) {
        color = '#f97316'; // Orange (worsening)
      }
    }
    
    const d = new Date(entry.date);
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return {
      date: dateLabel,
      totalKg: entry.totalKg,
      color: color,
      grade: entry.grade
    };
  });

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-[slideIn_0.6s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Monthly Progress
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Tracking your last {last6.length} footprint calculations
          </p>
        </div>

        {/* Trend Badge */}
        <div>
          {trendType === 'improving' && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450">
              <ArrowDown size={14} className="stroke-[3]" /> {trendText}
            </span>
          )}
          {trendType === 'worsening' && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-405">
              <ArrowUp size={14} className="stroke-[3]" /> {trendText}
            </span>
          )}
          {trendType === 'neutral' && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <Info size={14} /> {trendText}
            </span>
          )}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              fontSize={10} 
              fontWeight="bold" 
              tickLine={false} 
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10} 
              fontWeight="bold" 
              tickLine={false} 
              unit=" kg"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 dark:bg-slate-950 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs font-semibold space-y-1">
                      <p className="font-bold text-slate-400">{item.date}</p>
                      <p>
                        Footprint: <span className="font-black text-emerald-400">{item.totalKg.toLocaleString()} kg</span>
                      </p>
                      <p>
                        Grade: <span className="font-black text-blue-400">{item.grade}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="totalKg" radius={[6, 6, 0, 0]} maxBarSize={45}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ProgressChart;
