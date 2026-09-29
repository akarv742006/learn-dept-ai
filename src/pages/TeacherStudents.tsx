import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiskBadge } from '../components/RiskBadge';
import { firebaseSync } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, Search, Users, Sparkles } from 'lucide-react';

export const TeacherStudents: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const live = await firebaseSync.getStudents();
      setStudents(live);
    } catch (e) {
      console.warn("Could not load live students for teacher roster:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    window.addEventListener('learndebt_test_submitted', fetchStudents);
    window.addEventListener('storage', fetchStudents);
    const interval = setInterval(fetchStudents, 10000);
    return () => {
      window.removeEventListener('learndebt_test_submitted', fetchStudents);
      window.removeEventListener('storage', fetchStudents);
      clearInterval(interval);
    };
  }, []);

  const filtered = students.filter(s => {
    const matchDept = selectedDept === 'All' || s.department === selectedDept || (s.department || '').includes(selectedDept);
    const matchSearch = (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (s.rollNumber || '').toLowerCase().includes(search.toLowerCase()) ||
                        (s.email || '').toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Live Student Roster & Learning Health
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">All Students & Prerequisite Debt</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time sync across campus registrations, exam submissions, and parent links.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStudents}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 hover:bg-slate-200 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{loading ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name or roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="text-xs font-bold text-slate-500">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filtered.length}</strong> Students
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Student ID / Roll</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Linked Parent</th>
                <th className="p-3.5">Exam Score</th>
                <th className="p-3.5">Learning Debt Index</th>
                <th className="p-3.5">Risk Level</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((s) => (
                <tr key={s.id || s.rollNumber} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {s.name}
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">{s.rollNumber}</td>
                  <td className="p-3.5">{s.department}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{s.parentName || s.linkedParentName}</div>
                    <div className="text-[10px] text-slate-400">{s.parentPhone || s.linkedParentPhone}</div>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-600">{s.overallPerformance}%</td>
                  <td className="p-3.5 font-bold text-amber-600">{s.learningDebt} / 100</td>
                  <td className="p-3.5"><RiskBadge level={s.riskLevel} size="sm" /></td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/teacher/student/${s.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition cursor-pointer"
                    >
                      View Deep Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
