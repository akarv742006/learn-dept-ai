import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { RecoveryComparisonCard } from '../components/RecoveryComparisonCard';
import { useAuth } from '../context/AuthContext';

export const StudentLearningDebt: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentDebt, setCurrentDebt] = useState<number>(() => {
    try {
      const latest = JSON.parse(localStorage.getItem('learndebt_latest_student') || 'null');
      if (latest && typeof latest.learningDebt === 'number') return latest.learningDebt;
      const sub = JSON.parse(localStorage.getItem('learndebt_latest_submission') || 'null');
      if (sub && typeof sub.learningDebt === 'number') return sub.learningDebt;
    } catch {}
    return 37;
  });

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e?.detail?.learningDebt) {
        setCurrentDebt(e.detail.learningDebt);
      } else {
        try {
          const latest = JSON.parse(localStorage.getItem('learndebt_latest_student') || 'null');
          if (latest && typeof latest.learningDebt === 'number') setCurrentDebt(latest.learningDebt);
        } catch {}
      }
    };
    window.addEventListener('learndebt_test_submitted', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('learndebt_test_submitted', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              Flagship Diagnostic Engine Active
            </span>
            <span className="text-xs text-slate-400 font-semibold">• MISSION-07</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Learning Debt Analysis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Learning debt represents unresolved conceptual weaknesses that degrade future performance over time even when current exam marks appear high.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/learning-path')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Resolve Debt Now</span>
        </button>
      </div>

      {/* Main Score Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Circular Gauge */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#12192b] via-[#1a233b] to-indigo-950 p-8 rounded-3xl text-white flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
          <div className="w-40 h-40 rounded-full border-8 border-amber-500/30 border-t-amber-400 border-r-amber-500 flex flex-col items-center justify-center my-4 shadow-inner relative">
            <span className="text-5xl font-black text-white tracking-tight">{currentDebt}</span>
            <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">/ 100</span>
          </div>

          <RiskBadge level={currentDebt > 50 ? 'HIGH RISK' : (currentDebt > 25 ? 'MODERATE RISK' : 'LOW RISK')} />

          <p className="text-xs text-slate-300 max-w-sm leading-relaxed mt-3">
            {currentDebt <= 25 
              ? "Prerequisite debt successfully cleared! Foundation verified with high conceptual resilience."
              : "Your current learning debt is mainly caused by unresolved prerequisite gaps in Functional Dependency."}
          </p>
        </div>

        {/* Right Stats & Categories */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Debt Accumulated</span>
              <div className="flex items-center gap-1 text-rose-600 font-black text-2xl">
                <ArrowUpRight className="w-5 h-5" />
                <span>+8</span>
              </div>
              <span className="text-[10px] text-slate-400">This Month</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Debt Resolved</span>
              <div className="flex items-center gap-1 text-emerald-600 font-black text-2xl">
                <ArrowDownRight className="w-5 h-5" />
                <span>-12</span>
              </div>
              <span className="text-[10px] text-slate-400">Through Remediation</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Net Current Debt</span>
              <div className="text-amber-600 font-black text-2xl">
                <span>{currentDebt}</span>
              </div>
              <span className="text-[10px] text-slate-400">Target &lt; 15</span>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Learning Debt Breakdown by Category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-medium block">Foundational Debt</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">62%</span>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-medium block">Concept Debt</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">45%</span>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-medium block">Practice Debt</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">38%</span>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-medium block">Prerequisite Debt</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">71%</span>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '71%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Week Debt Timeline */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span>4-Week Debt Compound Timeline</span>
            </h3>
            <p className="text-xs text-slate-500">Visualizing how unaddressed prerequisite gaps compound into learning debt over time.</p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">4-Week Projection</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block mb-1">Week 1</span>
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">Debt: 18</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">Minor gap in Functional Dependency definition. Exam score remains 92%.</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider block mb-1">Week 2</span>
            <span className="text-xl font-black text-blue-700 dark:text-blue-400">Debt: 25</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">Unaddressed FD attribute closure propagates into Candidate Key identification errors.</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block mb-1">Week 3</span>
            <span className="text-xl font-black text-amber-700 dark:text-amber-400">Debt: 31</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">Student relies on memorizing SQL syntax without understanding relational decomposition.</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800">
            <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider block mb-1">Week 4</span>
            <span className="text-xl font-black text-rose-700 dark:text-rose-400">Debt: 37</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">Cascading vulnerability degrades 2NF, 3NF, and BCNF normalization concepts.</p>
          </div>
        </div>
      </div>

      {/* Scoring Model Formula Explanation */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-3 shadow-xl">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800">
          Prototype Scoring Formula Model (Requirement 33)
        </span>
        <div className="font-mono text-xs md:text-sm bg-slate-950 p-4 rounded-2xl border border-slate-800 text-cyan-300 overflow-x-auto">
          Learning Debt Score = Concept Weakness + Prerequisite Gap + Repeated Errors + Negative Trend + Unresolved Practice
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          Note: This scoring model presents the application's prototype diagnostic algorithm for evaluating non-obvious prerequisite knowledge vulnerabilities.
        </p>
      </div>

      {/* Recovery Impact Comparison */}
      <RecoveryComparisonCard
        studentName={user?.name || "Akash Sharma"}
        onTakeQuiz={() => navigate('/student/quiz')}
      />
    </div>
  );
};
