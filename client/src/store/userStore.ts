import { create } from 'zustand';

interface UserProfile {
  id: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
  hasPaid: boolean;
}

interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
