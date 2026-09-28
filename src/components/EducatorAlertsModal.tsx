import React from 'react';
import type { AlertItem, Student } from '../types/debt';
import {
  X,
  ShieldAlert,
  Bell,
  Sparkles
} from 'lucide-react';

interface EducatorAlertsModalProps {
  alerts: AlertItem[];
  students: Student[];
  onClose: () => void;
  onSelectStudent: (student: Student) => void;
  onLaunchRemediation: (student: Student) => void;
}

export const EducatorAlertsModal: React.FC<EducatorAlertsModalProps> = ({
  alerts,
  students,
  onClose,
  onSelectStudent,
  onLaunchRemediation,
}) => {
  const studentMap = new Map(students.map((s) => [s.id, s]));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="glass-panel bg-white w-full max-w-3xl rounded-2xl border border-slate-300 p-6 md:p-8 bg-white max-h-[85vh] overflow-y-auto relative animate-pulse-subtle pr-4 sm:pr-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-6 border-b border-slate-200 mb-6">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div className="pr-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
              Educator Early Warning Alerts
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
                {alerts.length} Detected
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Hidden prerequisite gaps detected before exam scores collapse in upcoming units.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => {
            const studentObj = studentMap.get(alert.studentId);
            return (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-slate-50 border border-rose-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-rose-400 transition-all shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-slate-900 text-sm font-extrabold">{alert.studentName}</strong>
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-extrabold text-[10px] uppercase tracking-wider border border-rose-200">
                        DEBT SCORE: {alert.debtScore}
                      </span>
                    </div>

                    <p className="text-slate-700 mt-1 leading-relaxed font-medium">
                      Exam Mark: <strong className="text-cyan-700">{alert.rawGrade}%</strong>, but Prerequisite Health in <strong className="text-amber-700">{alert.prerequisiteName}</strong> is only <strong className="text-rose-700">{alert.prereqMastery}%</strong>.
                    </p>

                    <div className="mt-2 text-[11px] text-slate-500 font-medium italic">
                      Recommended: {alert.recommendedAction}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {studentObj && (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectStudent(studentObj);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition-all shadow-2xs"
                    >
                      View Student
                    </button>
                  )}

                  {studentObj && (
                    <button
                      onClick={() => {
                        onClose();
                        onLaunchRemediation(studentObj);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Assign Repair</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
