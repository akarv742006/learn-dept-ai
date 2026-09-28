import { apiRequest } from './client';

export const teacherApi = {
  getDashboard: async () => {
    return apiRequest('/teacher/dashboard');
  },

  getStudentDetails: async (studentId: string) => {
    return apiRequest(`/teacher/students/${studentId}`);
  }
};
