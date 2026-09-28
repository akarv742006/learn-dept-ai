import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, ChevronDown, GraduationCap, UserCheck, ShieldCheck, HeartHandshake, LogOut, Globe, Sparkles, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { UserRole } from '../types/debt';
import { useNavigate } from 'react-router-dom';
import { HackathonDemoModal } from './HackathonDemoModal';

export const TopNavbar: React.FC = () => {
  const { user, currentRole, loginAsRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    loginAsRole(role);
    setShowRoleDropdown(false);
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'teacher') navigate('/teacher/dashboard');
    else if (role === 'parent') navigate('/parent/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <>
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs font-sans">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search students, concepts, topics, reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Hackathon Demo Flow Trigger Button */}
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-105 transition"
            title="Run 6-Step Learning Debt Demo"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span className="hidden sm:inline">Learning Debt Demo</span>
          </button>

          {/* Revenue Model Demo Button */}
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 hover:scale-105 transition"
            title="Open Revenue Model & Pricing Demo"
          >
            <DollarSign className="w-3.5 h-3.5 stroke-[3] text-slate-950" />
            <span className="hidden md:inline">Revenue Model Demo</span>
          </button>

          {/* Landing Page Quick Link */}
          <button
            onClick={() => navigate('/')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>Landing Page</span>
          </button>

          {/* Theme Mode Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-slate-600" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => {
              if (currentRole === 'student') navigate('/student/notifications');
              else if (currentRole === 'teacher') navigate('/teacher/notifications');
              else if (currentRole === 'parent') navigate('/parent/notifications');
            }}
            className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
              3
            </span>
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800 cursor-pointer hover:opacity-80 transition"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User Profile'}
                className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700 shadow-xs"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user?.name || 'Akash Sharma'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <span className="uppercase font-bold text-blue-600 dark:text-blue-400">{currentRole}</span>
                  <span>• Switch Role</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {showRoleDropdown && (
              <div className="absolute right-0 top-12 w-60 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 text-xs font-sans space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                  Select Active Interface
                </div>

                <button
                  onClick={() => handleRoleSelect('student')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left font-semibold transition ${
                    currentRole === 'student' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Student (Akash Sharma)</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('teacher')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left font-semibold transition ${
                    currentRole === 'teacher' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Teacher (Ms. Priya Sharma)</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('parent')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left font-semibold transition ${
                    currentRole === 'parent' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>Parent (Mr. Kumar)</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('admin')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left font-semibold transition ${
                    currentRole === 'admin' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Administrator</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleDropdown(false);
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout / Switch User</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <HackathonDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onNavigateToPath={() => navigate('/student/learning-path')}
      />
    </>
  );
};
