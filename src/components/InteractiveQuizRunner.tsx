import React, { useState } from 'react';
import type { Student } from '../types/debt';
import { DIAGNOSTIC_QUIZZES } from '../data/quizzes';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Brain,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Lightbulb
} from 'lucide-react';

interface InteractiveQuizRunnerProps {
  student: Student;
  onUpdateStudentDebt: (student: Student, updatedDebtIndex: number) => void;
  onLaunchRemediation: (student: Student) => void;
}

export const InteractiveQuizRunner: React.FC<InteractiveQuizRunnerProps> = ({
  student,
  onUpdateStudentDebt,
  onLaunchRemediation,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: DIAGNOSTIC_QUIZZES.length });
  const [detectedGaps, setDetectedGaps] = useState<string[]>([]);

  const question = DIAGNOSTIC_QUIZZES[currentQuestionIndex];

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isSubmitted) return;
    setIsSubmitted(true);

    const chosenOption = question.options.find((o) => o.id === selectedOptionId);
    if (chosenOption?.isCorrect) {
      setQuizScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else if (chosenOption?.targetedConceptId) {
      setDetectedGaps((prev) => [...prev, chosenOption.targetedConceptId]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < DIAGNOSTIC_QUIZZES.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
    } else {
      const gapPenalty = detectedGaps.length * 12;
      const updatedDebt = Math.min(100, student.learningDebtIndex + gapPenalty);
      onUpdateStudentDebt(student, updatedDebt);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setQuizScore({ correct: 0, total: DIAGNOSTIC_QUIZZES.length });
    setDetectedGaps([]);
  };

  const isCompleted = currentQuestionIndex === DIAGNOSTIC_QUIZZES.length - 1 && isSubmitted;

  return (
    <div className="glass-panel bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 w-full mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Diagnostic Concept Probe Simulator
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Probing hidden prerequisite gaps for <strong className="text-cyan-700">{student.name}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-600 font-bold">
            Probe {currentQuestionIndex + 1} of {DIAGNOSTIC_QUIZZES.length}
          </span>
          <div className="w-28 bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / DIAGNOSTIC_QUIZZES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="py-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200">
              Target Concept: {question.conceptName}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
              Prerequisite Probe: {question.prerequisiteName}
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 mb-6 leading-relaxed">
            {question.questionText}
          </h3>

          <div className="space-y-3 mb-6">
            {question.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let optionClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

              if (isSubmitted) {
                if (opt.isCorrect) {
                  optionClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs';
                } else if (isSelected && !opt.isCorrect) {
                  optionClass = 'bg-rose-50 border-rose-500 text-rose-900 font-bold shadow-xs';
                } else {
                  optionClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                optionClass = 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold shadow-xs';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all duration-200 ${optionClass}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {opt.id.slice(-1).toUpperCase()}
                      </div>
                      <span className="leading-relaxed font-semibold">{opt.text}</span>
                    </div>

                    {isSubmitted && opt.isCorrect && (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    )}
                    {isSubmitted && isSelected && !opt.isCorrect && (
                      <XCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                    )}
                  </div>

                  {isSubmitted && (isSelected || opt.isCorrect) && (
                    <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] leading-relaxed flex items-start gap-2 font-medium text-slate-700">
                      <Lightbulb className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      <span>{opt.diagnosticInsight}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isSubmitted && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-6 leading-relaxed font-medium">
              <strong className="text-cyan-800 block mb-1">Foundational Explanation:</strong>
              {question.explanation}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Evaluate Probe Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md shadow-cyan-600/30 flex items-center gap-2 transition-all"
              >
                <span>{currentQuestionIndex < DIAGNOSTIC_QUIZZES.length - 1 ? 'Next Diagnostic Probe' : 'Finalize Learning Debt Audit'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Brain className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-2">
            Diagnostic Probe Evaluation Complete!
          </h3>
          <p className="text-xs text-slate-600 font-medium max-w-md mx-auto mb-6">
            Probing complete for <strong className="text-slate-900">{student.name}</strong>. Identified foundational prerequisite gaps have been processed by the Learning Debt Engine.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8 text-left">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold uppercase">Score on Probe</span>
              <div className="text-2xl font-black text-cyan-700 mt-1">
                {quizScore.correct} / {quizScore.total}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-rose-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-bold uppercase">Detected Prerequisite Gaps</span>
              <div className="text-2xl font-black text-rose-600 mt-1">
                {detectedGaps.length} Gaps
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleResetQuiz}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Diagnostic Probe</span>
            </button>

            <button
              onClick={() => onLaunchRemediation(student)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch 15-Min Remediation Path</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
