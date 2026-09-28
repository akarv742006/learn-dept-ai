import React from 'react';
import { ArrowRight, CheckCircle2, TrendingDown, Sparkles } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface RecoveryComparisonCardProps {
  studentName?: string;
  subject?: string;
  beforeDebt?: number;
  afterDebt?: number;
  onTakeQuiz?: () => void;
}

export const RecoveryComparisonCard: React.FC<RecoveryComparisonCardProps> = ({
  studentName = 'Arun Kumar',
  subject = 'DBMS',
  beforeDebt = 68,
  afterDebt = 42,
  onTakeQuiz,
}) => {
  const reductionPercent = Math.round(((beforeDebt - afterDebt) / beforeDebt) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Verified Diagnostic Impact
            </span>
            <span className="text-xs text-slate-400">• Subject: {subject}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Prerequisite Recovery Comparison ({studentName})
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-2xl text-emerald-700 dark:text-emerald-300 font-bold text-xs">
          <TrendingDown className="w-4 h-4 text-emerald-600" />
          <span>-{reductionPercent}% Learning Debt Reduction</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE RECOVERY */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-rose-500 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-bl-xl">
            Initial State
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Before Recovery
            </h3>
            <RiskBadge level="High Risk" size="sm" />
          </div>

          <div className="text-center py-2">
            <span className="text-4xl font-black text-rose-600 tracking-tight">{beforeDebt}</span>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Learning Debt Index</span>
          </div>

          <div className="space-y-2 text-xs font-medium border-t border-slate-200 dark:border-slate-700 pt-3">
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Functional Dependency:</span>
              <span className="font-extrabold text-rose-600">35%</span>
            </div>
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Candidate Key:</span>
              <span className="font-extrabold text-amber-600">40%</span>
            </div>
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Normalization:</span>
              <span className="font-extrabold text-amber-600">42%</span>
            </div>
          </div>
        </div>

        {/* AFTER RECOVERY */}
        <div className="bg-emerald-50/40 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-bl-xl">
            After Recovery
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Target Achieved</span>
            </h3>
            <RiskBadge level="Moderate Risk" size="sm" />
          </div>

          <div className="text-center py-2">
            <span className="text-4xl font-black text-emerald-600 tracking-tight">{afterDebt}</span>
            <span className="text-xs text-slate-500 font-semibold block uppercase">Learning Debt Index</span>
          </div>

          <div className="space-y-2 text-xs font-medium border-t border-emerald-200 dark:border-emerald-800/60 pt-3">
            <div className="flex justify-between text-slate-800 dark:text-slate-200">
              <span>Functional Dependency:</span>
              <span className="font-extrabold text-emerald-600">72% (+37%)</span>
            </div>
            <div className="flex justify-between text-slate-800 dark:text-slate-200">
              <span>Candidate Key:</span>
              <span className="font-extrabold text-emerald-600">68% (+28%)</span>
            </div>
            <div className="flex justify-between text-slate-800 dark:text-slate-200">
              <span>Normalization:</span>
              <span className="font-extrabold text-emerald-600">70% (+28%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/80 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="font-medium">
            Completing the Functional Dependency recovery module successfully removed the downstream prerequisite bottleneck.
          </p>
        </div>
        {onTakeQuiz && (
          <button
            onClick={onTakeQuiz}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm shrink-0 flex items-center gap-1.5 transition"
          >
            <span>Retake Verification Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
