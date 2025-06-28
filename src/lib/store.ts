import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserMode, Theme, WorksheetSettings, Worksheet, User } from '@/types';

interface AppState {
  // User
  user: User | null;
  userMode: UserMode;
  setUser: (user: User) => void;
  setUserMode: (mode: UserMode) => void;

  // Settings
  currentTheme: Theme;
  worksheetSettings: WorksheetSettings;
  setTheme: (theme: Theme) => void;
  updateWorksheetSettings: (settings: Partial<WorksheetSettings>) => void;

  // Worksheets
  worksheets: Worksheet[];
  currentWorksheet: Worksheet | null;
  addWorksheet: (worksheet: Worksheet) => void;
  setCurrentWorksheet: (worksheet: Worksheet | null) => void;
  updateWorksheet: (id: string, updates: Partial<Worksheet>) => void;

  // Game state
  isPlaying: boolean;
  currentProblemIndex: number;
  score: number;
  startGame: () => void;
  endGame: () => void;
  nextProblem: () => void;
  updateScore: (points: number) => void;
}

const defaultSettings: WorksheetSettings = {
  theme: 'space',
  operation: 'addition',
  difficulty: 'easy',
  problemsPerPage: 12,
  columns: 2,
  showNumbers: true,
  showSolutions: false,
  carryOver: false,
  placeholders: false,
  mixedOperations: false,
  numberRange: { min: 1, max: 10 },
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      user: null,
      userMode: 'student',
      setUser: (user) => set({ user }),
      setUserMode: (mode) => set({ userMode: mode }),

      // Settings
      currentTheme: 'space',
      worksheetSettings: defaultSettings,
      setTheme: (theme) => set({ currentTheme: theme }),
      updateWorksheetSettings: (settings) =>
        set((state) => ({
          worksheetSettings: { ...state.worksheetSettings, ...settings },
        })),

      // Worksheets
      worksheets: [],
      currentWorksheet: null,
      addWorksheet: (worksheet) =>
        set((state) => ({ worksheets: [...state.worksheets, worksheet] })),
      setCurrentWorksheet: (worksheet) => set({ currentWorksheet: worksheet }),
      updateWorksheet: (id, updates) =>
        set((state) => ({
          worksheets: state.worksheets.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),

      // Game state
      isPlaying: false,
      currentProblemIndex: 0,
      score: 0,
      startGame: () => set({ isPlaying: true, currentProblemIndex: 0, score: 0 }),
      endGame: () => set({ isPlaying: false }),
      nextProblem: () =>
        set((state) => ({ currentProblemIndex: state.currentProblemIndex + 1 })),
      updateScore: (points) =>
        set((state) => ({ score: state.score + points })),
    }),
    {
      name: 'rechenblatt-storage',
    }
  )
);