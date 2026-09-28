import React, { useState } from 'react';
import type { Student, RemediationModule } from '../types/debt';
import { REMEDIATION_MODULES } from '../data/remediations';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Check
} from 'lucide-react';

interface RemediationPlannerProps {
  student: Student;
  onCompleteRemediation: (student: Student, repairedConceptId: string) => void;
}

export const RemediationPlanner: React.FC<RemediationPlannerProps> = ({
  student,
  onCompleteRemediation,
}) => {
  const [activeModule, setActiveModule] = useState<RemediationModule>(REMEDIATION_MODULES[0]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedStepIndices, setCompletedStepIndices] = useState<number[]>([]);
  const [isModuleCompleted, setIsModuleCompleted] = useState(false);

  const handleNextStep = () => {
    if (!completedStepIndices.includes(activeStepIndex)) {
      setCompletedStepIndices((prev) => [...prev, activeStepIndex]);
    }

    if (activeStepIndex < activeModule.steps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      setIsModuleCompleted(true);
      onCompleteRemediation(student, activeModule.missingPrerequisiteId);
    }
  };

  return (
    <div className="glass-panel bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 w-full mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-purple-700 font-bold uppercase tracking-wider">
              15-Min Prerequisite Micro-Remediation Bridge
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {activeModule.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Assigned to: <strong className="text-cyan-800">{student.name}</strong> • Gap Repair: <strong className="text-amber-800">{activeModule.missingPrerequisiteName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>Est. Time: {activeModule.estimatedMinutes} Mins</span>
        </div>
      </div>

      <div className="flex items-center gap-2 my-6 overflow-x-auto pb-2">
        {REMEDIATION_MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => {
              setActiveModule(mod);
              setActiveStepIndex(0);
              setCompletedStepIndices([]);
              setIsModuleCompleted(false);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
              mod.id === activeModule.id
                ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            {mod.missingPrerequisiteName} Bridge
          </button>
        ))}
      </div>

      {!isModuleCompleted ? (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {activeModule.steps.map((step, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                  idx === activeStepIndex
                    ? 'bg-purple-50 border-purple-400 text-purple-900 font-extrabold shadow-2xs'
                    : completedStepIndices.includes(idx)
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Step {step.stepNumber}</span>
                  {completedStepIndices.includes(idx) && (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <span className="text-[11px] text-slate-600 block truncate mt-0.5 font-medium">{step.heading}</span>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
            <span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block mb-2">
              Step {activeModule.steps[activeStepIndex].stepNumber}: {activeModule.steps[activeStepIndex].heading}
            </span>

            <p className="text-sm text-slate-800 leading-relaxed mb-4 font-medium">
              {activeModule.steps[activeStepIndex].content}
            </p>

            {activeModule.steps[activeStepIndex].visualSnippet && (
              <div className="p-4 rounded-xl bg-white border border-slate-300 font-mono text-xs text-cyan-800 font-bold my-4 shadow-xs">
                {activeModule.steps[activeStepIndex].visualSnippet}
              </div>
            )}

            {activeModule.steps[activeStepIndex].codeOrFormula && (
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 font-mono text-xs text-purple-900 font-bold my-4 shadow-xs">
                {activeModule.steps[activeStepIndex].codeOrFormula}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 italic font-medium">
              Key Insight: {activeModule.keyTakeaway}
            </div>

            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all"
            >
              <span>{activeStepIndex < activeModule.steps.length - 1 ? 'Next Step' : 'Complete Prerequisite Bridge'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-2">
            Prerequisite Gap Repaired!
          </h3>
          <p className="text-xs text-slate-600 font-medium max-w-md mx-auto mb-6">
            <strong className="text-slate-900">{student.name}</strong> has completed the 15-minute bridge for <strong className="text-purple-800">{activeModule.missingPrerequisiteName}</strong>. Learning debt index reduced by -18 points!
          </p>

          <button
            onClick={() => {
              setActiveStepIndex(0);
              setCompletedStepIndices([]);
              setIsModuleCompleted(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition-all shadow-xs"
          >
            Review Bridge Material Again
          </button>
        </div>
      )}
    </div>
  );
};
