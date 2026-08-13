import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';

interface SurvivorProfile {
  id: string;
  email: string;
  fullName: string;
  college: string | null;
  rollNo: string | null;
  mobileNo: string | null;
  department: string | null;
  idUploadStatus: 'MISSING' | 'UPLOADED';
  hasPaidFee: boolean;
  role: 'USER' | 'ADMIN' | 'MODERATOR' | 'SURVIVOR' | 'GATE_VOLUNTEER';
  registrations: any[];
  squads: any[];
}

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  token: string | null;
  session: Session | null;
  survivor: SurvivorProfile | null;
  setInitialized: (isInitialized: boolean) => void;
  setAuth: (isAuthenticated: boolean, token: string | null) => void;
  setSession: (session: Session | null) => void;
  setSurvivor: (survivor: SurvivorProfile | null) => void;
  updatePaidStatus: () => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isInitialized: false,
  isAuthenticated: false,
  token: null,
  session: null,
  survivor: null,
  setInitialized: (isInitialized) => set({ isInitialized }),
  setAuth: (isAuthenticated, token) => set({ isAuthenticated, token }),
  setSession: (session) => set({ session, token: session?.access_token || null, isAuthenticated: !!session }),
  setSurvivor: (survivor) => set({ survivor }),
  updatePaidStatus: () => set((state) => ({
    survivor: state.survivor ? { ...state.survivor, hasPaidFee: true } : null
  })),
  resetAuth: () => set({ isAuthenticated: false, token: null, session: null, survivor: null }), // Don't reset isInitialized
}));
