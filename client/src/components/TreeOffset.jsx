import React from 'react';

export const TreeOffset = ({ totalKg }) => {
  const treesNeeded = Math.ceil(totalKg / 21);

  return (
    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="text-3xl sm:text-4xl select-none leading-none">🌳</div>
      <div className="space-y-1.5 flex-1">
        <h4 className="text-sm font-black text-emerald-800 dark:text-emerald-400">
          Carbon Offset Equivalent
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
          To offset your footprint of <span className="font-extrabold text-emerald-650 dark:text-emerald-450">{totalKg.toLocaleString()} kg CO₂/yr</span>, you would need to plant approximately <span className="font-extrabold text-emerald-650 dark:text-emerald-450">{treesNeeded} {treesNeeded === 1 ? 'tree' : 'trees'}</span> and let them grow for 10 years.
        </p>
        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
          (Calculation: 1 mature tree absorbs ~21 kg CO₂/yr. Trees needed = totalKg / 21, rounded up)
        </div>
        <p className="text-xs text-emerald-600/80 dark:text-emerald-500/85 font-bold pt-1">
          Or offset instantly by supporting certified reforestation projects.
        </p>
      </div>
    </div>
  );
};

export default TreeOffset;
