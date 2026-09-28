import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Play, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentLearningPath: React.FC = () => {
  const navigate = useNavigate();
  const [completedModules, setCompletedModules] = useState<string[]>(['m-1', 'm-2']);

  const handleCompleteModule = (id: string) => {
    if (!completedModules.includes(id)) {
      setCompletedModules([...completedModules, id]);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const modules = [
    { id: 'm-1', title: '1. SQL Relational Basics', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'm-2', title: '2. Relational Joins & Aggregates', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'm-3', title: '3. Functional Dependency & Attribute Closure (X+)', status: 'Attention Needed', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
    { id: 'm-4', title: '4. Candidate Keys & Armstrong Axioms', status: 'Upcoming', icon: Play, color: 'text-blue-600 bg-blue-50' },
    { id: 'm-5', title: '5. Normalization (1NF, 2NF, 3NF, BCNF)', status: 'Upcoming', icon: Play, color: 'text-blue-600 bg-blue-50' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800 uppercase tracking-wider mb-2 inline-block">
            AI Remediation Active
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Master DBMS Foundations Learning Path
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
            Targeted prerequisite recovery path designed by LearnDebt AI to eliminate your 35% Functional Dependency debt.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-right">
          <span className="text-[10px] uppercase text-cyan-300 font-extrabold block">Path Progress</span>
          <span className="text-2xl font-black text-white">42%</span>
          <span className="text-[10px] text-slate-300 block">2 of 5 Modules Complete</span>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((m) => {
          const isDone = completedModules.includes(m.id);
          return (
            <div
              key={m.id}
              className={`p-6 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : m.id === 'm-3'
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl font-bold ${isDone ? 'bg-emerald-100 text-emerald-700' : m.color}`}>
                    {isDone ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Module</span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{m.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Video Lesson (12 mins) • Reading Notes • Interactive Formula Practice • Concept Verification Quiz
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isDone && (
                    <button
                      onClick={() => handleCompleteModule(m.id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      Complete Module
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/student/quiz')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                  >
                    <span>Take Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
