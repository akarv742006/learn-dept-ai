import type { TeacherIntervention } from '../types/debt';

export const INITIAL_TEACHER_INTERVENTIONS: TeacherIntervention[] = [
  {
    id: 'int-101',
    studentId: 'std-arun-102',
    studentName: 'Arun Kumar',
    className: 'III CSE - Sec A',
    gapConcept: 'Functional Dependency & Normalization',
    rootCause: 'Weak understanding of FD attribute closure X -> Y creates cascading failure in Candidate Keys.',
    severity: 'Critical',
    recommendedAction: 'Assign Functional Dependency Recovery Path & Diagnostic Quiz.',
    status: 'Pending',
    assignedDate: '2026-09-26',
  },
  {
    id: 'int-102',
    studentId: 'std-priya-103',
    studentName: 'Priya S',
    className: 'III CSE - Sec A',
    gapConcept: 'Arrays & Pointer Indexing',
    rootCause: '0-index contiguous memory allocation boundary condition errors under time constraints.',
    severity: 'High',
    recommendedAction: 'Assign Arrays Interactive Memory Allocator visualizer.',
    status: 'In Progress',
    assignedDate: '2026-09-24',
  },
  {
    id: 'int-103',
    studentId: 'std-sneha-105',
    studentName: 'Sneha R',
    className: 'III CSE - Sec B',
    gapConcept: 'Trigonometric Identities in Calculus Integrals',
    rootCause: 'Memorizes integration templates without unit circle identity reduction.',
    severity: 'High',
    recommendedAction: 'Schedule 1-on-1 TA Session & Assign Unit Circle Intuition module.',
    status: 'Improved',
    assignedDate: '2026-09-21',
  },
  {
    id: 'int-104',
    studentId: 'std-akash-101',
    studentName: 'Akash Sharma',
    className: 'III CSE - Sec A',
    gapConcept: 'SQL Join Cartesian Cross-Products',
    rootCause: 'Misunderstands INNER vs LEFT JOIN predicate evaluation.',
    severity: 'Moderate',
    recommendedAction: 'Assign Relational Join Visualizer & Practice Quiz.',
    status: 'Resolved',
    assignedDate: '2026-09-18',
  },
];

export const teacherService = {
  getClassSummaryStats: () => {
    return {
      totalStudents: 60,
      lowRiskCount: 38,
      mediumRiskCount: 15,
      highRiskCount: 7,
      avgClassMastery: 76,
      avgLearningDebt: 34,
    };
  },
  getInterventions: (): TeacherIntervention[] => {
    return INITIAL_TEACHER_INTERVENTIONS;
  },
  updateInterventionStatus: (id: string, status: TeacherIntervention['status']) => {
    const item = INITIAL_TEACHER_INTERVENTIONS.find((i) => i.id === id);
    if (item) item.status = status;
    return INITIAL_TEACHER_INTERVENTIONS;
  },
};
