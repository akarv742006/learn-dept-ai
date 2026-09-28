import { apiRequest } from './client';

export const parentApi = {
  getDashboard: async (parentId: string = 'parent_sarah') => {
    return apiRequest(`/parent/dashboard?parent_id=${parentId}`);
  }
};
