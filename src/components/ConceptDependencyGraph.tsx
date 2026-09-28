import React, { useState } from 'react';
import type { Concept, Student, SubjectData } from '../types/debt';
import {
  Brain,
  Zap,
  ArrowRight,
  XCircle,
  HelpCircle,
  Sparkles,
  Search
} from 'lucide-react';

interface ConceptDependencyGraphProps {
  subject: SubjectData;
  students: Student[];
  selectedStudent: Student;
  onSelectStudent: (student: Student) => void;
  onLaunchQuizForConcept: (concept: Concept) => void;
  onLaunchRemediationForConcept: (concept: Concept) => void;
}

export const ConceptDependencyGraph: React.FC<ConceptDependencyGraphProps> = ({
  subject,
  students,
  selectedStudent,
  onSelectStudent,
  onLaunchQuizForConcept,
  onLaunchRemediationForConcept,
}) => {
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'heatmap' | 'hidden_gaps' | 'bottlenecks'>('heatmap');
  const [searchQuery, setSearchQuery] = useState('');

  const concepts = subject.concepts;
  const masteries = selectedStudent.conceptMasteries;

  const conceptMap = new Map(concepts.map((c) => [c.id, c]));

  const minX = Math.min(...concepts.map((c) => c.position.x)) - 80;
  const maxX = Math.max(...concepts.map((c) => c.position.x)) + 260;
  const minY = Math.min(...concepts.map((c) => c.position.y)) - 60;
  const maxY = Math.max(...concepts.map((c) => c.position.y)) + 160;

  const width = Math.max(1200, maxX - minX);
  const height = Math.max(500, maxY - minY);

  const filteredConcepts = concepts.filter((concept) => {
    const matchesSearch =
      concept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concept.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const m = masteries[concept.id];
    if (filterMode === 'hidden_gaps') {
      return m?.isIllusionaryHigh || (m?.learningDebtScore && m.learningDebtScore > 50);
    }
    if (filterMode === 'bottlenecks') {
      return concept.criticalityWeight >= 4;
    }
    return true;
  });

  return (
    <div className="glass-panel bg-white p-6 rounded-2xl border border-slate-200/90 mb-8 relative shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Concept Prerequisite DAG & Learning Debt Map
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200">
              Interactive Network
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Visualizing foundational prerequisites to advanced concepts for{' '}
            <strong className="text-cyan-700">{subject.name}</strong>. Evaluated profile:{' '}
            <strong className="text-amber-700">{selectedStudent.name}</strong> ({selectedStudent.persona}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Profile selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-300">
            <span className="text-xs text-slate-600 px-2 font-semibold">Profile:</span>
            <select
              value={selectedStudent.id}
              onChange={(e) => {
                const s = students.find((std) => std.id === e.target.value);
                if (s) onSelectStudent(s);
              }}
              className="bg-white text-slate-800 text-xs rounded-lg px-2.5 py-1 border border-slate-300 font-semibold focus:outline-none focus:border-cyan-600 shadow-2xs"
            >
              {students.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.name} (Debt Index: {std.learningDebtIndex})
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 text-xs text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-cyan-600 w-40"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300 text-xs font-semibold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 font-bold border border-slate-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('heatmap')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterMode === 'heatmap'
                  ? 'bg-cyan-100 text-cyan-800 font-bold border border-cyan-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Debt Heatmap
            </button>
            <button
              onClick={() => setFilterMode('hidden_gaps')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterMode === 'hidden_gaps'
                  ? 'bg-rose-100 text-rose-800 font-bold border border-rose-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hidden Gaps
            </button>
            <button
              onClick={() => setFilterMode('bottlenecks')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterMode === 'bottlenecks'
                  ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bottlenecks
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-x-auto rounded-xl bg-slate-50 border border-slate-300 p-4 shadow-inner min-h-[480px]">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-4 text-[11px] bg-white/95 px-3.5 py-2 rounded-xl border border-slate-300 shadow-md backdrop-blur-md">
          <span className="text-slate-600 font-bold">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700 font-medium">Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-700 font-medium">Moderate Debt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-700 font-medium">Critical Gap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-300 text-[10px]">
              ILLUSION
            </span>
            <span className="text-slate-700 font-medium">Hidden Exam Score Gap</span>
          </div>
        </div>

        <svg
          viewBox={`${minX} ${minY} ${width} ${height}`}
          className="w-full h-[450px] min-w-[1000px] select-none"
        >
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
            <marker
              id="arrow-danger"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#e11d48" />
            </marker>
          </defs>

          {concepts.map((targetConcept) => {
            return targetConcept.prerequisites.map((prereqId) => {
              const sourceConcept = conceptMap.get(prereqId);
              if (!sourceConcept) return null;

              const sourceM = masteries[sourceConcept.id];
              const targetM = masteries[targetConcept.id];

              const isHighDebtEdge =
                (sourceM?.learningDebtScore ?? 0) > 50 || (targetM?.learningDebtScore ?? 0) > 50;

              const startX = sourceConcept.position.x + 180;
              const startY = sourceConcept.position.y + 40;
              const endX = targetConcept.position.x;
              const endY = targetConcept.position.y + 40;

              const dx = endX - startX;
              const controlX1 = startX + dx * 0.5;
              const controlY1 = startY;
              const controlX2 = startX + dx * 0.5;
              const controlY2 = endY;

              const pathString = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;

              return (
                <g key={`edge-${sourceConcept.id}-${targetConcept.id}`}>
                  <path
                    d={pathString}
                    fill="none"
                    stroke={isHighDebtEdge ? '#e11d48' : '#94a3b8'}
                    strokeWidth={isHighDebtEdge ? 2.5 : 1.5}
                    strokeOpacity={isHighDebtEdge ? 0.95 : 0.7}
                    markerEnd={isHighDebtEdge ? 'url(#arrow-danger)' : 'url(#arrow-default)'}
                    className={isHighDebtEdge ? 'animated-edge' : ''}
                  />
                  {isHighDebtEdge && (
                    <text
                      x={(startX + endX) / 2}
                      y={(startY + endY) / 2 - 8}
                      fill="#be123c"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Prereq Gap
                    </text>
                  )}
                </g>
              );
            });
          })}

          {concepts.map((concept) => {
            const mastery = masteries[concept.id];
            const isFilteredOut = !filteredConcepts.some((c) => c.id === concept.id);
            const isSelected = selectedConcept?.id === concept.id;

            const debtScore = mastery?.learningDebtScore ?? 0;
            const directScore = mastery?.directScore ?? 0;
            const prereqMastery = mastery?.prerequisiteMastery ?? 0;
            const isIllusion = mastery?.isIllusionaryHigh ?? false;

            let borderColor = '#cbd5e1';
            let bgFill = '#ffffff';

            if (debtScore >= 70 || isIllusion) {
              borderColor = '#e11d48';
              bgFill = '#fff1f2';
            } else if (debtScore >= 45) {
              borderColor = '#f59e0b';
              bgFill = '#fffbeb';
            } else {
              borderColor = '#0284c7';
              bgFill = '#f0f9ff';
            }

            return (
              <g
                key={`node-${concept.id}`}
                transform={`translate(${concept.position.x}, ${concept.position.y})`}
                onClick={() => setSelectedConcept(concept)}
                className="cursor-pointer transition-all duration-300"
                style={{ opacity: isFilteredOut ? 0.25 : 1 }}
              >
                {(isSelected || debtScore >= 65 || isIllusion) && (
                  <rect
                    x="-6"
                    y="-6"
                    width="192"
                    height="92"
                    rx="18"
                    fill="none"
                    stroke={isIllusion || debtScore >= 65 ? '#e11d48' : '#0284c7'}
                    strokeWidth="2.5"
                    strokeDasharray={isIllusion ? '4 4' : 'none'}
                    className="animate-pulse"
                  />
                )}

                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="80"
                  rx="14"
                  fill={bgFill}
                  stroke={borderColor}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  className="filter drop-shadow-sm transition-colors hover:brightness-95"
                />

                <text x="12" y="18" fill="#64748b" fontSize="9" fontWeight="bold" letterSpacing="0.5">
                  {concept.category.toUpperCase()}
                </text>
                <text
                  x="12"
                  y="36"
                  fill="#0f172a"
                  fontSize="12"
                  fontWeight="bold"
                  className="select-none"
                >
                  {concept.name.length > 22 ? concept.name.substring(0, 20) + '...' : concept.name}
                </text>

                <g transform="translate(12, 46)">
                  <rect x="0" y="0" width="65" height="18" rx="5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
                  <text x="6" y="13" fill="#334155" fontSize="9" fontWeight="600">
                    Exam: <tspan fill="#0284c7" fontWeight="bold">{directScore}%</tspan>
                  </text>

                  <rect x="70" y="0" width="85" height="18" rx="5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
                  <text x="75" y="13" fill="#334155" fontSize="9" fontWeight="600">
                    Prereq: <tspan fill={prereqMastery < 55 ? '#e11d48' : '#059669'} fontWeight="bold">{prereqMastery}%</tspan>
                  </text>
                </g>

                {concept.criticalityWeight >= 4 && (
                  <circle cx="166" cy="14" r="8" fill="#d97706" opacity="0.95" />
                )}
                {concept.criticalityWeight >= 4 && (
                  <text x="166" y="17" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">
                    ⚡
                  </text>
                )}

                {isIllusion && (
                  <g transform="translate(12, 67)">
                    <rect x="0" y="0" width="156" height="10" rx="3" fill="#be123c" />
                    <text x="78" y="8" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
                      ⚠️ HIDDEN DEBT ILLUSION (HIGH EXAM / LOW PREREQ)
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {selectedConcept && (
        <div className="mt-6 glass-panel bg-white p-6 rounded-2xl border border-cyan-300 relative shadow-xl animate-pulse-subtle">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                  Concept Deep Dive • {selectedConcept.category}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedConcept.name}</h3>
              </div>
            </div>

            <button
              onClick={() => setSelectedConcept(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-6 leading-relaxed font-medium">
            {selectedConcept.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold">Direct Assessment Score</span>
              <div className="text-xl font-black text-cyan-700 mt-1">
                {masteries[selectedConcept.id]?.directScore ?? 0}%
              </div>
              <span className="text-[10px] text-slate-500 font-medium">From unit exam marks</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold">Prerequisite Chain Readiness</span>
              <div className={`text-xl font-black mt-1 ${
                (masteries[selectedConcept.id]?.prerequisiteMastery ?? 0) < 60 ? 'text-rose-600' : 'text-emerald-700'
              }`}>
                {masteries[selectedConcept.id]?.prerequisiteMastery ?? 0}%
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Ancestoral prerequisite average</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold">Calculated Learning Debt</span>
              <div className={`text-xl font-black mt-1 ${
                (masteries[selectedConcept.id]?.learningDebtScore ?? 0) > 50 ? 'text-rose-600' : 'text-amber-600'
              }`}>
                {masteries[selectedConcept.id]?.learningDebtScore ?? 0} / 100
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Cascading vulnerability index</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold">Criticality Multiplier</span>
              <div className="text-xl font-black text-amber-700 mt-1 flex items-center gap-1">
                <Zap className="w-4 h-4 fill-amber-600" />
                {selectedConcept.criticalityWeight}x
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Impact on downstream topics</span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Prerequisite Dependencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedConcept.prerequisites.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No prerequisites (Foundational concept).</span>
              ) : (
                selectedConcept.prerequisites.map((pId) => {
                  const prereqConcept = conceptMap.get(pId);
                  const pMastery = masteries[pId];
                  return (
                    <div
                      key={pId}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-600" />
                      <span className="text-slate-800 font-bold">{prereqConcept?.name}</span>
                      <span className={`font-extrabold px-1.5 py-0.5 rounded text-[10px] ${
                        (pMastery?.directScore ?? 0) < 60 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Score: {pMastery?.directScore ?? 0}%
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => onLaunchQuizForConcept(selectedConcept)}
              className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>Run Diagnostic Probe Quiz</span>
            </button>

            <button
              onClick={() => onLaunchRemediationForConcept(selectedConcept)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch 15-Min Micro-Remediation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
