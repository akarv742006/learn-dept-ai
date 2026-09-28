import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  UserCheck,
  HeartHandshake,
  ShieldCheck,
  QrCode,
  KeyRound,
  Mail,
  Building,
  Calendar,
  Sparkles,
  Camera,
  Check,
  Layers,
  AlertCircle,
  Phone,
  Languages
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import type { UserRole } from '../types/debt';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  department: string;
  semester: string;
  debtScore: number;
  gapStatus: 'Critical Gaps' | 'Moderate Debt' | 'Near Mastery';
  avatarBg: string;
}

const SAMPLE_STUDENTS: StudentProfile[] = [
  {
    id: 'student_arun',
    name: 'Arun Sharma',
    email: 'arun.sharma@learndebt.ai',
    rollNo: '21CS104',
    department: 'Computer Science',
    semester: 'Semester 6',
    debtScore: 32,
    gapStatus: 'Moderate Debt',
    avatarBg: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'student_priya',
    name: 'Priya Patel',
    email: 'priya.patel@learndebt.ai',
    rollNo: '22EC058',
    department: 'Electronics & Comm',
    semester: 'Semester 4',
    debtScore: 58,
    gapStatus: 'Critical Gaps',
    avatarBg: 'from-rose-600 to-amber-600',
  },
  {
    id: 'student_rahul',
    name: 'Rahul Verma',
    email: 'rahul.verma@learndebt.ai',
    rollNo: '21IT092',
    department: 'Information Tech',
    semester: 'Semester 6',
    debtScore: 18,
    gapStatus: 'Near Mastery',
    avatarBg: 'from-emerald-600 to-teal-600',
  },
];

interface ParentPersona {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  pin: string;
  childName: string;
  childRollNo: string;
  childDept: string;
  childDebt: number;
  avatarBg: string;
}

const SAMPLE_PARENTS: ParentPersona[] = [
  {
    id: 'parent_ramesh',
    name: 'Ramesh Krishnan',
    relationship: 'தந்தை / Father',
    email: 'ramesh.krishnan@parent.org',
    phone: '+91 98450 12345',
    pin: '1234',
    childName: 'Arun Kumar',
    childRollNo: 'CS2023-042',
    childDept: 'B.Tech CSE - 3rd Year',
    childDebt: 68,
    avatarBg: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'parent_sunita',
    name: 'Meenakshi Sundaram',
    relationship: 'தாய் / Mother',
    email: 'meenakshi.s@parent.org',
    phone: '+91 97123 45678',
    pin: '1234',
    childName: 'Priya Patel',
    childRollNo: 'AI2023-018',
    childDept: 'B.Tech AI&DS - 2nd Year',
    childDebt: 34,
    avatarBg: 'from-amber-600 to-rose-600',
  },
  {
    id: 'parent_rajesh_v',
    name: 'Karthik Raja',
    relationship: 'தந்தை / Father',
    email: 'karthik.raja@parent.org',
    phone: '+91 98234 56789',
    pin: '1234',
    childName: 'Rahul Verma',
    childRollNo: 'IT2023-055',
    childDept: 'B.Tech IT - 4th Year',
    childDebt: 14,
    avatarBg: 'from-blue-600 to-indigo-600',
  },
];

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('arun.sharma@learndebt.ai');
  const [rollNumber, setRollNumber] = useState('21CS104');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [studentLoginTab, setStudentLoginTab] = useState<'email' | 'roll' | 'otp' | 'qr'>('email');
  const [parentLoginTab, setParentLoginTab] = useState<'child_roll' | 'pin'>('child_roll');
  const [parentLang, setParentLang] = useState<'ta' | 'en'>('ta');
  const [parentPhone, setParentPhone] = useState('+91 98450 12345');
  const [parentPin, setParentPin] = useState('1234');
  const [parentChildRoll, setParentChildRoll] = useState('CS2023-042');
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState('Semester 6');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isScanningQr, setIsScanningQr] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);

  const { loginAsRole } = useAuth();
  const navigate = useNavigate();

  const handleSelectStudentProfile = (s: StudentProfile) => {
    setEmail(s.email);
    setRollNumber(s.rollNo);
    setDepartment(s.department);
    setSemester(s.semester);
    setSelectedRole('student');
  };

  const handleSelectParentProfile = (p: ParentPersona) => {
    setEmail(p.email);
    setParentPhone(p.phone);
    setParentChildRoll(p.childRollNo);
    setParentPin(p.pin);
    setSelectedRole('parent');
    loginAsRole('parent', p.name, p.email);
    navigate('/parent/dashboard');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'parent') {
      const parentName = email.includes('sunita')
        ? 'Sunita Patel'
        : email.includes('rajesh')
        ? 'Rajesh Verma'
        : 'Ramesh Sharma';
      loginAsRole('parent', parentName, email);
      navigate('/parent/dashboard');
      return;
    }

    const emailPrefix = email.split('@')[0] || 'User';
    const formattedName = emailPrefix
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    loginAsRole(selectedRole, formattedName, email);
    if (selectedRole === 'student') navigate('/student/dashboard');
    else if (selectedRole === 'teacher') navigate('/teacher/dashboard');
    else if (selectedRole === 'admin') navigate('/admin/dashboard');
  };

  const handleDemoLogin = (role: UserRole) => {
    loginAsRole(role);
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'teacher') navigate('/teacher/dashboard');
    else if (role === 'parent') navigate('/parent/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const handleSimulateQrScan = () => {
    setIsScanningQr(true);
    setTimeout(() => {
      setIsScanningQr(false);
      setQrScanned(true);
      setTimeout(() => {
        loginAsRole('student', 'Arun Sharma', 'arun.sharma@learndebt.ai');
        navigate('/student/dashboard');
      }, 1000);
    }, 1500);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpCode('123456');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-w-5xl w-full grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Branding Side */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -ml-28 -mb-28" />

          <div className="relative z-10 space-y-6">
            <Logo size="lg" />

            <div className="space-y-3 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Adaptive Educational AI Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Detect Gaps. <br />
                Bridge Prereqs. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  Empower Families.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Personalized concept diagnostics for students, intuitive visual progress meters for parents, and actionable DAG intervention workflows for teachers.
              </p>
            </div>
          </div>

          {/* Academic Term Notice */}
          <div className="relative z-10 pt-8 border-t border-white/10 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" />
                Current Term
              </span>
              <span className="font-bold text-white">Fall 2026 Diagnostic Window</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-400" />
                Institution
              </span>
              <span className="font-bold text-white">Central Academic Consortium</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Database Engine
              </span>
              <span className="font-mono text-emerald-300 text-[11px] font-bold">MongoDB Atlas & Firebase Synced</span>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Portal Sign In</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select your academic role to enter LearnDebt AI.
              </p>
            </div>

            <Link to="/" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Landing Page
            </Link>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
            {(
              [
                { role: 'student', label: 'Student', icon: GraduationCap },
                { role: 'teacher', label: 'Teacher', icon: UserCheck },
                { role: 'parent', label: 'Parent', icon: HeartHandshake },
                { role: 'admin', label: 'Admin', icon: ShieldCheck },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const isActive = selectedRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setSelectedRole(item.role)}
                  className={`py-2 px-1 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* ============================================================== */}
          {/* STUDENT SPECIFIC FEATURES */}
          {/* ============================================================== */}
          {selectedRole === 'student' && (
            <div className="space-y-4">
              {/* Quick Student Profile Cards */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>Quick Select Student Profile (1-Click Fill)</span>
                  </label>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">3 Personas</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SAMPLE_STUDENTS.map((std) => (
                    <button
                      key={std.id}
                      type="button"
                      onClick={() => handleSelectStudentProfile(std)}
                      className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                        email === std.email
                          ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-tr ${std.avatarBg} text-white text-[10px] font-bold flex items-center justify-center`}
                        >
                          {std.name.charAt(0)}
                        </div>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                            std.gapStatus === 'Critical Gaps'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                              : std.gapStatus === 'Moderate Debt'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {std.debtScore}% Debt
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-100 block truncate">
                          {std.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{std.rollNo}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Login Sub-Tabs */}
              <div className="flex items-center gap-4 text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setStudentLoginTab('email')}
                  className={`pb-1 font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    studentLoginTab === 'email'
                      ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>College Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentLoginTab('roll')}
                  className={`pb-1 font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    studentLoginTab === 'roll'
                      ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Roll Number ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentLoginTab('otp')}
                  className={`pb-1 font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    studentLoginTab === 'otp'
                      ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Mobile OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentLoginTab('qr')}
                  className={`pb-1 font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    studentLoginTab === 'qr'
                      ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>ID Card QR</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PARENT SPECIFIC ACCESSIBLE FEATURES */}
          {/* ============================================================== */}
          {selectedRole === 'parent' && (
            <div className="space-y-4">
              
              {/* Language Selection Header for Parents - ONLY TAMIL AND ENGLISH */}
              <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    {parentLang === 'ta' ? 'மொழி / Language:' : 'Language / மொழி:'}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  {[
                    { code: 'ta', label: 'தமிழ் (Tamil)' },
                    { code: 'en', label: 'English' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setParentLang(l.code as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                        parentLang === l.code
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Select Parent Persona (1-Click Fill & Instant Login) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {parentLang === 'ta'
                        ? 'பெற்றோர் சுயவிவரங்கள் (1-கிளிக் உடனடி உள்நுழைவு)'
                        : 'Quick Select Parent Profile (1-Click Login)'}
                    </span>
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">3 Parents</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SAMPLE_PARENTS.map((prn) => (
                    <button
                      key={prn.id}
                      type="button"
                      onClick={() => handleSelectParentProfile(prn)}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 text-left transition cursor-pointer flex flex-col justify-between gap-1 shadow-xs hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {prn.name}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          {prn.relationship}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {parentLang === 'ta' ? 'மாணவர்' : 'Child'}: <span className="font-bold text-slate-800 dark:text-slate-200">{prn.childName}</span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        Roll: {prn.childRollNo}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Parent Login Sub-Tabs */}
              <div className="flex items-center gap-4 text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setParentLoginTab('child_roll')}
                  className={`pb-1 font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    parentLoginTab === 'child_roll'
                      ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    {parentLang === 'ta' ? 'மாணவர் பதிவு எண் + தொலைபேசி' : "Child's Roll No + Mobile"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setParentLoginTab('pin')}
                  className={`pb-1 font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    parentLoginTab === 'pin'
                      ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>
                    {parentLang === 'ta' ? '4-இலக்க எளிதான பின்' : '4-Digit Simple PIN'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* MAIN LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* PARENT SPECIFIC INPUTS */}
            {selectedRole === 'parent' && parentLoginTab === 'child_roll' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {parentLang === 'ta' ? 'மாணவரின் கல்லூரி பதிவு எண் (Roll Number)' : "Student's Campus Roll Number"}
                  </label>
                  <input
                    type="text"
                    value={parentChildRoll}
                    onChange={(e) => setParentChildRoll(e.target.value)}
                    placeholder="e.g. CS2023-042"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {parentLang === 'ta' ? 'பதிவு செய்யப்பட்ட பெற்றோர் மொபைல் எண்' : 'Registered Parent Mobile Phone'}
                  </label>
                  <input
                    type="text"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
              </div>
            )}

            {selectedRole === 'parent' && parentLoginTab === 'pin' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {parentLang === 'ta' ? 'மொபைல் எண் அல்லது மின்னஞ்சல்' : 'Parent Mobile or Email'}
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh.krishnan@parent.org or mobile"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {parentLang === 'ta' ? '4-இலக்க பாதுகாப்பு பின் (PIN - 1234)' : '4-Digit Security PIN (Default: 1234)'}
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={parentPin}
                    onChange={(e) => setParentPin(e.target.value)}
                    placeholder="1234"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono tracking-widest text-lg font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            )}

            {/* Student Roll ID Mode Fields */}
            {selectedRole === 'student' && studentLoginTab === 'roll' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Roll Number / Campus ID
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 21CS104"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="Computer Science">Computer Science & Eng</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Information Tech">Information Technology</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="Semester 2">Semester 2 (Year 1)</option>
                    <option value="Semester 4">Semester 4 (Year 2)</option>
                    <option value="Semester 6">Semester 6 (Year 3)</option>
                    <option value="Semester 8">Semester 8 (Year 4)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Email Mode Fields (Standard or Student, non-parent) */}
            {selectedRole !== 'parent' && (selectedRole !== 'student' || studentLoginTab === 'email') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {selectedRole === 'student' ? 'College Registered Email' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            )}

            {/* Student OTP Mode Fields */}
            {selectedRole === 'student' && studentLoginTab === 'otp' && (
              <div className="space-y-3 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Registered Mobile Verification</span>
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition cursor-pointer"
                    >
                      Send OTP (Demo: 123456)
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> OTP Sent to +91 98*** **412
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP (e.g. 123456)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono tracking-widest text-center font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Student QR Card Scan Mode */}
            {selectedRole === 'student' && studentLoginTab === 'qr' && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Camera className={`w-8 h-8 ${isScanningQr ? 'animate-pulse text-indigo-500' : ''}`} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {isScanningQr ? 'Scanning Student ID Barcode...' : qrScanned ? 'ID Verified! Redirecting...' : 'Scan College Student ID Card'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hold your physical ID card barcode or digital QR up to your device camera.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSimulateQrScan}
                  disabled={isScanningQr}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                >
                  {isScanningQr ? 'Verifying Barcode...' : 'Simulate ID Card Scan'}
                </button>
              </div>
            )}

            {/* Standard Password input (hidden on student OTP/QR or parent role) */}
            {selectedRole !== 'parent' && (selectedRole !== 'student' || (studentLoginTab !== 'otp' && studentLoginTab !== 'qr')) && (
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
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                <span>Remember this workstation</span>
              </label>
              <a href="#forgot" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                Need Help?
              </a>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition hover:scale-[1.01] cursor-pointer ${
                selectedRole === 'parent'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-600/25'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-blue-600/25'
              }`}
            >
              <span>
                {selectedRole === 'parent'
                  ? (parentLang === 'ta' ? 'பெற்றோர் போர்ட்டலில் நுழையவும் (Enter Parent Portal)' : 'Enter Parent Portal')
                  : `Login to ${selectedRole.toUpperCase()} Dashboard`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Role Demobuttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Instant Demo:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-bold text-[11px] hover:bg-blue-100 transition"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('teacher')}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold text-[11px] hover:bg-indigo-100 transition"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('parent')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100 transition"
              >
                Parent
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 font-bold text-[11px] hover:bg-purple-100 transition"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            Don't have an institutional account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Register Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
