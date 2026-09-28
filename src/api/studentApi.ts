import { apiRequest } from './client';

export interface StudentDashboardResponse {
  user: any;
  profile: any;
  overallPerformance: number;
  learningDebt: number;
  riskLevel: string;
  conceptMastery: Record<string, number>;
  recentAssessments: any[];
  debtHistory: any[];
  notifications: any[];
}

export const studentApi = {
  getDashboard: async (studentId: string = 'student_arun'): Promise<StudentDashboardResponse> => {
    return apiRequest<StudentDashboardResponse>(`/student/dashboard?student_id=${studentId}`);
  },

  getAnalytics: async (studentId: string = 'student_arun') => {
    return apiRequest(`/student/analytics?student_id=${studentId}`);
  }
};
