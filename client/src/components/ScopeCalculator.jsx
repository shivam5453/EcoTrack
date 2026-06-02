import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Info, Save, Download, ArrowRight, Activity, Zap, ShoppingBag } from 'lucide-react';
import { generatePDFReport } from '../utils/PDFReport';
import api from '../api/axiosInstance';

const COLORS = ['#1e3a5f', '#0d9488', '#d97706']; // Navy, Teal, Amber

export const ScopeCalculator = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // State for all inputs
  const [scope1, setScope1] = useState({
    carLitresWeek: '',
    motorbikeLitresWeek: '',
    gasKgMonth: '',
    oilLitresMonth: '',
    generatorLitresMonth: ''
  });
  
  const [scope2, setScope2] = useState({
    electricityKwhMonth: '',
    renewablePercent: 0,
    districtHeatingKwhMonth: ''
  });
  
  const [scope3, setScope3] = useState({
    shortFlightsYear: '',
    longFlightsYear: '',
    transitKmWeek: '',
    taxiKmWeek: '',
    meatFrequency: 'weekly',
    dairyConsumption: 'medium',
    foodWaste: 'medium',
    localFoodPercent: 0,
    onlineOrdersMonth: '',
    clothesYear: '',
    electronicsYear: '',
    furnitureYear: '',
    wasteBagsWeek: '',
    recyclingLevel: 'none'
  });

  // State for live calculated results
  const [results, setResults] = useState({
    scope1: 0, scope2: 0, scope3: 0, totalKg: 0, grade: 'F', tips: []
  });

  // Live calculation effect
  useEffect(() => {
    // Math logic matching backend
    const s1Car = (Number(scope1.carLitresWeek) || 0) * 2.31 * 52;
    const s1Moto = (Number(scope1.motorbikeLitresWeek) || 0) * 2.31 * 52;
    const s1Gas = (Number(scope1.gasKgMonth) || 0) * 3.0 * 12;
    const s1Oil = (Number(scope1.oilLitresMonth) || 0) * 2.68 * 12;
    const s1Gen = (Number(scope1.generatorLitresMonth) || 0) * 2.68 * 12;
    const s1Total = s1Car + s1Moto + s1Gas + s1Oil + s1Gen;

    const s2ElecRaw = (Number(scope2.electricityKwhMonth) || 0) * 0.233 * 12;
    const s2Elec = s2ElecRaw * (1 - (Number(scope2.renewablePercent) / 100));
    const s2Heat = (Number(scope2.districtHeatingKwhMonth) || 0) * 0.18 * 12;
    const s2Total = s2Elec + s2Heat;

    const s3Travel = ((Number(scope3.shortFlightsYear) || 0) * 150) + 
                     ((Number(scope3.longFlightsYear) || 0) * 400) + 
                     ((Number(scope3.transitKmWeek) || 0) * 0.089 * 52) + 
                     ((Number(scope3.taxiKmWeek) || 0) * 0.21 * 52);
    
    let meat = 600;
    if (scope3.meatFrequency === 'daily') meat = 1500;
    if (scope3.meatFrequency === 'rarely') meat = 200;
    if (scope3.meatFrequency === 'vegan') meat = 50;
    
    let dairy = 200;
    if (scope3.dairyConsumption === 'high') dairy = 400;
    if (scope3.dairyConsumption === 'low') dairy = 80;
    if (scope3.dairyConsumption === 'none') dairy = 0;
    
    let waste = 100;
    if (scope3.foodWaste === 'high') waste = 200;
    if (scope3.foodWaste === 'low') waste = 20;

    const rawDiet = meat + dairy + waste;
    const s3Diet = rawDiet * (1 - (Number(scope3.localFoodPercent) / 100 * 0.10));

    const s3Shop = ((Number(scope3.onlineOrdersMonth) || 0) * 2.5 * 12) +
                   ((Number(scope3.clothesYear) || 0) * 15) +
                   ((Number(scope3.electronicsYear) || 0) * 80) +
                   ((Number(scope3.furnitureYear) || 0) * 60);

    const rawTrash = (Number(scope3.wasteBagsWeek) || 0) * 11 * 52;
    let rec = 1;
    if (scope3.recyclingLevel === 'some') rec = 0.8;
    if (scope3.recyclingLevel === 'most') rec = 0.5;
    if (scope3.recyclingLevel === 'all') rec = 0.2;
    const s3Waste = rawTrash * rec;

    const s3Total = s3Travel + s3Diet + s3Shop + s3Waste;
    
    const t = Math.round(s1Total + s2Total + s3Total);
    let g = 'F';
    if (t < 2000) g = 'A';
    else if (t < 3000) g = 'B';
    else if (t < 4000) g = 'C';
    else if (t < 8000) g = 'D';
    else if (t < 15000) g = 'E';

    setResults({
      scope1: Math.round(s1Total),
      scope2: Math.round(s2Total),
      scope3: Math.round(s3Total),
      totalKg: t,
      grade: g
    });
  }, [scope1, scope2, scope3]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await api.post('/carbon/save', {
        reportTitle: `Carbon Report ${new Date().toLocaleDateString()}`,
        scope1, scope2, scope3
      });
      navigate('/history');
    } catch (err) {
      setError('Failed to save calculation.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    // Generate dummy entry for PDF
    const entry = {
      date: new Date(),
      reportTitle: `Carbon Report ${new Date().toLocaleDateString()}`,
      breakdown: { scope1: results.scope1, scope2: results.scope2, scope3: results.scope3 },
      totalKg: results.totalKg,
      grade: results.grade,
      tips: [] // Can be filled in
    };
    generatePDFReport(entry, { name: 'You' });
  };

  const getFeedback = () => {
    const { grade, scope1, scope2, scope3 } = results;
    let max = 'Scope 3';
    if (scope1 > scope2 && scope1 > scope3) max = 'Scope 1';
    if (scope2 > scope1 && scope2 > scope3) max = 'Scope 2';

    if (grade === 'A') return { text: "Outstanding! You're well within sustainable limits.", max };
    if (grade === 'B') return { text: "Great work! You're below the world average.", max };
    if (grade === 'C') return { text: "You're at the global average. Small changes can move you up.", max };
    if (grade === 'D') return { text: `Your footprint is above average. Focus on ${max} to improve.`, max };
    if (grade === 'E') return { text: `Your emissions are significantly high. Immediate action on ${max} is recommended.`, max };
    return { text: `Critical level. Your footprint is way over sustainable targets. Start reducing ${max} today.`, max };
  };

  const feedback = getFeedback();
  const chartData = [
    { name: 'Scope 1', value: results.scope1 },
    { name: 'Scope 2', value: results.scope2 },
    { name: 'Scope 3', value: results.scope3 }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Tabs */}
      <div className="flex overflow-x-auto rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
        {[1, 2, 3, 4].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab 
                ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab === 1 && 'Scope 1 (Direct)'}
            {tab === 2 && 'Scope 2 (Energy)'}
            {tab === 3 && 'Scope 3 (Lifestyle)'}
            {tab === 4 && 'Combined Result'}
          </button>
        ))}
      </div>

      {/* Scope 1 */}
      {activeTab === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-[slideIn_0.3s_ease-out]">
          <div className="flex items-center gap-3 mb-6 text-slate-800 dark:text-white">
            <div className="p-2 bg-[#1e3a5f]/10 text-[#1e3a5f] dark:text-[#3b82f6] rounded-xl"><Activity size={24} /></div>
            <div>
              <h2 className="text-xl font-bold">Scope 1 — Direct Emissions</h2>
              <p className="text-sm text-slate-500">Fuel you directly burn — your car, gas stove, home heating</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Car Petrol (Litres/week)</label>
                <input type="number" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" value={scope1.carLitresWeek} onChange={(e) => setScope1({...scope1, carLitresWeek: e.target.value})} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Motorbike Petrol (Litres/week)</label>
                <input type="number" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" value={scope1.motorbikeLitresWeek} onChange={(e) => setScope1({...scope1, motorbikeLitresWeek: e.target.value})} placeholder="0" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Home Gas (kg/month)</label>
                <input type="number" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" value={scope1.gasKgMonth} onChange={(e) => setScope1({...scope1, gasKgMonth: e.target.value})} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Heating Oil (Litres/month)</label>
                <input type="number" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" value={scope1.oilLitresMonth} onChange={(e) => setScope1({...scope1, oilLitresMonth: e.target.value})} placeholder="0" />
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="text-sm font-bold text-slate-500">Live Subtotal: <span className="text-xl text-[#1e3a5f] dark:text-[#3b82f6]">{results.scope1.toLocaleString()} kg</span></div>
            <button onClick={() => setActiveTab(2)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">Next Scope <ArrowRight size={18}/></button>
          </div>
        </div>
      )}

      {/* Scope 2 */}
      {activeTab === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-[slideIn_0.3s_ease-out]">
          <div className="flex items-center gap-3 mb-6 text-slate-800 dark:text-white">
            <div className="p-2 bg-[#0d9488]/10 text-[#0d9488] dark:text-[#2dd4bf] rounded-xl"><Zap size={24} /></div>
            <div>
              <h2 className="text-xl font-bold">Scope 2 — Indirect Energy</h2>
              <p className="text-sm text-slate-500">Emissions from the electricity and heat you purchase</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Electricity (kWh/month)</label>
                <input type="number" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" value={scope2.electricityKwhMonth} onChange={(e) => setScope2({...scope2, electricityKwhMonth: e.target.value})} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Renewable Energy: {scope2.renewablePercent}%</label>
                <input type="range" min="0" max="100" className="w-full accent-emerald-600" value={scope2.renewablePercent} onChange={(e) => setScope2({...scope2, renewablePercent: e.target.value})} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">District Heating/Cooling (kWh/month)</label>
                <input type="number" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800" value={scope2.districtHeatingKwhMonth} onChange={(e) => setScope2({...scope2, districtHeatingKwhMonth: e.target.value})} placeholder="0" />
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="text-sm font-bold text-slate-500">Live Subtotal: <span className="text-xl text-[#0d9488] dark:text-[#2dd4bf]">{results.scope2.toLocaleString()} kg</span></div>
            <button onClick={() => setActiveTab(3)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">Next Scope <ArrowRight size={18}/></button>
          </div>
        </div>
      )}

      {/* Scope 3 */}
      {activeTab === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-[slideIn_0.3s_ease-out]">
          <div className="flex items-center gap-3 mb-6 text-slate-800 dark:text-white">
            <div className="p-2 bg-[#d97706]/10 text-[#d97706] dark:text-[#fbbf24] rounded-xl"><ShoppingBag size={24} /></div>
            <div>
              <h2 className="text-xl font-bold">Scope 3 — Value Chain / Lifestyle</h2>
              <p className="text-sm text-slate-500">Indirect emissions from your lifestyle, purchases, travel, and food</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-96 overflow-y-auto pr-2">
            <div className="space-y-6">
              <h3 className="font-bold border-b pb-2">Travel</h3>
              <div><label className="block text-sm mb-1">Short Flights (/year)</label><input type="number" className="w-full p-2 border rounded-lg dark:bg-slate-800" onChange={e=>setScope3({...scope3, shortFlightsYear: e.target.value})} /></div>
              <div><label className="block text-sm mb-1">Long Flights (/year)</label><input type="number" className="w-full p-2 border rounded-lg dark:bg-slate-800" onChange={e=>setScope3({...scope3, longFlightsYear: e.target.value})} /></div>
              <div><label className="block text-sm mb-1">Transit (km/week)</label><input type="number" className="w-full p-2 border rounded-lg dark:bg-slate-800" onChange={e=>setScope3({...scope3, transitKmWeek: e.target.value})} /></div>
              
              <h3 className="font-bold border-b pb-2 mt-4">Shopping & Waste</h3>
              <div><label className="block text-sm mb-1">Online Orders (/month)</label><input type="number" className="w-full p-2 border rounded-lg dark:bg-slate-800" onChange={e=>setScope3({...scope3, onlineOrdersMonth: e.target.value})} /></div>
              <div><label className="block text-sm mb-1">New Clothes (/year)</label><input type="number" className="w-full p-2 border rounded-lg dark:bg-slate-800" onChange={e=>setScope3({...scope3, clothesYear: e.target.value})} /></div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-bold border-b pb-2">Diet</h3>
              <div>
                <label className="block text-sm mb-1">Meat Frequency</label>
                <select className="w-full p-2 border rounded-lg dark:bg-slate-800" value={scope3.meatFrequency} onChange={e=>setScope3({...scope3, meatFrequency: e.target.value})}>
                  <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="rarely">Rarely</option><option value="vegan">Vegan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Dairy Consumption</label>
                <select className="w-full p-2 border rounded-lg dark:bg-slate-800" value={scope3.dairyConsumption} onChange={e=>setScope3({...scope3, dairyConsumption: e.target.value})}>
                  <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option><option value="none">None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Local Food: {scope3.localFoodPercent}%</label>
                <input type="range" min="0" max="100" className="w-full accent-[#d97706]" value={scope3.localFoodPercent} onChange={e=>setScope3({...scope3, localFoodPercent: e.target.value})}/>
              </div>

              <h3 className="font-bold border-b pb-2 mt-4">Waste</h3>
              <div><label className="block text-sm mb-1">Trash Bags (/week)</label><input type="number" className="w-full p-2 border rounded-lg dark:bg-slate-800" onChange={e=>setScope3({...scope3, wasteBagsWeek: e.target.value})} /></div>
              <div>
                <label className="block text-sm mb-1">Recycling Level</label>
                <select className="w-full p-2 border rounded-lg dark:bg-slate-800" value={scope3.recyclingLevel} onChange={e=>setScope3({...scope3, recyclingLevel: e.target.value})}>
                  <option value="none">None</option><option value="some">Some</option><option value="most">Most</option><option value="all">All</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="text-sm font-bold text-slate-500">Live Subtotal: <span className="text-xl text-[#d97706] dark:text-[#fbbf24]">{results.scope3.toLocaleString()} kg</span></div>
            <button onClick={() => setActiveTab(4)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">View Result <ArrowRight size={18}/></button>
          </div>
        </div>
      )}

      {/* Tab 4: Combined Results */}
      {activeTab === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-[slideIn_0.3s_ease-out]">
          <h2 className="text-2xl font-bold mb-6 text-center">Your Carbon Footprint</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Chart */}
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                  </Pie>
                  <Tooltip formatter={(val) => `${val.toLocaleString()} kg`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold">{results.totalKg.toLocaleString()}</span>
                <span className="text-sm font-bold text-slate-500">kg CO₂/yr</span>
              </div>
            </div>
            
            {/* Breakdown & Feedback */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 p-4 rounded-xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10">
                  <div className="text-xs font-bold text-[#1e3a5f] dark:text-[#3b82f6]">Scope 1</div>
                  <div className="text-lg font-bold">{results.scope1.toLocaleString()} kg</div>
                </div>
                <div className="flex-1 p-4 rounded-xl bg-[#0d9488]/5 border border-[#0d9488]/10">
                  <div className="text-xs font-bold text-[#0d9488] dark:text-[#2dd4bf]">Scope 2</div>
                  <div className="text-lg font-bold">{results.scope2.toLocaleString()} kg</div>
                </div>
                <div className="flex-1 p-4 rounded-xl bg-[#d97706]/5 border border-[#d97706]/10">
                  <div className="text-xs font-bold text-[#d97706] dark:text-[#fbbf24]">Scope 3</div>
                  <div className="text-lg font-bold">{results.scope3.toLocaleString()} kg</div>
                </div>
              </div>
              
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                    results.grade === 'A' ? 'bg-green-500' :
                    results.grade === 'B' ? 'bg-emerald-500' :
                    results.grade === 'C' ? 'bg-yellow-500' :
                    results.grade === 'D' ? 'bg-orange-500' :
                    results.grade === 'E' ? 'bg-red-500' : 'bg-red-600'
                  }`}>
                    {results.grade}
                  </div>
                  <h3 className="font-bold text-lg">Grade {results.grade}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{feedback.text}</p>
                <div className="mt-4">
                  <div className="text-xs font-bold text-slate-500 mb-1">Target Comparison:</div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: `${Math.min((results.totalKg / 8000) * 100, 100)}%`}} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                    <span>0</span><span>Paris Target (2,000)</span><span>World Avg (4,000)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
            >
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save to History'}
            </button>
            <button 
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl transition"
            >
              <Download size={18} /> Download PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
