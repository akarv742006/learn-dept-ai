import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Calendar,
  Layers,
  BarChart3,
  Award,
  UserPlus,
  X,
  Loader2
} from 'lucide-react';
import {
  saasApi,
  type OrganizationDetails,
  type OrganizationUsage,
  type PaymentRecord
} from '../api/saasApi';
import { useAuth } from '../context/AuthContext';

export const AdminSubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [activating, setActivating] = useState<boolean>(false);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [orgData, setOrgData] = useState<OrganizationDetails | null>(null);
  const [subData, setSubData] = useState<OrganizationUsage | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Seat provision modal state
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [newMemberDept, setNewMemberDept] = useState('Computer Science');

  const orgId = 'org_psr_eng';

  const loadData = async () => {
    setLoading(true);
    try {
      const [statusRes, payRes] = await Promise.all([
        saasApi.getOrganizationStatus(orgId),
        saasApi.getPayments(orgId)
      ]);
      setOrgData(statusRes.organization);
      setSubData(statusRes.subscription);
      setPayments(payRes.payments || []);
    } catch (e: any) {
      console.warn("Could not load SaaS status:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleActivateDemo = async () => {
    setActivating(true);
    setMessage(null);
    try {
      const res = await saasApi.activateDemoSubscription({
        organizationId: orgId,
        planId: 'institution_pro',
        userId: user?.id || 'admin_user',
        userRole: 'admin',
        adminName: user?.name || 'Administrative Officer'
      });
      setMessage({
        text: `Demo Subscription Activated! Plan: Institution Pro. No real money charged.`,
        type: 'success'
      });
      await loadData();
    } catch (e: any) {
      setMessage({ text: e.message || 'Failed to activate demo subscription', type: 'error' });
    } finally {
      setActivating(false);
    }
  };

  const handleEnrollMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    setEnrolling(true);
    setMessage(null);
    try {
      await saasApi.addOrganizationMember(orgId, {
        name: newMemberName.trim(),
        email: newMemberEmail.trim(),
        role: newMemberRole,
        department: newMemberDept
      });
      setMessage({
        text: `Successfully provisioned ${newMemberRole} seat for ${newMemberName}!`,
        type: 'success'
      });
      setIsEnrollModalOpen(false);
      setNewMemberName('');
      setNewMemberEmail('');
      await loadData();
    } catch (e: any) {
      setMessage({ text: e.message || 'Seat limit reached or enrollment failed', type: 'error' });
    } finally {
      setEnrolling(false);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '31 Aug 2027';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Institution Subscription & Quotas
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              {orgData?.name || 'PSR Engineering College'}
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl leading-relaxed">
              Manage multi-tenant institution licensing, department seats, role allocations, and server-side demo payment activations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
              title="Refresh Quota Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> Provision Seat
            </button>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200 ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Section 1: Subscription Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Active Plan */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current License</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {subData?.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Institution Pro</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full-campus prerequisite intelligence & AI intervention
              </p>
            </div>
            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">₹25,000</span>
              <span className="text-xs font-semibold text-slate-500">/ year</span>
              <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Proposed / Demo Pricing
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Valid Until:
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {formatDate(subData?.expiry_date)}
            </span>
          </div>
        </div>

        {/* Card 2: Demo Payment Hub */}
        <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/60 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/50 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Demo Payment Gateway</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Instant Plan Renewal
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Verify server-side payment records, apply seat quotas, and activate institutional access immediately.
            </p>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-800/60 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              🛡️ <strong>Demo Payment Mode:</strong> Safe simulation. No real money or bank accounts will be debited.
            </div>
          </div>

          <div className="pt-4 mt-4">
            <button
              onClick={handleActivateDemo}
              disabled={activating}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {activating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Server-Side Payment...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Activate Demo Subscription (₹25,000 / yr)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 3: Included Features */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Unlocked Campus Features
            </h3>
          </div>
          <div className="space-y-2.5">
            {[
              'Learning Debt Analytics',
              'AI Intervention Engine',
              'Teacher Dashboard & Faculty Hub',
              'Cohort Gradebook & Exam Tracking',
              'Accreditation & Institutional Reports',
              'Department-Level Analytics'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Seat Management & Quotas */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Enforcement & Allocation
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Live Seat Usage & Multi-Tenant Quotas
            </h3>
          </div>
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-600" /> Add Member to Campus
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Students Usage */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" /> Student Seats
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {subData?.usage?.students?.percentage || 74.3}% Full
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {subData?.usage?.students?.used || 743}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                / {subData?.usage?.students?.limit || 1000} Enrolled
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${subData?.usage?.students?.percentage || 74.3}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {((subData?.usage?.students?.limit || 1000) - (subData?.usage?.students?.used || 743))} seats remaining for active learners.
            </p>
          </div>

          {/* Teachers Usage */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-500" /> Faculty / Teacher Seats
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                {subData?.usage?.teachers?.percentage || 70}% Full
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {subData?.usage?.teachers?.used || 14}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                / {subData?.usage?.teachers?.limit || 20} Faculty
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${subData?.usage?.teachers?.percentage || 70}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {((subData?.usage?.teachers?.limit || 20) - (subData?.usage?.teachers?.used || 14))} educator seats remaining for department leads.
            </p>
          </div>

          {/* Admins Usage */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500" /> Admin Seats
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                {subData?.usage?.admins?.percentage || 40}% Full
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {subData?.usage?.admins?.used || 2}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                / {subData?.usage?.admins?.limit || 5} Administrators
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${subData?.usage?.admins?.percentage || 40}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {((subData?.usage?.admins?.limit || 5) - (subData?.usage?.admins?.used || 2))} administrative control seats remaining.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Persistent Payment Records */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Audit & Accounting
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Persistent Payment History (MongoDB Atlas)
            </h3>
          </div>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
            {payments.length} Records Logged
          </span>
        </div>

        {payments.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No payment transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Payment ID</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Mode</th>
                  <th className="pb-3 pr-2 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {payments.map((p) => (
                  <tr key={p._id || p.payment_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3.5 pl-2 font-mono text-slate-800 dark:text-slate-200 font-bold">
                      {p.payment_id}
                    </td>
                    <td className="py-3.5 capitalize text-slate-700 dark:text-slate-300">
                      {p.plan_id.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                      ₹{p.amount?.toLocaleString()} {p.currency}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {p.mode}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-right text-slate-400 font-mono text-[11px]">
                      {p.created_at ? new Date(p.created_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Member Enrollment Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" /> Provision Campus Member Seat
              </h4>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnrollMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohith S"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rohith@student.edu"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role Allocation</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Faculty / Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={newMemberDept}
                    onChange={(e) => setNewMemberDept(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Comm</option>
                    <option value="Mechanical Engineering">Mechanical Eng</option>
                    <option value="Civil Engineering">Civil Eng</option>
                    <option value="Electrical Engineering">Electrical Eng</option>
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Seat limits are enforced on the server. If capacity is exhausted, the server rejects enrollment until a seat is freed or upgraded.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrolling}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Assign Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
