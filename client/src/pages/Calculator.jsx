import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Car, 
  Plane, 
  Zap, 
  Flame, 
  Leaf, 
  Trash2, 
  ArrowLeft, 
  ArrowRight,
  TrendingUp,
  Scale
} from 'lucide-react';

const Calculator = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    // Step 1: Transport (km/month, flight is km/year)
    carDistance: 0,
    bikeDistance: 0,
    busDistance: 0,
    trainDistance: 0,
    flightTravel: 0,
    // Step 2: Energy
    electricity: 0,
    lpgUsage: 0,
    renewableRatio: 0,
    // Step 3: Food
    dietType: 'mixed',
    // Step 4: Waste
    wasteGenerated: 0,
    recyclingRatio: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'dietType' ? value : Number(value)
    }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setIsSubmitting(true);
      
      const res = await api.post('/carbon/calculate', formData);
      if (res.data.success) {
        // Redirect to results, passing calculation details in state
        navigate('/dashboard', { state: { latestRecord: res.data.data, fromCalculator: true } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Calculation engine failed. Please verify your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* 1. Header Title & Progress Wizard */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Scale className="text-emerald-500" size={26} /> Carbon Footprint Calculator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Let's evaluate your environmental baseline across travel, electricity, dietary habits, and recycling models.
          </p>
        </div>

        {/* Dynamic Wizard Steps */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 rounded-full z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-300 z-0"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>

          <div className="relative z-10 flex justify-between">
            {[
              { num: 1, name: 'Transport' },
              { num: 2, name: 'Energy' },
              { num: 3, name: 'Diet' },
              { num: 4, name: 'Waste' }
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => {
                  if (s.num < step || (s.num > step && !isSubmitting)) {
                    setStep(s.num);
                  }
                }}
                className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-all cursor-pointer ${
                  step === s.num
                    ? 'bg-emerald-600 text-white border-4 border-emerald-100 dark:border-emerald-950 ring-2 ring-emerald-500'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-450 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {s.num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-550/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* 2. Form Wizard Steps */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* STEP 1: TRANSPORTATION */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4 flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-550 dark:text-blue-400 rounded-xl">
                <Car size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transportation Habits</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Calculate emissions based on your monthly vehicle distances and annual flights.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Car */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Car Distance (km/month)</label>
                <input
                  type="number"
                  name="carDistance"
                  min="0"
                  value={formData.carDistance}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm"
                />
              </div>

              {/* Bike */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Motorbike Distance (km/month)</label>
                <input
                  type="number"
                  name="bikeDistance"
                  min="0"
                  value={formData.bikeDistance}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm"
                />
              </div>

              {/* Bus */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bus Transit (km/month)</label>
                <input
                  type="number"
                  name="busDistance"
                  min="0"
                  value={formData.busDistance}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm"
                />
              </div>

              {/* Train */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Train Transit (km/month)</label>
                <input
                  type="number"
                  name="trainDistance"
                  min="0"
                  value={formData.trainDistance}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm"
                />
              </div>

              {/* Flights */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Plane size={14} /> Annual Flight Travel (km/year)
                </label>
                <input
                  type="number"
                  name="flightTravel"
                  min="0"
                  value={formData.flightTravel}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm"
                  placeholder="e.g. 5000 km (typically a short-haul roundtrip is ~2500 km)"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ENERGY */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4 flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
                <Zap size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Home Energy Profile</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Calculate carbon output from your residential electricity units and cooking LPG cylinders.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Electricity */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  Electricity Usage (kWh/month)
                </label>
                <input
                  type="number"
                  name="electricity"
                  min="0"
                  value={formData.electricity}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm"
                />
              </div>

              {/* LPG */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} /> LPG cylinder Usage (kg/month)
                </label>
                <input
                  type="number"
                  name="lpgUsage"
                  min="0"
                  value={formData.lpgUsage}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm"
                  placeholder="Note: One full household cylinder is ~14.2 kg"
                />
              </div>

              {/* Renewable Energy Percentage Slider */}
              <div className="space-y-3 md:col-span-2 bg-slate-50 dark:bg-slate-850/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-650 dark:text-slate-300">Renewable Energy Percentage</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg border border-emerald-500/10">
                    {formData.renewableRatio}%
                  </span>
                </div>
                
                <input
                  type="range"
                  name="renewableRatio"
                  min="0"
                  max="100"
                  value={formData.renewableRatio}
                  onChange={handleChange}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                  Adjust this if you have solar panels installed or purchase electricity under a certified green-energy grid contract. This directly subtracts grid intensity values.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FOOD */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
                <Leaf size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dietary Patterns</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Pick the category that aligns closest to your typical food choices.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { 
                  id: 'vegetarian', 
                  title: 'Vegetarian', 
                  desc: 'Completely plant-based, dairy and eggs supported. Zero meat or fish products.',
                  credits: 'Low intensity - ~100 kg CO₂e/month'
                },
                { 
                  id: 'mixed', 
                  title: 'Mixed Diet', 
                  desc: 'Includes moderate poultry, fish, meat, alongside rich grain and vegetable patterns.',
                  credits: 'Average intensity - ~180 kg CO₂e/month'
                },
                { 
                  id: 'non-vegetarian', 
                  title: 'Non-Vegetarian (Heavy)', 
                  desc: 'Frequent consumption of high-methane beef, pork, poultry and dairy products.',
                  credits: 'High intensity - ~280 kg CO₂e/month'
                }
              ].map((diet) => (
                <label 
                  key={diet.id}
                  className={`
                    border rounded-2xl p-5 flex items-start gap-4 cursor-pointer transition-all duration-200
                    ${formData.dietType === diet.id 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 ring-1 ring-emerald-500' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/30'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="dietType"
                    value={diet.id}
                    checked={formData.dietType === diet.id}
                    onChange={handleChange}
                    className="mt-1 h-4.5 w-4.5 text-emerald-600 focus:ring-emerald-500 border-slate-350 accent-emerald-500 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-slate-950 dark:text-white block">{diet.title}</span>
                    <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed">{diet.desc}</p>
                    <span className="inline-block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {diet.credits}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: WASTE */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4 flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950/20 text-purple-500 rounded-xl">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Waste Management & Recycling</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Examine monthly solid waste generation and what ratio is successfully recycled or composted.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Waste generated */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Solid Waste Generated (kg/month)
                </label>
                <input
                  type="number"
                  name="wasteGenerated"
                  min="0"
                  value={formData.wasteGenerated}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm"
                  placeholder="Typically ~15-30 kg per person monthly"
                />
              </div>

              {/* Recycling percentage slider */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-850/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-650 dark:text-slate-300">Recycled/Composted Percentage</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg border border-emerald-500/10">
                    {formData.recyclingRatio}%
                  </span>
                </div>
                
                <input
                  type="range"
                  name="recyclingRatio"
                  min="0"
                  max="100"
                  value={formData.recyclingRatio}
                  onChange={handleChange}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                
                <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed">
                  Includes separating paper, glass, plastic, and metallic containers, or setting up a composting bin for kitchen scraps. Every 10% recycled lowers baseline waste emission.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Controls & Navigation buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-150 dark:border-slate-800/60">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-650 hover:bg-emerald-700 dark:bg-emerald-550 dark:hover:bg-emerald-600 text-white font-semibold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  Calculate Impact <TrendingUp size={16} />
                </>
              )}
            </button>
          )}
        </div>

      </form>
    </div>
  );
};

export default Calculator;
