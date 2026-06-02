import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Zap, Car, Utensils } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useCarbon from '../hooks/useCarbon';
import SkeletonLoader from '../components/SkeletonLoader';

import AtmosphereData from '../components/AtmosphereData';
import LiveEmissions from '../components/LiveEmissions';
import WorldPollutionStats from '../components/WorldPollutionStats';
import PersonalScore from '../components/PersonalScore';
import CalculatorCTA from '../components/CalculatorCTA';

// Quick tips data for the "How to Reduce" highlight section
const REDUCE_HIGHLIGHTS = [
  {
    icon: Zap,
    title: 'Switch to Renewables',
    description: 'Choose a green energy provider or install solar panels. Could save up to 800 kg CO₂/year.',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/15',
  },
  {
    icon: Car,
    title: 'Rethink Transport',
    description: 'Bike, carpool, or switch to an EV. Short car trips replaced with cycling save 600 kg/yr.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/15',
  },
  {
    icon: Utensils,
    title: 'Eat More Plants',
    description: 'Reducing meat to 2 meals/week saves up to 900 kg CO₂/year. Small shifts, big impact.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/15',
  },
];

export const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { entries, loading: carbonLoading, fetchHistory } = useCarbon();

  // Fetch history if user is logged in
  useEffect(() => {
    if (user) {
      fetchHistory(1, 10).catch(() => {});
    }
  }, [user, fetchHistory]);

  const hasEntries = entries && entries.length > 0;
  const latestEntry = hasEntries ? entries[0] : null;
  const previousEntry = (entries && entries.length >= 2) ? entries[1] : null;

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SkeletonLoader type="dashboard" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      
      {/* SECTION 1 — Global Atmosphere Data */}
      <AtmosphereData />

      {/* SECTION 2 — Live CO₂ Emissions Counter */}
      <LiveEmissions />

      {/* SECTION 3 — World Footprint & Top Polluters */}
      <WorldPollutionStats />

      {/* SECTION 3.5 — How to Reduce Your Footprint (3-card highlight) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              How to Reduce Your Footprint
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Start with these high-impact actions. Every step counts.
            </p>
          </div>
          <Link
            to="/learn"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <BookOpen size={14} /> View all 20 techniques →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REDUCE_HIGHLIGHTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all duration-300"
              >
                <div className={`p-2.5 rounded-xl ${item.bg} ${item.color} w-fit mb-3`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile "View All" link */}
        <div className="sm:hidden text-center">
          <Link
            to="/learn"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400"
          >
            <BookOpen size={14} /> Explore all 20 techniques →
          </Link>
        </div>
      </section>

      {/* SECTION 4 — Your Score Card (if logged in) */}
      {user && carbonLoading && !hasEntries ? (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <SkeletonLoader type="dashboard" />
        </section>
      ) : (
        <PersonalScore 
          user={user} 
          latestEntry={latestEntry} 
          previousEntry={previousEntry} 
        />
      )}

      {/* SECTION 5 — Start Calculation CTA */}
      <CalculatorCTA user={user} hasEntries={hasEntries} />

    </div>
  );
};

export default Dashboard;
