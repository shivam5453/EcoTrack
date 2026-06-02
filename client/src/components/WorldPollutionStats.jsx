import React from 'react';
import { Globe } from 'lucide-react';

const WorldPollutionStats = () => {
  const topPolluters = [
    { rank: 1, country: 'Qatar', flag: 'QA', emoji: '🇶🇦', value: 31400 },
    { rank: 2, country: 'Kuwait', flag: 'KW', emoji: '🇰🇼', value: 25600 },
    { rank: 3, country: 'UAE', flag: 'AE', emoji: '🇦🇪', value: 20600 },
    { rank: 4, country: 'USA', flag: 'US', emoji: '🇺🇸', value: 16000 },
    { rank: 5, country: 'Australia', flag: 'AU', emoji: '🇦🇺', value: 14800 },
    { rank: '-', country: 'World avg', emoji: '🌍', value: 4000, highlight: true },
    { rank: '-', country: 'India', emoji: '🇮🇳', value: 1700, highlight: true }
  ];

  const maxVal = 31400; // Qatar

  return (
    <section className="space-y-4 animate-[slideIn_0.5s_ease-out]">
      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
        <Globe className="text-emerald-500" /> World Footprint & Top Polluters
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left column */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Global Averages</h3>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">🌍 World average</span>
                <span className="font-black text-slate-900 dark:text-white">4,000 <span className="text-[10px] text-slate-400">kg/yr</span></span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(4000/16000)*100}%` }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">🇮🇳 India average</span>
                <span className="font-black text-slate-900 dark:text-white">1,700 <span className="text-[10px] text-slate-400">kg/yr</span></span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(1700/16000)*100}%` }} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-end mb-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500">🎯 Sustainable target</span>
                <span className="font-black text-emerald-600 dark:text-emerald-500">&lt;2,000 <span className="text-[10px] opacity-70">kg/yr</span></span>
              </div>
              <div className="h-2 w-full bg-emerald-50 dark:bg-emerald-900/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(2000/16000)*100}%` }} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-2">Aligned with Paris Agreement 1.5°C goal.</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Top Polluters (Per Capita)</h3>
          
          <div className="space-y-3">
            {topPolluters.map((item, idx) => (
              <div key={idx} className={`relative p-2 rounded-xl flex items-center gap-3 ${item.highlight ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`}>
                <div className="w-5 text-center text-xs font-black text-slate-400">{item.rank}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1">
                    <span className={`text-sm font-bold ${item.highlight ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.emoji} {item.country}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{item.value.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">kg</span></span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.highlight ? 'bg-emerald-500' : 'bg-red-400'}`} 
                      style={{ width: `${(item.value / maxVal) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WorldPollutionStats;
