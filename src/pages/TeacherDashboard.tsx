import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, RefreshCw, Users, AlertTriangle } from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';
import { teacherApi } from '../api/teacherApi';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getDashboard();
      setData(res);
    } catch (e) {
      console.warn("Error fetching teacher dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const overview = data?.classOverview || {
    totalStudents: 4,
    avgLearningDebt: 42,
    highRiskCount: 1,
    mediumRiskCount: 2,
    lowRiskCount: 1,
    atRiskStudentsCount: 3
  };

  const studentsList = data?.students || [
    { id: 'student_arun', name: 'Arun Kumar', rollNumber: 'CS2023-042', department: 'Computer Science', year: '3rd Year', overallPerformance: 78, learningDebt: 42, riskLevel: 'Medium' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-cyan-300 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Educator Portal • Department of {user?.department || 'Computer Science'}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
              PSR Engineering College • 14/20 Faculty Seats Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Good Morning, {user?.name || 'Dr. Rajesh Sharma'} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed mt-1">
            Class overview: <span className="font-bold text-white">{overview.totalStudents} total students</span> tracked via MongoDB Atlas. Average Learning Debt is <span className="font-bold text-amber-300">{overview.avgLearningDebt} pts</span>.
          </p>
        </div>

        <button
          onClick={() => navigate('/teacher/students')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition cursor-pointer"
        >
          <span>View Student Directory</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Students</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">{overview.totalStudents}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Low Risk</span>
          <span className="text-2xl font-black text-emerald-600 block mt-1">{overview.lowRiskCount}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Medium Risk</span>
          <span className="text-2xl font-black text-amber-600 block mt-1">{overview.mediumRiskCount}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">High Risk</span>
          <span className="text-2xl font-black text-rose-600 block mt-1">{overview.highRiskCount}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Class Debt</span>
          <span className="text-2xl font-black text-indigo-500 block mt-1">{overview.avgLearningDebt} pts</span>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            <span>Class Roster & Synchronized Learning Debt Scores</span>
          </h2>
          <button
            onClick={fetchDashboard}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl text-slate-600 dark:text-slate-300 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Department & Year</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Learning Debt</th>
                <th className="py-3 px-4">Risk Profile</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentsList.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{s.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{s.rollNumber}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{s.department} ({s.year})</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{s.overallPerformance}%</td>
                  <td className="py-3.5 px-4 font-bold text-amber-500">{s.learningDebt} pts</td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={s.riskLevel} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => navigate(`/teacher/student/${s.id}`)}
                      className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition cursor-pointer"
                    >
                      Inspect Profile →
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
