import { create } from 'zustand';

type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  reduceMotion: boolean;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  toggleReduceMotion: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark',
  reduceMotion: false,
  setTheme: (mode) => set({ mode }),
  toggleTheme: () => set((state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' })),
  toggleReduceMotion: () => set((state) => ({ reduceMotion: !state.reduceMotion })),
}));
