import React from 'react';
import { Moon, Sun, Scale, Bell, Settings, ShieldCheck } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';

export const SettingsPage = () => {
  const { user, updateSettings } = useAuth();
  const { theme, toggleTheme, isDark } = useThemeContext();

  // Active user settings (fallbacks to defaults)
  const currentUnits = user?.settings?.units || 'kg';
  const currentNotifications = user?.settings?.notifications !== undefined ? user.settings.notifications : true;

  const handleUnitChange = async (unit) => {
    await updateSettings({ units: unit });
  };

  const handleNotificationsToggle = async () => {
    await updateSettings({ notifications: !currentNotifications });
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8 space-y-8 animate-[slideIn_0.3s_ease-out]">
      
      {/* Title */}
      <div className="space-y-1 pl-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-455 font-semibold">
          Customize your dashboard preferences, theme displays, and alert notification styles.
        </p>
      </div>

      {/* Main Settings Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80">
        
        {/* 1. Theme Configuration */}
        <div className="py-6 first:pt-0 flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-2xl">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900 dark:text-white leading-none">
                Interface Color Theme
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-550 leading-relaxed font-semibold">
                Toggle between light and sleek dark mode layouts.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={toggleTheme}
            className={`
              w-12 h-6.5 rounded-full p-1 transition-all duration-300 flex items-center cursor-pointer
              ${isDark ? 'bg-emerald-600 justify-end' : 'bg-slate-200 justify-start'}
            `}
            aria-label="Toggle theme"
          >
            <span className="w-4.5 h-4.5 bg-white rounded-full shadow-md" />
          </button>
        </div>

        {/* 2. Units Preferences */}
        <div className="py-6 flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Scale size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900 dark:text-white leading-none">
                Weight Measurement Units
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-550 leading-relaxed font-semibold">
                Choose to display carbon footprints in Kilograms (kg) or Metric Tonnes (t).
              </p>
            </div>
          </div>

          {/* Button Group Selects */}
          <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm shrink-0">
            {['kg', 'tonnes'].map((unit) => (
              <button
                key={unit}
                onClick={() => handleUnitChange(unit)}
                className={`
                  px-4 py-2 text-xs font-bold transition-all uppercase cursor-pointer
                  ${currentUnits === unit
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-400'
                  }
                `}
              >
                {unit === 'tonnes' ? 't' : 'kg'}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Notifications Preferences */}
        <div className="py-6 last:pb-0 flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-650 dark:text-purple-400 rounded-2xl">
              <Bell size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900 dark:text-white leading-none">
                Weekly Sustainability Tips
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-550 leading-relaxed font-semibold">
                Receive weekly eco-friendly recommendations and action alert updates in your inbox.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleNotificationsToggle}
            className={`
              w-12 h-6.5 rounded-full p-1 transition-all duration-300 flex items-center cursor-pointer
              ${currentNotifications ? 'bg-emerald-600 justify-end' : 'bg-slate-200 justify-start'}
            `}
            aria-label="Toggle notifications"
          >
            <span className="w-4.5 h-4.5 bg-white rounded-full shadow-md" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
