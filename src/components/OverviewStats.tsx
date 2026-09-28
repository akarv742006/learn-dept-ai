import React from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  TrendingDown,
  Brain,
  ArrowUpRight,
  Zap,
  Info
} from 'lucide-react';
import type { Student } from '../types/debt';

interface OverviewStatsProps {
  students: Student[];
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ students }) => {
  const avgDebtIndex = Math.round(
    students.reduce((acc, s) => acc + s.learningDebtIndex, 0) / (students.length || 1)
  );

  const avgConventionalGrade = (
    students.reduce((acc, s) => acc + s.overallGrade, 0) / (students.length || 1)
  ).toFixed(1);

  const hiddenIllusionStudents = students.filter(
    (s) => s.overallGrade >= 75 && s.learningDebtIndex >= 45
  );

  const criticalRiskCount = students.filter((s) => s.riskStatus === 'Critical Risk' || s.riskStatus === 'High Debt').length;
  const avgProjectedDrop = Math.round(avgDebtIndex * 0.26);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Stat 1: Learning Debt Index */}
      <div className="glass-panel glass-panel-hover bg-white p-5 rounded-2xl relative overflow-hidden group border-slate-200/90 shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Cohort Learning Debt Index
          </span>
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
            <Brain className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            {avgDebtIndex}
          </span>
          <span className="text-xs font-semibold text-slate-500">/ 100 Risk</span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-3 border border-slate-200">
          <div
            className={`h-full transition-all duration-1000 ${
              avgDebtIndex > 60
                ? 'bg-gradient-to-r from-rose-500 to-red-600'
                : avgDebtIndex > 35
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
            }`}
            style={{ width: `${avgDebtIndex}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Conventional Avg: <strong className="text-slate-900">{avgConventionalGrade}%</strong></span>
          <span className="text-amber-700 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            Hidden Variance
          </span>
        </div>
      </div>

      {/* Stat 2: Hidden Gap Alert */}
      <div className="glass-panel glass-panel-hover bg-white p-5 rounded-2xl relative overflow-hidden group border-rose-200 shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Hidden Prerequisite Gaps
          </span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-black text-rose-600 tracking-tight">
            {hiddenIllusionStudents.length}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            of {students.length} Students
          </span>
        </div>

        <p className="text-xs text-slate-600 my-2 leading-relaxed">
          High exam marks (≥75%) masking critical prerequisite weaknesses.
        </p>

        <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] text-rose-600 font-bold">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Requires Immediate Diagnostic Remediation</span>
        </div>
      </div>

      {/* Stat 3: Cascading Risk */}
      <div className="glass-panel glass-panel-hover bg-white p-5 rounded-2xl relative overflow-hidden group border-slate-200/90 shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            High Debt Cascading Risk
          </span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-black text-amber-600 tracking-tight">
            {criticalRiskCount}
          </span>
          <span className="text-xs font-semibold text-slate-500">At Risk Cohort</span>
        </div>

        <p className="text-xs text-slate-600 my-2 leading-relaxed">
          Students facing compounding difficulty in next-unit prerequisites.
        </p>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>Cascade Multiplier</span>
          <span className="text-amber-700 font-bold">1.8x Prereq Resistance</span>
        </div>
      </div>

      {/* Stat 4: 90-Day Decay */}
      <div className="glass-panel glass-panel-hover bg-white p-5 rounded-2xl relative overflow-hidden group border-slate-200/90 shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Projected Grade Decay
          </span>
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-black text-purple-700 tracking-tight">
            -{avgProjectedDrop}%
          </span>
          <span className="text-xs font-semibold text-slate-500">In 90 Days</span>
        </div>

        <p className="text-xs text-slate-600 my-2 leading-relaxed">
          Predicted score drop when advanced integration & ODE units begin.
        </p>

        <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] text-cyan-700 font-semibold">
          <Info className="w-3.5 h-3.5" />
          <span>Preventable with 15-min Prerequisite Repair</span>
        </div>
      </div>
    </div>
  );
};
