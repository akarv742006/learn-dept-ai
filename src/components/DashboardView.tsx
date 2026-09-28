import React from 'react';
import {
  Users,
  AlertTriangle,
  Target,
  TrendingUp,
  MoreVertical,
  Calendar,
  ChevronDown,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText
} from 'lucide-react';
import type { Student } from '../types/debt';

interface DashboardViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onLaunchRemediation: (student: Student) => void;
  onSelectTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  onSelectStudent,
  onLaunchRemediation,
  onSelectTab,
}) => {
  // Demo table data matching reference image
  const gapStudents = [
    { sNo: 1, name: 'Rohan S', class: 'XII - A', gapTopics: 'Arrays, Linked List', risk: 'High', studentId: 'std-001' },
    { sNo: 2, name: 'Sneha R', class: 'XII - B', gapTopics: 'Chemical Bonding, Stoichiometry', risk: 'High', studentId: 'std-004' },
    { sNo: 3, name: 'Arjun M', class: 'XII - A', gapTopics: 'Trigonometry, Coordinate Geometry', risk: 'Medium', studentId: 'std-003' },
    { sNo: 4, name: 'Divya K', class: 'XII - C', gapTopics: 'OOP Concepts, Inheritance', risk: 'Medium', studentId: 'std-002' },
    { sNo: 5, name: 'Karthik P', class: 'XII - B', gapTopics: 'Differentiation, Integration', risk: 'High', studentId: 'std-001' },
  ];

  // Demo alerts matching reference image
  const recentAlerts = [
    { name: 'Rohan S', gap: 'Weak in Arrays (DSA)', time: '2 hours ago', severity: 'high' },
    { name: 'Sneha R', gap: 'Gaps in Chemical Bonding', time: '4 hours ago', severity: 'high' },
    { name: 'Arjun M', gap: 'Weak in Trigonometry', time: '5 hours ago', severity: 'medium' },
    { name: 'Divya K', gap: 'Gaps in OOP Concepts', time: '6 hours ago', severity: 'medium' },
    { name: 'Karthik P', gap: 'Weak in Differentiation', time: '7 hours ago', severity: 'high' },
  ];

  // Demo concept progress
  const conceptProgress = [
    { concept: 'Arrays', mastery: 62, color: 'bg-rose-500' },
    { concept: 'Linked List', mastery: 68, color: 'bg-amber-500' },
    { concept: 'Recursion', mastery: 74, color: 'bg-amber-500' },
    { concept: 'Trigonometry', mastery: 81, color: 'bg-emerald-500' },
    { concept: 'Chemical Bonding', mastery: 58, color: 'bg-rose-500' },
    { concept: 'OOP Concepts', mastery: 76, color: 'bg-emerald-500' },
  ];

  // Demo subject distribution
  const subjectDistribution = [
    { subject: 'Mathematics', percentage: '29%', count: 5, color: '#3b82f6' },
    { subject: 'Physics', percentage: '24%', count: 4, color: '#06b6d4' },
    { subject: 'Chemistry', percentage: '18%', count: 3, color: '#f59e0b' },
    { subject: 'Computer Science', percentage: '18%', count: 3, color: '#e11d48' },
    { subject: 'English', percentage: '6%', count: 1, color: '#8b5cf6' },
    { subject: 'Others', percentage: '6%', count: 1, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50/80 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Good Morning, Ms. Priya! 👋
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Here's how your students are performing and where they need support.
          </p>
        </div>

        {/* Date Selector Card */}
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-3 shadow-2xs">
          <Calendar className="w-4 h-4 text-blue-600" />
          <div>
            <div className="text-slate-900 font-bold">Thursday, 25 September 2026</div>
            <div className="text-[10px] text-slate-500">Academic Year 2026 - 2027</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* 2. Top 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Students
              </span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">48</div>
              <span className="text-[11px] text-emerald-600 font-semibold">+2 this week</span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Students with Learning Gaps */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Students with Learning Gaps
              </span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">17</div>
              <span className="text-[11px] text-rose-600 font-semibold">35.4% of total</span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Total Concepts Analyzed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Concepts Analyzed
              </span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">124</div>
              <span className="text-[11px] text-slate-500 font-medium">Across all subjects</span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Card 4: Average Improvement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Average Improvement
              </span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">12%</div>
              <span className="text-[11px] text-slate-500 font-medium">After support sessions</span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Middle Row: Learning Debt Trend Line Chart, Donut Chart & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Learning Debt Trend Line Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Learning Debt Trend</h3>
              <p className="text-[11px] text-slate-500 font-medium">Students with detected gaps over time</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Students with Gaps</span>
            </div>
          </div>

          {/* Line Chart SVG */}
          <div className="w-full h-48 py-2">
            <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="0" y="32" fill="#94a3b8" fontSize="9">30</text>
              <text x="0" y="62" fill="#94a3b8" fontSize="9">20</text>
              <text x="0" y="92" fill="#94a3b8" fontSize="9">10</text>
              <text x="0" y="122" fill="#94a3b8" fontSize="9">0</text>

              {/* Area Under Curve */}
              <path
                d="M 30 95 Q 90 70, 150 98 T 270 75 T 390 55 L 390 125 L 30 125 Z"
                fill="url(#lineGrad)"
              />

              {/* Smooth Curve */}
              <path
                d="M 30 95 Q 90 70, 150 98 T 270 75 T 390 55"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
              />

              {/* Data Points */}
              <circle cx="30" cy="95" r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />
              <circle cx="102" cy="72" r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />
              <circle cx="174" cy="98" r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />
              <circle cx="246" cy="92" r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />
              <circle cx="318" cy="75" r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />
              <circle cx="390" cy="55" r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />

              {/* X Axis Labels */}
              <text x="30" y="142" fill="#64748b" fontSize="10" textAnchor="middle">Apr</text>
              <text x="102" y="142" fill="#64748b" fontSize="10" textAnchor="middle">May</text>
              <text x="174" y="142" fill="#64748b" fontSize="10" textAnchor="middle">Jun</text>
              <text x="246" y="142" fill="#64748b" fontSize="10" textAnchor="middle">Jul</text>
              <text x="318" y="142" fill="#64748b" fontSize="10" textAnchor="middle">Aug</text>
              <text x="390" y="142" fill="#64748b" fontSize="10" textAnchor="middle">Sep</text>
            </svg>
          </div>
        </div>

        {/* Middle: Gap Distribution by Subject Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-extrabold text-slate-900">Gap Distribution by Subject</h3>
            <button
              onClick={() => onSelectTab('concept-analysis')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="flex items-center gap-4 py-2">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="16" />
                {/* Segments */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="16" strokeDasharray="69 170" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="16" strokeDasharray="57 182" strokeDashoffset="-69" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="16" strokeDasharray="43 196" strokeDashoffset="-126" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#e11d48" strokeWidth="16" strokeDasharray="43 196" strokeDashoffset="-169" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="16" strokeDasharray="14 225" strokeDashoffset="-212" />
              </svg>
              <div className="absolute text-center pointer-events-none">
                <div className="text-xl font-black text-slate-900">17</div>
                <div className="text-[10px] text-slate-500 font-medium">Students</div>
              </div>
            </div>

            {/* Legend List */}
            <div className="space-y-1.5 flex-1 text-[11px]">
              {subjectDistribution.map((item) => (
                <div key={item.subject} className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate max-w-[90px] font-medium">{item.subject}</span>
                  </div>
                  <span className="font-bold">{item.percentage} <span className="text-slate-400 font-normal">({item.count})</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recent Alerts (3 cols) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-slate-900">Recent Alerts</h3>
            <button
              onClick={() => onSelectTab('learning-gaps')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-start justify-between gap-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    alert.severity === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">{alert.name}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{alert.gap}</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Main Grid: Students Table, Concept Analysis & Learning Path Suggestion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Students with Learning Gaps Table (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900">Students with Learning Gaps</h3>
              <button
                onClick={() => onSelectTab('students')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                    <th className="pb-2.5">S.No</th>
                    <th className="pb-2.5">Student Name</th>
                    <th className="pb-2.5">Class</th>
                    <th className="pb-2.5">Gap Topics</th>
                    <th className="pb-2.5">Risk Level</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gapStudents.map((row) => (
                    <tr key={row.sNo} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 text-slate-500 font-medium">{row.sNo}</td>
                      <td className="py-3 font-bold text-slate-900">{row.name}</td>
                      <td className="py-3 text-slate-500 font-medium">{row.class}</td>
                      <td className="py-3 text-slate-700 font-medium">{row.gapTopics}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.risk === 'High'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {row.risk}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            const std = students.find((s) => s.id === row.studentId) || students[0];
                            onSelectStudent(std);
                          }}
                          className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100">
            <button
              onClick={() => onSelectTab('students')}
              className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
            >
              <span>View all students</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Middle: Concept Analysis Progress Bars (3 cols) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900">Concept Analysis</h3>
              <button
                onClick={() => onSelectTab('concept-analysis')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                View Details
              </button>
            </div>

            <div className="space-y-4">
              {conceptProgress.map((item) => (
                <div key={item.concept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{item.concept}</span>
                    <span className="text-slate-900 font-extrabold">{item.mastery}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Learning Path Suggestion Card (3 cols) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Learning Path Suggestion
              </h3>
              <button
                onClick={() => onSelectTab('learning-paths')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                View All
              </button>
            </div>

            {/* Student Focus Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
              <div className="font-extrabold text-slate-900 text-xs">
                Rohan S – Arrays (DSA)
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Recommended Path</div>
              <ol className="mt-2 space-y-1.5 text-[11px] text-slate-700 font-semibold">
                <li className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Basic Array Concepts (Video + Notes)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Practice Set (10 Questions)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Array Applications (Real-world)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">4</span>
                  <span>Short Quiz (Assessment)</span>
                </li>
              </ol>
            </div>
          </div>

          <button
            onClick={() => {
              const std = students[0];
              onLaunchRemediation(std);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 transition-all"
          >
            Assign Learning Path
          </button>
        </div>
      </div>

      {/* 5. Bottom Row: Recent Activity & Detect Early Banner Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Activity (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900">Recent Activity</h3>
            <button className="text-xs text-blue-600 font-bold hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">Concept analysis completed for Class XII - A</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Today, 10:24 AM</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">Learning gap detected for Sneha R in Chemical Bonding</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Today, 09:48 AM</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">Learning path assigned to Arjun M (Trigonometry)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Yesterday, 06:32 PM</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">Report generated for Monthly Learning Gaps</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Yesterday, 04:15 PM</span>
            </div>
          </div>
        </div>

        {/* Right: Detect Early. Support Better Banner (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                Detect Early. Support Better.
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                Stay ahead of learning debt with concept-level insights, performance tracking and personalized learning paths.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => onSelectTab('concept-analysis')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 transition-all"
            >
              Explore Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
