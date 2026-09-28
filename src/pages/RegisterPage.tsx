import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, UserCheck, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/debt';

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    institution: 'Delhi Technological University',
    department: 'Computer Science',
    year: 'B.Tech 3rd Year',
  });

  const { loginAsRole } = useAuth();
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      const userName = formData.name.trim() || 'New User';
      const userEmail = formData.email.trim() || `${selectedRole}@learndebt.ai`;
      loginAsRole(selectedRole, userName, userEmail);
      if (selectedRole === 'student') navigate('/student/dashboard');
      else if (selectedRole === 'teacher') navigate('/teacher/dashboard');
      else if (selectedRole === 'parent') navigate('/parent/dashboard');
      else navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-w-2xl w-full p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <Logo size="md" />
          <Link to="/login" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Already have an account? Sign In
          </Link>
        </div>

        {/* Progress Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className={step >= 1 ? 'text-blue-600 font-extrabold' : ''}>1. Role</span>
          <span className="text-slate-300">•</span>
          <span className={step >= 2 ? 'text-blue-600 font-extrabold' : ''}>2. Details</span>
          <span className="text-slate-300">•</span>
          <span className={step >= 3 ? 'text-blue-600 font-extrabold' : ''}>3. Complete Profile</span>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Select Registration Role</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                    selectedRole === 'student'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <span className="text-xs font-bold">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('teacher')}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                    selectedRole === 'teacher'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <UserCheck className="w-6 h-6 text-indigo-600" />
                  <span className="text-xs font-bold">Teacher</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('parent')}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                    selectedRole === 'parent'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <HeartHandshake className="w-6 h-6 text-emerald-600" />
                  <span className="text-xs font-bold">Parent</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Personal & Academic Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Akash Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    placeholder="akash@learndebt.ai"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Institution</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {selectedRole === 'student' ? 'Student ID' : selectedRole === 'teacher' ? 'Employee ID' : 'Child Student ID'}
                  </label>
                  <input
                    type="text"
                    placeholder="STU1024"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Profile Configured!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Your AI Learning Debt Diagnostic Profile is pre-configured and ready for concept gap analysis.
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Back
              </button>
            ) : <div></div>}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <span>{step < 3 ? 'Continue' : 'Enter Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
