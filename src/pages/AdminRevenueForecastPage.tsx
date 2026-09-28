import React, { useState } from 'react';
import {
  Sliders,
  TrendingUp,
  Calculator,
  RotateCcw,
  Sparkles,
  PieChart as PieChartIcon,
  ShieldCheck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { revenueService } from '../services/revenueService';
import type { ForecastInputs } from '../services/revenueService';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

export const AdminRevenueForecastPage: React.FC = () => {
  const navigate = useNavigate();

  // Scenario Presets
  const conservativePreset: ForecastInputs = {
    freeUsers: 1000,
    studentPlusCount: 50,
    studentProCount: 20,
    teacherCount: 10,
    institutionCount: 2,
    enterpriseCount: 0,
    monthlyOperatingCosts: 15000,
    monthlyAiCosts: 8000,
    monthlyMarketingCosts: 10000,
  };

  const moderatePreset: ForecastInputs = {
    freeUsers: 5000,
    studentPlusCount: 300,
    studentProCount: 150,
    teacherCount: 50,
    institutionCount: 8,
    enterpriseCount: 1,
    monthlyOperatingCosts: 35000,
    monthlyAiCosts: 22000,
    monthlyMarketingCosts: 25000,
  };

  const growthPreset: ForecastInputs = {
    freeUsers: 25000,
    studentPlusCount: 1800,
    studentProCount: 950,
    teacherCount: 250,
    institutionCount: 35,
    enterpriseCount: 4,
    monthlyOperatingCosts: 120000,
    monthlyAiCosts: 75000,
    monthlyMarketingCosts: 90000,
  };

  const [inputs, setInputs] = useState<ForecastInputs>(moderatePreset);
  const [activeScenario, setActiveScenario] = useState<'conservative' | 'moderate' | 'growth' | 'custom'>('moderate');

  // Calculate live results
  const results = revenueService.calculateForecast(inputs);

  const applyPreset = (preset: ForecastInputs, name: 'conservative' | 'moderate' | 'growth') => {
    setInputs(preset);
    setActiveScenario(name);
  };

  const handleInputChange = (field: keyof ForecastInputs, val: number) => {
    setInputs((prev) => ({ ...prev, [field]: Math.max(0, val) }));
    setActiveScenario('custom');
  };

  // Chart data comparing Revenue vs Costs
  const comparisonData = [
    {
      category: 'Monthly',
      Revenue: results.monthlyRevenue,
      Costs: results.monthlyCosts,
      Profit: results.monthlyGrossProfit,
    },
    {
      category: 'Annual',
      Revenue: results.annualRevenue,
      Costs: results.annualCosts,
      Profit: results.annualGrossProfit,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              EdTech SaaS Revenue Simulator
            </span>
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[11px] font-bold rounded-full border border-amber-500/30">
              Interactive Projections
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Revenue Forecast & Cost Model
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl mt-1">
            Simulate subscriber adoption, institutional license scale, gross margins, and estimated Gemini AI API costs dynamically.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/revenue')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Back to Revenue Dashboard</span>
          </button>
        </div>
      </div>

      {/* Scenario Presets Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Select Forecast Growth Scenario:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => applyPreset(conservativePreset, 'conservative')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeScenario === 'conservative'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Conservative
          </button>
          <button
            onClick={() => applyPreset(moderatePreset, 'moderate')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeScenario === 'moderate'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Moderate (Default)
          </button>
          <button
            onClick={() => applyPreset(growthPreset, 'growth')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeScenario === 'growth'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Aggressive Growth
          </button>
          <button
            onClick={() => applyPreset(moderatePreset, 'moderate')}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition"
            title="Reset to Default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Dynamic Output Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Revenue */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl border border-indigo-700/40 shadow-lg">
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
            Simulated Monthly Revenue
          </div>
          <div className="text-3xl font-black mt-2">
            ₹{results.monthlyRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-indigo-200/80 mt-1 font-medium">
            ₹{results.annualRevenue.toLocaleString('en-IN')} / year (ARR)
          </div>
        </div>

        {/* Monthly Operating Costs */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Monthly Costs
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">
            ₹{results.monthlyCosts.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            AI + Hosting + Marketing
          </div>
        </div>

        {/* Monthly Gross Margin */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Estimated Monthly Profit
          </div>
          <div
            className={`text-3xl font-black mt-2 ${
              results.monthlyGrossProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
            }`}
          >
            ₹{results.monthlyGrossProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Annual: ₹{results.annualGrossProfit.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Gross Margin % */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Gross Margin %
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {results.grossMarginPercent}%
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
            Target: &gt; 65% SaaS benchmark
          </div>
        </div>
      </div>

      {/* Main Interactive Controls & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Sliders */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-500" />
              Subscriber & License Sliders
            </h2>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Live Recalculation
            </span>
          </div>

          <div className="space-y-5">
            {/* Free Users */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Free Tier Users (₹0)</span>
                <span className="text-slate-500">{inputs.freeUsers.toLocaleString('en-IN')} users</span>
              </div>
              <input
                type="range"
                min={100}
                max={50000}
                step={100}
                value={inputs.freeUsers}
                onChange={(e) => handleInputChange('freeUsers', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Student Plus */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-600 dark:text-blue-400">Student Plus (₹99 / mo)</span>
                <span className="text-slate-900 dark:text-white">{inputs.studentPlusCount.toLocaleString('en-IN')} subs</span>
              </div>
              <input
                type="range"
                min={0}
                max={5000}
                step={10}
                value={inputs.studentPlusCount}
                onChange={(e) => handleInputChange('studentPlusCount', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Student Pro */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-purple-600 dark:text-purple-400">Student Pro (₹199 / mo)</span>
                <span className="text-slate-900 dark:text-white">{inputs.studentProCount.toLocaleString('en-IN')} subs</span>
              </div>
              <input
                type="range"
                min={0}
                max={3000}
                step={10}
                value={inputs.studentProCount}
                onChange={(e) => handleInputChange('studentProCount', Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Teacher */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-indigo-600 dark:text-indigo-400">Teacher Plan (₹499 / mo)</span>
                <span className="text-slate-900 dark:text-white">{inputs.teacherCount.toLocaleString('en-IN')} subs</span>
              </div>
              <input
                type="range"
                min={0}
                max={1000}
                step={5}
                value={inputs.teacherCount}
                onChange={(e) => handleInputChange('teacherCount', Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Institution */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-600 dark:text-emerald-400">Institution Licenses (₹25,000 / yr)</span>
                <span className="text-slate-900 dark:text-white">{inputs.institutionCount.toLocaleString('en-IN')} campuses</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={inputs.institutionCount}
                onChange={(e) => handleInputChange('institutionCount', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Enterprise */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-600 dark:text-amber-400">Enterprise Contracts (₹1,50,000 / yr avg)</span>
                <span className="text-slate-900 dark:text-white">{inputs.enterpriseCount.toLocaleString('en-IN')} deals</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                value={inputs.enterpriseCount}
                onChange={(e) => handleInputChange('enterpriseCount', Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Expense Sliders */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Monthly Operating Cost Inputs (₹)
              </h3>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-rose-500">
                  <span>Gemini AI API Costs</span>
                  <span>₹{inputs.monthlyAiCosts.toLocaleString('en-IN')} / mo</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={200000}
                  step={1000}
                  value={inputs.monthlyAiCosts}
                  onChange={(e) => handleInputChange('monthlyAiCosts', Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-rose-500">
                  <span>Hosting & Cloud Infrastructure</span>
                  <span>₹{inputs.monthlyOperatingCosts.toLocaleString('en-IN')} / mo</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={200000}
                  step={1000}
                  value={inputs.monthlyOperatingCosts}
                  onChange={(e) => handleInputChange('monthlyOperatingCosts', Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-rose-500">
                  <span>Sales & Customer Marketing</span>
                  <span>₹{inputs.monthlyMarketingCosts.toLocaleString('en-IN')} / mo</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200000}
                  step={1000}
                  value={inputs.monthlyMarketingCosts}
                  onChange={(e) => handleInputChange('monthlyMarketingCosts', Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Mix */}
        <div className="lg:col-span-6 space-y-6">
          {/* Revenue vs Costs Bar Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Projected Revenue vs. Operating Expenses
            </h2>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`]}
                  />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Costs" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Mix Pie Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <PieChartIcon className="w-5 h-5 text-indigo-500" />
              Revenue Contribution Breakdown
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.revenueMix}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="amount"
                      nameKey="tier"
                    >
                      {results.revenueMix.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Monthly MRR']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs">
                {results.revenueMix.map((mix: any, idx: number) => (
                  <div key={mix.tier} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{mix.tier}</span>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      ₹{mix.amount.toLocaleString('en-IN')} <span className="text-slate-400 font-normal">({mix.percentage}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenueForecastPage;
