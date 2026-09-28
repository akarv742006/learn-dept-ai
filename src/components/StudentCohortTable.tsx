import React, { useState } from 'react';
import type { Student } from '../types/debt';
import {
  Search,
  HelpCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface StudentCohortTableProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onLaunchQuiz: (student: Student) => void;
  onLaunchRemediation: (student: Student) => void;
}

export const StudentCohortTable: React.FC<StudentCohortTableProps> = ({
  students,
  onSelectStudent,
  onLaunchQuiz,
  onLaunchRemediation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'illusion'>('all');

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.persona.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (riskFilter === 'critical') {
      return student.riskStatus === 'Critical Risk' || student.riskStatus === 'High Debt';
    }

    if (riskFilter === 'illusion') {
      return Object.values(student.conceptMasteries).some((m) => m.isIllusionaryHigh);
    }

    return true;
  });

  return (
    <div className="glass-panel bg-white p-6 rounded-2xl border border-slate-200/90 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Student Cohort Learning Debt Matrix
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              {filteredStudents.length} Students
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Comparing conventional examination marks against true foundational prerequisite readiness.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 text-xs text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-cyan-600"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300 text-xs font-semibold">
            <button
              onClick={() => setRiskFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                riskFilter === 'all'
                  ? 'bg-white text-slate-900 font-bold border border-slate-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setRiskFilter('illusion')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                riskFilter === 'illusion'
                  ? 'bg-rose-100 text-rose-800 font-bold border border-rose-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hidden Gaps Only
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <th className="py-3 px-4">Student Profile</th>
              <th className="py-3 px-4">Exam Mark vs Foundational Mastery</th>
              <th className="py-3 px-4">Learning Debt Index</th>
              <th className="py-3 px-4">Risk Status</th>
              <th className="py-3 px-4">Primary Prerequisite Gap</th>
              <th className="py-3 px-4 text-right">Intervention Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredStudents.map((student) => {
              const masteriesList = Object.values(student.conceptMasteries);
              const isIllusionHigh = masteriesList.some((m) => m.isIllusionaryHigh);
              const criticalGapConcept = masteriesList.find((m) => m.vulnerabilityLevel === 'Critical');

              const avgPrereqMastery = Math.round(
                masteriesList.reduce((acc, m) => acc + m.prerequisiteMastery, 0) / (masteriesList.length || 1)
              );

              return (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  onClick={() => onSelectStudent(student)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-300 shadow-xs"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {student.name}
                          {isIllusionHigh && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 uppercase tracking-wider animate-pulse">
                              ⚠️ HIDDEN GAP
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {student.persona}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-slate-700 font-semibold">
                        <span>Exam Mark: <strong className="text-cyan-700">{student.overallGrade}%</strong></span>
                        <span>Prereq: <strong className={avgPrereqMastery < 60 ? 'text-rose-600' : 'text-emerald-700'}>{avgPrereqMastery}%</strong></span>
                      </div>
                      <div className="w-36 bg-slate-100 h-2 rounded-full overflow-hidden flex border border-slate-200">
                        <div
                          className="bg-cyan-600 h-full"
                          style={{ width: `${student.overallGrade}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-black text-sm ${
                        student.learningDebtIndex >= 65
                          ? 'text-rose-600'
                          : student.learningDebtIndex >= 45
                          ? 'text-amber-600'
                          : 'text-emerald-700'
                      }`}>
                        {student.learningDebtIndex}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">/100</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      student.riskStatus === 'Critical Risk'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : student.riskStatus === 'High Debt'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {student.riskStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {criticalGapConcept ? (
                      <span className="text-slate-800 font-semibold truncate max-w-[140px] block">
                        {criticalGapConcept.conceptId === 'math-101' ? 'Algebraic Factoring' : 'Function Composition'}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">No Critical Gap</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onLaunchQuiz(student)}
                        className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-all shadow-2xs"
                        title="Run Diagnostic Quiz"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onLaunchRemediation(student)}
                        className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 transition-all shadow-2xs"
                        title="Assign Prerequisite Remediation"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectStudent(student)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all shadow-2xs"
                        title="Student Full Audit"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
