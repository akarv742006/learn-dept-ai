import { apiRequest } from './client';

export interface DatabaseStatusResponse {
  status: string;
  isAtlas?: boolean;
  maskedUri?: string;
  databaseName: string;
  envFile?: string;
  collections: Record<string, number>;
  totalLoginsRegistered?: number;
  userLogins?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    lastLoginAt: string;
  }>;
}

export const adminApi = {
  getDashboard: async () => {
    return apiRequest('/admin/dashboard');
  },

  getDatabaseStatus: async (): Promise<DatabaseStatusResponse> => {
    return apiRequest<DatabaseStatusResponse>('/admin/database-status');
  },

  seedDatabase: async () => {
    return apiRequest<{ success: boolean; message: string }>('/admin/seed', {
      method: 'POST'
    });
  },

  connectMongoDB: async (mongodbUri: string, databaseName: string = 'learndebt') => {
    return apiRequest<{
      success: boolean;
      message: string;
      isAtlas: boolean;
      maskedUri: string;
      databaseName: string;
    }>('/admin/database/connect', {
      method: 'POST',
      body: JSON.stringify({ mongodbUri, databaseName })
    });
  }
};
