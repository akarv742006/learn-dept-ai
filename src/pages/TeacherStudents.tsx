import React from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_STUDENTS_LIST } from '../services/studentService';
import { RiskBadge } from '../components/RiskBadge';

export const TeacherStudents: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase">Class Cohort Roster</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">All Students & Prerequisite Debt</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Student ID</th>
                <th className="p-3.5">Class Section</th>
                <th className="p-3.5">Exam Mark</th>
                <th className="p-3.5">Learning Debt Index</th>
                <th className="p-3.5">Risk Level</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {INITIAL_STUDENTS_LIST.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                    <span>{s.name}</span>
                  </td>
                  <td className="p-3.5 text-slate-500">{s.studentId}</td>
                  <td className="p-3.5">{s.className}</td>
                  <td className="p-3.5 font-bold text-emerald-600">{s.overallGrade}%</td>
                  <td className="p-3.5 font-bold text-amber-600">{s.learningDebtIndex} / 100</td>
                  <td className="p-3.5"><RiskBadge level={s.riskStatus} size="sm" /></td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/teacher/student/${s.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[11px]"
                    >
                      View Deep Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
