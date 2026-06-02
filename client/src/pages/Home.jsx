import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Globe, 
  Flame, 
  Activity, 
  Trees, 
  Wind, 
  TrendingUp, 
  Sparkles,
  ShieldCheck, 
  LineChart, 
  Lightbulb, 
  CheckCircle2 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Home = () => {
  const { user } = useAuth();

  // Environmental trend data (Atmospheric CO2 concentrations in ppm over years)
  const co2Data = [
    { year: '1990', co2: 354, temp: +0.44 },
    { year: '1995', co2: 360, temp: +0.46 },
    { year: '2000', co2: 369, temp: +0.51 },
    { year: '2005', co2: 379, temp: +0.65 },
    { year: '2010', co2: 389, temp: +0.73 },
    { year: '2015', co2: 400, temp: +0.90 },
    { year: '2020', co2: 414, temp: +1.02 },
    { year: '2025', co2: 424, temp: +1.15 }
  ];

  const globalStats = [
    { 
      title: 'Global CO₂ Emissions', 
      value: '37.4 Billion Tons', 
      change: '+1.5% YoY', 
      desc: 'Total global greenhouse gas output', 
      icon: Globe,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20'
    },
    { 
      title: 'Global Average Footprint', 
      value: '4.8 Tons CO₂/yr', 
      change: 'Sustainable target: <1.8t', 
      desc: 'Per capita annual emissions globally', 
      icon: Wind,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20'
    },
    { 
      title: "India's Average Footprint", 
      value: '1.9 Tons CO₂/yr', 
      change: 'Developing economy base', 
      desc: 'National average per person emissions', 
      icon: Activity,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
    },
    { 
      title: 'Global Temp Increase', 
      value: '+1.15°C', 
      change: 'Paris Agreement: Limit 1.5°C', 
      desc: 'Increase since pre-industrial average', 
      icon: Flame,
      color: 'text-red-500 bg-red-50 dark:bg-red-950/20'
    },
    { 
      title: 'Renewable Grid Share', 
      value: '30%', 
      change: 'Growing at 8.5% YoY', 
      desc: 'Global electricity from renewables', 
      icon: Sparkles,
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20'
    },
    { 
      title: 'Forest Loss Rate', 
      value: '10M Hectares/yr', 
      change: 'Requires urgent restoration', 
      desc: 'Net deforestation rate globally', 
      icon: Trees,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20'
    }
  ];

  const features = [
    {
      title: 'Carbon Calculator',
      desc: 'Multi-step calculation covering travel, electricity, LPG, dietary patterns, and recycling habits.',
      icon: Calculator
    },
    {
      title: 'Emission Analytics',
      desc: 'Visualize your carbon footprint contribution through interactive charts and categories.',
      icon: LineChart
    },
    {
      title: 'Personalized Action Plans',
      desc: 'Receive dynamic conservation tips targeting your heaviest emission outputs.',
      icon: Lightbulb
    },
    {
      title: 'Progress Tracking',
      desc: 'Monitor calculation records over time, showing emission metrics reduction trends.',
      icon: TrendingUp
    },
    {
      title: 'Gamified Badges',
      desc: 'Unlock achievements like Eco Explorer and Planet Protector as you lower your emissions score.',
      icon: ShieldCheck
    },
    {
      title: 'Sustainability Reports',
      desc: 'Export and download complete historical records for ESG, academic, or personal tracking.',
      icon: CheckCircle2
    }
  ];

  const facts = [
    'A single mature tree absorbs approximately 22 kg (48 lbs) of carbon dioxide per year.',
    'Reducing meat and dairy consumption can slash your food carbon footprint by up to 73%.',
    'Unplugging standby electronics (phantom loads) can reduce household electricity bills and carbon impact by 10%.',
    'Deforestation contributes to roughly 10% of global greenhouse gas emissions.'
  ];

  return (
    <div className="space-y-16">
      
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-950/30 dark:via-slate-900/60 dark:to-slate-950/90 text-white p-8 sm:p-12 lg:p-16 border border-emerald-500/10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
            <Sparkles size={12} /> ESG Sustainability Platform
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Track Your Carbon Impact. <br />
            <span className="bg-gradient-to-r from-emerald-200 to-teal-300 bg-clip-text text-transparent">
              Build a Sustainable Future.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl font-light">
            EcoTrack empowers individuals and enterprises to accurately calculate their ecological footprint, compare consumption models against national targets, and receive intelligence recommendations to reduce atmospheric carbon intensity.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to={user ? '/calculate' : '/register'}
              className="px-6 py-3.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 font-semibold text-sm transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
            >
              Calculate My Footprint
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            
            <a
              href="#dashboard"
              className="px-6 py-3.5 rounded-2xl bg-emerald-700/40 text-emerald-100 hover:bg-emerald-700/60 dark:bg-slate-800 dark:hover:bg-slate-750 font-semibold text-sm transition-all border border-emerald-500/20 dark:border-slate-700 flex items-center gap-1.5"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* 2. Global Climate Dashboard */}
      <section id="dashboard" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Global Environmental Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Live estimates representing the state of planetary boundaries, atmospheric CO₂ volumes, and international sustainability indicators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {globalStats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/20 dark:hover:border-emerald-500/10 shadow-sm transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={18} className="group-hover:scale-105 transition-transform" />
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">
                    {stat.change}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-450 dark:text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Climate Insights Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Recharts Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-emerald-500" size={18} /> Global CO₂ Trend & Temperature Increase
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Atmospheric Carbon Dioxide Concentration (ppm) vs Pre-Industrial baseline anomalies.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-350">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> CO₂ PPM
              </div>
            </div>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={co2Data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis domain={[340, 440]} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: 'none', 
                    borderRadius: '1rem',
                    color: '#fff' 
                  }} 
                />
                <Area type="monotone" dataKey="co2" name="CO₂ Concentration (PPM)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCo2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Environmental Facts */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-emerald-500" size={18} /> Climate Insights & Facts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Crucial information highlighting the interconnected feedback loops in ecology and energy resources.
            </p>
          </div>

          <div className="space-y-4">
            {facts.map((fact, idx) => (
              <div key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <span className="text-emerald-500 font-bold">0{idx + 1}.</span>
                <p>{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="space-y-8 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            EcoTrack Analytical Modules
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A comprehensive suite of ESG utilities designed to track, calculate, and report metrics to lower personal emissions score.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/20 dark:hover:border-emerald-500/10 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
            >
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-2xl">
                <feature.icon size={20} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-950 dark:text-white text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
