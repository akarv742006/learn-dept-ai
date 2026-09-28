import React, { useState } from 'react';
import { ArrowDown, X } from 'lucide-react';

interface StudentConceptMapViewProps {
  onLaunchQuiz: () => void;
}

export const StudentConceptMapView: React.FC<StudentConceptMapViewProps> = ({ onLaunchQuiz }) => {
  const [selectedConcept, setSelectedConcept] = useState<any>(null);

  const conceptChain = [
    {
      id: 'cs-node-1',
      name: 'Programming & Logic',
      category: 'Foundation Level 1',
      mastery: 96,
      confidence: 'High',
      attempts: 24,
      correct: 23,
      status: 'Strong',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      prerequisites: [],
      description: 'Control flow, primitive types, conditional branching, and basic boolean evaluation.',
    },
    {
      id: 'cs-node-2',
      name: 'Data Structures',
      category: 'Foundation Level 2',
      mastery: 84,
      confidence: 'High',
      attempts: 18,
      correct: 15,
      status: 'Strong',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      prerequisites: ['Programming & Logic'],
      description: 'Linear vs non-linear memory allocation concepts and dynamic indexing abstraction.',
    },
    {
      id: 'cs-node-3',
      name: 'Arrays & Strings',
      category: 'Core Concept (Prerequisite Bottleneck)',
      mastery: 54,
      confidence: 'Low',
      attempts: 14,
      correct: 7,
      status: 'At Risk',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      prerequisites: ['Data Structures'],
      description: 'Contiguous memory allocation, index computation, off-by-one boundary conditions.',
    },
    {
      id: 'cs-node-4',
      name: 'Searching Algorithms',
      category: 'Advanced Application',
      mastery: 45,
      confidence: 'Low',
      attempts: 10,
      correct: 4,
      status: 'Needs Practice',
      statusColor: 'bg-rose-100 text-rose-800 border-rose-300',
      prerequisites: ['Arrays & Strings'],
      description: 'Linear vs logarithmic search bounds, mid-point calculation, array division.',
    },
    {
      id: 'cs-node-5',
      name: 'Binary Search Trees',
      category: 'Downstream Vulnerability',
      mastery: 38,
      confidence: 'Low',
      attempts: 8,
      correct: 3,
      status: 'Critical Gap',
      statusColor: 'bg-rose-200 text-rose-900 border-rose-400 font-black',
      prerequisites: ['Searching Algorithms'],
      description: 'Dividing dynamic search spaces into balanced left/right child pointers.',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-10">
      {/* 1. Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            Interactive Prerequisite Graph
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Concept Map & Knowledge Tree
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Visualizing concept dependency chains. Click any node to inspect mastery, confidence score, attempts, and downstream risk.
          </p>
        </div>

        <button
          onClick={onLaunchQuiz}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
        >
          Run Diagnostic Test
        </button>
      </div>

      {/* 2. Concept Graph Flow Layout */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Subject: Computer Science (DSA) Prerequisite Chain
          </span>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Strong (&gt;80%)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> At Risk (50-79%)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Critical Gap (&lt;50%)</span>
          </div>
        </div>

        {/* Vertical Connected Chain */}
        <div className="flex flex-col items-center space-y-3 py-4 max-w-2xl mx-auto">
          {conceptChain.map((node, index) => (
            <React.Fragment key={node.id}>
              <div
                onClick={() => setSelectedConcept(node)}
                className={`w-full p-5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  node.status === 'Critical Gap'
                    ? 'bg-rose-50/80 border-rose-300 hover:border-rose-400'
                    : node.status === 'At Risk'
                    ? 'bg-amber-50/80 border-amber-300 hover:border-amber-400'
                    : 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {node.category}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">{node.name}</h3>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${node.statusColor}`}>
                      Mastery: {node.mastery}%
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">Confidence: {node.confidence}</span>
                  </div>
                </div>
              </div>

              {index < conceptChain.length - 1 && (
                <div className="flex flex-col items-center text-slate-400 my-1">
                  <div className="w-0.5 h-6 bg-slate-300"></div>
                  <ArrowDown className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. Detailed Concept Modal/Drawer */}
      {selectedConcept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedConcept(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${selectedConcept.statusColor}`}>
              {selectedConcept.status}
            </span>

            <h3 className="text-xl font-extrabold text-slate-900">{selectedConcept.name}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedConcept.description}</p>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Mastery Score</span>
                <span className="text-lg font-black text-slate-900">{selectedConcept.mastery}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Practice Attempts</span>
                <span className="text-lg font-black text-slate-900">{selectedConcept.attempts}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Correct Answers</span>
                <span className="text-lg font-black text-slate-900">{selectedConcept.correct}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedConcept(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => { setSelectedConcept(null); onLaunchQuiz(); }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
              >
                Practice This Concept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
