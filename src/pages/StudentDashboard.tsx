import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Flame, ArrowRight, Sparkles, RefreshCw, Lock, Unlock, Bot, BrainCircuit, Target, CheckCircle2, ShieldCheck, X, Receipt, Building2, PhoneCall, MessageCircle, HeartHandshake, ClipboardCheck, Award, FileText } from 'lucide-react';
import { LearningDebtWaterfallCard } from '../components/LearningDebtWaterfallCard';
import { RiskBadge } from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';
import { studentApi, type StudentDashboardResponse } from '../api/studentApi';
import { saasApi, type UserSubscriptionState, type PaymentRecord } from '../api/saasApi';
import { authApi, type CollegeStaffMember } from '../api/authApi';
import { firebaseSync } from '../services/firebase';
import { UPIPaymentModal } from '../components/UPIPaymentModal';
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '../data/subscriptionPlans';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignedTests, setAssignedTests] = useState<any[]>([]);
  const [latestReport, setLatestReport] = useState<any>(null);
  const [data, setData] = useState<StudentDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [subState, setSubState] = useState<UserSubscriptionState | null>(null);
  const [collegeStaff, setCollegeStaff] = useState<CollegeStaffMember[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [gatedModalOpen, setGatedModalOpen] = useState<boolean>(false);
  const [gatedFeatureName, setGatedFeatureName] = useState<string>('');
  const [activeAiTool, setActiveAiTool] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  const fetchTestsAndReports = async () => {
    try {
      const dept = user?.department || 'Computer Science';
      let tests = await firebaseSync.getAssignments(dept);
      if (!tests || tests.length === 0) {
        tests = await firebaseSync.getAssignments('All');
      }
      setAssignedTests(tests || []);

      const roll = (user as any)?.rollNumber || user?.id || 'CS2023-042';
      const report = await firebaseSync.getLatestStudentTest(roll);
      setLatestReport(report);
    } catch (e) {
      console.warn("Could not load faculty tests or report:", e);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [res, subRes, staffRes] = await Promise.all([
        studentApi.getDashboard(user?.id || 'student_arun'),
        saasApi.getMySubscription(user?.id || 'student_arun'),
        authApi.getCollegeStaff(user?.college || 'Anna University').catch(() => ({ success: true, staff: [] })),
        fetchTestsAndReports()
      ]);
      setData(res);
      setSubState(subRes);
      if (staffRes?.staff) {
        setCollegeStaff(staffRes.staff);
      }
    } catch (e) {
      console.warn("Using baseline fallback profile:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Listen for real-time exam submissions or local updates
    const onTestUpdate = () => {
      fetchTestsAndReports();
    };
    window.addEventListener('learndebt_test_submitted', onTestUpdate);
    window.addEventListener('learndebt_assignment_created', onTestUpdate);
    window.addEventListener('storage', onTestUpdate);
    const interval = setInterval(fetchTestsAndReports, 8000); // 8s auto-refresh for newly created tests

    return () => {
      window.removeEventListener('learndebt_test_submitted', onTestUpdate);
      window.removeEventListener('learndebt_assignment_created', onTestUpdate);
      window.removeEventListener('storage', onTestUpdate);
      clearInterval(interval);
    };
  }, [user?.id, user?.college, user?.department]);

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

  const fetchPaymentHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await saasApi.getPaymentHistory(user?.id || 'student_arun');
      setPaymentHistory(res?.payments || []);
    } catch (e) {
      console.warn("Could not load payment history:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleOpenHistory = () => {
    setShowHistoryModal(true);
    fetchPaymentHistory();
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

      {/* 2.5 REAL-TIME FACULTY ASSIGNED TESTS & LATEST EXAM REPORT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Faculty Assigned Tests */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 p-6 rounded-3xl border border-indigo-500/40 text-white shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-black text-white">Faculty Assigned Tests</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {assignedTests.length} Available
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Tests published by your department professors in real-time. Complete them to clear prerequisite debt.
          </p>

          <div className="space-y-2">
            {assignedTests.length > 0 ? (
              assignedTests.slice(0, 3).map((test: any, idx: number) => (
                <div
                  key={test.id || idx}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-white truncate">{test.title}</h4>
                    <p className="text-[11px] text-indigo-300 truncate">
                      {test.concept || test.department || 'Computer Science'} • {test.totalMarks || 50} Marks
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/student/quiz?testId=${test.id}`)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-md transition shrink-0 cursor-pointer"
                  >
                    Start Test →
                  </button>
                </div>
              ))
            ) : (
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-center text-xs text-slate-400">
                <span>No new pending faculty tests. Ready for smart self-assessment!</span>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/student/quiz')}
            className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>View All Assessments & Quizzes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Latest Test Mark Sheet & Score Report */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">Latest Exam Mark Sheet</h3>
            </div>
            {latestReport ? (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                (latestReport.percentage ?? 0) >= 60
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
              }`}>
                {(latestReport.percentage ?? 0) >= 60 ? 'PASSED ✅' : 'NEEDS PRACTICE ⚠️'}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                Ready for Test
              </span>
            )}
          </div>

          {latestReport ? (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">{latestReport.testTitle || 'Diagnostic Assessment'}</h4>
                  <p className="text-[11px] text-slate-500">{latestReport.department || 'Computer Science'} • {new Date(latestReport.submittedAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {latestReport.marksAwarded ?? 40} / {latestReport.totalMarks ?? 50}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold block">
                    ({latestReport.percentage ?? 80}% Accuracy)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Correct Answers</span>
                  <span className="font-extrabold">{latestReport.correctAnswers ?? 4} Questions</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Total Evaluated</span>
                  <span className="font-extrabold">{latestReport.totalQuestions ?? 5} Questions</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No test taken today</p>
              <p className="text-[11px] text-slate-500">Take an assessment above to generate your live report card.</p>
            </div>
          )}

          <button
            onClick={() => navigate('/student/quiz')}
            className="w-full py-2.5 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <span>Open Exam Center & Solution Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
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
              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                <button
                  type="button"
                  onClick={handleOpenHistory}
                  className="flex items-center gap-1.5 text-indigo-300 hover:text-white transition font-medium cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View Payment History</span>
                </button>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Synced
                </span>
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
              <div className="pt-1 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleOpenHistory}
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Payment History</span>
                </button>
                <span className="text-[10px] text-slate-400 font-medium">Demo Mode</span>
              </div>
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

          {/* Linked Parent Portal Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs">
                <HeartHandshake className="w-4 h-4" />
                <span>Linked Parent Portal</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                தமிழ் / English
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Parent Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{user?.parentName || 'Ramesh Krishnan'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Contact:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{user?.parentPhone || '+91 63797 62186'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Login PIN:</span>
                <span className="font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">1234</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Parents can monitor learning debt scores and concept recovery progress in either <strong>தமிழ் (Tamil)</strong> or <strong>English</strong>.
            </p>
            <button
              type="button"
              onClick={() => navigate('/parent/dashboard')}
              className="w-full py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Preview Parent Dashboard (பெற்றோர்)</span>
              <ArrowRight className="w-3.5 h-3.5" />
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

      {/* 4. College Faculty & Mentors Section (Same College) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Your College Faculty & Staff Mentors
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {user?.college || 'Anna University'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Staff members registered under your college available for academic guidance and concept clarification.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Faculty Support Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(collegeStaff.length > 0 ? collegeStaff : [
            {
              id: 'teacher_rajesh',
              name: 'Dr. Rajesh Sharma',
              designation: 'Associate Professor & HOD',
              department: 'Computer Science',
              phone: '+91 63797 62186',
              whatsapp: '6379762186',
              officeHours: 'Mon-Fri 09:00 AM - 05:00 PM',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
              courses: ['DBMS', 'Distributed Systems']
            },
            {
              id: 'teacher_priya_sharma',
              name: 'Ms. Priya Sharma',
              designation: 'Assistant Professor & Concept Advisor',
              department: 'Computer Science',
              phone: '+91 63797 62186',
              whatsapp: '6379762186',
              officeHours: 'Mon-Thu 10:00 AM - 04:00 PM',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma',
              courses: ['Relational Schema Design', 'Normalization']
            },
            {
              id: 'teacher_suresh',
              name: 'Prof. Suresh Nair',
              designation: 'Senior Professor & Academic Dean',
              department: 'Information Technology',
              phone: '+91 63797 62186',
              whatsapp: '6379762186',
              officeHours: 'Tue-Fri 11:00 AM - 05:00 PM',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SureshNair',
              courses: ['Algorithms', 'Cloud Systems']
            }
          ]).map((staff: any) => (
            <div key={staff.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <img src={staff.avatar} alt={staff.name} className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{staff.name}</h4>
                  <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{staff.designation}</p>
                  <p className="text-[10px] text-slate-500">{staff.department}</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
                <div><span className="font-semibold text-slate-700 dark:text-slate-300">Office Hours:</span> {staff.officeHours}</div>
                <div><span className="font-semibold text-slate-700 dark:text-slate-300">Courses:</span> {staff.courses?.join(', ')}</div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`https://wa.me/916379762186?text=${encodeURIComponent(`Hello ${staff.name}, I am ${user?.name || 'a student'} from ${user?.college || 'Anna University'}. I have a doubt regarding my Learning Debt assessment.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp (6379762186)</span>
                </a>
                <a
                  href="tel:+916379762186"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                  title="Call Faculty (+91 63797 62186)"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
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

      {/* PAYMENT HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Payment History</h3>
                  <p className="text-[11px] text-slate-500">View transaction receipts and subscription records</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                DEMO PAYMENT — NO REAL MONEY CHARGED
              </span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {loadingHistory ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading payment records...</div>
              ) : paymentHistory.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No payment records found yet.</div>
              ) : (
                paymentHistory.map((rec: any, idx: number) => (
                  <div
                    key={rec._id || rec.payment_id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {rec.plan_id ? rec.plan_id.replace('_', ' ').toUpperCase() : 'STUDENT PRO'}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          rec.status === 'SUCCESS'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}>
                          {rec.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        ID: <span className="font-mono text-slate-700 dark:text-slate-300">{rec.payment_id || rec._id}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {rec.payment_method || 'DEMO_UPI'} • {rec.created_at ? new Date(rec.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        ₹{rec.amount ?? 99}
                      </span>
                      <span className="block text-[10px] text-slate-400 uppercase">
                        {rec.currency || 'INR'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
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
