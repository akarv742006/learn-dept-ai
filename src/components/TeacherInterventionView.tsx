import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TeacherIntervention } from '../types/debt';
import { MOCK_TEACHER_INTERVENTIONS } from '../data/mockPlatformData';

export const TeacherInterventionView: React.FC = () => {
  const [interventions, setInterventions] = useState<TeacherIntervention[]>(MOCK_TEACHER_INTERVENTIONS);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Improved' | 'Resolved'>('All');

  const filteredInterventions = interventions.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.status === activeFilter;
  });

  const handleStatusChange = (id: string, newStatus: TeacherIntervention['status']) => {
    setInterventions(
      interventions.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-10">
      {/* 1. Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            Educator Action Center
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Intervention Center
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Assign personalized remediation modules, monitor progress, and resolve critical prerequisite gaps.
          </p>
        </div>

        <button
          onClick={() => {
            const newInt: TeacherIntervention = {
              id: `int-${Date.now()}`,
              studentId: 'std-akash-007',
              studentName: 'Vikram Seth',
              gapConcept: 'Recursion Call Stack',
              severity: 'High',
              recommendedAction: 'Assign Stack Memory Visualizer',
              status: 'Pending',
              assignedDate: 'Just now',
            };
            setInterventions([newInt, ...interventions]);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Intervention</span>
        </button>
      </div>

      {/* 2. Status Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Pending', 'In Progress', 'Improved', 'Resolved'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeFilter === filter
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {filter} ({filter === 'All' ? interventions.length : interventions.filter(i => i.status === filter).length})
          </button>
        ))}
      </div>

      {/* 3. Interventions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Gap Concept</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Recommended Action</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInterventions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {item.studentName.charAt(0)}
                    </div>
                    <span>{item.studentName}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{item.gapConcept}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : item.severity === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs">{item.recommendedAction}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Improved'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'In Progress'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {item.status !== 'Resolved' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'Resolved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                      >
                        Mark Resolved
                      </button>
                    )}
                    {item.status === 'Pending' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'In Progress')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs"
                      >
                        Assign Path
                      </button>
                    )}
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
