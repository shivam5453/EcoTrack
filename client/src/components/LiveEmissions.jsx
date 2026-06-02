import React, { useState, useEffect } from 'react';

const LiveEmissions = () => {
  const EMISSIONS_PER_SECOND = 1185; // tonnes CO₂/second globally
  
  const [emittedThisYear, setEmittedThisYear] = useState(0);
  const [emittedToday, setEmittedToday] = useState(0);
  
  // Calculate initial values
  useEffect(() => {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const now = Date.now();
    const secondsElapsedThisYear = (now - startOfYear.getTime()) / 1000;
    const secondsElapsedToday = (now - startOfDay.getTime()) / 1000;
    
    setEmittedThisYear(Math.floor(secondsElapsedThisYear * EMISSIONS_PER_SECOND));
    setEmittedToday(Math.floor(secondsElapsedToday * EMISSIONS_PER_SECOND));
    
    const interval = setInterval(() => {
      setEmittedThisYear(prev => prev + EMISSIONS_PER_SECOND);
      setEmittedToday(prev => prev + EMISSIONS_PER_SECOND);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-slate-950 dark:bg-black border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-[slideIn_0.4s_ease-out]">
      <div className="absolute inset-0 bg-red-900/10 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-center">
        
        {/* Left header */}
        <div className="flex flex-col gap-2 shrink-0 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-black uppercase tracking-widest w-max mx-auto md:mx-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </div>
          <h2 className="text-xl font-black text-white">Global CO₂ Counter</h2>
        </div>
        
        {/* Counters */}
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-around text-center">
          
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CO₂ Added Right Now</div>
            <div className="text-3xl font-black text-white">{EMISSIONS_PER_SECOND.toLocaleString()} <span className="text-sm text-slate-400">t/s</span></div>
          </div>
          
          <div className="w-px bg-slate-800 hidden sm:block" />
          <div className="h-px bg-slate-800 w-full sm:hidden" />
          
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Emitted Today</div>
            <div className="text-3xl font-black text-amber-500">{emittedToday.toLocaleString()} <span className="text-sm text-amber-700">tonnes</span></div>
          </div>
          
          <div className="w-px bg-slate-800 hidden sm:block" />
          <div className="h-px bg-slate-800 w-full sm:hidden" />
          
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Emitted This Year</div>
            <div className="text-3xl font-black text-red-500">{emittedThisYear.toLocaleString()} <span className="text-sm text-red-800">tonnes</span></div>
          </div>
          
        </div>
      </div>
      
      <div className="relative z-10 mt-8 text-center">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          Based on IEA 2024 global emissions rate of ~37.4 Gt CO₂/year
        </p>
      </div>
    </section>
  );
};

export default LiveEmissions;
