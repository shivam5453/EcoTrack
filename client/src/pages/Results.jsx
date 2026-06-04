import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { Bookmark, RefreshCw, Globe, Flame, Lightbulb, Compass, Award, Download } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useCarbon from '../hooks/useCarbon';
import GradeCircle from '../components/GradeCircle';
import TipCard from '../components/TipCard';
import TreeOffset from '../components/TreeOffset';
import api from '../api/axiosInstance';
import { generateCarbonReport } from '../utils/generatePDF';
import { formatCarbonValue } from '../utils/formatters';

export const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();
  const { saveFootprint, loading } = useCarbon();

  // Retrieve calculated results from React Router state
  const calculation = location.state?.calculation;

  if (!calculation) {
    // If arriving here directly without calculation context, redirect back
    return <Navigate to="/calculate" replace />;
  }

  const { inputs, breakdown, totalKg, grade, tips = [] } = calculation;
  const preferredUnit = user?.settings?.units || 'kg';

  // Prepare data for the Donut Chart
  const pieData = [
    { name: 'Transport', value: breakdown.transport, color: '#3b82f6' }, // Blue
    { name: 'Energy', value: breakdown.energy, color: '#f59e0b' },    // Amber
    { name: 'Diet', value: breakdown.diet, color: '#10b981' },      // Emerald
    { name: 'Shopping', value: breakdown.shopping, color: '#a855f7' }  // Purple
  ].filter((d) => d.value > 0); // Ignore empty categories

  const handleSave = async () => {
    try {
      const res = await api.post('/carbon/save', {
        reportTitle: `Carbon Report ${new Date().toLocaleDateString('en-IN')}`,
        scope1: inputs.scope1,
        scope2: inputs.scope2,
        scope3: inputs.scope3
      });
      if (res.data.success) {
        showToast('Calculation saved ✓', 'success');
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        showToast('Failed to save — please log in', 'error');
      } else {
        showToast(err.response?.data?.message || 'Failed to save calculation.', 'error');
      }
    }
  };

  const handleDownload = () => {
    const entry = {
      date: new Date(),
      grade,
      totalKg,
      breakdown
    };
    generateCarbonReport(entry, user?.name || 'You');
  };

  const worldAvg = 4000;
  const indiaAvg = 1700;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 space-y-8 animate-[slideIn_0.3s_ease-out]">
      
      {/* 1. Header Congratulations */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-full animate-bounce">
          <Award size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Calculation Complete!
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-455 font-semibold">
          Here is a detailed breakdown of your estimated yearly CO₂ emissions.
        </p>
      </div>

      {/* 2. Primary Metrics: Grade Circle & Donut Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Card: Grade & Total */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
            Estimated Carbon Score
          </p>
          <GradeCircle grade={grade} totalKg={totalKg} unit={preferredUnit} />
          
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-950 dark:text-white">
              {formatCarbonValue(totalKg, preferredUnit, true)}
            </h2>
            <p className="text-xs text-slate-455 dark:text-slate-500 max-w-xs leading-relaxed font-semibold">
              This score indicates the total greenhouse gases (in CO₂ equivalents) emitted by your lifestyle choices over a full year.
            </p>
          </div>
        </div>

        {/* Right Card: Pie Chart Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Emissions By Category
          </h3>
          
          {/* Recharts Pie Donut representation */}
          <div className="h-56 w-full relative flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white dark:bg-slate-950 px-3.5 py-2 rounded-xl text-xs shadow-2xl border border-slate-850">
                            <span className="font-bold">{payload[0].name}: </span>
                            <span className="font-black text-emerald-400">{formatCarbonValue(payload[0].value, preferredUnit, true)}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-450 dark:text-slate-500">Zero footprint recorded</p>
            )}
          </div>
        </div>

      </div>

      {/* Carbon Offset trees equivalent representation */}
      <TreeOffset totalKg={totalKg} />

      {/* 3. Global Benchmarks Averages */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Where Do You Fit Internationally?
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* vs World */}
          <div className="bg-slate-50 dark:bg-slate-850/30 p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-550 rounded-xl">
                <Globe size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-450 dark:text-slate-500 block leading-none">World Average</span>
                <span className="text-sm font-black text-slate-800 dark:text-white mt-1 block">4,000 kg</span>
              </div>
            </div>
            <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${totalKg <= worldAvg ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : 'bg-rose-500/10 text-rose-600'}`}>
              {totalKg <= worldAvg ? '↓ Below Average' : '↑ Above Average'}
            </span>
          </div>

          {/* vs India */}
          <div className="bg-slate-50 dark:bg-slate-850/30 p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Flame size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-450 dark:text-slate-500 block leading-none">India Average</span>
                <span className="text-sm font-black text-slate-800 dark:text-white mt-1 block">1,700 kg</span>
              </div>
            </div>
            <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${totalKg <= indiaAvg ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : 'bg-rose-500/10 text-rose-600'}`}>
              {totalKg <= indiaAvg ? '↓ Below Average' : '↑ Above Average'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Personalized Recommendation Tips */}
      {tips.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-1.5">
            <Lightbulb className="text-amber-500" size={14} /> Top Actions To Trim Your Score
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </div>
      )}

      {/* 5. Control buttons: Save to History or Recalculate */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        
        {/* Recalculate */}
        <Link
          to="/calculate"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 font-black text-xs transition-all"
        >
          <RefreshCw size={14} /> Adjust inputs & Recalculate
        </Link>

        {/* Download PDF */}
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 font-black text-xs transition-all cursor-pointer"
        >
          <Download size={14} /> Download PDF Report
        </button>

        {/* Save to History */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3.5 bg-emerald-650 hover:bg-emerald-700 dark:bg-emerald-550 dark:hover:bg-emerald-600 text-white font-black text-xs rounded-2xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
        >
          {loading ? (
            <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto"></div>
          ) : (
            <>
              Save To History <Bookmark size={14} className="fill-white/10" />
            </>
          )}
        </button>

      </div>

    </div>
  );
};

export default Results;
