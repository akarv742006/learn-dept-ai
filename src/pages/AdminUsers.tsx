import React, { useState, useEffect } from 'react';
import { AdminDashboardView } from '../components/AdminDashboardView';
import {
  Users, BookOpen, Layers, Award, FileText, Settings, Plus, Search,
  Download, CheckCircle2, ShieldCheck, Building2, ChevronRight, X,
  Database, RefreshCw, BarChart2, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering'
];

export const AdminUsers: React.FC = () => <AdminDashboardView />;

const BASE_STUDENTS = [
  { id: 'STU-101', name: 'Arun Kumar', email: 'arun@student.edu', dept: 'Computer Science', year: 'Year 3', debt: '38%', gpa: '8.4', status: 'Active' },
  { id: 'STU-102', name: 'Priya Sharma', email: 'priya@student.edu', dept: 'Information Technology', year: 'Year 2', debt: '62%', gpa: '7.1', status: 'Active' },
  { id: 'STU-103', name: 'Rahul Verma', email: 'rahul@student.edu', dept: 'Electronics & Communication', year: 'Year 4', debt: '18%', gpa: '9.2', status: 'Active' },
  { id: 'STU-104', name: 'Sneha Patel', email: 'sneha@student.edu', dept: 'Computer Science', year: 'Year 3', debt: '45%', gpa: '7.9', status: 'Active' },
  { id: 'STU-105', name: 'Karthik Raja', email: 'karthik@student.edu', dept: 'Mechanical Engineering', year: 'Year 1', debt: '29%', gpa: '8.1', status: 'Active' },
  { id: 'STU-106', name: 'Ananya Rao', email: 'ananya@student.edu', dept: 'Civil Engineering', year: 'Year 2', debt: '33%', gpa: '8.6', status: 'Active' }
];

// 1. ADMIN STUDENTS VIEW
export const AdminStudents: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<any[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('learndebt_registered_students') || '[]');
      const latest = JSON.parse(localStorage.getItem('learndebt_latest_student') || 'null');
      const customList = latest ? [latest, ...stored.filter((s: any) => s.email !== latest.email)] : stored;
      const mapped = customList.map((s: any, idx: number) => ({
        id: s.rollNumber || s.studentId || `STU-${200 + idx}`,
        name: s.name,
        email: s.email,
        dept: s.department || 'Computer Science',
        year: s.year || 'Year 3',
        debt: `${s.learningDebt || 38}%`,
        gpa: '8.5',
        status: 'Active',
      }));
      return [...mapped, ...BASE_STUDENTS];
    } catch {}
    return BASE_STUDENTS;
  });

  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLiveStudents = async () => {
    setLoading(true);
    try {
      const [resStudents, resLogins] = await Promise.allSettled([
        fetch('https://learndept-ai-default-rtdb.firebaseio.com/students.json'),
        fetch('https://learndept-ai-default-rtdb.firebaseio.com/logins.json')
      ]);

      let fbStudentsData: any = null;
      let fbLoginsData: any = null;

      if (resStudents.status === 'fulfilled' && resStudents.value.ok) {
        fbStudentsData = await resStudents.value.json();
      }
      if (resLogins.status === 'fulfilled' && resLogins.value.ok) {
        fbLoginsData = await resLogins.value.json();
      }

      if (fbStudentsData && typeof fbStudentsData === 'object') {
        const fbStudents = Object.entries(fbStudentsData).map(([key, val]: [string, any]) => {
          let lastActive = 'Recently';
          if (val.lastActive) {
            try {
              lastActive = new Date(val.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } catch {}
          }
          return {
            id: val.rollNumber || val.studentId || key,
            name: val.name || 'Student',
            email: val.email || `${(val.name || 'student').toLowerCase().replace(/\s+/g, '')}@student.edu`,
            dept: val.department || 'Computer Science',
            year: val.year || 'Year 3',
            debt: `${val.learningDebt || 38}%`,
            gpa: '8.6',
            status: 'Active',
            lastActive: lastActive,
          };
        });

        // Also check recent logins to mark online
        if (fbLoginsData && typeof fbLoginsData === 'object') {
          const loginEmails = new Set(Object.values(fbLoginsData).map((l: any) => (l.email || '').toLowerCase()));
          fbStudents.forEach(s => {
            if (loginEmails.has(s.email.toLowerCase())) {
              s.lastActive = 'Online now';
            }
          });
        }

        setStudents(prev => {
          const emails = new Set(fbStudents.map(s => s.email.toLowerCase()));
          const nonDup = prev.filter(s => !emails.has(s.email.toLowerCase()));
          return [...fbStudents, ...nonDup];
        });
      }
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn('Live students fetch fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStudents();
    const interval = setInterval(fetchLiveStudents, 12000);
    return () => clearInterval(interval);
  }, []);

  const filtered = students.filter(s => {
    const matchDept = selectedDept === 'All' || s.dept === selectedDept;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Student Roster Management • Live RTDB
            </span>
            <span className="text-[11px] text-slate-400">
              Synced: <strong className="text-slate-600 dark:text-slate-300">{lastRefreshed}</strong>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">Institutional Student Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Monitor real-time student logins, enrollment, department allocations, and individual learning debt status.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchLiveStudents()}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none flex-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4">GPA</th>
                <th className="py-3.5 px-4">Learning Debt</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                    <div className="text-[11px] text-slate-400">{s.email}</div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">{s.dept}</td>
                  <td className="py-4 px-4 text-slate-500">{s.year}</td>
                  <td className="py-4 px-4 font-black text-slate-900 dark:text-white">{s.gpa}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      parseFloat(s.debt) > 50 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {s.debt}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                    {s.lastActive || 'Recently'}
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

// 2. ADMIN TEACHERS VIEW
export const AdminTeachers: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All');

  const faculty = [
    { name: 'Dr. Rajesh Sharma', email: 'rajesh@teacher.edu', dept: 'Computer Science', role: 'Associate Professor', courses: 'DBMS, Algorithms', questionsAuthored: 42 },
    { name: 'Prof. Meenakshi Sundaram', email: 'meenakshi@teacher.edu', dept: 'Information Technology', role: 'Professor & Head', courses: 'Cloud Computing, Networks', questionsAuthored: 36 },
    { name: 'Dr. Anand Kulkarni', email: 'anand@teacher.edu', dept: 'Electronics & Communication', role: 'Assistant Professor', courses: 'VLSI Design, Signals', questionsAuthored: 28 },
    { name: 'Dr. Harish Chandra', email: 'harish@teacher.edu', dept: 'Mechanical Engineering', role: 'Professor', courses: 'Thermodynamics, CAD', questionsAuthored: 31 },
    { name: 'Prof. Nalini Nair', email: 'nalini@teacher.edu', dept: 'Civil Engineering', role: 'Associate Professor', courses: 'Structural Mechanics', questionsAuthored: 24 }
  ];

  const filtered = faculty.filter(f => selectedDept === 'All' || f.dept === selectedDept);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Faculty Governance</span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">Department Faculty & Mentors</h1>
          <p className="text-xs text-slate-500 mt-1">Manage professorial assignments, course stewardship, and diagnostic authoring output.</p>
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((f, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                {f.dept}
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {f.questionsAuthored} Questions Authored
              </span>
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">{f.name}</h2>
              <p className="text-xs text-slate-500">{f.role} &bull; {f.email}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">Assigned Courses: </span>
              {f.courses}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. ADMIN CLASSES VIEW
export const AdminClasses: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', dept: 'Computer Science', year: 'Year 3', section: 'A', capacity: 60 });
  const [classesList, setClassesList] = useState([
    { id: 'CLS-1', name: 'CS-3A', dept: 'Computer Science', year: 'Year 3', section: 'Section A', count: 58, mentor: 'Dr. Rajesh Sharma' },
    { id: 'CLS-2', name: 'CS-3B', dept: 'Computer Science', year: 'Year 3', section: 'Section B', count: 54, mentor: 'Prof. Meenakshi Sundaram' },
    { id: 'CLS-3', name: 'IT-2A', dept: 'Information Technology', year: 'Year 2', section: 'Section A', count: 62, mentor: 'Dr. Anand Kulkarni' },
    { id: 'CLS-4', name: 'EC-4A', dept: 'Electronics & Communication', year: 'Year 4', section: 'Section A', count: 48, mentor: 'Dr. Harish Chandra' },
    { id: 'CLS-5', name: 'ME-1A', dept: 'Mechanical Engineering', year: 'Year 1', section: 'Section A', count: 52, mentor: 'Prof. Nalini Nair' }
  ]);

  const filtered = classesList.filter(c => selectedDept === 'All' || c.dept === selectedDept);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name.trim()) return;
    setClassesList(prev => [
      ...prev,
      {
        id: `CLS-${Date.now()}`,
        name: newClass.name.trim(),
        dept: newClass.dept,
        year: newClass.year,
        section: `Section ${newClass.section}`,
        count: 0,
        mentor: 'Faculty Appointed'
      }
    ]);
    setShowAddModal(false);
    setNewClass({ name: '', dept: 'Computer Science', year: 'Year 3', section: 'A', capacity: 60 });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Class & Section Administration</span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">Department Class Cohorts</h1>
          <p className="text-xs text-slate-500 mt-1">Manage academic sections, student enrollment allocations, and faculty mentors.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Class Section
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400">{c.name}</span>
              <span className="text-[11px] font-bold text-slate-500">{c.count} Students</span>
            </div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">{c.dept}</h2>
            <div className="text-xs text-slate-500">
              {c.year} &bull; {c.section}
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              Faculty Mentor: <strong className="text-slate-900 dark:text-white">{c.mentor}</strong>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 dark:text-white">Create New Class Cohort</h2>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Class Code / Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. CS-3C"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <select
                  value={newClass.dept}
                  onChange={(e) => setNewClass({ ...newClass, dept: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. ADMIN SUBJECTS VIEW
export const AdminSubjects: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All');

  const subjects = [
    { code: 'CS301', title: 'Database Management Systems (DBMS)', dept: 'Computer Science', credits: 4, sem: 'Sem 5', questions: 48, status: 'Active' },
    { code: 'CS302', title: 'Data Structures & Algorithms', dept: 'Computer Science', credits: 4, sem: 'Sem 3', questions: 62, status: 'Active' },
    { code: 'IT201', title: 'Computer Networks & Protocols', dept: 'Information Technology', credits: 3, sem: 'Sem 4', questions: 34, status: 'Active' },
    { code: 'EC204', title: 'Digital Electronics & Logic Design', dept: 'Electronics & Communication', credits: 4, sem: 'Sem 3', questions: 41, status: 'Active' },
    { code: 'ME305', title: 'Thermodynamics & Heat Transfer', dept: 'Mechanical Engineering', credits: 4, sem: 'Sem 5', questions: 30, status: 'Active' },
    { code: 'CE202', title: 'Strength of Materials & Solid Mechanics', dept: 'Civil Engineering', credits: 3, sem: 'Sem 4', questions: 26, status: 'Active' }
  ];

  const filtered = subjects.filter(s => selectedDept === 'All' || s.dept === selectedDept);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Curriculum Catalog</span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">Institutional Subject Registry</h1>
          <p className="text-xs text-slate-500 mt-1">Cross-department courses, credit mappings, and diagnostic question banks.</p>
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(s => (
          <div key={s.code} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-black">
                {s.code} &bull; {s.dept}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                {s.status}
              </span>
            </div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">{s.title}</h2>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>{s.sem} &bull; {s.credits} Credits</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{s.questions} Questions in Bank</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. ADMIN ASSESSMENTS VIEW
export const AdminAssessments: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All');

  const deptAssessments = [
    { title: 'CS301: Normalization & Relational Algebra Diagnostic', dept: 'Computer Science', target: 'Year 3', submissions: 112, avgScore: '74.2%', status: 'Active' },
    { title: 'IT202: Network Topology & Routing Protocols Benchmark', dept: 'Information Technology', target: 'Year 2', submissions: 86, avgScore: '69.8%', status: 'Active' },
    { title: 'EC201: Semiconductor Physics & Op-Amp Mastery Test', dept: 'Electronics & Communication', target: 'Year 2', submissions: 74, avgScore: '71.5%', status: 'Active' },
    { title: 'ME301: Thermodynamics & Energy Balances', dept: 'Mechanical Engineering', target: 'Year 3', submissions: 62, avgScore: '78.1%', status: 'Active' },
    { title: 'CE201: Fluid Mechanics & Hydrodynamics Diagnostic', dept: 'Civil Engineering', target: 'Year 2', submissions: 54, avgScore: '73.0%', status: 'Active' }
  ];

  const filtered = deptAssessments.filter(a => selectedDept === 'All' || a.dept === selectedDept);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Campus Diagnostic Oversight</span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">Cross-Department Assessment Monitor</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time status of staff-published assessments and student completion records.</p>
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase">
                  {item.dept}
                </span>
                <span className="text-[11px] font-bold text-slate-400">&bull; {item.target}</span>
              </div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">{item.title}</h2>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Submissions</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{item.submissions} students</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Average Score</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{item.avgScore}</span>
              </div>
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 text-xs font-bold rounded-full">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. ADMIN REPORTS VIEW
export const AdminReports: React.FC = () => {
  const handleExport = () => {
    const reportData = {
      institution: 'Delhi Technological University',
      reportType: 'Institutional Learning Debt & Accreditation Readiness',
      generatedDate: new Date().toISOString(),
      departments: [
        { name: 'Computer Science', totalStudents: 240, avgDebt: '32%', accreditationStatus: 'Compliant' },
        { name: 'Information Technology', totalStudents: 180, avgDebt: '36%', accreditationStatus: 'Compliant' },
        { name: 'Electronics & Communication', totalStudents: 195, avgDebt: '41%', accreditationStatus: 'Review Needed' },
        { name: 'Mechanical Engineering', totalStudents: 160, avgDebt: '28%', accreditationStatus: 'Compliant' }
      ]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Institutional_Accreditation_Report_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Accreditation & Analytics</span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">Institutional Learning Debt Audit</h1>
          <p className="text-xs text-slate-500 mt-1">Global compliance ratings, learning debt elimination velocities, and audit archives.</p>
        </div>

        <button
          onClick={handleExport}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Campus Audit (JSON)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Enrolled Cohort</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">1,240</h2>
          <p className="text-xs text-emerald-600 font-bold">&uarr; 94% active participation rate</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Campus Average Debt</span>
          <h2 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">34.6%</h2>
          <p className="text-xs text-slate-500">Decreased by 8.4% this semester</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Accreditation Readiness</span>
          <h2 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">98.2%</h2>
          <p className="text-xs text-slate-500">All ABET criterion thresholds met</p>
        </div>
      </div>
    </div>
  );
};

// 7. ADMIN SETTINGS VIEW
export const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [instName, setInstName] = useState('Delhi Technological University');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-16">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Institutional Settings & System Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">Configure campus-wide academic parameters and database controls.</p>

        <form onSubmit={handleSave} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Institution Name</label>
              <input
                type="text"
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current Academic Term</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-blue-900 dark:text-blue-200">Database & System Health</h3>
              <p className="text-[11px] text-blue-700 dark:text-blue-300">Inspect live MongoDB collections, run migrations, or seed demo test users.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/database-status')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Open Database Manager
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {saved ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> System parameters updated!
              </span>
            ) : <div />}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
