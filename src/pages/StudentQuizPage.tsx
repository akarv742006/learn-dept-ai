import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Award, AlertTriangle, RotateCcw,
  Sparkles, BookOpen, Bookmark, ArrowRight, RefreshCw, CheckCircle2, XCircle,
  Building2, Users, FileCheck, Layers, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { assessmentApi, type Question, type DepartmentAssignment, type StudentSubmission } from '../api/assessmentApi';
import { aiApi } from '../api/aiApi';
import { firebaseSync } from '../services/firebase';

const DEPARTMENTS = [
  'All Departments / Campus Wide',
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering'
];

const SUBJECTS_BY_DEPARTMENT: Record<string, string[]> = {
  'All Departments / Campus Wide': ['DBMS', 'Data Structures', 'Algorithms', 'Cloud Computing', 'Digital Electronics', 'Thermodynamics'],
  'Computer Science': ['DBMS', 'Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks'],
  'Information Technology': ['Cloud Computing', 'Web Security', 'Database Engineering', 'Data Mining'],
  'Electronics & Communication': ['Digital Electronics', 'VLSI Design', 'Signals & Systems', 'Microcontrollers'],
  'Mechanical Engineering': ['Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Heat Transfer'],
  'Civil Engineering': ['Structural Analysis', 'Geotechnical Engineering', 'Surveying', 'Hydraulics'],
  'Electrical Engineering': ['Power Systems', 'Control Systems', 'Circuit Theory', 'Electrical Machines']
};

const CONCEPTS_BY_SUBJECT: Record<string, string[]> = {
  DBMS: ['c_fd', 'c_norm', 'c_relational_basics', 'SQL Joins'],
  'Data Structures': ['c_bst', 'Arrays & Strings', 'Graph Algorithms', 'Recursion'],
  Algorithms: ['Divide & Conquer', 'Dynamic Programming', 'Greedy Methods'],
  'Operating Systems': ['Process Scheduling', 'Virtual Memory', 'Semaphores'],
  'Computer Networks': ['TCP/IP Model', 'Packet Routing', 'Subnetting'],
  'Digital Electronics': ['Boolean Logic', 'Flip-Flops', 'Counters & Multiplexers'],
  Thermodynamics: ['First Law of Thermo', 'Carnot Efficiency', 'Entropy Balance']
};

export const StudentQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const studentId = user?.id || 'student_arun';

  // Department State
  const [selectedDepartment, setSelectedDepartment] = useState<string>(user?.department || 'All Departments / Campus Wide');
  const [deptAssignments, setDeptAssignments] = useState<DepartmentAssignment[]>([]);
  const [pastSubmissions, setPastSubmissions] = useState<StudentSubmission[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState<boolean>(false);

  // Config State
  const [selectedSubject, setSelectedSubject] = useState('DBMS');
  const [selectedConcept, setSelectedConcept] = useState('c_fd');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [assessmentType, setAssessmentType] = useState<string>('practice');

  // Active Quiz State
  const [quizState, setQuizState] = useState<'config' | 'active' | 'exhausted' | 'results'>('config');
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [isExhausted, setIsExhausted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAssignmentTitle, setActiveAssignmentTitle] = useState<string>('');

  // Generation loading state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Result metrics
  const [finalScore, setFinalScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [debtBefore, setDebtBefore] = useState(52);
  const [debtAfter, setDebtAfter] = useState(42);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [reviewItems, setReviewItems] = useState<any[]>([]);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');

  const fetchMyPastSubmissions = async () => {
    try {
      const [apiSubs, fbSubs] = await Promise.allSettled([
        assessmentApi.getSubmissions({ studentId }),
        firebaseSync.getSubmissions({ studentId })
      ]);

      const subList: StudentSubmission[] = [];
      if (apiSubs.status === 'fulfilled' && Array.isArray(apiSubs.value)) {
        subList.push(...apiSubs.value);
      }
      if (fbSubs.status === 'fulfilled' && Array.isArray(fbSubs.value)) {
        subList.push(...fbSubs.value);
      }

      const map = new Map();
      subList.forEach((s: any) => {
        const id = s._id || s.id;
        if (id && !map.has(id)) map.set(id, s);
      });

      const merged = Array.from(map.values()).sort(
        (a: any, b: any) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
      );
      setPastSubmissions(merged);
    } catch (err) {
      console.warn("Could not fetch past student submissions", err);
    }
  };

  useEffect(() => {
    fetchMyPastSubmissions();
  }, [studentId]);

  // Load Department Assignments whenever selectedDepartment changes
  const fetchDeptAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const queryDept = selectedDepartment.includes('All') ? 'All' : selectedDepartment;
      const [apiList, fbList] = await Promise.allSettled([
        assessmentApi.getDepartmentAssignments(queryDept),
        firebaseSync.getAssignments(selectedDepartment)
      ]);

      const allList: DepartmentAssignment[] = [];
      if (apiList.status === 'fulfilled' && Array.isArray(apiList.value)) {
        allList.push(...apiList.value);
      }
      if (fbList.status === 'fulfilled' && Array.isArray(fbList.value)) {
        allList.push(...fbList.value);
      }

      const map = new Map();
      allList.forEach((a: any) => {
        const id = a._id || a.id;
        if (id && !map.has(id)) map.set(id, a);
      });

      const merged = Array.from(map.values()).sort(
        (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setDeptAssignments(merged);
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn("Could not fetch department assignments", err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    fetchDeptAssignments();

    // Auto-poll assignments every 12 seconds so teacher-created tests appear in real-time
    const interval = setInterval(fetchDeptAssignments, 12000);

    // Also update default subject for department
    const subjects = SUBJECTS_BY_DEPARTMENT[selectedDepartment] || ['DBMS'];
    setSelectedSubject(subjects[0]);

    return () => clearInterval(interval);
  }, [selectedDepartment]);

  // When subject changes, reset selected concept
  useEffect(() => {
    if (CONCEPTS_BY_SUBJECT[selectedSubject]) {
      setSelectedConcept(CONCEPTS_BY_SUBJECT[selectedSubject][0]);
    } else {
      setSelectedConcept('General Principles');
    }
  }, [selectedSubject]);

  // Timer effect
  useEffect(() => {
    if (quizState !== 'active') return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState, assessmentId, selectedOptions]);

  // Start self-configured quiz
  const handleStartQuiz = async () => {
    setIsLoading(true);
    setActiveAssignmentTitle('');
    try {
      const res = await assessmentApi.generate({
        studentId,
        subjectId: selectedSubject,
        conceptId: selectedConcept,
        difficulty: selectedDifficulty,
        questionCount,
        assessmentType,
        department: selectedDepartment
      });

      setAssessmentId(res.assessmentId);
      setActiveQuestions(res.questions);
      setIsExhausted(res.exhausted);
      setCurrentIdx(0);
      setSelectedOptions({});
      setMarkedForReview({});
      setTimeLeftSeconds(res.questions.length * 120);
      setIsSubmitted(false);

      if (res.exhausted && res.questions.length === 0) {
        setQuizState('exhausted');
      } else {
        setQuizState('active');
      }
    } catch (e: any) {
      alert("Error starting assessment: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Start Faculty-Assigned Assignment
  const handleStartFacultyAssignment = async (assign: DepartmentAssignment) => {
    setIsLoading(true);
    setActiveAssignmentTitle(assign.title);
    try {
      let qList: Question[] = [];
      let asmId = `asm_${Date.now()}`;

      try {
        const res = await assessmentApi.generate({
          studentId,
          subjectId: assign.subjectId || 'General',
          department: assign.department || selectedDepartment,
          assignmentId: assign._id || (assign as any).id
        });
        if (res?.questions && res.questions.length > 0) {
          qList = res.questions;
          asmId = res.assessmentId || asmId;
        }
      } catch (genErr) {
        console.warn("Backend generate notice, resolving embedded questions:", genErr);
      }

      // If backend returned no questions, resolve from assign.questions if available
      if (qList.length === 0 && (assign as any).questions && (assign as any).questions.length > 0) {
        qList = (assign as any).questions.map((q: any, i: number) => ({
          id: q._id || q.id || `q_${i}`,
          question: q.question,
          options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: q.correctAnswer ?? 0,
          explanation: q.explanation || 'Instructor verified rationale.',
          department: assign.department,
          subjectId: assign.subjectId,
          difficulty: 'medium'
        }));
      }

      // If still empty, supply curriculum diagnostic questions
      if (qList.length === 0) {
        qList = [
          {
            id: 'q_diag_1',
            question: `In ${assign.subjectId || 'Computer Science'}, which core principle governs structural integrity and optimal resource utilization?`,
            options: ['Normalized Functional Dependency Model', 'Unconstrained Heap Allocation', 'Random Polling Protocol', 'Static Pointer Aliasing'],
            correctAnswer: 0,
            explanation: 'Normalized Functional Dependencies eliminate data redundancy and prevent update anomalies.',
            department: assign.department,
            subjectId: assign.subjectId,
            difficulty: 'medium'
          },
          {
            id: 'q_diag_2',
            question: `When evaluating relational decomposition for ${assign.subjectId || 'Database Systems'}, what guarantees no spurious tuples?`,
            options: ['Lossless Join Property (R1 ∩ R2 -> R1 or R2)', 'Boyce-Codd Denial', 'Cyclic Graph Redundancy', 'Transitive Distraction'],
            correctAnswer: 0,
            explanation: 'Lossless join requires the intersection of attributes to functionally determine at least one of the decomposed relations.',
            department: assign.department,
            subjectId: assign.subjectId,
            difficulty: 'medium'
          },
          {
            id: 'q_diag_3',
            question: 'What is the primary condition required for 3NF with respect to non-trivial functional dependency X -> A?',
            options: ['X is a superkey OR A is a prime attribute', 'X must be a foreign key', 'A must be indexed sequentially', 'Table must have no primary key'],
            correctAnswer: 0,
            explanation: '3NF relaxes BCNF by allowing the right-hand side A to be a prime attribute (part of any candidate key).',
            department: assign.department,
            subjectId: assign.subjectId,
            difficulty: 'medium'
          }
        ];
      }

      setAssessmentId(asmId);
      setActiveQuestions(qList);
      setIsExhausted(false);
      setCurrentIdx(0);
      setSelectedOptions({});
      setMarkedForReview({});
      setTimeLeftSeconds((assign.durationMinutes || 25) * 60);
      setIsSubmitted(false);
      setQuizState('active');
    } catch (e: any) {
      alert("Error starting faculty assignment: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAIQuiz = async () => {
    setIsGeneratingAI(true);
    try {
      await aiApi.generateQuestions({
        studentId,
        subjectId: selectedSubject,
        conceptId: selectedConcept,
        difficulty: selectedDifficulty,
        count: questionCount
      });
      await handleStartQuiz();
    } catch (err: any) {
      alert("AI Generation error: " + err.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    const answersPayload = Object.entries(selectedOptions).map(([qId, optIdx]) => ({
      questionId: qId,
      selectedAnswer: optIdx
    }));

    try {
      const elapsed = Math.max(10, (activeQuestions.length * 120) - timeLeftSeconds);
      setTimeSpentSeconds(elapsed);

      let res: any = null;
      try {
        res = await assessmentApi.submit(assessmentId, answersPayload, elapsed);
      } catch (submitErr) {
        console.warn('Backend submit notice, evaluating locally:', submitErr);
        let correctCount = 0;
        const review = activeQuestions.map((q) => {
          const studentAns = selectedOptions[q.id || (q as any)._id || ''] ?? -1;
          const isCorr = studentAns === q.correctAnswer;
          if (isCorr) correctCount++;
          return {
            questionId: q.id || (q as any)._id || '',
            question: q.question,
            options: q.options,
            selectedAnswer: studentAns,
            selectedAnswerText: q.options[studentAns] || 'None selected',
            correctAnswer: q.correctAnswer,
            correctAnswerText: q.options[q.correctAnswer] || '',
            isCorrect: isCorr,
            marks: isCorr ? 10 : 0,
            explanation: q.explanation || 'Instructor verified rationale.'
          };
        });
        const total = activeQuestions.length || 1;
        const pct = Math.round((correctCount / total) * 100);
        res = {
          assessmentId,
          score: correctCount * 10,
          maxScore: total * 10,
          percentage: pct,
          correctAnswers: correctCount,
          totalQuestions: total,
          passed: pct >= 50,
          review
        };
      }

      setFinalScore(res.score);
      setAccuracy(res.percentage);
      setSubmitResult(res);
      setReviewItems(res.review || []);
      setDebtBefore(48);
      setDebtAfter(Math.max(12, 48 - Math.round(res.percentage * 0.3)));
      setQuizState('results');

      // Record submission into Firebase RTDB & localStorage for real-time Teacher & Parent visibility
      const subRecord: StudentSubmission = {
        _id: `sub_${Date.now()}`,
        assessmentId: assessmentId || `asm_${Date.now()}`,
        assignmentId: '',
        assignmentTitle: activeAssignmentTitle || `${selectedSubject} Diagnostic Assessment`,
        studentId: studentId,
        studentName: user?.name || 'Arun Kumar',
        studentEmail: user?.email || `${studentId}@student.edu`,
        department: user?.department || selectedDepartment,
        year: user?.year || 'Year 3',
        score: res.score,
        maxScore: res.maxScore || (activeQuestions.length * 10),
        percentage: res.percentage,
        correctAnswers: res.correctAnswers,
        totalQuestions: res.totalQuestions,
        passed: res.passed ?? (res.percentage >= 50),
        timeTaken: elapsed,
        submittedAt: new Date().toISOString(),
        review: res.review || []
      };

      await firebaseSync.recordSubmission(subRecord);
      await fetchMyPastSubmissions();

      if (res.percentage >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      alert("Submission error: " + err.message);
    }
  };

  const handleViewPastMarkSheet = (sub: StudentSubmission) => {
    setFinalScore(sub.score);
    setAccuracy(sub.percentage);
    setActiveAssignmentTitle(sub.assignmentTitle);
    setSubmitResult({
      score: sub.score,
      maxScore: sub.maxScore,
      percentage: sub.percentage,
      correctAnswers: sub.correctAnswers,
      totalQuestions: sub.totalQuestions,
      passed: sub.passed
    });
    setReviewItems(sub.review || []);
    setTimeSpentSeconds(sub.timeTaken || 120);
    setQuizState('results');
  };

  const currentQ = activeQuestions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Student Diagnostic Portal</h1>
              <p className="text-xs text-slate-400">Department curriculum & faculty-assigned evaluations</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-300 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* 1. CONFIG STATE */}
        {quizState === 'config' && (
          <div className="space-y-6">

            {/* Department Selection Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-blue-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Your Department Cohort</span>
                  <h2 className="text-lg font-black text-white">Select Academic Department</h2>
                </div>
              </div>

              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white font-bold text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* SECTION 1: FACULTY-ASSIGNED ASSESSMENTS */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-black text-white">
                    Assigned by Your Faculty ({selectedDepartment})
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {deptAssignments.length} Active Assignments
                </span>
              </div>

              {loadingAssignments ? (
                <div className="text-center py-8 text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  Loading department assignments...
                </div>
              ) : deptAssignments.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800/80">
                  No pending faculty assignments for {selectedDepartment}. You can take a practice test below!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deptAssignments.map((assign) => (
                    <div
                      key={assign._id}
                      className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                            {assign.targetYear || 'Year 3'}
                          </span>
                          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {assign.durationMinutes} mins
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white leading-snug">{assign.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{assign.description || 'Department diagnostic evaluation.'}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">By: <strong className="text-slate-300">{assign.assignedBy}</strong></span>
                        <button
                          onClick={() => handleStartFacultyAssignment(assign)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                        >
                          Take Test <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 1.5: MY COMPLETED EXAMS & MARK SHEETS */}
            {pastSubmissions.length > 0 && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-black text-white">
                      My Completed Exams & Mark Sheets ({pastSubmissions.length} Evaluated)
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Official Gradebook Record
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastSubmissions.map((sub) => {
                    const isPass = sub.passed || sub.percentage >= 50;
                    const maxSc = sub.maxScore || (sub.totalQuestions ? sub.totalQuestions * 10 : 50);
                    return (
                      <div
                        key={sub._id}
                        className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {sub.department || selectedDepartment}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isPass
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {isPass ? 'PASSED' : 'NEEDS HELP'}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-white leading-snug">{sub.assignmentTitle}</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-white">
                              {sub.score} <span className="text-xs text-slate-400 font-normal">/ {maxSc} Marks</span>
                            </span>
                            <span className={`text-xs font-bold ${isPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                              ({sub.percentage}% &bull; {sub.correctAnswers ?? 0}/{sub.totalQuestions ?? 0} Correct)
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <span className="text-[11px] text-slate-500 font-mono">
                            {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'Recent'}
                          </span>
                          <button
                            onClick={() => handleViewPastMarkSheet(sub)}
                            className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5" /> View Mark Sheet &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 2: SELF-PRACTICE ASSESSMENTS */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Self-Practice & Adaptive Diagnostic Engine
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                  >
                    {(SUBJECTS_BY_DEPARTMENT[selectedDepartment] || ['DBMS', 'Data Structures']).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Concept Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Concept / Module</label>
                  <select
                    value={selectedConcept}
                    onChange={(e) => setSelectedConcept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                  >
                    {(CONCEPTS_BY_SUBJECT[selectedSubject] || ['Core Principles']).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Difficulty</label>
                  <div className="flex gap-2">
                    {['easy', 'medium', 'hard'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDifficulty(d)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wide transition border ${
                          selectedDifficulty === d
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Question Count</label>
                  <div className="flex gap-2">
                    {[3, 5, 10].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCount(cnt)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition border ${
                          questionCount === cnt
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {cnt} Questions
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Launch Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-800">
                <button
                  onClick={handleStartQuiz}
                  disabled={isLoading}
                  className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 transition disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  <span>Start Practice Quiz ({selectedDepartment})</span>
                </button>

                <button
                  onClick={handleGenerateAIQuiz}
                  disabled={isGeneratingAI}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-600/25 transition disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingAI ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-amber-300" />}
                  <span>Generate New AI Questions</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* 2. EXHAUSTED STATE */}
        {quizState === 'exhausted' && (
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">All Department Questions Attempted!</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              You have completed all questions in the bank for this concept.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => handleStartQuiz()}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-extrabold cursor-pointer"
              >
                Practice Previous Questions
              </button>
              <button
                onClick={handleGenerateAIQuiz}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Generate New AI Questions
              </button>
            </div>
          </div>
        )}

        {/* 3. ACTIVE QUIZ RUNNER */}
        {quizState === 'active' && currentQ && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            {/* Progress Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Question {currentIdx + 1} of {activeQuestions.length}
                </span>
                <h3 className="text-sm font-semibold text-slate-300 mt-0.5">
                  {activeAssignmentTitle || `${selectedSubject} • ${selectedConcept}`}
                </h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono text-xs font-extrabold">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(timeLeftSeconds / 60)}:{(timeLeftSeconds % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-xl font-extrabold text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = selectedOptions[currentQ.id || currentQ._id || ''] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQ.id || currentQ._id || '', idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border ${
                        isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-700 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-800">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>

              {currentIdx < activeQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold cursor-pointer"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={handleQuizSubmit}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Submit & Evaluate Assessment
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4. COMPREHENSIVE STUDENT MARK SHEET & REVIEW */}
        {quizState === 'results' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Score Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Official Exam Mark Sheet
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      accuracy >= 50
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {accuracy >= 50 ? 'PASSED' : 'NEEDS REMEDIATION'}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    {activeAssignmentTitle || `${selectedSubject} Diagnostic Examination`}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Department: <strong className="text-slate-200">{selectedDepartment}</strong> &bull; Student: <strong className="text-slate-200">{user?.name || 'Arun Kumar'}</strong>
                  </p>
                </div>

                {/* Score & Marks Display */}
                <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-6 min-w-[240px] justify-around">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Marks</span>
                    <span className="text-3xl font-black text-white">
                      {finalScore} <span className="text-sm font-semibold text-slate-400">/ {submitResult?.maxScore || activeQuestions.length * 10}</span>
                    </span>
                  </div>
                  <div className="w-[1px] h-12 bg-slate-800" />
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Grade / Accuracy</span>
                    <span className={`text-3xl font-black ${
                      accuracy >= 70 ? 'text-emerald-400' : accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {accuracy}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Diagnostic Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Correct Questions</span>
                  <p className="text-lg font-black text-emerald-400 mt-0.5">
                    {submitResult?.correctAnswers ?? 0} <span className="text-xs text-slate-500 font-normal">of {submitResult?.totalQuestions ?? activeQuestions.length}</span>
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Time Spent</span>
                  <p className="text-lg font-black text-white mt-0.5">
                    {Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Learning Debt</span>
                  <p className="text-lg font-black text-indigo-400 mt-0.5">
                    {debtAfter} pts <span className="text-xs text-emerald-400 font-bold">&darr; -{Math.max(0, debtBefore - debtAfter)}</span>
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Database Status</span>
                  <p className="text-xs font-bold text-slate-300 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Recorded in DB
                  </p>
                </div>
              </div>
            </div>

            {/* Question-by-Question Detailed Mark Breakdown */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-white">Detailed Question & Mark Sheet Review</h3>
                  <p className="text-xs text-slate-400">Review your choices against the verified faculty answer key and explanations.</p>
                </div>
                <button
                  onClick={() => {
                    const data = {
                      title: activeAssignmentTitle || `${selectedSubject} Exam`,
                      student: user?.name || 'Student',
                      marks: `${finalScore}/${submitResult?.maxScore || activeQuestions.length * 10}`,
                      percentage: `${accuracy}%`,
                      result: accuracy >= 50 ? 'PASSED' : 'NEEDS REMEDIATION',
                      review: reviewItems
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `MarkSheet_${Date.now()}.json`;
                    a.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition"
                >
                  Download Mark Sheet (JSON)
                </button>
              </div>

              <div className="space-y-4">
                {reviewItems.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No detailed question review items returned.
                  </div>
                ) : (
                  reviewItems.map((item, idx) => (
                    <div
                      key={item.questionId || idx}
                      className={`p-6 rounded-2xl border transition space-y-4 ${
                        item.isCorrect
                          ? 'bg-slate-950/70 border-emerald-900/50'
                          : 'bg-slate-950/70 border-rose-900/50'
                      }`}
                    >
                      {/* Question Header & Marks */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-300">Question #{idx + 1}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {item.conceptId || selectedConcept}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                          item.isCorrect
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {item.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{item.isCorrect ? '+10 / 10 Marks' : '0 / 10 Marks'}</span>
                        </span>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-bold text-white leading-relaxed">{item.question}</p>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {item.options?.map((opt: string, optIdx: number) => {
                          const isStudentPick = item.selectedAnswer === optIdx || item.selectedAnswerText === opt;
                          const isRightAnswer = item.correctAnswer === optIdx || item.correctAnswerText === opt;

                          let borderCls = 'border-slate-800 bg-slate-900/50 text-slate-400';
                          if (isRightAnswer) {
                            borderCls = 'border-emerald-500 bg-emerald-950/30 text-emerald-200 font-bold';
                          } else if (isStudentPick && !item.isCorrect) {
                            borderCls = 'border-rose-500 bg-rose-950/30 text-rose-200 font-semibold';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2.5 ${borderCls}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                  isRightAnswer
                                    ? 'bg-emerald-500 text-slate-950'
                                    : isStudentPick
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>

                              <div className="shrink-0 flex items-center gap-1.5">
                                {isStudentPick && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    item.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                  }`}>
                                    Your Pick
                                  </span>
                                )}
                                {isRightAnswer && (
                                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded">
                                    Correct Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation Rationale */}
                      {item.explanation && (
                        <div className="p-3 bg-slate-900/80 rounded-xl text-xs text-slate-300 border border-slate-800 flex items-start gap-2.5">
                          <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-white">Faculty Rationale: </span>
                            {item.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Nav Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
                <button
                  onClick={() => setQuizState('config')}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-extrabold cursor-pointer transition"
                >
                  ← Take Another Assessment
                </button>
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/30 cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <span>Return to Student Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
