import React from 'react';
import {
  Flame,
  AlertOctagon,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';
import type { Student } from '../types/debt';
import { LearningDebtWaterfallCard } from './LearningDebtWaterfallCard';

interface StudentDashboardViewProps {
  student: Student;
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ student, onNavigateTab }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-10">
      {/* 1. Header & Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-indigo-500/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Student Portal • {student.gradeLevel}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Good Morning, {student.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Your overall academic mark is <span className="font-bold text-emerald-400">88%</span>, but our AI diagnostic detected <span className="font-bold text-amber-300">2 foundational concept gaps</span> that could hinder advanced subjects.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold block">Learning Streak</span>
            <span className="text-lg font-extrabold text-white">12 Days 🔥</span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Health */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Overall Health</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">82%</span>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Healthy</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>

        {/* Card 2: Debt Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Learning Debt Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">24 <span className="text-xs text-slate-400 font-normal">/100</span></span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">Moderate</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '24%' }}></div>
          </div>
        </div>

        {/* Card 3: Mastered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Concepts Mastered</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600">68 <span className="text-xs text-slate-400 font-normal">/82</span></span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '83%' }}></div>
          </div>
        </div>

        {/* Card 4: At Risk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Concepts at Risk</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">7</span>
            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">Action Needed</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: '28%' }}></div>
          </div>
        </div>

        {/* Card 5: Upcoming */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Upcoming Tests</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">3</span>
            <span className="text-[10px] text-slate-500 font-medium">This Week</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>DSA Midterm Oct 4</span>
          </div>
        </div>
      </div>

      {/* 3. Flagship MISSION-07 Diagnostic Waterfall Card */}
      <LearningDebtWaterfallCard
        studentName={student.name}
        onLaunchRemediation={() => onNavigateTab('learning-paths')}
      />

      {/* 4. Two Column Layout: Hidden Gaps & Recommended Path */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Your Hidden Gaps */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-amber-500" />
                <span>Your Hidden Foundational Gaps</span>
              </h2>
              <p className="text-xs text-slate-500">Prerequisite weaknesses detected despite your 88% exam score.</p>
            </div>
            <button
              onClick={() => onNavigateTab('learning-gaps')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Run Diagnostic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Gap Item 1 */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Arrays & Memory Indexing
                </span>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Mastery: 54%
                </span>
              </div>
              <p className="text-xs text-slate-600">Prerequisite Dependency Cascade:</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px]">Loops ✓</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">Arrays ⚠</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px]">Searching 🔴</span>
              </div>
            </div>

            {/* Gap Item 2 */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Recursion & Stack Frames
                </span>
                <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  Mastery: 48%
                </span>
              </div>
              <p className="text-xs text-slate-600">Prerequisite Dependency Cascade:</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-rose-200">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px]">Functions ✓</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px]">Call Stack ⚠</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold">Recursion 🔴</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Learning Path */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>AI Personalized Recommendation</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              "Strengthen Arrays Before Starting Advanced DSA"
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Estimated completion: 25 minutes • Reduces debt index by 15 points.
            </p>

            <ol className="mt-4 space-y-2 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                <span>Array Memory Allocation & Indexing</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                <span>Contiguous Memory Pointer Traversal</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
                <span>Linear vs Binary Search Boundaries</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">4</span>
                <span>Sorting Invariants Intuition</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">5</span>
                <span>5-Question Concept Verification Quiz</span>
              </li>
            </ol>
          </div>

          <button
            onClick={() => onNavigateTab('learning-paths')}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition"
          >
            <span>Start Learning Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Concept Mastery Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Subject & Concept Mastery Progress</span>
          </h3>
          <span className="text-xs text-slate-400">Updated today</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Java CS */}
          <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Java Data Structures
            </span>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Arrays</span>
                  <span className="font-bold text-emerald-600">92% (Exam) / 54% (Prereq)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">OOP Concepts</span>
                  <span className="font-bold text-emerald-600">84%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Collections Framework</span>
                  <span className="font-bold text-amber-600">61%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '61%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Exception Handling</span>
                  <span className="font-bold text-emerald-600">78%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematics */}
          <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Mathematics & Calculus
            </span>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Differential Calculus</span>
                  <span className="font-bold text-amber-600">58%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Algebra & Functions</span>
                  <span className="font-bold text-emerald-600">87%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Trigonometry Identities</span>
                  <span className="font-bold text-rose-600">38%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
