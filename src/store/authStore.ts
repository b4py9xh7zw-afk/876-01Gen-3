import { create } from 'zustand';
import type { User, UserRole } from '../types';
import { mockUsers } from '../mock/data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  loginByUserId: (userId: string, password: string) => Promise<boolean>;
  logout: () => void;
  getDepartmentsByRole: (role: UserRole) => string[];
  getUsersByRoleAndDepartment: (role: UserRole, department: string) => User[];
  searchUsers: (role: UserRole, department: string, keyword: string) => User[];
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (username: string, password: string, role: UserRole) => {
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password && u.role === role
    );
    if (foundUser) {
      set({ user: foundUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
  loginByUserId: async (userId: string, password: string) => {
    const foundUser = mockUsers.find(
      (u) => u.id === userId && u.password === password
    );
    if (foundUser) {
      set({ user: foundUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  getDepartmentsByRole: (role: UserRole) => {
    const departments = mockUsers
      .filter((u) => u.role === role)
      .map((u) => u.department);
    return Array.from(new Set(departments));
  },
  getUsersByRoleAndDepartment: (role: UserRole, department: string) => {
    return mockUsers.filter((u) => u.role === role && u.department === department);
  },
  searchUsers: (role: UserRole, department: string, keyword: string) => {
    const kw = keyword.trim().toLowerCase();
    return mockUsers.filter((u) => {
      if (u.role !== role) return false;
      if (department && u.department !== department) return false;
      if (!kw) return true;
      return (
        u.name.toLowerCase().includes(kw) ||
        u.employeeId.toLowerCase().includes(kw) ||
        u.username.toLowerCase().includes(kw)
      );
    });
  },
}));
