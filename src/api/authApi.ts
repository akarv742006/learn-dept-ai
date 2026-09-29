import { apiRequest } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  college?: string;
  department?: string;
  year?: string;
  avatar?: string;
  linkedStudentId?: string;
  parentName?: string;
  parentPhone?: string;
  parentId?: string;
  studentName?: string;
  childName?: string;
  childRollNo?: string;
  phone?: string;
  token?: string;
  is_premium?: boolean;
  plan?: string;
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
  college?: string;
  department?: string;
  year?: string;
  phone?: string;
  linkedStudentId?: string;
  parentName?: string;
  parentPhone?: string;
  parentPin?: string;
}

export interface CollegeStaffMember {
  id: string;
  name: string;
  email: string;
  college: string;
  department: string;
  designation: string;
  phone: string;
  whatsapp: string;
  officeHours: string;
  avatar: string;
  courses: string[];
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

  getCollegeStaff: async (college: string = 'Anna University'): Promise<{ success: boolean; staff: CollegeStaffMember[] }> => {
    return apiRequest<{ success: boolean; staff: CollegeStaffMember[] }>(`/auth/college-staff?college=${encodeURIComponent(college)}`, {
      method: 'GET',
    });
  },

  getCollegeStudents: async (college: string = 'Anna University'): Promise<{ success: boolean; students: any[] }> => {
    return apiRequest<{ success: boolean; students: any[] }>(`/auth/college-students?college=${encodeURIComponent(college)}`, {
      method: 'GET',
    });
  },

  logout: () => {
    localStorage.removeItem('learndebt_token');
    localStorage.removeItem('learndebt_user');
  }
};
