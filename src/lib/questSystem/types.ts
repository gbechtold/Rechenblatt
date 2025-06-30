export type ThemeType = 'space' | 'dino' | 'medieval' | 'ocean' | 'circus';

export interface LocalizedString {
  en: string;
  de: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  gradient: string;
}

export interface Boss {
  id: string;
  name: LocalizedString;
  health: number;
  timeLimit: number;
  difficulty: number;
  specialMechanics?: {
    doubleDigits?: boolean;
    mixedOperations?: boolean;
    movingTarget?: boolean;
    shieldPhase?: boolean;
  };
  sprite?: string;
}

export interface Challenge {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  problemCount: number;
  difficultyModifier: number;
  specialRules?: {
    timeBonus?: boolean;
    noMistakes?: boolean;
    reverseOrder?: boolean;
  };
}

export interface Reward {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ThemeDictionary {
  theme: ThemeType;
  name: LocalizedString;
  colors: ThemeColors;
  locations: LocalizedString[];
  actions: LocalizedString[];
  challenges: Challenge[];
  miniBosses: Boss[];
  finalBosses: Boss[];
  rewards: Reward[];
  ambientEmojis: string[];
}

export interface QuestNode {
  type: 'intro' | 'challenge' | 'miniBoss' | 'finalBoss' | 'reward';
  name?: LocalizedString;
  problems?: number;
  challenge?: Challenge;
  boss?: Boss;
  completed: boolean;
}

export interface Quest {
  id: string;
  theme: ThemeType;
  number: number;
  title: LocalizedString;
  path: QuestNode[];
  totalProblems: number;
  rewards: Reward[];
  seed: number;
}

export interface QuestProgress {
  questId: string;
  currentNodeIndex: number;
  nodesCompleted: number;
  score: number;
  mistakes: number;
  startTime: Date;
  endTime?: Date;
}

export interface PlayerProgress {
  playerId: string;
  currentTheme: ThemeType;
  themes: Record<ThemeType, {
    questsCompleted: number;
    currentQuest: QuestProgress | null;
    totalScore: number;
    bossesDefeated: string[];
  }>;
  achievements: Achievement[];
  statistics: {
    totalScore: number;
    bestCombo: number;
    totalBossesDefeated: number;
    perfectQuests: number;
    totalProblems: number;
  };
  seasonPass?: SeasonProgress;
}

export interface Achievement {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  category: 'quest' | 'combat' | 'collection' | 'special';
  requirement: {
    type: 'bosses' | 'quests' | 'score' | 'combo' | 'perfect';
    value: number;
    theme?: ThemeType;
  };
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  points: number;
}

export interface SeasonProgress {
  seasonId: string;
  startDate: Date;
  endDate: Date;
  level: number;
  experience: number;
  rewards: string[];
}

export interface ChallengeLink {
  version: string;
  challenger: {
    name: string;
    playerId: string;
  };
  quest: {
    theme: ThemeType;
    number: number;
    title: LocalizedString;
  };
  stats: {
    score: number;
    combo: number;
    time: number;
    perfect: boolean;
  };
  message: string;
  createdAt: Date;
}