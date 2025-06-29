export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type Theme = 'space' | 'dino' | 'castle' | 'ocean' | 'circus';
export type UserMode = 'teacher' | 'student';

// Specific operation subtypes based on German notation
// E = Einer (ones), Z = Zehner (tens), ZE = Zweistellig (two-digit), HZE = Hunderterzahl (three-digit)
export type AdditionSubtype = 
  | 'E+E'   // Ones + Ones (1-9)
  | 'Z+E'   // Tens + Ones (10,20,30... + 1-9)
  | 'ZE+E'  // Two-digit + Ones
  | 'ZE+Z'  // Two-digit + Tens
  | 'ZE+ZE' // Two-digit + Two-digit
  | 'HZE+HZE'; // Three-digit + Three-digit

export type SubtractionSubtype = 
  | 'E-E'   // Ones - Ones
  | 'Z-E'   // Tens - Ones
  | 'ZE-E'  // Two-digit - Ones
  | 'ZE-Z'  // Two-digit - Tens
  | 'ZE-ZE' // Two-digit - Two-digit
  | 'HZE-HZE'; // Three-digit - Three-digit

export type MultiplicationSubtype = 
  | 'standard'
  | 'written'  // Written multiplication
  | 'large';   // Large factor multiplication

export type DivisionSubtype = 
  | 'standard'
  | 'long'      // Long division
  | 'remainder'; // Division with remainder

export type OperationSubtype = AdditionSubtype | SubtractionSubtype | MultiplicationSubtype | DivisionSubtype;

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
  operations?: Operation[]; // For multiple operations
  operationSubtypes?: Partial<Record<Operation, OperationSubtype[]>>; // Specific subtypes per operation
  difficulty: Difficulty;
  problemsPerPage: number;
  columns: number;
  showNumbers: boolean;
  showSolutions: boolean;
  carryOver: boolean;
  placeholders: boolean;
  mixedOperations: boolean;
  numberRange: NumberRange;
  multiplicationTables?: number[]; // For specific multiplication tables (1-10)
  columnsPerOperation?: Record<Operation, number>; // Different columns per operation
  pageFormat?: 'A4' | 'Letter'; // PDF format
  suppressTrivial?: boolean; // Suppress trivial problems like 1+1, 0×n
  avoidDuplicates?: boolean; // Avoid repeating problems
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