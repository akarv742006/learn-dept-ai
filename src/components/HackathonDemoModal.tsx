import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Play, CheckCircle2, AlertTriangle, Layers, Brain, Award, RefreshCw, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HackathonDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPath?: () => void;
}

export const HackathonDemoModal: React.FC<HackathonDemoModalProps> = ({ isOpen, onClose, onNavigateToPath }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isAutoPlaying && currentStep < 6) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 2500);
    } else if (currentStep === 6 && isAutoPlaying) {
      setIsAutoPlaying(false);
      confetti({ particleCount: 100, spread: 70 });
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStep]);

  if (!isOpen) return null;

  const stepsData = [
    {
      step: 1,
      title: 'Initial Assessment & High Exam Score',
      badge: 'Step 1 • Traditional Evaluation',
      icon: Award,
      content: 'Arun Kumar achieves an 82% overall mark in the DBMS examination. Traditional grading systems register him as a strong, healthy student.',
      metric: { label: 'Exam Score', value: '82%', status: 'Good Mark', color: 'text-emerald-500' },
    },
    {
      step: 2,
      title: 'Deep Concept Vector Analysis',
      badge: 'Step 2 • Prerequisite Vector Audit',
      icon: Brain,
      content: 'LearnDebt AI evaluates performance at individual concept vectors instead of stopping at the overall mark.',
      conceptBreakdown: [
        { name: 'SQL Basics', score: 85, status: 'Strong' },
        { name: 'SQL Joins', score: 80, status: 'Healthy' },
        { name: 'Functional Dependency', score: 35, status: 'CRITICAL GAP' },
        { name: 'Candidate Key', score: 40, status: 'Weak' },
        { name: 'Normalization', score: 42, status: 'Vulnerable' },
      ],
    },
    {
      step: 3,
      title: 'Root Cause & Prerequisite Dependency Chain',
      badge: 'Step 3 • Dependency Graph Mapping',
      icon: Layers,
      content: 'The engine traces the cascade: Weakness in Functional Dependency (35%) directly sabotages Candidate Keys (40%) and Normalization (42%).',
      chain: 'Functional Dependency (35%)  ➔  Candidate Key (40%)  ➔  Normalization (42%)',
    },
    {
      step: 4,
      title: 'Learning Debt Calculation & Risk Flag',
      badge: 'Step 4 • Prototype Scoring Model',
      icon: AlertTriangle,
      content: 'Calculates high prototype Learning Debt score of 68/100 despite the 82% exam grade. High Risk flag generated.',
      metric: { label: 'Learning Debt Index', value: '68 / 100', status: 'HIGH RISK', color: 'text-rose-600' },
    },
    {
      step: 5,
      title: 'AI Gemini Insight & 3-Day Recovery Plan',
      badge: 'Step 5 • Intelligent Personalization',
      icon: Sparkles,
      content: 'Gemini AI generates plain-English explanation for student, teacher & parent, recommending a 3-Day Functional Dependency Recovery Plan.',
      plan: ['Day 1: FD Axioms & Closures', 'Day 2: Minimal Covers & Candidate Keys', 'Day 3: 2NF/3NF Normalization Quiz'],
    },
    {
      step: 6,
      title: 'Diagnostic Recovery & Debt Reduction',
      badge: 'Step 6 • Verified Improvement',
      icon: CheckCircle2,
      content: 'Student completes recovery drills and retakes diagnostic quiz. Functional Dependency mastery jumps to 72%! Learning Debt drops from 68 ➔ 42 (-38%).',
      comparison: { before: 68, after: 42, drop: '-26 pts (-38%)' },
    },
  ];

  const current = stepsData[currentStep - 1];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col justify-between max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 font-black flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 fill-slate-900" />
            </div>
            <div>
              <span className="text-[10px] font-black text-cyan-300 uppercase tracking-wider block">
                MISSION-07 End-to-End Simulation
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Learning Debt Detection Journey Demo
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Pills */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
          {stepsData.map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                currentStep === s.step
                  ? 'bg-blue-600 text-white shadow-xs'
                  : currentStep > s.step
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              <span>{s.step}</span>
              <span className="hidden sm:inline text-[10px]">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Main Step Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              {current.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono">Step {currentStep} of 6</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
              <StepIcon className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{current.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{current.content}</p>
            </div>
          </div>

          {/* Dynamic Content Views based on Step */}
          {current.metric && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">{current.metric.label}</span>
              <div className="text-right">
                <span className={`text-2xl font-black ${current.metric.color}`}>{current.metric.value}</span>
                <span className="text-[10px] block font-bold text-slate-400">{current.metric.status}</span>
              </div>
            </div>
          )}

          {current.conceptBreakdown && (
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                Student Vector Audit (Arun Kumar)
              </span>
              {current.conceptBreakdown.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/60 dark:border-slate-700/60 last:border-none">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-black ${c.score < 50 ? 'text-rose-600 font-extrabold' : 'text-slate-700 dark:text-slate-300'}`}>
                      {c.score}%
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.score < 50 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {current.chain && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/40 dark:to-amber-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-mono font-bold text-rose-800 dark:text-rose-200 text-center">
              {current.chain}
            </div>
          )}

          {current.plan && (
            <div className="space-y-2 bg-blue-50/60 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 block mb-1">
                Generated Recovery Schedule
              </span>
              {current.plan.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          )}

          {current.comparison && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/50 dark:to-cyan-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Before Recovery</span>
                <span className="text-2xl font-black text-rose-600">{current.comparison.before} / 100</span>
              </div>
              <div className="text-emerald-600 font-black text-xl">➔</div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">After Recovery</span>
                <span className="text-2xl font-black text-emerald-600">{current.comparison.after} / 100</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Net Reduction</span>
                <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
                  {current.comparison.drop}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 flex items-center gap-1.5 transition"
          >
            {isAutoPlaying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>Auto-playing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Auto Play Journey</span>
              </>
            )}
          </button>

          <div className="flex gap-2">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
              >
                Back
              </button>
            )}

            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToPath) onNavigateToPath();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition"
              >
                <span>Explore Full App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
