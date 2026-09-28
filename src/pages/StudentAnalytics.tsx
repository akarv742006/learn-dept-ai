import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  Layers,
  BookOpen,
  Activity,
  Target
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';

export const StudentAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '3m' | 'all'>('30d');

  // Simulated live performance trends based on active user
  const performanceTrendData = [
    { date: 'Sep 10', quizScore: 65, debtScore: 52, mastery: 68 },
    { date: 'Sep 14', quizScore: 70, debtScore: 48, mastery: 72 },
    { date: 'Sep 18', quizScore: 82, debtScore: 42, mastery: 78 },
    { date: 'Sep 22', quizScore: 78, debtScore: 40, mastery: 80 },
    { date: 'Sep 26', quizScore: 88, debtScore: 36, mastery: 85 },
    { date: 'Sep 28', quizScore: 92, debtScore: 32, mastery: 88 },
  ];

  const conceptMasteryData = [
    { concept: 'SQL Joins', mastery: 92, status: 'Mastered' },
    { concept: 'Functional Dependency', mastery: 42, status: 'Weak' },
    { concept: 'Candidate Key', mastery: 68, status: 'Developing' },
    { concept: '3NF Normalization', mastery: 35, status: 'Weak' },
    { concept: 'Graph Traversals', mastery: 78, status: 'Developing' },
  ];

  const quizAccuracyData = [
    { name: 'Correct Answers', count: 74, color: '#10b981' },
    { name: 'Incorrect Answers', count: 18, color: '#f43f5e' },
  ];

  const studyActivityData = [
    { day: 'Mon', hours: 2.5, quizzes: 3 },
    { day: 'Tue', hours: 1.8, quizzes: 2 },
    { day: 'Wed', hours: 3.2, quizzes: 4 },
    { day: 'Thu', hours: 0.8, quizzes: 1 },
    { day: 'Fri', hours: 4.0, quizzes: 5 },
    { day: 'Sat', hours: 2.0, quizzes: 2 },
    { day: 'Sun', hours: 1.5, quizzes: 1 },
  ];

  const recentActivities = [
    { id: 1, text: 'Completed DBMS Practice Quiz on SQL Joins', time: '10 mins ago', badge: 'Score: 90%', type: 'quiz' },
    { id: 2, text: 'Improved Functional Dependency mastery from 35% to 42%', time: '2 hours ago', badge: '+7% Mastery', type: 'mastery' },
    { id: 3, text: 'Completed Day 1 Recovery Plan for Normalization Gaps', time: 'Yesterday', badge: 'Debt -6 pts', type: 'recovery' },
    { id: 4, text: 'Passed Diagnostic Assessment on Candidate Keys', time: '2 days ago', badge: 'Score: 85%', type: 'assessment' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-blue-500/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              Live Performance Telemetry
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            {user?.name || 'Student'}'s Learning Analytics
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mt-1">
            Real-time concept mastery trends, learning debt accumulation, and diagnostic quiz accuracy.
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          {(['7d', '30d', '3m', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition uppercase ${
                timeFilter === t
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : t === '3m' ? '3 Months' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Quizzes */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
            <span>Quizzes Completed</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-3">18</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
            Avg Score: 84%
          </div>
        </div>

        {/* Current Learning Debt */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
            <span>Learning Debt Score</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-3 flex items-baseline gap-2">
            <span>32</span>
            <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
            ↓ -16 pts (Low Risk)
          </div>
        </div>

        {/* Concept Mastery */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
            <span>Overall Concept Mastery</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-3">88%</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">4 of 5 concepts mastered</div>
        </div>

        {/* Questions & Accuracy */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
            <span>Questions Attempted</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-3">92</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-bold">
            80.4% Overall Accuracy
          </div>
        </div>
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance & Debt Trend Line Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Performance vs. Learning Debt Trend
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Shows quiz scores improving as learning debt decreases over time.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="quizScore" name="Quiz Score %" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="debtScore" name="Learning Debt Score" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="mastery" name="Concept Mastery %" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quiz Accuracy Pie Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-emerald-500" />
              Quiz Answer Accuracy
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Ratio of correct vs. incorrect responses across all quizzes.
            </p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quizAccuracyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {quizAccuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {quizAccuracyData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="text-slate-900 dark:text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Concept Mastery Bar Chart & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Concept Mastery Bars */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Concept Mastery Breakdown
          </h2>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conceptMasteryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="concept" type="category" stroke="#94a3b8" fontSize={11} width={120} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Mastery']}
                />
                <Bar dataKey="mastery" fill="#4f46e5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Study Activity */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Weekly Study Hours & Activity
            </h3>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} hrs`, 'Study Time']}
                  />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Live Activity Stream
          </h2>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white">{act.text}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{act.time}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] shrink-0">
                  {act.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
