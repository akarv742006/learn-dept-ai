import { apiRequest } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  department?: string;
  year?: string;
  avatar?: string;
  linkedStudentId?: string;
  token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  department?: string;
  year?: string;
  linkedStudentId?: string;
}

export const authApi = {
  login: async (credentials: LoginPayload): Promise<User> => {
    const user = await apiRequest<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (user.token) {
      localStorage.setItem('learndebt_token', user.token);
      localStorage.setItem('learndebt_user', JSON.stringify(user));
    }
    return user;
  },

  register: async (payload: RegisterPayload): Promise<User> => {
    const user = await apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (user.token) {
      localStorage.setItem('learndebt_token', user.token);
      localStorage.setItem('learndebt_user', JSON.stringify(user));
    }
    return user;
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest<User>('/auth/me', {
      method: 'GET',
    });
  },

  logout: () => {
    localStorage.removeItem('learndebt_token');
    localStorage.removeItem('learndebt_user');
  }
};
