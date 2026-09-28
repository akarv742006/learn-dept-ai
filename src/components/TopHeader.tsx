import React, { useState } from 'react';
import { Search, Bell, ChevronDown, UserCheck, GraduationCap, ShieldCheck, LogIn } from 'lucide-react';
import type { UserRole } from '../types/debt';

interface TopHeaderProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenAlerts: () => void;
  onOpenAuth: () => void;
  alertCount: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentRole,
  onChangeRole,
  onOpenAlerts,
  onOpenAuth,
  alertCount,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const getRoleLabel = () => {
    switch (currentRole) {
      case 'student':
        return { name: 'Akash Sharma', role: 'Student', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' };
      case 'teacher':
        return { name: 'Ms. Priya Sharma', role: 'Teacher', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' };
      case 'parent':
        return { name: 'Mr. Kumar', role: 'Parent', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' };
      case 'admin':
        return { name: 'Prof. Suresh Nair', role: 'Administrator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' };
      default:
        return { name: 'Public Guest', role: 'Guest', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' };
    }
  };

  const user = getRoleLabel();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      {/* Global Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search students, concepts, topics, reports..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
        />
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          title="Recent Alerts"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
            {alertCount || 3}
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-200 cursor-pointer hover:opacity-80 transition"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-300 shadow-xs"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {user.name}
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <span>{user.role}</span>
                <span className="text-emerald-600 font-bold">• Switch</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {showRoleDropdown && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 text-xs font-sans space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                Switch Role / View
              </div>

              <button
                onClick={() => { onChangeRole('student'); setShowRoleDropdown(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-semibold transition ${
                  currentRole === 'student' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Student (Akash Sharma)</span>
              </button>

              <button
                onClick={() => { onChangeRole('teacher'); setShowRoleDropdown(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-semibold transition ${
                  currentRole === 'teacher' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Teacher (Ms. Priya)</span>
              </button>

              <button
                onClick={() => { onChangeRole('admin'); setShowRoleDropdown(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-semibold transition ${
                  currentRole === 'admin' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Administrator</span>
              </button>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => { onOpenAuth(); setShowRoleDropdown(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-bold text-blue-600 hover:bg-blue-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Register Modal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
