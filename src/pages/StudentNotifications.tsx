import React from 'react';
import { Bell } from 'lucide-react';
import { notificationService } from '../services/notificationService';

export const StudentNotifications: React.FC = () => {
  const list = notificationService.getNotificationsByRole('student');

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase">Notification Center</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Recent Alerts & Recommendations</h1>
        </div>
      </div>

      <div className="space-y-3">
        {list.map((n) => (
          <div
            key={n.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">{n.type} Alert • {n.timestamp}</span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{n.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { useAuth } from '../context/AuthContext';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-4">
        <img
          src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
          alt={user?.name || "Student Profile"}
          className="w-24 h-24 rounded-full mx-auto border-4 border-blue-500 shadow-md object-cover"
        />
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name || "Akash Sharma"}</h1>
          <p className="text-xs text-slate-500">Student ID: STU1024 • {user?.department || "B.Tech CSE 3rd Year"}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <span className="text-xs font-bold text-amber-600 block">12 Day Streak</span>
            <span className="text-[10px] text-slate-400">Daily Active Learner</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <span className="text-xs font-bold text-blue-600 block">68 Mastered</span>
            <span className="text-[10px] text-slate-400">Out of 82 Concepts</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <span className="text-xs font-bold text-emerald-600 block">10 Quizzes</span>
            <span className="text-[10px] text-slate-400">Assessments Done</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudentSettings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Account & Privacy Settings</h2>
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
            <span>Two-Factor Authentication</span>
            <span className="font-bold text-emerald-600">Enabled</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
            <span>AI Diagnostic Engine Threshold</span>
            <span className="font-bold text-blue-600">Standard (&gt;30% Gap)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
