import React from 'react';

/**
 * Premium loading skeletons for a smooth, flicker-free UX.
 */
export const SkeletonLoader = ({ type = 'dashboard' }) => {
  // 1. Dashboard Main Skeleton (mimics ScoreCard + TrendChart)
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Navbar-like placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Your Carbon Score Skeleton */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-8 w-44 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
              <div className="h-12 w-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-850 rounded-lg" />
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
            <div className="space-y-4">
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* India vs World Cards Skeleton */}
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Trend Chart skeleton */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="space-y-2">
                <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="h-48 w-full bg-slate-100/50 dark:bg-slate-850/50 rounded-2xl flex items-end justify-between p-6 gap-2">
            {[35, 60, 45, 80, 55, 70].map((h, idx) => (
              <div 
                key={idx} 
                style={{ height: `${h}%` }} 
                className="bg-slate-200 dark:bg-slate-800 w-full rounded-lg" 
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Table List Skeleton (mimics History rows)
  if (type === 'history') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-150 dark:divide-slate-800">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-4 py-4 flex items-center justify-between gap-4">
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg hidden md:block" />
              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Simple Cards Skeleton (mimics Tips / Cards lists)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="space-y-2">
              <div className="h-2 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          </div>
          <div className="h-16 w-full bg-slate-100 dark:bg-slate-850 rounded-xl" />
          <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
