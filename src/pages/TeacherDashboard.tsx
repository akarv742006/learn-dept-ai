import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, RefreshCw, Users, AlertTriangle, Award, CheckCircle2, Clock, FileCheck } from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';
import { teacherApi } from '../api/teacherApi';
import { firebaseSync } from '../services/firebase';
import { resolveStudentParent } from '../services/parentDirectory';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [liveStudents, setLiveStudents] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [res, students, subs] = await Promise.allSettled([
        teacherApi.getDashboard().catch(() => null),
        firebaseSync.getStudents(user?.department),
        firebaseSync.getSubmissions({ department: user?.department })
      ]);

      if (res.status === 'fulfilled' && res.value) {
        setData(res.value);
      }
      if (students.status === 'fulfilled' && Array.isArray(students.value)) {
        setLiveStudents(students.value);
      }
      if (subs.status === 'fulfilled' && Array.isArray(subs.value)) {
        setRecentSubmissions(subs.value);
      }
    } catch (e) {
      console.warn("Error fetching teacher dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const onTestUpdate = () => {
      fetchDashboard();
    };
    window.addEventListener('learndebt_test_submitted', onTestUpdate);
    window.addEventListener('storage', onTestUpdate);
    const interval = setInterval(fetchDashboard, 8000);

    return () => {
      window.removeEventListener('learndebt_test_submitted', onTestUpdate);
      window.removeEventListener('storage', onTestUpdate);
      clearInterval(interval);
    };
  }, [user?.department]);

  const studentsList = liveStudents.length > 0 ? liveStudents : (data?.students || [
    { id: 'student_arun', name: 'Arun Kumar', rollNumber: 'CS2023-042', department: 'Computer Science', year: '3rd Year', overallPerformance: 78, learningDebt: 42, riskLevel: 'Medium' }
  ]);

  // Compute live overview metrics
  const totalStudents = studentsList.length;
  const avgLearningDebt = totalStudents > 0
    ? Math.round(studentsList.reduce((acc: number, s: any) => acc + (Number(s.learningDebt) || 40), 0) / totalStudents)
    : 42;
  const highRiskCount = studentsList.filter((s: any) => (s.riskLevel || '').toLowerCase() === 'high' || (s.learningDebt || 0) > 50).length;
  const mediumRiskCount = studentsList.filter((s: any) => (s.riskLevel || '').toLowerCase() === 'medium' || ((s.learningDebt || 0) >= 25 && (s.learningDebt || 0) <= 50)).length;
  const lowRiskCount = studentsList.filter((s: any) => (s.riskLevel || '').toLowerCase() === 'low' || (s.learningDebt || 0) < 25).length;

  const overview = {
    totalStudents,
    avgLearningDebt,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    atRiskStudentsCount: highRiskCount + mediumRiskCount
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-cyan-300 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Faculty Portal • Department of {user?.department || 'Computer Science'}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
              {user?.college || 'Anna University'} • Faculty Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Good Morning, {user?.name || 'Dr. Rajesh Sharma'} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed mt-1">
            College: <span className="font-bold text-white">{user?.college || 'Anna University'}</span> • Mentor WhatsApp: <span className="font-bold text-emerald-300">+91 63797 62186</span>. Class overview: <span className="font-bold text-white">{overview.totalStudents} total students</span> tracked with live parent synchronization.
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
            <span>{user?.college || 'Anna University'} Student Roster & Parent Links</span>
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
                <th className="py-3 px-4">Linked Parent</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Learning Debt</th>
                <th className="py-3 px-4">Risk Profile</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentsList.map((s: any) => {
                const parent = resolveStudentParent(s);
                return (
                  <tr key={s.id || s.rollNumber} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{s.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{s.rollNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{s.department} ({s.year})</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{parent.name}</div>
                      <div className="text-[10px] text-slate-400">{parent.phone}</div>
                    </td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Student Test Submissions & Staff Analysis */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Student Test Submissions & Staff Analysis
              </h2>
              <p className="text-[11px] text-slate-500">Real-time gradebook sync across Student, Teacher, and Parent portals</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
            {recentSubmissions.length} Evaluated Tests
          </span>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            No recent student submissions yet. As students take department tests, marks and prerequisite recovery metrics will update here live.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSubmissions.slice(0, 6).map((sub: any) => {
              const isPass = sub.passed || sub.percentage >= 50;
              return (
                <div
                  key={sub._id || sub.id}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[160px]">
                        {sub.studentName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isPass ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}>
                        {isPass ? 'PASSED ✅' : 'NEEDS PRACTICE ⚠️'}
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold truncate">
                      {sub.assignmentTitle}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {sub.department || user?.department} • {new Date(sub.submittedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {sub.score} <span className="text-[10px] text-slate-400 font-normal">/ {sub.maxScore || 50}</span>
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 ml-1.5">
                        ({sub.percentage}%)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3" /> {Math.round((sub.timeTaken || 120) / 60)}m
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
