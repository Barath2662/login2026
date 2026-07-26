import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  setAuth: (isAuthenticated: boolean, token: string | null) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  setAuth: (isAuthenticated, token) => set({ isAuthenticated, token }),
  resetAuth: () => set({ isAuthenticated: false, token: null }),
}));
