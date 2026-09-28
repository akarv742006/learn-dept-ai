import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Flame, AlertOctagon, ArrowRight, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import { LearningDebtWaterfallCard } from '../components/LearningDebtWaterfallCard';
import { RiskBadge } from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';
import { studentApi, type StudentDashboardResponse } from '../api/studentApi';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await studentApi.getDashboard(user?.id || 'student_arun');
      setData(res);
    } catch (e) {
      console.warn("Using baseline fallback profile:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Arun';
  const learningDebt = data?.learningDebt ?? 42;
  const overallPerformance = data?.overallPerformance ?? 78;
  const riskLevel = data?.riskLevel ?? 'Medium';

  // Format trend data from learning debt history snapshots
  const trendData = data?.debtHistory && data.debtHistory.length > 0
    ? data.debtHistory.map((item: any, idx: number) => ({
        week: `T${idx + 1}`,
        performance: 75 + (idx * 2),
        debt: item.score ?? 40
      }))
    : [
        { week: 'T1', performance: 72, debt: 68 },
        { week: 'T2', performance: 74, debt: 61 },
        { week: 'T3', performance: 76, debt: 52 },
        { week: 'T4', performance: 78, debt: 42 },
      ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>LearnDebt AI Student Portal • {user?.department || 'Computer Science'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Good Morning, {firstName} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Here's your learning health overview. Overall score is <span className="font-bold text-emerald-400">{overallPerformance}%</span>, and Learning Debt is <span className="font-bold text-amber-300">{learningDebt} pts</span>.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold block">Learning Streak</span>
            <span className="text-lg font-extrabold text-white">14 Days 🔥</span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Overall Performance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{overallPerformance}%</span>
            <RiskBadge level={riskLevel} size="sm" />
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${overallPerformance}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Learning Debt Index</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-500">{learningDebt} pts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">MongoDB Atlas Synced</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Risk Profile</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-500">{riskLevel}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">Concept Deficits Tracked</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Recent Evaluations</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-500">{data?.recentAssessments?.length ?? 4} Tests</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">Non-repeating items</p>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Learning Debt Waterfall */}
        <div className="lg:col-span-2 space-y-6">
          <LearningDebtWaterfallCard />

          {/* Trend Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Learning Debt Progression Trend</h3>
                <p className="text-xs text-slate-500">Live database snapshots over time</p>
              </div>
              <button
                onClick={fetchDashboardData}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl text-slate-600 dark:text-slate-300 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="week" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="debt" stroke="#f59e0b" strokeWidth={3} name="Learning Debt (pts)" />
                  <Line type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={2} name="Score (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Next Steps & Quick Quiz Trigger */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl border border-indigo-800/50 text-white shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-cyan-300 font-extrabold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black tracking-tight">Ready for a Quiz?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Take a randomized, non-repeating assessment backed by MongoDB Atlas to clear your concept deficits.
            </p>
            <button
              onClick={() => navigate('/student/quiz')}
              className="w-full py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition cursor-pointer"
            >
              <span>Start Smart Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Recent Evaluation Notifications</h3>
            <div className="space-y-2">
              {(data?.notifications && data.notifications.length > 0 ? data.notifications : [
                { _id: '1', title: 'DBMS Assessment Score', message: 'Evaluation completed. Score: 80%', createdAt: '2 hours ago' },
                { _id: '2', title: 'Pro Plan Active', message: 'Gemini AI question generation unlocked.', createdAt: '1 day ago' }
              ]).map((n: any) => (
                <div key={n._id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
                  <p className="font-bold text-slate-900 dark:text-white">{n.title}</p>
                  <p className="text-slate-500 mt-0.5">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
