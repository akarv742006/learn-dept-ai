import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Bell,
  User,
  Shield,
  Phone,
  Mail,
  BookOpen,
  ArrowRight,
  MessageSquare,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ParentProgress: React.FC = () => {
  const { user } = useAuth();
  const parentName = user?.name || 'Ramesh Krishnan';

  const subjects = [
    { name: 'Database Management Systems (DBMS)', code: 'CS301', score: 76, status: 'கவனம் தேவை (Needs Practice)', color: 'amber', icon: '💾', note: 'தர்க்க கணிதத்தில் 15 நிமிடம் பயிற்சி தேவை' },
    { name: 'Data Structures & Algorithms', code: 'CS302', score: 84, status: 'மிகவும் நன்று (Doing Great)', color: 'emerald', icon: '⚡', note: 'அரே மற்றும் மர வரைபடத்தில் மிகவும் சிறந்து விளங்குகிறார்' },
    { name: 'Computer Networks', code: 'CS303', score: 71, status: 'மிகவும் நன்று (Doing Great)', color: 'emerald', icon: '🌐', note: 'ஆய்வக சோதனைகளில் தொடர் வருகை' },
    { name: 'Mathematics & Logic', code: 'CS304', score: 62, status: 'ஆசிரியர் உதவி தேவை (Needs Help)', color: 'rose', icon: '📐', note: 'ஆசிரியர் இந்த வெள்ளிக்கிழமை சிறப்பு வகுப்பு வைத்துள்ளார்' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16 px-3 sm:px-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>பாடம் வாரியான அறிக்கை (Subject-wise Report Card)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Child Academic Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Student: <span className="font-bold text-white">Arun Kumar</span> (Roll No: <span className="font-mono text-emerald-300">CS2023-042</span>)
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-center">
          <span className="text-[10px] uppercase text-emerald-300 font-bold block">Overall Aggregate</span>
          <span className="text-2xl sm:text-3xl font-black text-white">78%</span>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((sub, idx) => (
          <div
            key={idx}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-xs">{sub.icon}</span>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    {sub.name}
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-400">{sub.code}</span>
                </div>
              </div>

              <span
                className={`text-xs font-black px-3 py-1.5 rounded-full ${
                  sub.color === 'emerald'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : sub.color === 'amber'
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                }`}
              >
                {sub.score}% • {sub.status}
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  sub.color === 'emerald' ? 'bg-emerald-500' : sub.color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${sub.score}%` }}
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>{sub.note}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Regular</span>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Dial Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-lg">கல்லூரி வருகைப்பதிவு: 92% (Present)</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              இந்த மாதம் 26 நாட்களில் 24 நாட்கள் வருகை தந்துள்ளார். வருகை மிக சிறப்பு!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black">
            ✓ 75% கட்டாய வருகைக்கு மேல் உள்ளது (Safe)
          </span>
        </div>
      </div>
    </div>
  );
};

export const ParentLearningDebt: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16 px-3 sm:px-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>கற்றல் இடைவெளி அறிக்கை (Learning Gap Diagnostics)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Child Learning Debt Index: 42 / 100
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
            எளிய விளக்கம்: முந்தைய ஆண்டுகளில் தவறவிட்ட அடிப்படை பாடங்கள், தற்போதைய புதிய பாடங்களை புரிந்துகொள்ள சிரமம் தருகின்றன. இந்த 2 தலைப்புகளை சரிசெய்தால் முழு தேர்ச்சி எளிதாகிவிடும்.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-center">
          <span className="text-[10px] uppercase text-amber-300 font-bold block">Current Gap Score</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-400">42 pts</span>
          <span className="text-[10px] text-emerald-400 block font-semibold">Reduced from 68 pts</span>
        </div>
      </div>

      {/* Progress Journey */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-black text-slate-900 dark:text-white text-lg">
          முன்னேற்றப் பயணம் (Debt Recovery Journey)
        </h3>
        <p className="text-xs text-slate-500">
          கடந்த 3 வாரங்களில் உங்கள் குழந்தை 2 முக்கிய பாட இடைவெளிகளை வெற்றிகரமாக சரிசெய்துள்ளார்.
        </p>

        <div className="space-y-3 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Topic 1: SQL Basic Queries</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">✓ வெற்றிகரமாக முடிக்கப்பட்டது (Solved)</p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-600">-16 pts Debt Reduced</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 animate-pulse" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Topic 2: Relational Functional Dependencies</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400">⏳ 15 நிமிடம் பயிற்சி தேவை (Pending practice)</p>
              </div>
            </div>
            <span className="text-xs font-black text-amber-600">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ParentNotifications: React.FC = () => {
  const notifications = [
    { id: 1, title: 'தேர்வு அறிக்கை புதுப்பிக்கப்பட்டது', time: 'இன்று மதியம்', message: 'அருண் தரவுத்தள (DBMS) பயிற்சி தேர்வை முடித்துள்ளார் (80% மதிப்பெண்).', type: 'success' },
    { id: 2, title: 'ஆசிரியர் சந்தேக விளக்கம் வகுப்பு', time: 'நாளை காலை 10:00 மணி', message: 'பேராசிரியர் ராஜேஷ் சர்மா கணிதத்திற்கான இணையவழி கூடுதல் வகுப்பு வைத்துள்ளார்.', type: 'info' },
    { id: 3, title: 'செமஸ்டர் தேர்வு கால அட்டவணை வெளியீடு', time: '2 நாட்களுக்கு முன்', message: 'டிசம்பர் பருவத் தேர்வுகளின் தேதி பட்டியல் கல்லூரி போர்ட்டலில் வெளியிடப்பட்டுள்ளது.', type: 'alert' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-16 px-3 sm:px-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1 font-bold text-xs uppercase tracking-wider">
          <Bell className="w-4 h-4" />
          <span>கல்லூரி அறிவிப்புகள் (Parent Notifications)</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Parent Announcements & Updates
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          முக்கிய அறிவிப்புகள் மற்றும் குழந்தையின் கல்வி செயல்பாடுகள்.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{n.title}</h4>
                <span className="text-[10px] font-semibold text-slate-400">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ParentProfile: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-16 px-3 sm:px-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1 font-bold text-xs uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>பெற்றோர் சுயவிவரம் (Parent Account Profile)</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Parent Account Information
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          தங்களின் கணக்கு மற்றும் குழந்தையின் கல்லூரி விவரங்கள்.
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Parent Name / பெற்றோர் பெயர்</span>
            <span className="font-black text-slate-900 dark:text-white text-base">{user?.name || 'Ramesh Krishnan'}</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Registered Mobile / பதிவு செய்யப்பட்ட எண்</span>
            <span className="font-black text-slate-900 dark:text-white text-base">+91 98450 12345</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Linked Child / இணைக்கப்பட்ட மாணவர்</span>
            <span className="font-black text-slate-900 dark:text-white text-base">Arun Kumar (CS2023-042)</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Department & Year / துறை & ஆண்டு</span>
            <span className="font-black text-slate-900 dark:text-white text-base">Computer Science • 3rd Year</span>
          </div>
        </div>
      </div>
    </div>
  );
};
