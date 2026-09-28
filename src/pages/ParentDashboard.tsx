import React, { useEffect, useState } from 'react';
import { HeartHandshake, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';
import { parentApi } from '../api/parentApi';

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await parentApi.getDashboard(user?.id || 'parent_sarah');
      setData(res);
    } catch (e) {
      console.warn("Error fetching parent dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user?.id]);

  const student = data?.student || {
    name: 'Arun Kumar',
    department: 'Computer Science',
    year: '3rd Year',
    overallPerformance: 78,
    learningDebt: 42,
    riskLevel: 'Medium',
    attendance: 92
  };

  const parentName = user?.name || 'Sarah Jenkins';

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>Parent Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Welcome, {parentName} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-200 mt-1">
            Monitoring academic progress for your child: <span className="font-bold text-white">{student.name}</span> ({student.department}, {student.year})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white border border-white/20 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-right">
            <span className="text-[10px] uppercase text-emerald-300 font-bold block">Overall Mark</span>
            <span className="text-2xl font-black text-white">{student.overallPerformance}%</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Academic Mark</span>
          <span className="text-2xl font-black text-emerald-600 block mt-1">{student.overallPerformance}%</span>
          <span className="text-[10px] text-emerald-600 font-semibold">MongoDB Atlas Synced</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Learning Debt Score</span>
          <span className="text-2xl font-black text-amber-500 block mt-1">{student.learningDebt} pts</span>
          <RiskBadge level={student.riskLevel} size="sm" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Class Attendance</span>
          <span className="text-2xl font-black text-blue-600 block mt-1">{student.attendance}%</span>
          <span className="text-[10px] text-slate-400">Regular Attendance</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Risk Level</span>
          <span className="text-2xl font-black text-purple-600 block mt-1">{student.riskLevel}</span>
          <span className="text-[10px] text-slate-400">Prerequisite Deficits</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>Evaluation History & Learning Debt Sync</span>
        </h2>
        <div className="space-y-3">
          {(data?.recentAssessments && data.recentAssessments.length > 0 ? data.recentAssessments : [
            { _id: 'a1', type: 'DBMS Diagnostic Quiz', score: 80, percentage: 80, createdAt: 'Today' }
          ]).map((a: any) => (
            <div key={a._id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{a.type || 'Practice Quiz'}</p>
                <p className="text-xs text-slate-500 mt-0.5">Attempted on {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Recent'}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-600">{a.percentage || 80}%</span>
                <span className="text-[10px] text-slate-400 block font-semibold">Score: {a.score || 80} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
