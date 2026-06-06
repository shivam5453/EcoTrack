import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Target, Edit2, Calendar, Award } from 'lucide-react';

export const GoalCard = ({ latestEntry }) => {
  const { user, updateSettings } = useAuth();
  const goal = user?.settings?.goal;

  const [isEditing, setIsEditing] = useState(!goal);
  const [targetKg, setTargetKg] = useState(goal?.targetKg || '');
  const [targetDate, setTargetDate] = useState(() => {
    if (goal?.targetDate) {
      const d = new Date(goal.targetDate);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    return '';
  });
  const [saving, setSaving] = useState(false);

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!targetKg || !targetDate) return;

    try {
      setSaving(true);
      const res = await updateSettings({
        goal: {
          targetKg: Number(targetKg),
          targetDate: new Date(targetDate)
        }
      });
      if (res?.success) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const currentScore = latestEntry ? latestEntry.totalKg : 0;
  const isGoalReached = goal && currentScore > 0 && currentScore <= goal.targetKg;
  const reductionNeeded = goal ? Math.max(0, currentScore - goal.targetKg) : 0;

  // Format date display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Progress percentage (reduction journey: if we are at 4000 and target is 2000, we want to decrease. 
  // If we decrease to 3000, we are 50% there).
  // Formula: progress = (Initial - Current) / (Initial - Target)
  // Since we don't have "Initial" easily, a standard percentage is: (Goal / Current) * 100, capped at 100
  const progressPercent =
  currentScore > 0 && goal?.targetKg
    ? Math.min(100, Math.round((goal.targetKg / currentScore) * 100))
    : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between animate-[slideIn_0.6s_ease-out]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Target size={16} className="text-emerald-500" /> Your Carbon Goal
        </h3>
        {goal && !isEditing && (
          <button
            onClick={handleEdit}
            className="text-xs font-bold text-slate-455 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-450 flex items-center gap-1 transition-colors"
          >
            <Edit2 size={12} /> Edit Goal
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 block">Target Footprint (kg CO₂/yr)</label>
            <input
              type="number"
              required
              min="1"
              value={targetKg}
              onChange={(e) => setTargetKg(e.target.value)}
              placeholder="e.g. 2000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-sm font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 block">Target Month & Year</label>
            <input
              type="month"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-sm font-semibold"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-colors shadow-sm"
            >
              {saving ? 'Saving...' : 'Set Goal'}
            </button>
            {goal && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 font-black text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {isGoalReached ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl text-center space-y-2 animate-bounce">
              <span className="text-3xl">🎉</span>
              <h4 className="text-sm font-black text-emerald-800 dark:text-emerald-400">Goal Reached!</h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Outstanding! Your current footprint of <span className="font-extrabold">{currentScore.toLocaleString()} kg</span> is under your target of <span className="font-extrabold">{(goal?.targetKg || 0).toLocaleString()} kg</span>. Keep it up!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-2xl font-black text-slate-850 dark:text-white">
                    {(goal?.targetKg || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">kg CO₂/yr</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-405 font-bold uppercase">
                  <Calendar size={12} /> {formatDate(goal?.targetDate)}
                </div>
              </div>

              {currentScore > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                    <span>Current ({currentScore.toLocaleString()} kg)</span>
                    <span>Target ({(goal?.targetKg || 0).toLocaleString()} kg)</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold pt-1">
                    You need to reduce by <span className="font-bold text-orange-500">{reductionNeeded.toLocaleString()} kg</span> more to reach your goal.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-455 dark:text-slate-500 font-bold italic leading-relaxed">
                  Complete your first calculation to see progress towards your target.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalCard;
