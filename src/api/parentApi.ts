import { apiRequest } from './client';

export const parentApi = {
  getDashboard: async (parentId: string = 'parent_ramesh', rollNumber?: string, lang: string = 'hi') => {
    let url = `/parent/dashboard?parent_id=${encodeURIComponent(parentId)}&lang=${encodeURIComponent(lang)}`;
    if (rollNumber) {
      url += `&roll_number=${encodeURIComponent(rollNumber)}`;
    }
    return apiRequest(url);
  },

  notifyTeacher: async (payload: { parentName: string; studentName: string; teacherName: string; message: string }) => {
    return apiRequest('/parent/notify-teacher', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};
