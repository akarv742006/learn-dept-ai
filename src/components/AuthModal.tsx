import React, { useState } from 'react';
import { BookOpen, User, GraduationCap, ShieldCheck, CheckCircle2, ArrowRight, X } from 'lucide-react';
import type { UserRole } from '../types/debt';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: 'Akash Sharma',
    email: 'akash.sharma@edutech.edu',
    password: '••••••••',
    institution: 'Delhi Technological University',
    department: 'Computer Science',
    idNumber: '2024-CSE-042',
    academicLevel: 'Undergraduate B.Tech 2nd Year',
    subjects: ['Data Structures & Algorithms', 'Calculus & Linear Algebra', 'Java OOP'],
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && step < 3) {
      setStep(step + 1);
    } else {
      onLoginSuccess(selectedRole as UserRole);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden relative font-sans animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Left Side Banner */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#12192b] via-[#1a233b] to-indigo-950 p-6 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-extrabold text-sm tracking-tight text-white">Learning Debt</span>
              </div>

              <h2 className="text-xl font-bold mb-2 text-white">
                {isSignUp ? 'Build Stronger Foundations' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Intelligent concept-level gap detection for students, educators, and institutions.
              </p>
            </div>

            <div className="space-y-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Hidden Gap Analysis Engine</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Prerequisite Chain Mapping</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Real-Time Learning Debt Score</span>
              </div>
            </div>
          </div>

          {/* Right Side Form Content */}
          <div className="md:col-span-3 p-6 md:p-8">
            {/* Header Tabs */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setStep(1); }}
                  className={`text-sm font-bold pb-2 transition ${!isSignUp ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setStep(1); }}
                  className={`text-sm font-bold pb-2 transition ${isSignUp ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Create Account
                </button>
              </div>

              {isSignUp && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                  Step {step} of 3
                </span>
              )}
            </div>

            {/* Role Selection */}
            {step === 1 && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Role / Interface
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${selectedRole === 'student' ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold shadow-xs' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                  >
                    <GraduationCap className="w-5 h-5 mb-1" />
                    <span className="text-xs">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('teacher')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${selectedRole === 'teacher' ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold shadow-xs' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                  >
                    <User className="w-5 h-5 mb-1" />
                    <span className="text-xs">Teacher</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${selectedRole === 'admin' ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold shadow-xs' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                  >
                    <ShieldCheck className="w-5 h-5 mb-1" />
                    <span className="text-xs">Admin</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email / Student or Employee ID</label>
                    <input
                      type="text"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="e.g. akash.sharma@edutech.edu"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {!isSignUp && (
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <span>Remember me</span>
                      </label>
                      <a href="#forgot" className="text-blue-600 hover:underline font-semibold">Forgot Password?</a>
                    </div>
                  )}
                </>
              )}

              {isSignUp && step === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Institution Name</label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Department / Class</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                    />
                  </div>
                </div>
              )}

              {isSignUp && step === 3 && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">Onboarding Wizard Configuration</span>
                    <p className="text-slate-500 text-[11px]">
                      {selectedRole === 'student'
                        ? '1. Select initial subjects -> 2. Set academic target level -> 3. Run foundation diagnostic.'
                        : selectedRole === 'teacher'
                        ? '1. Add class section -> 2. Assign subject curriculum -> 3. Sync student roster.'
                        : '1. Configure institution settings -> 2. Enable AI debt thresholds -> 3. Invite educators.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold pt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Diagnostic Engine Pre-configured</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition"
                >
                  <span>
                    {!isSignUp
                      ? `Sign In as ${selectedRole.toUpperCase()}`
                      : step < 3
                      ? 'Continue Onboarding'
                      : 'Complete Registration'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {!isSignUp && (
                <div className="pt-2 text-center">
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                    <div className="relative flex justify-center text-[10px] text-slate-400 uppercase bg-white px-2">or continue with</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { onLoginSuccess(selectedRole as UserRole); onClose(); }}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Google Workspace SSO</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
