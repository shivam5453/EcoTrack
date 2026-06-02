import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const AtmosphereData = () => {
  const [ppm, setPpm] = useState(424.7);
  const PPM_PER_SECOND = 0.000004;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPpm(prev => prev + PPM_PER_SECOND);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="space-y-4 animate-[slideIn_0.3s_ease-out]">
      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
        <TrendingUp className="text-red-500" /> Global Atmosphere Data
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Atmospheric CO₂ Today</span>
          <div className="mt-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{ppm.toFixed(4)} <span className="text-lg text-slate-400">ppm</span></span>
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold w-max">
            <AlertTriangle size={12} /> +51.7 ppm above safe limit
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Above Pre-industrial</span>
          <div className="mt-2">
            <span className="text-4xl font-black text-amber-500">+144.7 <span className="text-lg">ppm</span></span>
          </div>
          <div className="mt-4 text-xs font-bold text-slate-500">
            Increase of <span className="text-amber-600 dark:text-amber-500">+51.7%</span> from 280 ppm baseline
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">1.5°C Carbon Budget Left</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-red-500">~250 <span className="text-lg">Gt</span></span>
            <span className="text-xs font-bold text-slate-400">of 2900 Gt</span>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full" style={{ width: '91%' }} />
            </div>
            <div className="text-[10px] font-bold text-right text-red-500">~91% Consumed</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CO₂ Rise This Century</span>
          <div className="mt-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">+24 <span className="text-lg text-slate-400">ppm since 2000</span></span>
          </div>
          <div className="mt-4 flex items-end justify-between h-8 gap-1">
            {[
              { year: 2000, val: 369 },
              { year: 2005, val: 379 },
              { year: 2010, val: 389 },
              { year: 2015, val: 400 },
              { year: 2020, val: 412 },
              { year: 2024, val: 424.7 }
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-1 group relative">
                <div 
                  className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm group-hover:bg-emerald-500 transition-colors"
                  style={{ height: `${((d.val - 350) / (425 - 350)) * 100}%`, minHeight: '4px' }}
                />
                <span className="absolute -bottom-4 text-[8px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{d.year}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AtmosphereData;
