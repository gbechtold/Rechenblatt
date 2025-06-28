export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type Theme = 'space' | 'dino' | 'castle' | 'ocean' | 'circus';
export type UserMode = 'teacher' | 'student';

export interface NumberRange {
  min: number;
  max: number;
}

export interface Problem {
  id: string;
  operand1: number;
  operand2: number;
  operation: Operation;
  answer: number;
  placeholder?: 'operand1' | 'operand2' | 'answer';
  userAnswer?: number;
  isCorrect?: boolean;
}

export interface WorksheetSettings {
  theme: Theme;
  operation: Operation;
  difficulty: Difficulty;
  problemsPerPage: number;
  columns: number;
  showNumbers: boolean;
  showSolutions: boolean;
  carryOver: boolean;
  placeholders: boolean;
  mixedOperations: boolean;
  numberRange: NumberRange;
}

export interface Worksheet {
  id: string;
  title: string;
  settings: WorksheetSettings;
  problems: Problem[];
  createdAt: Date;
  completedAt?: Date;
  score?: number;
}

export interface User {
  id: string;
  name: string;
  mode: UserMode;
  classId?: string;
  achievements?: Achievement[];
  progress?: Progress[];
}

export interface Achievement {
  id: string;
  type: string;
  earnedAt: Date;
  details: any;
}

export interface Progress {
  worksheetId: string;
  completedAt: Date;
  score: number;
  timeSpent: number;
}

export interface ThemeAssets {
  background: string;
  decorations: string[];
  sounds?: {
    correct: string;
    incorrect: string;
    complete: string;
  };
  animations?: {
    correct: string;
    incorrect: string;
  };
}