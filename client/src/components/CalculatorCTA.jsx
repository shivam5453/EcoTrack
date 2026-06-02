import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CalculatorCTA = ({ user, hasEntries }) => {
  return (
    <section className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-lg relative overflow-hidden animate-[slideIn_0.7s_ease-out]">
      {/* Background decoration */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">How big is your carbon footprint?</h2>
          <p className="text-sm sm:text-base font-semibold text-emerald-100 max-w-md mx-auto leading-relaxed">
            Takes 3 minutes. Get your personal CO₂ score, grade, and custom reduction tips.
          </p>
        </div>

        {/* Icons Strip */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-emerald-200 font-bold text-sm">
          <span className="flex items-center gap-1.5 bg-emerald-800/50 px-3 py-1.5 rounded-full">🚗 Transport</span>
          <ArrowRight size={14} className="opacity-50" />
          <span className="flex items-center gap-1.5 bg-emerald-800/50 px-3 py-1.5 rounded-full">⚡ Energy</span>
          <ArrowRight size={14} className="opacity-50" />
          <span className="flex items-center gap-1.5 bg-emerald-800/50 px-3 py-1.5 rounded-full">🥗 Diet</span>
          <ArrowRight size={14} className="opacity-50" />
          <span className="flex items-center gap-1.5 bg-emerald-800/50 px-3 py-1.5 rounded-full">🛍️ Shopping</span>
        </div>

        <div className="flex flex-col items-center gap-3 pt-4">
          <Link
            to="/calculate"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-base rounded-2xl transition-all shadow-xl shadow-emerald-950/50 hover:-translate-y-0.5"
          >
            Calculate My Footprint <ArrowRight size={18} strokeWidth={3} />
          </Link>
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
            Free. No credit card. Takes ~3 minutes.
          </span>
          
          {user && hasEntries && (
            <Link
              to="/calculate"
              className="mt-2 px-6 py-2 border-2 border-emerald-700 hover:bg-emerald-800 text-emerald-100 font-black text-xs rounded-xl transition-colors"
            >
              Recalculate
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CalculatorCTA;
