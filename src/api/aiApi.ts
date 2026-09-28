import { apiRequest } from './client';

export interface AIHealthResponse {
  status: string;
  model: string;
  geminiConfigured: boolean;
  mongoDBConnected: boolean;
  backendStatus: string;
}

export const aiApi = {
  checkHealth: async (): Promise<AIHealthResponse> => {
    return apiRequest<AIHealthResponse>('/ai/health');
  },

  generateQuestions: async (params: {
    studentId: string;
    subjectId: string;
    conceptId: string;
    difficulty?: string;
    count?: number;
    excludedFingerprints?: string[];
  }) => {
    return apiRequest('/ai/generate-questions', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
};
