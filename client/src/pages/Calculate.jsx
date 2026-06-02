import React from 'react';
import { Calculator } from 'lucide-react';
import { ScopeCalculator } from '../components/ScopeCalculator';

export const Calculate = () => {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 space-y-8 animate-[slideIn_0.3s_ease-out]">
      {/* Page Title Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1 pl-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calculator className="text-emerald-500" size={26} /> Carbon Calculator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
            Evaluate your environmental footprints across GHG Scopes 1, 2, and 3.
          </p>
        </div>
      </div>

      <ScopeCalculator />
    </div>
  );
};

export default Calculate;
