import type { User, UserRole } from '../types/debt';

export const DEMO_USERS: Record<UserRole, User> = {
  student: {
    id: 'user-std-101',
    name: 'Akash Sharma',
    email: 'akash.sharma@learndebt.ai',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    institution: 'Delhi Technological University',
    department: 'Computer Science (B.Tech 3rd Year)',
  },
  teacher: {
    id: 'user-tch-201',
    name: 'Ms. Priya Sharma',
    email: 'priya.sharma@learndebt.ai',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    institution: 'Delhi Technological University',
    department: 'Computer Science & Engineering',
  },
  parent: {
    id: 'parent_ramesh',
    name: 'Ramesh Sharma',
    email: 'ramesh.sharma@parent.org',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    childStudentId: 'student_arun',
  },
  admin: {
    id: 'user-adm-401',
    name: 'Prof. Suresh Nair',
    email: 'suresh.nair@learndebt.ai',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    institution: 'Central Academic Administration Board',
  },
};

export const authService = {
  login: async (_email: string, role: UserRole): Promise<User> => {
    return DEMO_USERS[role] || DEMO_USERS.student;
  },
  getDemoUser: (role: UserRole): User => {
    return DEMO_USERS[role];
  },
  logout: async (): Promise<void> => {
    return Promise.resolve();
  },
};
