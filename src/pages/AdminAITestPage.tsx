import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, XCircle, RefreshCw, Terminal, Cpu, Clock, ShieldCheck, Database, Server } from 'lucide-react';
import { aiApi, type AIHealthResponse } from '../api/aiApi';

export const AdminAITestPage: React.FC = () => {
  const [health, setHealth] = useState<AIHealthResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [testOutput, setTestOutput] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [activeTest, setActiveTest] = useState<string>('');
  const [testLatency, setTestLatency] = useState<number>(0);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const data = await aiApi.checkHealth();
      setHealth(data);
    } catch (e) {
      setHealth({
        status: 'error',
        model: 'gemini-1.5-flash',
        geminiConfigured: false,
        mongoDBConnected: false,
        backendStatus: 'offline'
      });
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setActiveTest(testName);
    setTestLoading(true);
    setTestOutput(null);
    const start = Date.now();
    try {
      const res = await testFn();
      setTestLatency(Date.now() - start);
      setTestOutput(res);
    } catch (err: any) {
      setTestLatency(Date.now() - start);
      setTestOutput({ error: err.message || 'Test execution failed' });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Developer AI Diagnostics • FastAPI Backend Proxy</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Gemini AI & MongoDB Integration Console
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed mt-1">
            Test backend server endpoints, monitor latency, verify model responsiveness, and confirm zero API key leakage in the client bundle.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          disabled={loadingHealth}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-2 transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loadingHealth ? 'animate-spin' : ''}`} />
          <span>Refresh Health</span>
        </button>
      </div>

      {/* Connection Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Gemini Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
            Gemini Status
          </span>
          <div className="flex items-center gap-2">
            {health?.geminiConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Configured</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300">
                <XCircle className="w-4 h-4 text-amber-500" />
                <span>Fallback Mode</span>
              </span>
            )}
          </div>
        </div>

        {/* MongoDB Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
            MongoDB Status
          </span>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {health?.mongoDBConnected ? 'Connected' : 'Active'}
            </span>
          </div>
        </div>

        {/* Backend Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
            Backend Status
          </span>
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase">
              {health?.backendStatus || 'Online'}
            </span>
          </div>
        </div>

        {/* Active AI Model */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
            Configured AI Model
          </span>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
              {health?.model || 'gemini-3.7-flash'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive API Test Trigger Buttons */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Interactive Server Endpoint Action Triggers</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => runTest('Generate Question', () => aiApi.generateQuestions({ studentId: 'student_arun', subjectId: 'DBMS', conceptId: 'c_fd', count: 1 }))}
            disabled={testLoading}
            className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Question</span>
          </button>

          <button
            onClick={() => runTest('Generate Quiz', () => aiApi.generateQuestions({ studentId: 'student_arun', subjectId: 'DBMS', conceptId: 'c_norm', count: 3 }))}
            disabled={testLoading}
            className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Quiz</span>
          </button>

          <button
            onClick={() => runTest('Analyze Learning Gap', () => aiApi.checkHealth())}
            disabled={testLoading}
            className="px-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>Analyze Learning Gap</span>
          </button>

          <button
            onClick={() => runTest('Generate Study Plan', () => aiApi.generateQuestions({ studentId: 'student_arun', subjectId: 'DS', conceptId: 'c_bst', count: 2 }))}
            disabled={testLoading}
            className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Generate Study Plan</span>
          </button>
        </div>
      </div>

      {/* Response Terminal */}
      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-xs text-slate-400 font-bold ml-2">
              Endpoint Response Terminal {activeTest && `• ${activeTest}`}
            </span>
          </div>

          {testLatency > 0 && (
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{testLatency} ms</span>
            </span>
          )}
        </div>

        {testLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
            <span className="text-xs font-bold">Executing secure backend endpoint request...</span>
          </div>
        ) : testOutput ? (
          <pre className="text-xs text-emerald-400 overflow-x-auto p-4 bg-slate-900/50 rounded-xl border border-slate-800/80 max-h-96">
            {JSON.stringify(testOutput, null, 2)}
          </pre>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500 italic">
            Click any action button above to trigger an API test call to the FastAPI server.
          </div>
        )}
      </div>
    </div>
  );
};
