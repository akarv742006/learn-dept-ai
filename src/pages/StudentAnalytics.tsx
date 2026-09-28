import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  Layers,
  BookOpen,
  Activity,
  Target,
  Sparkles,
  Download,
  Brain,
  CheckCircle2,
  Calendar,
  Zap,
  ArrowUpRight,
  ShieldAlert,
  BarChart3,
  Radar as RadarIcon
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const StudentAnalytics: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '3m' | 'all'>('30d');
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<'all' | 'dbms' | 'dsa' | 'networks'>('all');
  const [reportDownloaded, setReportDownloaded] = useState(false);

  // Performance Trend Data
  const performanceTrendData = [
    { date: 'Sep 02', quizScore: 60, debtScore: 56, mastery: 64, targetVelocity: 50 },
    { date: 'Sep 06', quizScore: 68, debtScore: 50, mastery: 69, targetVelocity: 45 },
    { date: 'Sep 10', quizScore: 74, debtScore: 46, mastery: 73, targetVelocity: 40 },
    { date: 'Sep 15', quizScore: 80, debtScore: 42, mastery: 77, targetVelocity: 36 },
    { date: 'Sep 20', quizScore: 76, debtScore: 39, mastery: 80, targetVelocity: 33 },
    { date: 'Sep 25', quizScore: 86, debtScore: 34, mastery: 84, targetVelocity: 30 },
    { date: 'Sep 28', quizScore: 92, debtScore: 32, mastery: 88, targetVelocity: 28 },
  ];

  // Radar Chart: Subject Competency Comparison
  const subjectRadarData = [
    { subject: 'DBMS', studentScore: 82, classAverage: 68, fullMark: 100 },
    { subject: 'DSA', studentScore: 65, classAverage: 62, fullMark: 100 },
    { subject: 'Networks', studentScore: 78, classAverage: 71, fullMark: 100 },
    { subject: 'OS', studentScore: 72, classAverage: 65, fullMark: 100 },
    { subject: 'Web Tech', studentScore: 90, classAverage: 75, fullMark: 100 },
  ];

  // Cognitive Bloom's Taxonomy Breakdown
  const bloomTaxonomyData = [
    { level: 'Remember', percentage: 92, status: 'Mastered', count: '46/50' },
    { level: 'Understand', percentage: 84, status: 'Strong', count: '42/50' },
    { level: 'Apply', percentage: 68, status: 'Developing', count: '34/50' },
    { level: 'Analyze', percentage: 48, status: 'Prerequisite Gap', count: '24/50' },
    { level: 'Evaluate', percentage: 38, status: 'Critical Blocker', count: '19/50' },
  ];

  // Concept Mastery Data
  const conceptMasteryData = [
    { concept: 'SQL Joins', mastery: 92, status: 'Mastered', debt: 2 },
    { concept: 'Graph Traversals', mastery: 78, status: 'Developing', debt: 8 },
    { concept: 'Candidate Keys', mastery: 68, status: 'Developing', debt: 12 },
    { concept: 'Functional Dependency', mastery: 42, status: 'Root Gap', debt: 24 },
    { concept: '3NF Normalization', mastery: 35, status: 'Blocker', debt: 28 },
  ];

  // Quiz Accuracy
  const quizAccuracyData = [
    { name: 'Correct Answers', count: 76, color: '#10b981' },
    { name: 'Incorrect Answers', count: 18, color: '#f43f5e' },
  ];

  // Weekly Study Activity
  const studyActivityData = [
    { day: 'Mon', hours: 2.5, quizzes: 3 },
    { day: 'Tue', hours: 1.8, quizzes: 2 },
    { day: 'Wed', hours: 3.2, quizzes: 4 },
    { day: 'Thu', hours: 1.2, quizzes: 1 },
    { day: 'Fri', hours: 4.0, quizzes: 5 },
    { day: 'Sat', hours: 2.4, quizzes: 3 },
    { day: 'Sun', hours: 1.6, quizzes: 2 },
  ];

  // 28-Day Study Streak Activity Grid
  const streakDays = Array.from({ length: 28 }, (_, i) => {
    const intensity = [0, 1, 2, 3, 2, 3, 1, 0, 2, 3, 3, 2, 1, 3, 2, 1, 3, 3, 2, 0, 1, 2, 3, 3, 2, 3, 2, 3][i];
    return { day: i + 1, intensity };
  });

  const recentActivities = [
    { id: 1, text: 'Completed DBMS Practice Quiz on SQL Joins', time: '10 mins ago', badge: 'Score: 90%', type: 'quiz' },
    { id: 2, text: 'Remediated Functional Dependency prerequisite closure', time: '2 hours ago', badge: '+9% Mastery', type: 'mastery' },
    { id: 3, text: 'Finished 3-Day Recovery Mission on Normalization', time: 'Yesterday', badge: 'Debt -8 pts', type: 'recovery' },
    { id: 4, text: 'Passed Diagnostic Assessment on Candidate Keys', time: '2 days ago', badge: 'Score: 85%', type: 'assessment' },
  ];

  const handleDownloadReport = () => {
    const reportContent = `LEARNDEBT AI - STUDENT DIAGNOSTIC REPORT
Student: ${user?.name || 'Arun Sharma'}
Academic Department: Computer Science & Engineering
Term: Fall 2026
Generated: ${new Date().toLocaleDateString()}

========================================
EXECUTIVE METRICS
========================================
- Learning Debt Score: 32 / 100 (Low-to-Moderate Risk)
- Total Diagnostic Quizzes Cleared: 18
- Overall Prerequisite Mastery: 88%
- Accuracy Ratio: 80.8%
- Department Cohort Percentile: 84th Percentile (Top 16%)

========================================
PREREQUISITE GAP ANALYSIS
========================================
1. SQL Joins: 92% (Mastered)
2. Graph Traversals: 78% (Developing)
3. Candidate Keys: 68% (Developing - Debt: 12 pts)
4. Functional Dependency: 42% (Root Cause Gap - Debt: 24 pts)
5. 3NF Normalization: 35% (Cascading Failure - Debt: 28 pts)

========================================
COGNITIVE BLOOM'S TAXONOMY
========================================
- Remember: 92%
- Understand: 84%
- Apply: 68%
- Analyze: 48% (Target Remediation)
- Evaluate: 38% (Root Blocker)

Verified by LearnDebt AI Prerequisite Intelligence Engine.
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LearnDebt_Report_${user?.name?.replace(/\s+/g, '_') || 'Student'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setReportDownloaded(true);
    setTimeout(() => setReportDownloaded(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d1527] via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              Advanced Diagnostic Intelligence
            </span>
            <span className="text-xs text-slate-400">• Fall Term 2026</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            {user?.name || 'Student'}'s Learning Analytics
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mt-1.5 leading-relaxed">
            Real-time concept mastery trends, cognitive Bloom's taxonomy velocity, and root-cause learning debt remediation telemetry.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          {/* Time Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            {(['7d', '30d', '3m', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition uppercase cursor-pointer ${
                  timeFilter === t
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === '7d' ? '7D' : t === '30d' ? '30D' : t === '3m' ? '3M' : 'ALL'}
              </button>
            ))}
          </div>

          {/* Export Report Button */}
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition hover:scale-105 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{reportDownloaded ? 'Report Exported!' : 'Export Report'}</span>
          </button>
        </div>

        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Quizzes */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
            <span>Quizzes Cleared</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">18</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
            Avg Score: 84%
          </div>
        </div>

        {/* Current Learning Debt */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
            <span>Learning Debt Index</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2 flex items-baseline gap-1.5">
            <span>32</span>
            <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
            ↓ -16 pts (Low Risk)
          </div>
        </div>

        {/* Overall Concept Mastery */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
            <span>Overall Mastery</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">88%</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">4 of 5 concepts passed</div>
        </div>

        {/* Accuracy */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold">
            <span>Accuracy Rate</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">80.8%</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-bold">
            76 of 94 questions
          </div>
        </div>

        {/* Cohort Percentile Gauge */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-5 rounded-2xl border border-indigo-700/50 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-blue-200 uppercase font-bold">
            <span>Cohort Ranking</span>
            <BarChart3 className="w-4 h-4 text-blue-300" />
          </div>
          <div className="text-3xl font-black text-white mt-2">84th</div>
          <div className="text-xs text-emerald-300 mt-1 font-bold">
            Top 16% in Department
          </div>
        </div>
      </div>

      {/* CHARTS ROW 1: Performance Trend & Subject Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Performance & Debt Burn-down Velocity */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Performance vs. Learning Debt Burn-Down Velocity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing diagnostic examination score against active learning debt repayment over time.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
              Velocity: +8.4 pts/wk
            </span>
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
                <Line type="monotone" dataKey="debtScore" name="Learning Debt Index" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="mastery" name="Prerequisite Mastery %" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="targetVelocity" name="Planned Target Debt" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Competency Radar Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RadarIcon className="w-5 h-5 text-purple-500" />
                Subject Competency Radar
              </h2>
              <span className="text-[10px] font-black text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full">
                5 Subjects
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Student mastery (Blue) vs. College Department Average (Purple).
            </p>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={subjectRadarData}>
                  <PolarGrid stroke="#334155" opacity={0.2} />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                  <Radar name="Student" dataKey="studentScore" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                  <Radar name="Class Average" dataKey="classAverage" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* CHARTS ROW 2: Cognitive Bloom's Taxonomy & Concept Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cognitive Bloom's Taxonomy Breakdown */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-500" />
                Cognitive Bloom's Taxonomy Breakdown
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identifies higher-order cognitive bottlenecks where prerequisite breakdown occurs.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {bloomTaxonomyData.map((item) => (
              <div key={item.level} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>{item.level}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({item.count})</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        item.percentage >= 75
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.percentage >= 50
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="font-black text-slate-900 dark:text-white min-w-[36px] text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.percentage >= 75
                        ? 'bg-emerald-500'
                        : item.percentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concept Mastery Bars */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                Concept Mastery & Debt Attribution
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Shows exact points of debt contributed by each prerequisite concept.
              </p>
            </div>
            <button
              onClick={() => navigate('/student/concepts')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View DAG</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conceptMasteryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="concept" type="category" stroke="#94a3b8" fontSize={11} width={130} tickLine={false} />
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
        </div>

      </div>

      {/* CHARTS ROW 3: Study Streak Grid & AI Intervention Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 28-Day Study & Diagnostic Streak Calendar */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                28-Day Assessment & Study Streak
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily activity tracking for prerequisite quiz consistency.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
              🔥 12 Days
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {streakDays.map((s) => (
              <div
                key={s.day}
                className={`h-9 rounded-xl flex items-center justify-center font-bold text-[11px] transition ${
                  s.intensity === 3
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : s.intensity === 2
                    ? 'bg-emerald-400 text-slate-900 font-black'
                    : s.intensity === 1
                    ? 'bg-emerald-200 text-slate-800'
                    : 'bg-slate-200 dark:bg-slate-700/60 text-slate-400'
                }`}
                title={`Day ${s.day}: ${s.intensity * 2} Quizzes Cleared`}
              >
                {s.day}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Less Active</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-700" />
              <span className="w-3 h-3 rounded-md bg-emerald-200" />
              <span className="w-3 h-3 rounded-md bg-emerald-400" />
              <span className="w-3 h-3 rounded-md bg-emerald-600" />
            </div>
            <span>High Intensity</span>
          </div>
        </div>

        {/* AI Actionable Remediation Engine */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                AI Diagnostic Remediation Engine
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Neural-recommended interventions prioritized by highest debt reduction payoff.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold text-xs">
              Gemini 3.7
            </span>
          </div>

          <div className="space-y-3">
            {/* Card 1 */}
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-black text-rose-700 dark:text-rose-400 text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Priority 1: Remediate Functional Dependency Root Blocker</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Clearing attribute closure calculation eliminates -18 debt points and unlocks 3NF Normalization.
                </p>
              </div>
              <button
                onClick={() => navigate('/student/learning-path')}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shrink-0 transition shadow-sm cursor-pointer"
              >
                Start Mission (-18 pts)
              </button>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-black text-amber-700 dark:text-amber-400 text-xs">
                  <Zap className="w-4 h-4" />
                  <span>Priority 2: Practice Candidate Key Closures Diagnostic</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Student frequently misses secondary candidate keys. 5 tailored diagnostic questions ready.
                </p>
              </div>
              <button
                onClick={() => navigate('/student/quiz')}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shrink-0 transition shadow-sm cursor-pointer"
              >
                Launch Quiz (5 Qs)
              </button>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-black text-blue-700 dark:text-blue-400 text-xs">
                  <Layers className="w-4 h-4" />
                  <span>Priority 3: Inspect Interactive Prerequisite DAG Network</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Simulate debt reduction sliders and view downstream cascade impact on 3NF Normalization.
                </p>
              </div>
              <button
                onClick={() => navigate('/student/concepts')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shrink-0 transition shadow-sm cursor-pointer"
              >
                Inspect Graph
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentAnalytics;
