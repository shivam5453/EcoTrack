import React, { useState } from 'react';
import { Lightbulb, Compass, Award, ShieldCheck, HeartHandshake, Leaf, ArrowRight } from 'lucide-react';
import { TIPS } from '../constants/tips';
import TipCard from '../components/TipCard';

export const Tips = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeEffort, setActiveEffort] = useState('all');

  // Filter Tips based on active selections
  const filteredTips = TIPS.filter((tip) => {
    const matchCat = activeCategory === 'all' || tip.category === activeCategory;
    const matchEffort = activeEffort === 'all' || tip.effortLevel === activeEffort;
    return matchCat && matchEffort;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 space-y-12 animate-[slideIn_0.3s_ease-out]">
      
      {/* 1. Page Title & Intro */}
      <div className="space-y-3 pl-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Lightbulb className="text-amber-500 fill-amber-500/10" size={26} /> Green Action Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-455 font-semibold leading-relaxed max-w-2xl">
          Discover highly effective, science-backed lifestyle changes to scale down your footprint. Filter tips by category or effort to construct your customized reduction strategy.
        </p>
      </div>

      {/* 2. Educational Infographics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: The Carbon Target */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/5 border border-emerald-500/10 rounded-3xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            1
          </div>
          <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider leading-none">
            The 2-Tonne Target
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            To halt catastrophic global warming, the average global carbon footprint per person needs to drop below <strong>2,000 kg (2 tonnes)</strong> per year by 2050. Currently, the US average is 16,000 kg.
          </p>
        </div>

        {/* Card 2: Food Footprints */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-blue-950/20 dark:to-indigo-950/5 border border-blue-500/10 rounded-3xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
            2
          </div>
          <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider leading-none">
            The Diet Impact
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            Livestock agriculture accounts for nearly <strong>15%</strong> of global greenhouse gas emissions. Transitioning to vegetarian or vegan diets is the single quickest individual choice to trim down carbon outputs.
          </p>
        </div>

        {/* Card 3: Grid Energy */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-950/20 dark:to-orange-950/5 border border-amber-500/10 rounded-3xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
            3
          </div>
          <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider leading-none">
            Phantom Power Draw
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            Up to <strong>10%</strong> of active household electrical energy is consumed by "idle phantom loads" — appliances plugged in but inactive. Simply unplugging chargers and TVs saves hundreds of carbon kg.
          </p>
        </div>

      </div>

      {/* 3. Interactive Tip Directory Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Filters Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800/80 pb-6">
          
          {/* Category Selects */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Filter Category
            </span>
            <div className="flex gap-2 flex-wrap">
              {['all', 'transport', 'energy', 'diet', 'shopping'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-4 py-2 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer
                    ${activeCategory === cat
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/10'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-650 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-350'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Effort Selects */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Effort Intensity
            </span>
            <div className="flex gap-2 flex-wrap">
              {['all', 'low', 'medium', 'high'].map((effort) => (
                <button
                  key={effort}
                  onClick={() => setActiveEffort(effort)}
                  className={`
                    px-4 py-2 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer
                    ${activeEffort === effort
                      ? 'bg-emerald-650 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-650 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-350'
                    }
                  `}
                >
                  {effort}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Tips grid results */}
        {filteredTips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        ) : (
          /* Empty Filter state */
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
            <Compass size={36} className="mx-auto opacity-60" />
            <p className="text-xs font-bold uppercase tracking-wider">No tips match this filter</p>
            <p className="text-[11px]">Adjust your active category or effort parameters above.</p>
          </div>
        )}

      </div>

    </div>
  );
};

export default Tips;
