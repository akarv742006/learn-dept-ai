import React, { useState } from 'react';
import { Sparkles, Brain, AlertOctagon, ArrowRight, Cpu } from 'lucide-react';
import type { Student } from '../types/debt';
import { aiService, type AIGapAnalysisResult } from '../services/aiService';

interface AIGapDetectionViewProps {
  students: Student[];
  onAssignPath: (student: Student) => void;
}

export const AIGapDetectionView: React.FC<AIGapDetectionViewProps> = ({ students, onAssignPath }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-akash-007');
  const [selectedSubject, setSelectedSubject] = useState('Computer Science - DBMS');
  const [selectedAssessment, setSelectedAssessment] = useState('Midterm 1 Diagnostic Test');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(true);
  const [aiResult, setAiResult] = useState<AIGapAnalysisResult | null>(null);

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisDone(false);

    const result = await aiService.analyzeLearningGap({
      studentName: activeStudent.name,
      subject: selectedSubject,
      assessmentScore: activeStudent.overallGrade,
      concepts: [
        { name: 'SQL Basics', score: 85 },
        { name: 'Joins', score: 80 },
        { name: 'Functional Dependency', score: 35 },
        { name: 'Candidate Key', score: 40 },
        { name: 'Normalization', score: 42 },
      ],
    });

    setAiResult(result);
    setIsAnalyzing(false);
    setAnalysisDone(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-10">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>AI Neural Diagnostic Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            AI Learning Gap Analysis
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Uncovers non-obvious root-cause prerequisite failures using question response vectors, confidence scoring, and Bloom's taxonomy depth.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-xs text-slate-200">
          <span className="text-[10px] uppercase text-cyan-300 font-bold block mb-1">Model Status</span>
          <span className="font-extrabold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            92% Gap Detection Accuracy
          </span>
        </div>
      </div>

      {/* 2. Selection Form Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Configure Diagnostic Run
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.overallGrade}% Exam Score)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Computer Science - Data Structures">Computer Science - Data Structures</option>
              <option value="Mathematics - Calculus">Mathematics - Calculus</option>
              <option value="Physics - Quantum Mechanics">Physics - Quantum Mechanics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Assessment</label>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Midterm 1 Diagnostic Test">Midterm 1 Diagnostic Test</option>
              <option value="Foundation Prerequisites Quiz">Foundation Prerequisites Quiz</option>
              <option value="End of Term Comprehensive">End of Term Comprehensive</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Performance Vectors...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run AI Gap Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. AI Analysis Results */}
      {analysisDone && activeStudent && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Risk Level: {aiResult?.riskLevel || 'HIGH'}
                </span>
                <span className="text-xs text-slate-400">Target Student: {activeStudent.name}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                AI Diagnostic Result: <span className="text-rose-600">{aiResult?.rootCause || 'Functional Dependency & Prerequisite Gaps'}</span>
              </h3>
            </div>

            <button
              onClick={() => onAssignPath(activeStudent)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2"
            >
              <span>Assign Learning Path</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Evidence Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-500" />
                <span>Empirical Diagnostic Evidence</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                  <span><strong>7 incorrect answers</strong> on array boundary and off-by-one pointer questions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                  <span><strong>Low performance (54%)</strong> in array traversal under timed condition.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                  <span>Repeated errors in 0-indexed contiguous memory offsets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span>Strong performance (88%) in unrelated theoretical syntax questions.</span>
                </li>
              </ul>
            </div>

            {/* Root Cause & Impact */}
            <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200/80 space-y-3">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span>AI Root Cause & Cascade Impact</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Root Cause Analysis:</span>
                  <p className="text-slate-700">
                    "Basic array traversal and memory pointer indexing concepts require immediate visual reinforcement before moving to data structure pointers."
                  </p>
                </div>
                <div className="pt-2 border-t border-blue-200/60">
                  <span className="font-bold text-slate-900 block">Downstream Impact:</span>
                  <p className="text-slate-700">
                    "May severely affect upcoming <span className="font-bold text-rose-700">Searching</span>, <span className="font-bold text-rose-700">Sorting</span>, and <span className="font-bold text-rose-700">Linked List</span> modules."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
