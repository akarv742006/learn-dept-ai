import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  HeartHandshake,
  Shield,
  CreditCard,
  Database
} from 'lucide-react';
import { LearningDebtWaterfallCard } from './LearningDebtWaterfallCard';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. Public Top Navigation */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/90 border-b border-slate-800 px-6 xl:px-12 py-4 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  LearnDebt AI
                </span>
                <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  MongoDB Atlas
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Detect Early • Learn Stronger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/pricing')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Pricing</span>
            </button>
            <button
              onClick={() => navigate('/admin/database-status')}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <Database className="w-4 h-4 text-indigo-400" />
              <span>DB Inspector</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI-Powered Conceptual Gap & Prerequisite Detection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Good Marks Don't Always Mean <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Strong Foundations</span>.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Detect hidden conceptual gaps before they turn into compound learning debt. Our platform synchronizes evaluations, concept mastery, and remediation plans directly to MongoDB Atlas.
          </p>
          
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              <span>Launch Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-800 shadow-xs transition cursor-pointer"
            >
              Sign In with Any Role
            </button>
          </div>
        </div>

        {/* Quick Role Portal Access Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div
            onClick={() => navigate('/student/dashboard')}
            className="p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition shadow-lg group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Student Portal</h3>
            <p className="text-xs text-slate-400 mt-1">Diagnostic quizzes, concept map, and Learning Debt waterfall.</p>
            <span className="text-xs font-bold text-indigo-400 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition">
              Enter Portal →
            </span>
          </div>

          <div
            onClick={() => navigate('/teacher/dashboard')}
            className="p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition shadow-lg group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Educator Portal</h3>
            <p className="text-xs text-slate-400 mt-1">Classroom roster, student risk breakdown, and learning gaps.</p>
            <span className="text-xs font-bold text-purple-400 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition">
              Enter Portal →
            </span>
          </div>

          <div
            onClick={() => navigate('/parent/dashboard')}
            className="p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition shadow-lg group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Parent Portal</h3>
            <p className="text-xs text-slate-400 mt-1">Track child's academic health, debt score, and recovery progress.</p>
            <span className="text-xs font-bold text-emerald-400 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition">
              Enter Portal →
            </span>
          </div>

          <div
            onClick={() => navigate('/admin/dashboard')}
            className="p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition shadow-lg group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Admin Console</h3>
            <p className="text-xs text-slate-400 mt-1">Live MongoDB Atlas document inspection, revenue, and users.</p>
            <span className="text-xs font-bold text-cyan-400 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition">
              Enter Portal →
            </span>
          </div>
        </div>

        {/* Hero Visual Demo */}
        <div className="pt-4 max-w-5xl mx-auto">
          <LearningDebtWaterfallCard onLaunchRemediation={() => navigate('/student/quiz')} />
        </div>
      </main>
    </div>
  );
};
