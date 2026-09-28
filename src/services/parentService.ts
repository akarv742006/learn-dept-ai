import type { ParentOverview } from '../types/debt';
import { INITIAL_STUDENTS_LIST } from './studentService';

export const parentService = {
  getParentOverview: (): ParentOverview => {
    const arun = INITIAL_STUDENTS_LIST.find((s) => s.name === 'Arun Kumar') || INITIAL_STUDENTS_LIST[1];

    return {
      parentId: 'user-prn-301',
      parentName: 'Mr. Kumar',
      child: {
        ...arun,
        overallGrade: 78,
        learningDebtIndex: 42,
        attendanceRate: 91,
        assignmentCompletionRate: 88,
      },
      recentAlert: 'Your child is currently experiencing difficulty with DBMS Normalization fundamentals.',
      recentImprovement: 'Learning Debt reduced from 72 → 42 after completing the Recovery Plan.',
    };
  },
};
