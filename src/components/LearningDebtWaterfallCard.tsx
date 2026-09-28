import React from 'react';
import {
  Brain,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface LearningDebtWaterfallCardProps {
  studentName?: string;
  examScore?: number;
  conceptMastery?: number;
  prerequisiteGapsCount?: number;
  learningDebtScore?: number;
  futureRiskTopics?: string[];
  recommendedPath?: string;
  onLaunchPath?: () => void;
  onLaunchRemediation?: () => void;
}

export const LearningDebtWaterfallCard: React.FC<LearningDebtWaterfallCardProps> = ({
  studentName = 'Akash Sharma',
  examScore = 89,
  conceptMastery = 64,
  prerequisiteGapsCount = 4,
  learningDebtScore = 37,
  futureRiskTopics = ['Searching', 'Sorting', 'Trees & BSTs'],
  recommendedPath = 'Arrays → Searching → Sorting',
  onLaunchPath,
  onLaunchRemediation,
}) => {
  const handleAction = onLaunchRemediation || onLaunchPath;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-blue-200 shadow-sm mb-8 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Core Feature Highlight
              </span>
              <span className="text-xs text-slate-400 font-semibold">• MISSION-07 Diagnostic</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Learning Debt Diagnostic Waterfall ({studentName})
            </h2>
          </div>
        </div>

        <button
          onClick={handleAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Remediate Missing Prerequisite</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Waterfall Flow */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 relative z-10">
        {/* Step 1 */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Step 1 • Traditional</span>
            <span className="text-[11px] font-bold text-slate-700 block">Exam Score</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-emerald-600">{examScore}%</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Good Mark</span>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Step 2 • Deep Check</span>
            <span className="text-[11px] font-bold text-slate-700 block">Concept Mastery</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-blue-600">{conceptMastery}%</span>
          </div>
          <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">Hidden Drop</span>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Step 3 • Root Cause</span>
            <span className="text-[11px] font-bold text-slate-700 block">Prereq Gaps</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-amber-600">{prerequisiteGapsCount}</span>
          </div>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">Bottlenecks</span>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Step 4 • Metric</span>
            <span className="text-[11px] font-bold text-slate-700 block">Learning Debt</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-rose-600">{learningDebtScore}<span className="text-xs text-slate-400 font-normal">/100</span></span>
          </div>
          <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-semibold">Moderate Risk</span>
        </div>

        {/* Step 5 */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Step 5 • Downstream</span>
            <span className="text-[11px] font-bold text-slate-700 block">Future Risk</span>
          </div>
          <div className="my-2 text-[10px] font-semibold text-rose-600 space-y-0.5">
            {futureRiskTopics.map((t, idx) => (
              <span key={idx} className="block truncate">{t}</span>
            ))}
          </div>
          <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-semibold">Cascade Vulnerability</span>
        </div>

        {/* Step 6 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">Step 6 • Action</span>
            <span className="text-[11px] font-bold text-blue-900 block">AI Path</span>
          </div>
          <div className="my-2 text-[10px] font-bold text-blue-800 leading-tight">
            {recommendedPath}
          </div>
          <span className="text-[10px] text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full font-bold">Personalized</span>
        </div>
      </div>
    </div>
  );
};
