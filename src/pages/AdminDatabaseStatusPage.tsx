import React, { useEffect, useState } from 'react';
import { adminApi, type DatabaseStatusResponse } from '../api/adminApi';
import { useNavigate } from 'react-router-dom';
import {
  Database, Server, RefreshCw, CheckCircle2, ShieldCheck, Layers, Users,
  Clock, ArrowLeft, Sparkles, AlertCircle, Cloud, Key, FileCode, Check, Copy
} from 'lucide-react';

export const AdminDatabaseStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [dbStatus, setDbStatus] = useState<DatabaseStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  // Quick Atlas Connect Form
  const [atlasUriInput, setAtlasUriInput] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getDatabaseStatus();

      // Also merge Firebase RTDB students & logins to guarantee real-time admin visibility
      try {
        const [resStudents, resLogins] = await Promise.allSettled([
          fetch('https://learndept-ai-default-rtdb.firebaseio.com/students.json'),
          fetch('https://learndept-ai-default-rtdb.firebaseio.com/logins.json')
        ]);

        const existingEmails = new Set((data.userLogins || []).map(u => u.email.toLowerCase()));

        if (resStudents.status === 'fulfilled' && resStudents.value.ok) {
          const fbStudents = await resStudents.value.json();
          if (fbStudents && typeof fbStudents === 'object') {
            Object.entries(fbStudents).forEach(([k, s]: [string, any]) => {
              const email = (s.email || `${(s.name || 'student').toLowerCase().replace(/\s+/g, '')}@student.edu`).toLowerCase();
              if (!existingEmails.has(email)) {
                existingEmails.add(email);
                data.userLogins = data.userLogins || [];
                data.userLogins.push({
                  id: s.rollNumber || s.studentId || k,
                  name: s.name || 'Student',
                  email: email,
                  role: 'student',
                  department: s.department || 'Computer Science',
                  lastLoginAt: s.lastActive || new Date().toISOString()
                });
              }
            });
          }
        }

        // Check recent logins to update lastLoginAt
        if (resLogins.status === 'fulfilled' && resLogins.value.ok) {
          const fbLogins = await resLogins.value.json();
          if (fbLogins && typeof fbLogins === 'object') {
            Object.values(fbLogins).forEach((l: any) => {
              const email = (l.email || '').toLowerCase();
              const target = data.userLogins?.find(u => u.email.toLowerCase() === email);
              if (target && l.timestamp) {
                target.lastLoginAt = l.timestamp;
              }
            });
          }
        }
      } catch (fbErr) {
        console.warn('Firebase RTDB supplemental sync in DB status:', fbErr);
      }

      setDbStatus(data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (e: any) {
      setError(e.message || 'Failed to connect to backend database endpoint');
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    try {
      await adminApi.seedDatabase();
      setSuccessMsg('Sample database successfully seeded with demo faculty, students, and questions!');
      await fetchStatus();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e: any) {
      setError('Seed failed: ' + e.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleTestConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!atlasUriInput.trim()) return;
    setConnecting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await adminApi.connectMongoDB(atlasUriInput.trim(), 'learndebt');
      if (res.success) {
        setSuccessMsg(`Successfully connected to MongoDB Atlas! (${res.message})`);
        setAtlasUriInput('');
        await fetchStatus();
      } else {
        setError(`MongoDB Atlas Connection Failed: ${res.message}. Check credentials or IP whitelist.`);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to connect to MongoDB Atlas');
    } finally {
      setConnecting(false);
    }
  };

  const copyEnvSnippet = () => {
    const snippet = `# MongoDB Atlas Connection String in backend/.env\nMONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/learndebt?retryWrites=true&w=majority\nMONGODB_DATABASE=learndebt`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 3000);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const formatTimestamp = (ts: any) => {
    if (!ts) return 'Recent';
    try {
      const d = new Date(ts);
      return isNaN(d.getTime()) ? String(ts) : d.toLocaleString();
    } catch (e) {
      return String(ts);
    }
  };

  const isAtlasActive = dbStatus?.isAtlas;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm tracking-wide uppercase mb-1">
              <ShieldCheck className="w-4 h-4" /> Cloud Database Administration
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              MongoDB Atlas Connectivity & Cluster Status
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configured via separate <code className="text-emerald-400 font-mono">backend/.env</code> configuration file
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl font-bold text-xs text-slate-300 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Admin Console</span>
            </button>

            <button
              onClick={handleSeed}
              disabled={seeding || loading}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-purple-600/80 hover:bg-purple-600 text-white rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{seeding ? 'Seeding...' : 'Seed Sample DB'}</span>
            </button>

            <button
              onClick={fetchStatus}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {error && (
          <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 p-4 rounded-2xl flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Connection Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${
              isAtlasActive
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}>
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Engine Status</p>
              <p className={`text-base font-black flex items-center gap-1.5 mt-0.5 ${
                isAtlasActive ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                <CheckCircle2 className="w-4 h-4" /> {isAtlasActive ? 'MongoDB Atlas' : 'In-Memory Store'}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Database Name</p>
              <p className="text-base font-black text-white mt-0.5">
                {dbStatus?.databaseName || 'learndebt'}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">User Accounts</p>
              <p className="text-base font-black text-purple-300 mt-0.5">
                {dbStatus?.totalLoginsRegistered ?? dbStatus?.collections?.users ?? 0} Registered
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Last Polled</p>
              <p className="text-base font-bold text-cyan-300 mt-0.5">
                {lastRefreshed || 'Just now'}
              </p>
            </div>
          </div>
        </div>

        {/* MongoDB Atlas Connectivity Panel */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-black text-white">MongoDB Atlas Connection Configuration</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Connected via separate environment file: <span className="font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">backend/.env</span>
              </p>
            </div>

            <button
              onClick={copyEnvSnippet}
              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 transition flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              {copiedEnv ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedEnv ? 'Copied .env Example!' : 'Copy .env Format'}</span>
            </button>
          </div>

          {/* Active URI Display */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Connection String</span>
              <span className="font-mono text-xs text-indigo-300 break-all">
                {dbStatus?.maskedUri || 'mongodb+srv://admin:****@cluster0.xxxxx.mongodb.net/learndebt?retryWrites=true&w=majority'}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 self-start md:self-auto ${
              isAtlasActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {dbStatus?.status || 'Active'}
            </span>
          </div>

          {/* Live Test / Reconnect Form */}
          <form onSubmit={handleTestConnect} className="space-y-3">
            <label className="block text-xs font-bold text-slate-300">
              Test or Connect Custom MongoDB Atlas Cluster (Updates Runtime Session):
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={atlasUriInput}
                onChange={(e) => setAtlasUriInput(e.target.value)}
                placeholder="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/learndebt?retryWrites=true&w=majority"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={connecting || !atlasUriInput.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition disabled:opacity-40 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {connecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
                <span>{connecting ? 'Testing Connection...' : 'Test & Connect Atlas'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Tip: In MongoDB Atlas, ensure Network Access whitelist allows <span className="font-mono text-amber-400">0.0.0.0/0</span> (Allow Access from Anywhere) and database user has read/write privileges.
            </p>
          </form>

          {/* Step-by-Step Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1">
              <span className="font-bold text-indigo-400 block">Step 1: Get Atlas URI</span>
              <p className="text-slate-400 text-[11px]">
                Log into cloud.mongodb.com &rarr; Clusters &rarr; Connect &rarr; Drivers (Python 3.12+).
              </p>
            </div>
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1">
              <span className="font-bold text-indigo-400 block">Step 2: Add into backend/.env</span>
              <p className="text-slate-400 text-[11px]">
                Paste your URI into <code className="text-emerald-400">backend/.env</code> under <code className="text-indigo-300">MONGODB_URI</code>.
              </p>
            </div>
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1">
              <span className="font-bold text-indigo-400 block">Step 3: Instant Auto-Sync</span>
              <p className="text-slate-400 text-[11px]">
                FastAPI detects the connection with SSL/TLS encryption and automatically creates all required indexes.
              </p>
            </div>
          </div>
        </div>

        {/* Collections Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Database Collections Breakdown</h2>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {dbStatus?.collections ? Object.keys(dbStatus.collections).length : 0} Collections Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {dbStatus?.collections && Object.entries(dbStatus.collections).map(([colName, count]) => (
              <div key={colName} className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block truncate">{colName}</span>
                <span className="text-lg font-black text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Registered User Accounts Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white">Registered Users in Database</h2>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {dbStatus?.userLogins?.length || 0} Accounts Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Last Activity / Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {dbStatus?.userLogins?.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                        u.role === 'teacher' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{u.department || 'Computer Science'}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatTimestamp(u.lastLoginAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
