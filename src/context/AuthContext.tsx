import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole } from '../types/debt';
import { authApi, type User } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  currentRole: UserRole;
  loginAsRole: (role: UserRole, customName?: string, customEmail?: string) => Promise<void>;
  loginWithCredentials: (email: string, pass: string) => Promise<User>;
  registerUser: (name: string, email: string, pass: string, role: UserRole, department?: string, year?: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const DEFAULT_USERS: Record<UserRole, { email: string; password: string }> = {
  student: { email: 'arun@student.edu', password: 'student123' },
  teacher: { email: 'rajesh@teacher.edu', password: 'teacher123' },
  parent: { email: 'sarah@parent.org', password: 'parent123' },
  admin: { email: 'admin@learndebt.ai', password: 'admin123' }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const current = await authApi.getCurrentUser();
      setUser(current);
      setCurrentRole(current.role as UserRole);
    } catch (e) {
      // Fallback to local stored user
      const stored = localStorage.getItem('learndebt_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setCurrentRole(parsed.role || 'student');
        } catch (err) {}
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('learndebt_token');
      if (token) {
        await refreshUser();
      } else {
        // Auto-login default student demo account if unauthenticated
        try {
          const defaultUser = await authApi.login(DEFAULT_USERS.student);
          setUser(defaultUser);
          setCurrentRole('student');
        } catch (e) {
          console.warn("Backend startup pending...", e);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const loginAsRole = async (role: UserRole, customName?: string, customEmail?: string) => {
    setIsLoading(true);
    try {
      const def = DEFAULT_USERS[role] || DEFAULT_USERS.student;
      const targetEmail = customEmail?.trim() || def.email;
      const pass = def.password;

      try {
        const loggedUser = await authApi.login({ email: targetEmail, password: pass });
        setUser(loggedUser);
        setCurrentRole(role);
      } catch (e) {
        // Register user if demo user not yet created
        const regUser = await authApi.register({
          name: customName || (role.charAt(0).toUpperCase() + role.slice(1) + " Demo"),
          email: targetEmail,
          password: pass,
          role: role,
          department: 'Computer Science',
          year: '3rd Year'
        });
        setUser(regUser);
        setCurrentRole(role);
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithCredentials = async (email: string, pass: string): Promise<User> => {
    const res = await authApi.login({ email, password: pass });
    setUser(res);
    setCurrentRole(res.role as UserRole);
    return res;
  };

  const registerUser = async (
    name: string,
    email: string,
    pass: string,
    role: UserRole,
    department?: string,
    year?: string
  ): Promise<User> => {
    const res = await authApi.register({ name, email, password: pass, role, department, year });
    setUser(res);
    setCurrentRole(res.role as UserRole);
    return res;
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      currentRole,
      loginAsRole,
      loginWithCredentials,
      registerUser,
      logout,
      isLoading,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
