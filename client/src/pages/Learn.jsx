import React, { useState } from 'react';
import { BookOpen, Zap, Utensils, ShoppingBag, Recycle, Car, Home, Plane, Droplets, Sun, Wind, Leaf, TreePine, Factory, Package, Shirt } from 'lucide-react';
import LearnCard from '../components/LearnCard';

const CATEGORIES = [
  { id: 'energy', label: 'Energy', icon: Zap, color: 'text-amber-500' },
  { id: 'transport', label: 'Transport', icon: Car, color: 'text-blue-500' },
  { id: 'food', label: 'Food & Diet', icon: Utensils, color: 'text-emerald-500' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-purple-500' },
  { id: 'waste', label: 'Waste', icon: Recycle, color: 'text-rose-500' },
];

export const TECHNIQUES = [
  // Energy (5)
  { id: 1, category: 'energy', title: 'Switch to LED Lighting', description: 'Replace all incandescent bulbs with LED alternatives — they use 75% less energy and last 25x longer.', difficulty: 'easy', savingKg: 150, icon: Zap, tips: ['Start with rooms you use most', 'Look for 3000K warm white for living areas', 'Buy in bulk for savings'] },
  { id: 2, category: 'energy', title: 'Install a Smart Thermostat', description: 'Automatically optimizes heating and cooling based on your schedule, cutting HVAC energy waste.', difficulty: 'medium', savingKg: 400, icon: Home, tips: ['Set schedules for sleep and away times', 'Use geofencing to auto-adjust when you leave', 'Lower setpoint by 2°F in winter'] },
  { id: 3, category: 'energy', title: 'Switch to Renewable Energy', description: 'Choose a 100% green energy provider or install rooftop solar panels for zero-emission electricity.', difficulty: 'hard', savingKg: 800, icon: Sun, tips: ['Compare green energy plans online', 'Check if your utility offers green tariffs', 'Solar panels pay back in 5-8 years'] },
  { id: 4, category: 'energy', title: 'Seal Drafts & Insulate', description: 'Air-seal windows, doors, and attic spaces to prevent heat loss and reduce heating costs by 15-25%.', difficulty: 'medium', savingKg: 350, icon: Wind, tips: ['Use weatherstripping on doors', 'Apply caulk around window frames', 'Add attic insulation to R-38'] },
  
  // Transport (4)
  { id: 5, category: 'transport', title: 'Commute by Bike or Walk', description: 'Replace short car trips (<5 km) with cycling or walking. Zero emissions, plus health benefits.', difficulty: 'easy', savingKg: 600, icon: Car, tips: ['Start with 1-2 days per week', 'Get a used bike to reduce costs', 'Use bike routes for safer commutes'] },
  { id: 6, category: 'transport', title: 'Switch to Electric Vehicle', description: 'EVs produce zero tailpipe emissions and cost 60% less to fuel. Battery tech improves yearly.', difficulty: 'hard', savingKg: 1200, icon: Zap, tips: ['Check for government EV tax credits', 'Compare total cost of ownership vs gas', 'Consider used EVs for budget options'] },
  { id: 7, category: 'transport', title: 'Replace Flights with Trains', description: 'A single long-haul flight emits as much as months of driving. Take trains for trips under 500 km.', difficulty: 'medium', savingKg: 400, icon: Plane, tips: ['Book night trains for overnight journeys', 'Use rail passes for multi-city trips', 'Compare total door-to-door travel time'] },
  { id: 8, category: 'transport', title: 'Carpool to Work', description: 'Sharing rides with 1-2 colleagues cuts your commute emissions by 50-66%.', difficulty: 'easy', savingKg: 500, icon: Car, tips: ['Use carpooling apps to find matches', 'Alternate driving days with partners', 'Set pickup schedules a week in advance'] },

  // Food (4)
  { id: 9, category: 'food', title: 'Reduce Meat Consumption', description: 'Beef has 10x the carbon footprint of plant protein. Even cutting to 2 meat meals/week makes a big impact.', difficulty: 'medium', savingKg: 900, icon: Utensils, tips: ['Try Meatless Mondays as a start', 'Explore lentil and bean-based recipes', 'Swap beef for chicken (4x lower emissions)'] },
  { id: 10, category: 'food', title: 'Buy Local & Seasonal', description: 'Locally grown food travels less and is fresher. Seasonal produce avoids energy-intensive greenhouse farming.', difficulty: 'easy', savingKg: 120, icon: Leaf, tips: ['Visit farmers markets on weekends', 'Join a local CSA (community agriculture)', 'Grow herbs on your windowsill'] },
  { id: 11, category: 'food', title: 'Reduce Food Waste', description: '30% of food is wasted globally. Plan meals, use leftovers, and compost scraps to cut waste dramatically.', difficulty: 'easy', savingKg: 200, icon: Recycle, tips: ['Plan meals for the week before shopping', 'Use the "first in, first out" rule in your fridge', 'Freeze leftovers in portioned containers'] },
  { id: 12, category: 'food', title: 'Cut Dairy Intake', description: 'Dairy production is water and emissions intensive. Try plant-based milks and reduce cheese consumption.', difficulty: 'medium', savingKg: 300, icon: Droplets, tips: ['Try oat milk in coffee (lowest footprint)', 'Gradually reduce cheese portions', 'Explore cashew-based cream sauces'] },

  // Shopping (4)
  { id: 13, category: 'shopping', title: 'Buy Secondhand Clothing', description: 'Fast fashion accounts for 10% of global CO₂. Thrift stores and resale platforms extend garment life.', difficulty: 'easy', savingKg: 200, icon: Shirt, tips: ['Check ThriftUp, Depop, or local thrift shops', 'Host clothing swaps with friends', 'Invest in quality basics that last years'] },
  { id: 14, category: 'shopping', title: 'Extend Electronics Lifespan', description: 'Keep phones and laptops 1-2 years longer. Manufacturing a new device produces 70+ kg CO₂.', difficulty: 'easy', savingKg: 80, icon: Package, tips: ['Replace batteries instead of whole devices', 'Use cases and screen protectors', 'Buy refurbished when upgrading'] },
  { id: 15, category: 'shopping', title: 'Choose Sustainable Brands', description: 'Support companies with verified carbon-neutral or B-Corp certifications.', difficulty: 'medium', savingKg: 150, icon: TreePine, tips: ['Look for B-Corp certification', 'Check brand sustainability reports', 'Use apps like Good On You to rate brands'] },
  { id: 16, category: 'shopping', title: 'Reduce Online Orders', description: 'Each delivery generates ~2.5 kg CO₂ from packaging and transport. Batch orders and shop locally.', difficulty: 'easy', savingKg: 100, icon: Package, tips: ['Consolidate orders to reduce shipments', 'Choose slower shipping (less air freight)', 'Walk to local stores when possible'] },

  // Waste (4)
  { id: 17, category: 'waste', title: 'Start Composting', description: 'Divert organic waste from landfills where it produces methane. Composting returns nutrients to soil.', difficulty: 'medium', savingKg: 150, icon: Leaf, tips: ['Use a countertop compost bin for convenience', 'Compost fruit scraps, coffee grounds, eggshells', 'Check if your city offers compost pickup'] },
  { id: 18, category: 'waste', title: 'Recycle Everything Possible', description: 'Proper recycling of paper, glass, metal, and plastic keeps materials in the economy and out of landfills.', difficulty: 'easy', savingKg: 200, icon: Recycle, tips: ['Learn your local recycling guidelines', 'Rinse containers before recycling', 'Keep a separate bin for recyclables'] },
  { id: 19, category: 'waste', title: 'Go Zero-Waste Shopping', description: 'Bring reusable bags, containers, and bottles. Refuse single-use plastics at every opportunity.', difficulty: 'medium', savingKg: 100, icon: ShoppingBag, tips: ['Keep reusable bags in your car or backpack', 'Buy in bulk using your own containers', 'Carry a reusable water bottle always'] },
  { id: 20, category: 'waste', title: 'Reduce Paper Usage', description: 'Go digital for bills, notes, and documents. Each ton of paper requires 17 trees.', difficulty: 'easy', savingKg: 50, icon: Factory, tips: ['Switch to digital bills and statements', 'Use note-taking apps instead of paper', 'Print double-sided when printing is necessary'] },
];

export const Learn = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTechniques = activeCategory === 'all'
    ? TECHNIQUES
    : TECHNIQUES.filter((t) => t.category === activeCategory);

  const totalSaving = filteredTechniques.reduce((sum, t) => sum + t.savingKg, 0);

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 space-y-8 animate-[slideIn_0.3s_ease-out]">
      {/* Page Header */}
      <div className="space-y-2 pl-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <BookOpen className="text-emerald-500" size={26} /> Learn to Reduce
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold max-w-xl">
          Explore {TECHNIQUES.length} actionable techniques to lower your carbon footprint. Each technique includes difficulty level, estimated savings, and practical tips.
        </p>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold opacity-80">Total potential savings{activeCategory !== 'all' ? ` in ${CATEGORIES.find(c => c.id === activeCategory)?.label}` : ''}</div>
          <div className="text-3xl font-black">{totalSaving.toLocaleString()} kg CO₂/yr</div>
        </div>
        <div className="text-xs font-bold bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
          {filteredTechniques.length} techniques shown
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <CatIcon size={16} /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* Technique Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechniques.map((technique) => (
          <LearnCard
            key={technique.id}
            id={technique.id}
            title={technique.title}
            description={technique.description}
            difficulty={technique.difficulty}
            savingKg={technique.savingKg}
            icon={technique.icon}
            tips={technique.tips}
          />
        ))}
      </div>

      {filteredTechniques.length === 0 && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <p className="font-bold">No techniques in this category yet.</p>
        </div>
      )}
    </div>
  );
};

export default Learn;
