import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  AlertTriangle,
  FileText,
  Compass,
  Settings,
  ShieldCheck,
  Brain,
  Layers,
  Sparkles,
  HeartHandshake,
  User,
  GraduationCap,
  LogOut,
  Bell,
  DollarSign,
  CreditCard,
  TrendingUp,
  Activity,
  Database
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { currentRole, logout } = useAuth();
  const navigate = useNavigate();

  const getMenuItems = () => {
    if (currentRole === 'student') {
      return [
        { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/student/concepts', label: 'Concept Map', icon: BarChart3 },
        { path: '/student/learning-debt', label: 'Learning Debt', icon: Layers },
        { path: '/student/learning-path', label: 'Learning Path', icon: Compass },
        { path: '/student/assessments', label: 'Random Quizzes', icon: AlertTriangle },
        { path: '/student/analytics', label: 'Live Analytics', icon: Activity },
        { path: '/student/ai-assistant', label: 'AI Study Assistant', icon: Sparkles },
        { path: '/pricing', label: 'Pricing & Upgrades', icon: CreditCard },
        { path: '/student/notifications', label: 'Notifications', icon: Bell },
        { path: '/student/profile', label: 'My Profile', icon: User },
        { path: '/student/settings', label: 'Settings', icon: Settings },
      ];
    } else if (currentRole === 'parent') {
      return [
        { path: '/parent/dashboard', label: 'Child Dashboard', icon: LayoutDashboard },
        { path: '/parent/progress', label: 'Child Progress', icon: BarChart3 },
        { path: '/parent/learning-debt', label: 'Learning Debt', icon: Layers },
        { path: '/parent/notifications', label: 'Notifications', icon: Bell },
        { path: '/parent/profile', label: 'Parent Profile', icon: User },
      ];
    } else if (currentRole === 'admin') {
      return [
        { path: '/admin/dashboard', label: 'Admin Dashboard', icon: ShieldCheck },
        { path: '/admin/subscription', label: 'Institution Subscription', icon: CreditCard },
        { path: '/admin/revenue', label: 'Revenue & MRR', icon: DollarSign },
        { path: '/admin/revenue/forecast', label: 'Forecast Simulator', icon: TrendingUp },
        { path: '/pricing', label: 'Public Pricing Page', icon: CreditCard },
        { path: '/admin/users', label: 'User Management', icon: Users },
        { path: '/admin/students', label: 'All Students', icon: GraduationCap },
        { path: '/admin/teachers', label: 'All Teachers', icon: User },
        { path: '/admin/classes', label: 'Classes & Sections', icon: Layers },
        { path: '/admin/subjects', label: 'Subject Curriculums', icon: BarChart3 },
        { path: '/admin/assessments', label: 'Assessments', icon: AlertTriangle },
        { path: '/admin/reports', label: 'Institutional Reports', icon: FileText },
        { path: '/admin/settings', label: 'System Settings', icon: Settings },
        { path: '/admin/database-status', label: 'DB & Login Inspector', icon: Database },
        { path: '/admin/ai-test', label: 'AI Diagnostic Test', icon: Sparkles },
      ];
    } else {
      // Teacher (default)
      return [
        { path: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/teacher/students', label: 'Student Cohort', icon: Users },
        { path: '/teacher/concepts', label: 'Concept Graph', icon: BarChart3 },
        { path: '/teacher/learning-gaps', label: 'AI Gap Detection', icon: Brain },
        { path: '/teacher/interventions', label: 'Intervention Center', icon: AlertTriangle },
        { path: '/teacher/assessments', label: 'Assessments', icon: AlertTriangle },
        { path: '/teacher/learning-paths', label: 'Remediation Paths', icon: Compass },
        { path: '/teacher/reports', label: 'Reports', icon: FileText },
        { path: '/teacher/analytics', label: 'Learning Analytics', icon: BarChart3 },
        { path: '/pricing', label: 'SaaS Plans & Pricing', icon: CreditCard },
        { path: '/teacher/notifications', label: 'Notifications', icon: Bell },
        { path: '/teacher/settings', label: 'Settings', icon: Settings },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-[#12192b] text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800/60 font-sans">
      <div>
        {/* Brand Header */}
        <div
          onClick={() => navigate('/')}
          className="p-5 border-b border-slate-800/80 cursor-pointer hover:bg-slate-900/60 transition bg-slate-950/40"
        >
          <Logo size="md" variant="light" />
        </div>

        {/* Active Role Indicator */}
        <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-extrabold uppercase text-blue-400 text-[10px] tracking-wider">
            {currentRole === 'student' && <GraduationCap className="w-3.5 h-3.5" />}
            {currentRole === 'teacher' && <User className="w-3.5 h-3.5" />}
            {currentRole === 'parent' && <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />}
            {currentRole === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
            <span>{currentRole} Portal</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-[10px] font-bold text-slate-400 hover:text-white underline"
          >
            Switch
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer & Logout */}
      <div className="p-4 border-t border-slate-800/60 space-y-3">
        <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-center relative overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-1">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-tight">
            Early detection builds stronger foundations.
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
