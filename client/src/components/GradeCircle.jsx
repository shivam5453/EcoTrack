import React from 'react';
import { getGradeMeta } from '../utils/grading';

/**
 * Animated SVG circular gauge indicating emission grade.
 */
export const GradeCircle = ({ grade = 'C', totalKg = 0, unit = 'kg' }) => {
  const meta = getGradeMeta(grade);

  // Setup SVGs parameters
  const radius = 60;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  // Map grade to a percentage for the SVG dash offset
  const gradePercentages = { A: 95, B: 80, C: 60, D: 45, E: 25, F: 10 };
  const percentage = gradePercentages[grade] || 50;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Grade color map
  const colorMap = {
    A: '#10b981', // emerald
    B: '#22c55e', // green
    C: '#f59e0b', // amber
    D: '#f97316', // orange
    E: '#ef4444', // rose
    F: '#dc2626'  // red
  };
  const activeColor = colorMap[grade] || '#f59e0b';

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-850/20 border border-slate-150 dark:border-slate-800/60 rounded-3xl backdrop-blur-sm max-w-[240px] w-full mx-auto shadow-inner">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Animated Background loop */}
        <svg className="w-full h-full transform -rotate-90">
          {/* Base track circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-150 dark:text-slate-800 fill-transparent"
          />
          {/* Progress circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="fill-transparent transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0px 0px 4px ${activeColor}50)`
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-5xl font-black tracking-tight ${meta.color} leading-none mb-1 animate-pulse`}>
            {grade}
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
            GRADE
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs font-bold text-slate-455 dark:text-slate-400">
          {meta.label} Result
        </span>
      </div>
    </div>
  );
};

export default GradeCircle;
