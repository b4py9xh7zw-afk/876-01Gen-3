import { create } from 'zustand';
import type { User, UserRole } from '../types';
import { mockUsers } from '../mock/data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
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
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
