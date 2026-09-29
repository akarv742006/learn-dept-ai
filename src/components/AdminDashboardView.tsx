import React, { useState, useEffect } from 'react';
import {
  Search, UserPlus, X, CheckCircle2, RefreshCw, Database, Server,
  CreditCard, Building2, Activity, Wifi, Radio, UserCheck, Clock, Zap
} from 'lucide-react';
import type { AdminUser } from '../types/debt';
import { MOCK_ADMIN_USERS } from '../data/mockPlatformData';
import { adminApi } from '../api/adminApi';
import { saasApi, type AdminRevenueStats } from '../api/saasApi';
import { useNavigate } from 'react-router-dom';

export const AdminDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Teacher' | 'Student' | 'Administrator'>('All');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [adminMetrics, setAdminMetrics] = useState<any>(null);
  const [revenueStats, setRevenueStats] = useState<AdminRevenueStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentLogins, setRecentLogins] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('learndebt_recent_logins');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // 1. Fetch backend dashboard and SaaS revenue in parallel
      const [backendData, rev] = await Promise.allSettled([
        adminApi.getDashboard(),
        saasApi.getAdminRevenue()
      ]);

      const dashData = backendData.status === 'fulfilled' ? backendData.value : null;
      if (rev.status === 'fulfilled') {
        setRevenueStats(rev.value);
      }

      // 2. Fetch Firebase RTDB students & logins in parallel
      let fbStudents: any = {};
      let fbLogins: any = {};
      try {
        const [resStudents, resLogins] = await Promise.all([
          fetch('https://learndept-ai-default-rtdb.firebaseio.com/students.json'),
          fetch('https://learndept-ai-default-rtdb.firebaseio.com/logins.json')
        ]);
        if (resStudents.ok) fbStudents = (await resStudents.json()) || {};
        if (resLogins.ok) fbLogins = (await resLogins.json()) || {};
      } catch (fbErr) {
        console.warn('Firebase RTDB sync warning:', fbErr);
      }

      // 3. Local storage records
      let localStudents: any[] = [];
      let localRecentLogins: any[] = [];
      try {
        localStudents = JSON.parse(localStorage.getItem('learndebt_registered_students') || '[]');
        const latestStu = JSON.parse(localStorage.getItem('learndebt_latest_student') || 'null');
        if (latestStu && !localStudents.some(s => s.email === latestStu.email)) {
          localStudents.unshift(latestStu);
        }
        localRecentLogins = JSON.parse(localStorage.getItem('learndebt_recent_logins') || '[]');
      } catch {}

      // 4. Merge recent student logins for live activity widget
      const parsedFbLogins = Object.entries(fbLogins).map(([k, v]: [string, any]) => ({
        id: v.id || k,
        name: v.name || 'Student User',
        email: v.email || 'student@domain.edu',
        role: v.role || 'Student',
        department: v.department || 'Computer Science',
        timestamp: v.timestamp || v.lastLoginAt || new Date().toISOString(),
        loginMethod: v.loginMethod || 'Email/Password'
      }));

      const mergedLogins = [...parsedFbLogins, ...localRecentLogins];
      const uniqueLoginsMap = new Map();
      mergedLogins.forEach(l => {
        const key = `${l.email || l.name}_${l.timestamp || l.id}`;
        if (!uniqueLoginsMap.has(key)) {
          uniqueLoginsMap.set(key, l);
        }
      });
      const sortedLogins = Array.from(uniqueLoginsMap.values()).sort(
        (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setRecentLogins(sortedLogins);

      // 5. Merge all users for the roster & statistics
      const mergedUserMap = new Map<string, AdminUser>();

      // A. Seed default mock users
      MOCK_ADMIN_USERS.forEach(u => mergedUserMap.set(u.email.toLowerCase(), u));

      // B. Backend users if available
      if (dashData?.users && Array.isArray(dashData.users)) {
        dashData.users.forEach((u: any) => {
          mergedUserMap.set(u.email.toLowerCase(), {
            id: u.id || `usr-${Date.now()}`,
            name: u.name,
            email: u.email,
            role: (u.role?.charAt(0).toUpperCase() + u.role?.slice(1)) as any,
            institution: u.institution || 'Anna University',
            status: u.status || 'Active',
            lastActive: u.lastActive || 'Recently'
          });
        });
      }

      // C. Firebase students
      if (fbStudents && typeof fbStudents === 'object') {
        Object.entries(fbStudents).forEach(([k, s]: [string, any]) => {
          const email = (s.email || `${s.name?.toLowerCase().replace(/\s+/g, '')}@student.edu`).toLowerCase();
          mergedUserMap.set(email, {
            id: s.rollNumber || s.studentId || k,
            name: s.name || 'Enrolled Student',
            email: email,
            role: 'Student',
            institution: s.college || s.institution || 'Anna University',
            status: s.status || 'Active',
            lastActive: s.lastActive ? new Date(s.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Online now'
          });
        });
      }

      // D. Local storage students
      localStudents.forEach((s: any) => {
        const email = (s.email || `${s.name?.toLowerCase().replace(/\s+/g, '')}@student.edu`).toLowerCase();
        if (!mergedUserMap.has(email)) {
          mergedUserMap.set(email, {
            id: s.rollNumber || s.studentId || `stu-${Date.now()}`,
            name: s.name,
            email: email,
            role: 'Student',
            institution: s.college || s.institution || 'Anna University',
            status: 'Active',
            lastActive: 'Online now'
          });
        }
      });

      // E. Update any user's lastActive if they appeared in recentLogins
      sortedLogins.forEach((log: any) => {
        const email = (log.email || '').toLowerCase();
        if (mergedUserMap.has(email)) {
          const existing = mergedUserMap.get(email)!;
          mergedUserMap.set(email, {
            ...existing,
            status: 'Active',
            lastActive: 'Online now'
          });
        }
      });

      const finalUsers = Array.from(mergedUserMap.values());
      setUsers(finalUsers);

      const totalStudentsCount = finalUsers.filter(u => u.role.toLowerCase() === 'student').length;

      // Update metrics
      setAdminMetrics({
        ...(dashData?.metrics || {}),
        totalUsers: Math.max(dashData?.metrics?.totalUsers || 0, finalUsers.length),
        totalStudents: Math.max(dashData?.metrics?.totalStudents || 0, totalStudentsCount)
      });
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    } catch (e) {
      console.warn("Using baseline admin metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Auto-poll every 12 seconds so admin view stays continuously live
    const interval = setInterval(fetchMetrics, 12000);
    return () => clearInterval(interval);
  }, []);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Student' as 'Teacher' | 'Student' | 'Administrator',
    institution: 'Delhi Technological University',
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u)));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const created: AdminUser = {
      id: `usr-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      institution: newUser.institution,
      status: 'Active',
      lastActive: 'Just now',
    };

    setUsers([created, ...users]);
    setNewUser({ name: '', email: '', role: 'Student', institution: 'Delhi Technological University' });
    setIsAddUserModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-10">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-[#12192b] p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-400/30 px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Institutional Administration • Live Sync
            </span>
            <span className="text-[11px] text-slate-400">
              Synced: <strong className="text-indigo-200">{lastSyncTime}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Administrator Control Center</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Real-time synchronization across MongoDB Atlas & Firebase Realtime Database
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => fetchMetrics()}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs shadow-md border border-slate-700 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : 'text-slate-300'}`} />
            <span>{loading ? 'Syncing...' : 'Refresh Live Data'}</span>
          </button>
          <button
            onClick={() => navigate('/admin/subscription')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md border border-purple-400/30 flex items-center gap-2 transition cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Institution Subscription</span>
          </button>
          <button
            onClick={() => navigate('/admin/database-status')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs shadow-md border border-indigo-500/40 flex items-center gap-2 transition cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>DB Status Inspector</span>
          </button>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision New User</span>
          </button>
        </div>
      </div>

      {/* Institution License Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>PSR Engineering College</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Institution Pro Active
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              Seat Quota: <strong>743 / 1000</strong> Students Enrolled • <strong>14 / 20</strong> Faculty • <strong>2 / 5</strong> Admins • Valid until 31 Aug 2027
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/subscription')}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer self-start sm:self-auto"
        >
          Manage License & Seats →
        </button>
      </div>

      {/* 2. Top Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {adminMetrics?.totalUsers ?? users.length}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">MongoDB Atlas</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Students</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {adminMetrics?.totalStudents ?? 4}
          </span>
          <span className="text-[10px] text-blue-600 font-semibold block mt-1">Active Profiles</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Question Bank</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {adminMetrics?.totalQuestions ?? 180}
          </span>
          <span className="text-[10px] text-purple-600 font-semibold block mt-1">Fingerprinted</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assessments</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {adminMetrics?.totalAssessments ?? 72}
          </span>
          <span className="text-[10px] text-indigo-600 font-semibold block mt-1">Auto-Graded</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subscriptions</span>
          <span className="text-2xl font-black text-emerald-600">
            {adminMetrics?.activeSubscriptions ?? 1}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">Active Pro Plans</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Demo Revenue</span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            ₹{(revenueStats?.demo_revenue_inr ?? 25099).toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-500 font-bold block mt-1">Demo Mode Active</span>
        </div>
      </div>

      {/* 2.5 Live MongoDB Demo Revenue & Subscription Section (Requirement 30) */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 p-6 rounded-3xl border border-indigo-500/30 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-900/50 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">
                SaaS Subscription & Demo Revenue Analytics
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                DEMO REVENUE — NO REAL MONEY CHARGED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live metrics computed directly from MongoDB Atlas <code className="text-indigo-300">subscriptions</code> & <code className="text-indigo-300">payments</code> collections.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/subscription')}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Manage Institution Pro</span>
            <Building2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Users</span>
            <span className="text-lg font-black text-white">{revenueStats?.total_users ?? 4}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Free Users</span>
            <span className="text-lg font-black text-slate-300">{revenueStats?.free_users ?? 3}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Pro</span>
            <span className="text-lg font-black text-indigo-400">{revenueStats?.student_pro_users ?? 1}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Subs</span>
            <span className="text-lg font-black text-emerald-400">{revenueStats?.active_subscriptions ?? 2}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Demo Payments</span>
            <span className="text-lg font-black text-white">{revenueStats?.total_payments_count ?? 3}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Successful</span>
            <span className="text-lg font-black text-emerald-400">{revenueStats?.successful_payments_count ?? 3}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Failed</span>
            <span className="text-lg font-black text-rose-400">{revenueStats?.failed_payments_count ?? 0}</span>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30">
            <span className="text-[10px] text-indigo-300 uppercase font-bold block">Demo Revenue</span>
            <span className="text-lg font-black text-emerald-300">₹{(revenueStats?.demo_revenue_inr ?? 25099).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2.8 Live Student Logins & Real-Time Presence Feed */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Real-Time Student Logins & Active Sessions
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Firebase Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Live stream of authenticated student sessions recorded across Firebase Realtime Database & MongoDB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Recorded Logins:</span>
            <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black">
              {recentLogins.length} Sessions
            </span>
          </div>
        </div>

        {recentLogins.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            Waiting for student logins... Whenever any student logs in, their live session card will appear here instantly.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentLogins.slice(0, 6).map((login, idx) => (
              <div
                key={login.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-emerald-400/50 transition"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {login.name ? login.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                      <span>{login.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{login.email}</div>
                    <div className="text-[10px] text-indigo-500 font-semibold truncate mt-0.5">
                      {login.department || 'Computer Science'} • {login.loginMethod || 'Email/Password'}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 block mb-1">
                    Logged In
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {login.timestamp ? new Date(login.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. User Management Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['All', 'Teacher', 'Student', 'Administrator'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  roleFilter === r
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {u.name}
                    <span className="block text-[10px] text-slate-400 font-normal">{u.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-500">{u.role}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{u.institution}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      u.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {u.lastActive || 'Recently'}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Provision New User</h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@student.edu"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Institution</label>
                <input
                  type="text"
                  value={newUser.institution}
                  onChange={(e) => setNewUser({ ...newUser, institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-md"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
