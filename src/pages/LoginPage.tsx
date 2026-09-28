import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, GraduationCap, UserCheck, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import type { UserRole } from '../types/debt';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('akash.sharma@learndebt.ai');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const { loginAsRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emailPrefix = email.split('@')[0] || 'User';
    const formattedName = emailPrefix
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    loginAsRole(selectedRole, formattedName, email);
    if (selectedRole === 'student') navigate('/student/dashboard');
    else if (selectedRole === 'teacher') navigate('/teacher/dashboard');
    else if (selectedRole === 'parent') navigate('/parent/dashboard');
    else if (selectedRole === 'admin') navigate('/admin/dashboard');
  };

  const handleDemoLogin = (role: UserRole) => {
    loginAsRole(role);
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'teacher') navigate('/teacher/dashboard');
    else if (role === 'parent') navigate('/parent/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-5">
        {/* Left Branding Side */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#12192b] via-[#1a233b] to-indigo-950 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <Logo size="lg" />
            </div>

            <h2 className="text-2xl font-black mb-3 text-white">
              Detect Early. Learn Stronger.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              LearnDebt AI exposes hidden prerequisite knowledge gaps that remain invisible behind standard examination marks.
            </p>
          </div>

          <div className="space-y-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Prerequisite Chain Mapping</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-Time Learning Debt Score</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>AI Neural Root Cause Analysis</span>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="md:col-span-3 p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Welcome Back</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select your portal to sign in.</p>
            </div>

            <Link to="/" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Landing Page
            </Link>
          </div>

          {/* Quick Demo Login Row */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Instant Demo Access (One Click)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex flex-col items-center gap-1 transition"
              >
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Student Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('teacher')}
                className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex flex-col items-center gap-1 transition"
              >
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Teacher Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('parent')}
                className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex flex-col items-center gap-1 transition"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>Parent Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex flex-col items-center gap-1 transition"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="student">Student Portal</option>
                <option value="teacher">Teacher Portal</option>
                <option value="parent">Parent Portal</option>
                <option value="admin">Administrator Portal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email / Student ID
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition"
            >
              <span>Login to {selectedRole.toUpperCase()} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
