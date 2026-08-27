import { create } from 'zustand';

export interface UserProfile {
  id: number;
  login_id: string | null;
  name: string;
  fullName?: string;
  email: string;
  phone: string | null;
  college_name: string | null;
  department: string | null;
  roll_no: string | null;
  role: 'student' | 'event_coordinator' | 'junior_attendance' | 'special_user' | 'admin' | 'super_admin' | 'admin_power';
  user_type: 'PARTICIPANT' | 'ALUMNI' | 'STAFF';
  student_id_code?: string | null;
  must_change_password?: boolean;
  is_active: boolean;
  hasPaidFee?: boolean;
  registrations?: any[];
  accommodation_required?: boolean;
}

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
  survivor: UserProfile | null;
  setInitialized: (isInitialized: boolean) => void;
  setAuth: (isAuthenticated: boolean, token: string | null, user?: UserProfile | null) => void;
  setUser: (user: UserProfile | null) => void;
  setSurvivor: (user: UserProfile | null) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isInitialized: false,
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  user: null,
  survivor: null,
  setInitialized: (isInitialized) => set({ isInitialized }),
  setAuth: (isAuthenticated, token, user = null) => {
    const safeUser = user ? {
      ...user,
      role: String(user.role || 'student').toLowerCase(),
    } : null;

    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ isAuthenticated, token, user: safeUser, survivor: safeUser });
  },
  setUser: (user) => set({ user, survivor: user }),
  setSurvivor: (survivor) => set({ user: survivor, survivor }),
  resetAuth: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, token: null, user: null, survivor: null });
  },
}));
