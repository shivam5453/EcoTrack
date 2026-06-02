import React from 'react';
import { 
  Bus, 
  Car, 
  Bike, 
  Plane, 
  Zap, 
  Sun, 
  Thermometer, 
  Plug, 
  Leaf, 
  Utensils, 
  Recycle, 
  ShoppingBag, 
  Shirt, 
  Cpu, 
  Package, 
  Trash2,
  TrendingDown
} from 'lucide-react';
import { capitalize } from '../utils/formatters';

// Map icon string to Lucide component
const IconMapper = {
  bus: Bus,
  car: Car,
  bike: Bike,
  plane: Plane,
  zap: Zap,
  sun: Sun,
  thermometer: Thermometer,
  plug: Plug,
  leaf: Leaf,
  utensils: Utensils,
  recycle: Recycle,
  'shopping-bag': ShoppingBag,
  shirt: Shirt,
  cpu: Cpu,
  package: Package,
  trash: Trash2
};

/**
 * TipCard (Dashboard Section 4)
 * Renders individual actionable tips with icons, descriptions, efforts, and savings.
 */
export const TipCard = ({ tip }) => {
  const { category, title, description, estimatedSavingKg, effortLevel, icon, tags = [] } = tip;

  const TargetIcon = IconMapper[icon] || Leaf;

  // Category specific styles
  const categoryTheme = {
    transport: {
      bgColor: 'bg-blue-50/70 dark:bg-blue-950/20',
      borderColor: 'border-blue-500/10 dark:border-blue-500/20',
      iconColor: 'text-blue-650 dark:text-blue-400',
      pillColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    },
    energy: {
      bgColor: 'bg-amber-50/70 dark:bg-amber-950/20',
      borderColor: 'border-amber-500/10 dark:border-amber-500/20',
      iconColor: 'text-amber-650 dark:text-amber-400',
      pillColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    },
    diet: {
      bgColor: 'bg-emerald-50/70 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-500/10 dark:border-emerald-500/20',
      iconColor: 'text-emerald-650 dark:text-emerald-450',
      pillColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450'
    },
    shopping: {
      bgColor: 'bg-purple-50/70 dark:bg-purple-950/20',
      borderColor: 'border-purple-500/10 dark:border-purple-500/20',
      iconColor: 'text-purple-650 dark:text-purple-400',
      pillColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
    }
  };

  const currentTheme = categoryTheme[category] || categoryTheme.diet;

  // Effort level color mapping
  const effortPills = {
    low: 'bg-green-500/10 text-green-600 dark:text-green-450',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    high: 'bg-rose-500/10 text-rose-600 dark:text-rose-455'
  };
  const effortClass = effortPills[effortLevel] || effortPills.low;

  return (
    <div className={`
      relative border rounded-3xl p-5 shadow-sm transition-all duration-350 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between gap-4
      bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800
    `}>
      {/* Top Section: Category & Icon */}
      <div className="flex items-start gap-4">
        
        {/* Animated Icon Housing */}
        <div className={`p-3 rounded-2xl border ${currentTheme.bgColor} ${currentTheme.borderColor} ${currentTheme.iconColor} shrink-0`}>
          <TargetIcon size={20} className="stroke-[2.5]" />
        </div>

        {/* Title & Category Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${currentTheme.pillColor}`}>
              {category}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${effortClass}`}>
              {effortLevel} effort
            </span>
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
            {title}
          </h4>
        </div>

      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
        {description}
      </p>

      {/* Bottom Info: Savings & Tags */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between mt-auto">
        
        {/* Estimated Savings Pill */}
        <div className="flex items-center gap-1 text-emerald-650 dark:text-emerald-450 font-extrabold text-[11px]">
          <TrendingDown size={14} className="animate-bounce" />
          <span>Save ~{estimatedSavingKg} kg/yr</span>
        </div>

        {/* Tag Label */}
        {tags.length > 0 && (
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            #{tags[0]}
          </span>
        )}

      </div>

    </div>
  );
};

export default TipCard;
