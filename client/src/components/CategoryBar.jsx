import React from 'react';
import { formatCarbonValue } from '../utils/formatters';

/**
 * Stacked horizontal percentage bar detailing category ratios.
 */
export const CategoryBar = ({ breakdown = {}, total = 0 }) => {
  const { transport = 0, energy = 0, diet = 0, shopping = 0 } = breakdown;
  
  const sum = transport + energy + diet + shopping || total || 1;

  // Calculate percentages
  const transportPct = ((transport / sum) * 100).toFixed(0);
  const energyPct = ((energy / sum) * 100).toFixed(0);
  const dietPct = ((diet / sum) * 100).toFixed(0);
  const shoppingPct = ((shopping / sum) * 100).toFixed(0);

  const categories = [
    { name: 'Transport', val: transport, pct: transportPct, color: 'bg-blue-500', dotColor: 'bg-blue-500' },
    { name: 'Energy', val: energy, pct: energyPct, color: 'bg-amber-500', dotColor: 'bg-amber-500' },
    { name: 'Diet', val: diet, pct: dietPct, color: 'bg-emerald-500', dotColor: 'bg-emerald-500' },
    { name: 'Shopping', val: shopping, pct: shoppingPct, color: 'bg-purple-500', dotColor: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-4">
      {/* Horizontal Stacked Bar */}
      <div className="w-full h-4.5 bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden shadow-inner border border-slate-200/20">
        {transport > 0 && (
          <div 
            style={{ width: `${transportPct}%` }} 
            className="bg-blue-500 h-full hover:opacity-90 transition-opacity" 
            title={`Transport: ${transportPct}%`}
          />
        )}
        {energy > 0 && (
          <div 
            style={{ width: `${energyPct}%` }} 
            className="bg-amber-500 h-full hover:opacity-90 transition-opacity" 
            title={`Energy: ${energyPct}%`}
          />
        )}
        {diet > 0 && (
          <div 
            style={{ width: `${dietPct}%` }} 
            className="bg-emerald-500 h-full hover:opacity-90 transition-opacity" 
            title={`Diet: ${dietPct}%`}
          />
        )}
        {shopping > 0 && (
          <div 
            style={{ width: `${shoppingPct}%` }} 
            className="bg-purple-500 h-full hover:opacity-90 transition-opacity" 
            title={`Shopping: ${shoppingPct}%`}
          />
        )}
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span className={`w-2 h-2 rounded-full ${cat.dotColor}`} />
              <span>{cat.name}</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-1 py-0.5 rounded ml-auto">{cat.pct}%</span>
            </div>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white pl-3.5">
              {formatCarbonValue(cat.val, 'kg', true)}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CategoryBar;
