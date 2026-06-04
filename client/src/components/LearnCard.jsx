import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  hard: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const DIFFICULTY_LABELS = {
  easy: '🟢 Easy',
  medium: '🟡 Medium',
  hard: '🔴 Hard',
};

export const LearnCard = ({ id, title, description, difficulty = 'medium', savingKg, icon: Icon, tips = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const { user, updateSettings } = useAuth();
  
  const adoptedTips = user?.settings?.adoptedTips || [];
  const isAdopted = adoptedTips.includes(String(id));

  const handleToggleAdopt = async () => {
    if (!user) return;
    let updated;
    const strId = String(id);
    if (isAdopted) {
      updated = adoptedTips.filter(tId => tId !== strId);
    } else {
      updated = [...adoptedTips, strId];
    }
    await updateSettings({ adoptedTips: updated });
  };

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {Icon && (
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex-shrink-0 mt-0.5">
              <Icon size={20} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Adopt Checklist Toggle */}
        {user && (
          <label className="flex items-center gap-1 cursor-pointer select-none text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase shrink-0 pt-0.5">
            <input
              type="checkbox"
              checked={isAdopted}
              onChange={handleToggleAdopt}
              className="h-3.5 w-3.5 rounded border-slate-350 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span>{isAdopted ? 'Adopted' : 'Adopt'}</span>
          </label>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {/* Difficulty pill */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${DIFFICULTY_COLORS[difficulty]}`}>
          {DIFFICULTY_LABELS[difficulty]}
        </span>

        {/* Kg saved badge */}
        {savingKg && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Leaf size={10} className="text-emerald-500" />
            ~{savingKg} kg/yr saved
          </span>
        )}
      </div>

      {/* Expandable tips */}
      {tips.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-3 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            {expanded ? 'Hide' : 'Show'} tips
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <ul className="mt-2 space-y-1.5 pl-1 animate-[slideIn_0.2s_ease-out]">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default LearnCard;
