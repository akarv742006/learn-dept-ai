import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertOctagon } from 'lucide-react';
import { studentService } from '../services/studentService';
import { RiskBadge } from '../components/RiskBadge';
import { ConceptGraph } from '../components/ConceptGraph';

export const TeacherStudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Concepts' | 'Assessments' | 'Interventions'>('Overview');

  const student = studentService.getStudentById(id || 'std-arun-102');

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Back Button & Header */}
      <button
        onClick={() => navigate('/teacher/students')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Cohort</span>
      </button>

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{student.name}</h1>
              <RiskBadge level={student.riskStatus} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Class: {student.className} • ID: {student.studentId} • {student.department}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Exam Score</span>
            <span className="text-xl font-black text-emerald-600">{student.overallGrade}%</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Learning Debt</span>
            <span className="text-xl font-black text-rose-600">72 / 100</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Concept Mastery</span>
            <span className="text-xl font-black text-blue-600">64%</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Risk Level</span>
            <span className="text-sm font-black text-rose-600 block mt-1">HIGH</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        {(['Overview', 'Concepts', 'Assessments', 'Interventions'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === t
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="bg-amber-50/80 dark:bg-amber-950/20 p-6 rounded-3xl border border-amber-300 dark:border-amber-800/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-sm">
              <AlertOctagon className="w-5 h-5 text-amber-600" />
              <span>Diagnostic Key Insight</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
              "Student performs well in standard examination questions (82%), but exhibits critical vulnerability in 3 prerequisite concepts (Functional Dependency, Candidate Keys, Normalization)."
            </p>
          </div>

          <ConceptGraph onAssignPath={() => navigate('/teacher/interventions')} />
        </div>
      )}

      {activeTab === 'Concepts' && (
        <ConceptGraph onAssignPath={() => navigate('/teacher/interventions')} />
      )}
    </div>
  );
};
