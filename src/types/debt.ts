export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type RiskLevel = 'Low' | 'Moderate' | 'Medium' | 'High' | 'Critical' | 'Healthy' | 'Moderate Debt' | 'High Debt' | 'Critical Risk';
export type StatusColor = 'green' | 'yellow' | 'orange' | 'red' | 'blue';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  institution?: string;
  department?: string;
  childStudentId?: string;
}

export interface BloomTaxonomy {
  level: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
}

export interface Concept {
  id: string;
  name: string;
  category: string;
  description: string;
  prerequisites: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  bloomsTaxonomy: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  criticalityWeight: number;
  position: { x: number; y: number };
}

export interface ConceptNode {
  id: string;
  name: string;
  category: string;
  subject: string;
  mastery: number; // 0-100
  risk: RiskLevel;
  prerequisites: string[];
  affects: string[];
  correctAnswers: number;
  totalAttempts: number;
  repeatedErrors: number;
  lastPracticed: string;
  description: string;
  aiInsight: string;
  position?: { x: number; y: number };
}

export interface ConceptMastery {
  conceptId: string;
  directScore: number;
  prerequisiteMastery: number;
  learningDebtScore: number;
  isIllusionaryHigh: boolean;
  vulnerabilityLevel: RiskLevel;
  lastEvaluated: string;
}

export interface ExamRecord {
  id: string;
  title: string;
  date: string;
  rawScore: number;
  conceptBreakdown: {
    conceptId: string;
    conceptName: string;
    score: number;
    questionCount: number;
  }[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  gradeLevel?: string;
  studentId?: string;
  className?: string;
  rollNumber?: string;
  department?: string;
  overallGrade: number; // e.g., 88%
  learningDebtIndex: number; // e.g., 37/100
  riskStatus: RiskLevel;
  persona: string;
  summary: string;
  conceptMasteries: Record<string, ConceptMastery>;
  examHistory: ExamRecord[];
  learningStreakDays?: number;
  conceptsMasteredCount?: number;
  conceptsAtRiskCount?: number;
  attendanceRate?: number;
  assignmentCompletionRate?: number;
}

export interface ParentOverview {
  parentId: string;
  parentName: string;
  child: Student;
  recentAlert: string;
  recentImprovement: string;
}

export interface DiagnosticQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  diagnosticInsight: string;
  targetedConceptId: string;
}

export interface DiagnosticQuestion {
  id: string;
  conceptId: string;
  conceptName: string;
  prerequisiteId?: string;
  prerequisiteName?: string;
  questionText: string;
  type: 'Foundational Prerequisite' | 'Conceptual Application' | 'Problem Solving';
  options: DiagnosticQuestionOption[];
  explanation: string;
}

export interface RemediationStep {
  stepNumber: number;
  heading: string;
  content: string;
  visualSnippet?: string;
  codeOrFormula?: string;
}

export interface RemediationModule {
  id: string;
  targetConceptId: string;
  targetConceptName: string;
  missingPrerequisiteId: string;
  missingPrerequisiteName: string;
  title: string;
  estimatedMinutes: number;
  type: 'Visual Bridge' | 'Interactive Intuition' | 'Prerequisite Repair' | 'Concept Reframing';
  status?: 'Completed' | 'In Progress' | 'Not Started';
  description: string;
  keyTakeaway: string;
  steps: RemediationStep[];
  interactiveQuiz?: DiagnosticQuestion;
}

export interface TeacherIntervention {
  id: string;
  studentId: string;
  studentName: string;
  className?: string;
  gapConcept: string;
  rootCause?: string;
  severity: RiskLevel;
  recommendedAction: string;
  status: 'Pending' | 'In Progress' | 'Improved' | 'Resolved';
  assignedDate: string;
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole;
  title: string;
  message: string;
  type: 'Critical' | 'Warning' | 'Improvement' | 'Assignment' | 'Assessment' | 'System';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface AlertItem {
  id: string;
  studentId: string;
  studentName: string;
  conceptId: string;
  conceptName: string;
  prerequisiteId: string;
  prerequisiteName: string;
  rawGrade: number;
  prereqMastery: number;
  debtScore: number;
  severity: 'warning' | 'danger' | 'critical' | 'info';
  timestamp: string;
  recommendedAction: string;
}

export interface SubjectData {
  id: string;
  name: string;
  code: string;
  icon: string;
  description: string;
  concepts: Concept[];
}

export interface AdminUser {
  id: string;
  name: string;
  role: 'Teacher' | 'Student' | 'Administrator';
  institution: string;
  email: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
