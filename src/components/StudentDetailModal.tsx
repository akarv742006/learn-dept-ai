import React from 'react';
import type { Student, SubjectData } from '../types/debt';
import { predictFutureGradeImpact } from '../utils/debtCalculator';
import {
  X,
  Brain,
  TrendingDown,
  Sparkles,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  subject: SubjectData;
  onClose: () => void;
  onLaunchQuiz: (student: Student) => void;
  onLaunchRemediation: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  subject,
  onClose,
  onLaunchQuiz,
  onLaunchRemediation,
}) => {
  if (!student) return null;

  const projection = predictFutureGradeImpact(student.overallGrade, student.learningDebtIndex);
  const masteriesList = Object.values(student.conceptMasteries);
  const conceptMap = new Map(subject.concepts.map((c) => [c.id, c]));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel bg-white w-full max-w-4xl rounded-2xl border border-slate-300 p-6 md:p-8 bg-white max-h-[90vh] overflow-y-auto relative animate-pulse-subtle shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900">{student.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  student.riskStatus === 'Critical Risk'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {student.riskStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {student.email} • {student.gradeLevel}
              </p>
              <div className="mt-2 text-xs text-cyan-800 font-bold flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-600" />
                <span>Persona: {student.persona}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Exam Mark</span>
              <div className="text-2xl font-black text-cyan-700">{student.overallGrade}%</div>
            </div>

            <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Debt Index</span>
              <div className={`text-2xl font-black ${
                student.learningDebtIndex >= 60 ? 'text-rose-600' : 'text-amber-600'
              }`}>
                {student.learningDebtIndex}/100
              </div>
            </div>
          </div>
        </div>

        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
          <strong className="text-slate-900 block mb-1">Diagnostic Summary:</strong>
          {student.summary}
        </div>

        <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-extrabold text-slate-900">90-Day Learning Trajectory Projection</h3>
            </div>
            <span className="text-xs text-rose-700 font-bold">
              Est. Drop: -{projection.gradeDrop}%
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium">
            {projection.impactDescription}
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex-1 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-slate-500 block text-[10px] font-bold">Current Exam Score</span>
              <span className="text-cyan-700 text-base font-black">{student.overallGrade}%</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="flex-1 bg-white p-2.5 rounded-lg border border-rose-200 shadow-xs">
              <span className="text-slate-500 block text-[10px] font-bold">Predicted Score (No Remediation)</span>
              <span className="text-rose-600 text-base font-black">{projection.predictedGradeIn3Months}%</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="flex-1 bg-white p-2.5 rounded-lg border border-emerald-200 shadow-xs">
              <span className="text-slate-500 block text-[10px] font-bold">Target Score (With 15-Min Bridge)</span>
              <span className="text-emerald-700 text-base font-black">{Math.min(98, student.overallGrade + 6)}%</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Concept Mastery vs Prerequisite Health
          </h3>
          <div className="space-y-3">
            {masteriesList.map((m) => {
              const conceptObj = conceptMap.get(m.conceptId);
              if (!conceptObj) return null;

              return (
                <div
                  key={m.conceptId}
                  className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    m.isIllusionaryHigh || m.vulnerabilityLevel === 'Critical'
                      ? 'bg-rose-50/60 border-rose-300'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{conceptObj.name}</span>
                      {m.isIllusionaryHigh && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-600 text-white uppercase">
                          Hidden Prereq Gap
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">{conceptObj.category}</span>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-slate-500 text-[10px] font-semibold">Exam Score</div>
                      <div className="font-black text-cyan-700">{m.directScore}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-500 text-[10px] font-semibold">Prereq Health</div>
                      <div className={`font-black ${m.prerequisiteMastery < 55 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {m.prerequisiteMastery}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-500 text-[10px] font-semibold">Learning Debt</div>
                      <div className={`font-black ${m.learningDebtScore > 50 ? 'text-rose-600' : 'text-amber-600'}`}>
                        {m.learningDebtScore}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              onClose();
              onLaunchQuiz(student);
            }}
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Launch Diagnostic Probe</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onLaunchRemediation(student);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Assign 15-Min Remediation Bridge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
