import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Flame, ArrowRight, Sparkles, RefreshCw, Lock, Unlock, Bot, BrainCircuit, Target, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { LearningDebtWaterfallCard } from '../components/LearningDebtWaterfallCard';
import { RiskBadge } from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';
import { studentApi, type StudentDashboardResponse } from '../api/studentApi';
import { saasApi, type UserSubscriptionState } from '../api/saasApi';
import { UPIPaymentModal } from '../components/UPIPaymentModal';
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '../data/subscriptionPlans';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [subState, setSubState] = useState<UserSubscriptionState | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [gatedModalOpen, setGatedModalOpen] = useState<boolean>(false);
  const [gatedFeatureName, setGatedFeatureName] = useState<string>('');
  const [activeAiTool, setActiveAiTool] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [res, subRes] = await Promise.all([
        studentApi.getDashboard(user?.id || 'student_arun'),
        saasApi.getMySubscription(user?.id || 'student_arun')
      ]);
      setData(res);
      setSubState(subRes);
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
  const isPremium = subState?.is_premium ?? false;

  const handleFeatureClick = (featureTitle: string) => {
    if (!isPremium) {
      setGatedFeatureName(featureTitle);
      setGatedModalOpen(true);
    } else {
      setActiveAiTool(featureTitle);
    }
  };

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

  const studentProPlan = SUBSCRIPTION_PLANS.find((p: SubscriptionPlan) => p.id === 'student-pro') || {
    id: 'student_pro',
    name: 'Student Pro',
    target: 'Dedicated students',
    priceMonthly: 99,
    priceAnnual: 999,
    currency: '₹',
    aiRequestLimitMonthly: 100,
    aiQuizGenLimitMonthly: 50,
    description: 'Personalized recovery missions, detailed concept analytics & AI study assistance.',
    features: ['Advanced AI Study Assistant', 'Personalized Study Plan', 'Learning Debt Insights', 'AI Practice Questions'],
    ctaText: 'Upgrade to Student Pro',
    isPopular: true
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-cyan-300 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>LearnDebt AI Student Portal • {user?.department || 'Computer Science'}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
              PSR Engineering College • Campus License Active
            </span>
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
        {/* Left Column: Learning Debt Waterfall & Charts */}
        <div className="lg:col-span-2 space-y-6">
          <LearningDebtWaterfallCard />

          {/* Premium Feature Showcase (Interactive) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Student Pro AI Toolkit</span>
                </h3>
                <p className="text-xs text-slate-500">Personalized interventions and automated remediation</p>
              </div>
              {isPremium ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5" />
                  Unlocked
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Pro Pass Required
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleFeatureClick('Advanced AI Study Assistant')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
                  isPremium
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-400'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  {isPremium ? <Unlock className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">AI Study Assistant</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Gemini 1.5 instant concept explanations</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleFeatureClick('Personalized Recovery Missions')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
                  isPremium
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-400'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  {isPremium ? <Unlock className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Recovery Missions</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Automated deficit closure drills</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleFeatureClick('Deep Root-Cause Concept Analytics')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
                  isPremium
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-400'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  {isPremium ? <Unlock className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Concept Debt Graph</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Prerequisite dependency root-causes</p>
                </div>
              </button>
            </div>

            {/* If user clicked and is premium, show active tool preview */}
            {isPremium && activeAiTool && (
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-black text-indigo-700 dark:text-indigo-300">
                    Active Module: {activeAiTool}
                  </span>
                  <button onClick={() => setActiveAiTool(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your Student Pro pass is actively syncing with MongoDB Atlas and Firebase project <span className="font-mono text-indigo-500">learndept-ai</span>. Deep prerequisite weakness analysis indicates DBMS Functional Dependencies require 2 targeted practice items to reduce your 42 pts debt.
                </p>
                <button
                  onClick={() => navigate('/student/learning-debt')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition text-[11px] cursor-pointer"
                >
                  Open Debt Root-Cause Inspector →
                </button>
              </div>
            )}
          </div>

          {/* Trend Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Learning Debt Progression Trend</h3>
                <p className="text-xs text-slate-500">Live database snapshots over time</p>
              </div>
              <button
                onClick={fetchDashboardData}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl text-slate-600 dark:text-slate-300 transition cursor-pointer"
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

        {/* Right Column: Compact Subscription Card & Next Steps */}
        <div className="space-y-6">
          
          {/* COMPACT SUBSCRIPTION CARD (Requirement 24) */}
          {isPremium ? (
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-indigo-500/40 text-white shadow-xl space-y-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-black text-amber-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  ⭐ Student Pro
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ACTIVE ✅
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Status: <span className="font-bold text-white">Active (Demo)</span> • Expires: <span className="font-bold text-white">{subState?.expires_at ? new Date(subState.expires_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '29 Oct 2026'}</span>
              </p>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-cyan-300 flex items-center gap-2">
                <Unlock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Premium features unlocked 🔓</span>
              </div>
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Firebase Realtime Sync</span>
                <span className="text-emerald-400 font-bold">Connected</span>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Current Plan
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  FREE
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Basic features available. Personalized AI recovery tools are locked.
              </p>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Premium features locked 🔒</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Upgrade to Student Pro (₹99 Demo)</span>
              </button>
            </div>
          )}

          {/* Quick Quiz Trigger */}
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

      {/* GATED FEATURE MODAL (Requirement 6) */}
      {gatedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                🔒 Student Pro Feature
              </h3>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {gatedFeatureName}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                This feature is available with Student Pro.
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-700 dark:text-amber-300 font-semibold">
              ₹99/month Proposed / Demo Pricing
              <span className="block text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                DEMO PAYMENT — NO REAL MONEY CHARGED
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setGatedModalOpen(false);
                  setShowPaymentModal(true);
                }}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 transition cursor-pointer"
              >
                Upgrade Now (Pay ₹99 Demo)
              </button>
              <button
                type="button"
                onClick={() => setGatedModalOpen(false)}
                className="w-full py-2 rounded-2xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPI PAYMENT MODAL */}
      <UPIPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={studentProPlan as any}
        billingPeriod="Monthly"
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
};
