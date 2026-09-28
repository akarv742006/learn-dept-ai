import React, { useState } from 'react';
import {
  Brain,
  GraduationCap,
  Bell,
  Sparkles,
  BookOpen,
  Network,
  HelpCircle,
  Wrench,
  Download,
  AlertTriangle,
  Layers,
  ChevronDown
} from 'lucide-react';
import type { SubjectData, AlertItem } from '../types/debt';

interface NavbarProps {
  subjects: SubjectData[];
  selectedSubject: SubjectData;
  onSelectSubject: (subject: SubjectData) => void;
  activeTab: 'dashboard' | 'graph' | 'cohort' | 'quiz' | 'remediation' | 'editor';
  onSelectTab: (tab: 'dashboard' | 'graph' | 'cohort' | 'quiz' | 'remediation' | 'editor') => void;
  userRole: 'educator' | 'student';
  onToggleRole: () => void;
  alerts: AlertItem[];
  onOpenAlertModal: () => void;
  onExportReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  activeTab,
  onSelectTab,
  userRole,
  onToggleRole,
  alerts,
  onOpenAlertModal,
  onExportReport,
}) => {
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const criticalCount = alerts.filter((a) => a.severity === 'critical' || a.severity === 'danger').length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel bg-white/90 border-b border-slate-200/90 px-4 xl:px-8 py-3 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
        {/* Left Brand & Subject Selector */}
        <div className="flex items-center gap-4 sm:gap-6 w-full xl:w-auto justify-between xl:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-cyan-600/20 shrink-0">
              <Brain className="w-6 h-6 text-white animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight gradient-text">
                  MindDebt AI
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                  MISSION-07
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Learning Debt & Prerequisite Gap Detection
              </p>
            </div>
          </div>

          {/* Subject Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSubjectMenu(!showSubjectMenu)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-slate-800 text-xs font-semibold transition-all shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
              <span className="max-w-[130px] sm:max-w-[160px] truncate">{selectedSubject.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showSubjectMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 glass-panel bg-white rounded-xl border border-slate-200 p-2 shadow-xl z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Course Domain
                </div>
                {subjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onSelectSubject(sub);
                      setShowSubjectMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      sub.id === selectedSubject.id
                        ? 'bg-cyan-50 text-cyan-800 font-bold border border-cyan-200'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{sub.name}</div>
                      <div className="text-[10px] text-slate-500">{sub.code} • {sub.concepts.length} Concepts</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center justify-center gap-1.5 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 text-xs font-medium w-full xl:w-auto overflow-x-auto">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-white text-cyan-700 border border-slate-200 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-600" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => onSelectTab('graph')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'graph'
                ? 'bg-white text-cyan-700 border border-slate-200 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-indigo-600" />
            <span>DAG Map</span>
          </button>

          <button
            onClick={() => onSelectTab('cohort')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'cohort'
                ? 'bg-white text-cyan-700 border border-slate-200 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
            <span>Cohort</span>
          </button>

          <button
            onClick={() => onSelectTab('quiz')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'quiz'
                ? 'bg-white text-cyan-700 border border-slate-200 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Diagnostic Probe</span>
          </button>

          <button
            onClick={() => onSelectTab('remediation')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'remediation'
                ? 'bg-white text-cyan-700 border border-slate-200 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Remediation</span>
          </button>

          <button
            onClick={() => onSelectTab('editor')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'editor'
                ? 'bg-white text-cyan-700 border border-slate-200 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-slate-700" />
            <span>DAG Studio</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 w-full xl:w-auto justify-end">
          <button
            onClick={onOpenAlertModal}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-all flex items-center gap-1.5"
            title="Hidden Debt Alerts"
          >
            <Bell className="w-4 h-4 text-amber-600" />
            {criticalCount > 0 && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-pulse">
                <AlertTriangle className="w-2.5 h-2.5" />
                {criticalCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleRole}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              userRole === 'educator'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{userRole === 'educator' ? 'Educator View' : 'Student View'}</span>
          </button>

          <button
            onClick={onExportReport}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Audit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
