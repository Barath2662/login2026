import { create } from 'zustand';

export interface SurvivorProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  college_name: string | null;
  department: string | null;
  roll_no: string | null;
  role: 'student' | 'event_coordinator' | 'junior_attendance' | 'special_user' | 'admin';
  is_active: boolean;
  hasPaidFee?: boolean;
}

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  token: string | null;
  survivor: SurvivorProfile | null;
  setInitialized: (isInitialized: boolean) => void;
  setAuth: (isAuthenticated: boolean, token: string | null) => void;
  setSurvivor: (survivor: SurvivorProfile | null) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isInitialized: false,
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  survivor: null,
  setInitialized: (isInitialized) => set({ isInitialized }),
  setAuth: (isAuthenticated, token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ isAuthenticated, token });
  },
  setSurvivor: (survivor) => set({ survivor }),
  resetAuth: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, token: null, survivor: null });
  },
}));
