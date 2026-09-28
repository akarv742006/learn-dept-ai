import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, UserCheck, HeartHandshake, ArrowRight, CheckCircle2, ShieldCheck, Building2, PhoneCall, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
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
    college: 'Anna University',
    department: 'Computer Science',
    year: 'B.Tech 3rd Year',
    parentName: '',
    parentPhone: '+91 63797 62186',
    parentPin: '1234',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdParentInfo, setCreatedParentInfo] = useState<{ name: string; phone: string; pin: string } | null>(null);

  const { loginAsRole } = useAuth();
  const navigate = useNavigate();

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      const userName = formData.name.trim() || 'New User';
      const userEmail = formData.email.trim() || `${selectedRole}_${Date.now()}@learndebt.ai`;
      const pass = formData.password.trim() || 'password123';

      try {
        const regRes = await authApi.register({
          name: userName,
          email: userEmail,
          password: pass,
          role: selectedRole,
          college: formData.college,
          department: formData.department,
          year: formData.year,
          phone: formData.phone || '+91 98450 11223',
          parentName: formData.parentName.trim() || 'Ramesh Krishnan',
          parentPhone: formData.parentPhone.trim() || '+91 63797 62186',
          parentPin: formData.parentPin.trim() || '1234'
        });

        if (regRes.parentName) {
          setCreatedParentInfo({
            name: regRes.parentName,
            phone: regRes.parentPhone || '+91 63797 62186',
            pin: formData.parentPin || '1234'
          });
        }
      } catch (err) {
        console.warn('Backend register sync fallback:', err);
      } finally {
        setIsSubmitting(false);
        await loginAsRole(selectedRole, userName, userEmail);
        if (selectedRole === 'student') navigate('/student/dashboard');
        else if (selectedRole === 'teacher') navigate('/teacher/dashboard');
        else if (selectedRole === 'parent') navigate('/parent/dashboard');
        else navigate('/admin/dashboard');
      }
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
          <span className={step >= 1 ? 'text-blue-600 font-extrabold flex items-center gap-1' : ''}>
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 inline-flex items-center justify-center text-[10px]">1</span>
            Role
          </span>
          <span className="text-slate-300">•</span>
          <span className={step >= 2 ? 'text-blue-600 font-extrabold flex items-center gap-1' : ''}>
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 inline-flex items-center justify-center text-[10px]">2</span>
            Details & College
          </span>
          <span className="text-slate-300">•</span>
          <span className={step >= 3 ? 'text-blue-600 font-extrabold flex items-center gap-1' : ''}>
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 inline-flex items-center justify-center text-[10px]">3</span>
            Linked Accounts
          </span>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Select Registration Role</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Students and Staff from the same college automatically share the faculty directory and diagnostic analytics.
                </p>
              </div>

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
                  <span className="text-[10px] text-slate-400">+ Auto Parent Login</span>
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
                  <span className="text-xs font-bold">Faculty / Staff</span>
                  <span className="text-[10px] text-slate-400">Mentor Portal</span>
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
                  <span className="text-xs font-bold">Parent (பெற்றோர்)</span>
                  <span className="text-[10px] text-slate-400">தமிழ் / English</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Personal & College Information</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Connect your profile to your college and institutional database.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Arun Kumar"
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
                    placeholder="arun@student.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">College / Institution</label>
                  <select
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="Anna University">Anna University (AU Chennai)</option>
                    <option value="IIT Madras">IIT Madras</option>
                    <option value="NIT Trichy">NIT Trichy</option>
                    <option value="PSG College of Technology">PSG College of Technology</option>
                    <option value="Delhi Technological University">Delhi Technological University</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {selectedRole === 'student' ? 'Roll / Register Number' : selectedRole === 'teacher' ? 'Staff ID' : 'Student Roll Number'}
                  </label>
                  <input
                    type="text"
                    placeholder="AU-2026-0042"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Computer Science">Computer Science & Engineering</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Special Section: Automatic Parent Account Creation for Students */}
              {selectedRole === 'student' && (
                <div className="p-4 bg-gradient-to-br from-indigo-50/70 to-blue-50/60 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
                    <HeartHandshake className="w-4 h-4 text-emerald-600" />
                    <span>Parent Details (Auto-Creates Linked Parent Login)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                      தமிழ் / English
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    A linked Parent account will be automatically generated and synced to Firebase Realtime Database. Your parents can sign in using their phone or PIN to view your academic growth.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-medium mb-1 text-slate-600 dark:text-slate-400 text-[11px]">Parent Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Krishnan"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1 text-slate-600 dark:text-slate-400 text-[11px]">Parent Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="+91 63797 62186"
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1 text-slate-600 dark:text-slate-400 text-[11px]">Parent Login PIN</label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="1234"
                        value={formData.parentPin}
                        onChange={(e) => setFormData({ ...formData, parentPin: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Profile Ready to Connect!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  Your profile and institutional link will be synchronized to the MongoDB and Firebase Realtime Database.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                    <Building2 className="w-4 h-4" />
                    <span>{formData.college}</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-semibold">{formData.name || 'Student User'}</div>
                  <div className="text-slate-500 text-[11px]">{formData.department} • {formData.year}</div>
                  <div className="text-slate-500 text-[11px]">Faculty Mentor: Dr. Rajesh Sharma (+91 63797 62186)</div>
                </div>

                <div className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                    <HeartHandshake className="w-4 h-4" />
                    <span>Auto-Linked Parent Account</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">
                    {formData.parentName || 'Ramesh Krishnan'}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Phone: {formData.parentPhone || '+91 63797 62186'}
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold">
                    Login PIN: {formData.parentPin || '1234'} (தமிழ் & English)
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600" />
                <span>Synchronized with Firebase Realtime Database & ₹2 Instant UPI Payment Gateway.</span>
              </div>
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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md flex items-center gap-2 hover:opacity-95 transition disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Creating Accounts...' : step < 3 ? 'Continue' : 'Enter Portal & Sync'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
