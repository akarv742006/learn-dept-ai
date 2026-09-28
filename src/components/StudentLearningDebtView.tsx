import React from 'react';
import { Clock, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { Student } from '../types/debt';

interface StudentLearningDebtViewProps {
  student: Student;
  onNavigateTab: (tab: string) => void;
}

export const StudentLearningDebtView: React.FC<StudentLearningDebtViewProps> = ({ onNavigateTab }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-10">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            Diagnostic Engine Active
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Your Learning Debt Diagnostic
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Learning debt measures unresolved prerequisite knowledge gaps that degrade performance over time even when current exam marks appear high.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('learning-paths')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
        >
          Resolve Debt Now
        </button>
      </div>

      {/* 2. Main Score Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Score Gauge */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#12192b] via-[#1a233b] to-indigo-950 p-6 md:p-8 rounded-3xl text-white flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
          <div className="w-36 h-36 rounded-full border-8 border-amber-500/30 border-t-amber-400 border-r-amber-500 flex flex-col items-center justify-center my-4 shadow-inner relative">
            <span className="text-4xl font-black text-white tracking-tight">37</span>
            <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">/ 100</span>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
            Status: Moderate Risk
          </span>

          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
            Your current learning debt is mainly caused by hidden gaps in <span className="font-bold text-white">Array indexing</span> and <span className="font-bold text-white">Trigonometric identities</span>.
          </p>
        </div>

        {/* Right Stats & Delta Row */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Debt Accumulated</span>
              <div className="flex items-center gap-1 text-rose-600 font-black text-xl">
                <ArrowUpRight className="w-5 h-5" />
                <span>+8</span>
              </div>
              <span className="text-[10px] text-slate-400">This Month</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Debt Resolved</span>
              <div className="flex items-center gap-1 text-emerald-600 font-black text-xl">
                <ArrowDownRight className="w-5 h-5" />
                <span>-12</span>
              </div>
              <span className="text-[10px] text-slate-400">Through Remediation</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Net Current Debt</span>
              <div className="text-amber-600 font-black text-xl">
                <span>37</span>
              </div>
              <span className="text-[10px] text-slate-400">Target &lt; 15</span>
            </div>
          </div>

          {/* Category Debt Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Learning Debt Breakdown by Category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Foundational Debt</span>
                <span className="text-lg font-bold text-slate-900">42 / 100</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Concept Debt</span>
                <span className="text-lg font-bold text-slate-900">28 / 100</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Practice Debt</span>
                <span className="text-lg font-bold text-slate-900">19 / 100</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '19%' }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Prerequisite Debt</span>
                <span className="text-lg font-bold text-slate-900">54 / 100</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Debt Accumulation Timeline (Week 1 -> Week 4) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span>Debt Accumulation Timeline</span>
            </h3>
            <p className="text-xs text-slate-500">Visualizing how minor unaddressed prerequisite gaps compound into learning debt over time.</p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">4-Week Projection</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative pt-2">
          {/* Week 1 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 relative">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Week 1</span>
            <span className="text-xl font-black text-emerald-700">Debt: 8</span>
            <p className="text-xs text-slate-600 mt-2">
              Minor gap in <span className="font-semibold text-slate-800">Loop bounds</span>. Exam score remains 92%.
            </p>
          </div>

          {/* Week 2 */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 relative">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-1">Week 2</span>
            <span className="text-xl font-black text-blue-700">Debt: 18</span>
            <p className="text-xs text-slate-600 mt-2">
              Unaddressed loop bounds propagate into <span className="font-semibold text-slate-800">Array Off-by-One errors</span>.
            </p>
          </div>

          {/* Week 3 */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 relative">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">Week 3</span>
            <span className="text-xl font-black text-amber-700">Debt: 29</span>
            <p className="text-xs text-slate-600 mt-2">
              Student relies on memorizing searching syntax without understanding memory pointers.
            </p>
          </div>

          {/* Week 4 */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 relative">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block mb-1">Week 4</span>
            <span className="text-xl font-black text-rose-700">Debt: 37</span>
            <p className="text-xs text-slate-600 mt-2">
              Cascading vulnerability degrades <span className="font-semibold text-slate-800">Binary Search</span> & <span className="font-semibold text-slate-800">Sorting</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
