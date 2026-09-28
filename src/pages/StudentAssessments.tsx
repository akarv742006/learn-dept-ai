import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentQuizPage } from './StudentQuizPage';

export const StudentQuiz = StudentQuizPage;

export const StudentAssessments: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans p-6 pb-12">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Smart Quiz & Diagnostic Hub
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Randomized Assessments & Practice Tests
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Choose from practice quizzes, diagnostic tests, or AI-generated assessments with zero repeated questions.
          </p>
        </div>
        <button
          onClick={() => navigate('/student/quiz')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition"
        >
          Launch Random Quiz Engine
        </button>
      </div>

      <StudentQuizPage />
    </div>
  );
};

