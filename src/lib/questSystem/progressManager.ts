import { 
  PlayerProgress, 
  QuestProgress, 
  Achievement, 
  ThemeType,
  Quest,
  Boss
} from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'rechenblatt-quest-progress';

export class ProgressManager {
  private static instance: ProgressManager;
  private progress: PlayerProgress;

  private constructor() {
    this.progress = this.loadProgress();
  }

  public static getInstance(): ProgressManager {
    if (!ProgressManager.instance) {
      ProgressManager.instance = new ProgressManager();
    }
    return ProgressManager.instance;
  }

  private loadProgress(): PlayerProgress {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }

    // Initialize new progress
    return this.createNewProgress();
  }

  private createNewProgress(): PlayerProgress {
    const themes: ThemeType[] = ['space', 'dino', 'medieval', 'ocean', 'circus'];
    const themeProgress = {} as Record<ThemeType, any>;
    
    themes.forEach(theme => {
      themeProgress[theme] = {
        questsCompleted: 0,
        currentQuest: null,
        totalScore: 0,
        bossesDefeated: []
      };
    });

    return {
      playerId: uuidv4(),
      currentTheme: 'space',
      themes: themeProgress,
      achievements: [],
      statistics: {
        totalScore: 0,
        bestCombo: 0,
        totalBossesDefeated: 0,
        perfectQuests: 0,
        totalProblems: 0
      }
    };
  }

  private saveProgress(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  public getProgress(): PlayerProgress {
    return this.progress;
  }

  public startQuest(quest: Quest): void {
    const questProgress: QuestProgress = {
      questId: quest.id,
      currentNodeIndex: 0,
      nodesCompleted: 0,
      score: 0,
      mistakes: 0,
      startTime: new Date()
    };

    this.progress.themes[quest.theme].currentQuest = questProgress;
    this.saveProgress();
  }

  public updateQuestProgress(
    theme: ThemeType, 
    nodeCompleted: boolean, 
    score: number, 
    mistakes: number = 0
  ): void {
    const themeProgress = this.progress.themes[theme];
    if (!themeProgress.currentQuest) return;

    const quest = themeProgress.currentQuest;
    quest.score += score;
    quest.mistakes += mistakes;

    if (nodeCompleted) {
      quest.nodesCompleted++;
      quest.currentNodeIndex++;
    }

    this.progress.statistics.totalScore += score;
    this.saveProgress();
  }

  public completeQuest(theme: ThemeType, quest: Quest): void {
    const themeProgress = this.progress.themes[theme];
    if (!themeProgress.currentQuest) return;

    themeProgress.currentQuest.endTime = new Date();
    themeProgress.questsCompleted++;
    themeProgress.totalScore += themeProgress.currentQuest.score;

    // Check for perfect quest
    if (themeProgress.currentQuest.mistakes === 0) {
      this.progress.statistics.perfectQuests++;
    }

    // Clear current quest
    themeProgress.currentQuest = null;

    // Check for achievements
    this.checkAchievements();
    
    this.saveProgress();
  }

  public defeatBoss(theme: ThemeType, boss: Boss): void {
    const themeProgress = this.progress.themes[theme];
    
    if (!themeProgress.bossesDefeated.includes(boss.id)) {
      themeProgress.bossesDefeated.push(boss.id);
      this.progress.statistics.totalBossesDefeated++;
    }

    this.checkAchievements();
    this.saveProgress();
  }

  public updateStatistics(updates: Partial<PlayerProgress['statistics']>): void {
    Object.assign(this.progress.statistics, updates);
    
    // Update best combo if necessary
    if (updates.bestCombo && updates.bestCombo > this.progress.statistics.bestCombo) {
      this.progress.statistics.bestCombo = updates.bestCombo;
    }

    this.saveProgress();
  }

  public setCurrentTheme(theme: ThemeType): void {
    this.progress.currentTheme = theme;
    this.saveProgress();
  }

  private checkAchievements(): void {
    const achievements: Achievement[] = [
      {
        id: 'first-quest',
        title: { en: 'First Steps', de: 'Erste Schritte' },
        description: { en: 'Complete your first quest', de: 'Schließe deine erste Quest ab' },
        icon: '🎯',
        category: 'quest',
        requirement: { type: 'quests', value: 1 },
        progress: 0,
        unlocked: false,
        points: 10
      },
      {
        id: 'boss-slayer',
        title: { en: 'Boss Slayer', de: 'Boss-Bezwinger' },
        description: { en: 'Defeat 10 bosses', de: 'Besiege 10 Bosse' },
        icon: '⚔️',
        category: 'combat',
        requirement: { type: 'bosses', value: 10 },
        progress: 0,
        unlocked: false,
        points: 50
      },
      {
        id: 'perfectionist',
        title: { en: 'Perfectionist', de: 'Perfektionist' },
        description: { en: 'Complete 5 quests without mistakes', de: 'Schließe 5 Quests ohne Fehler ab' },
        icon: '⭐',
        category: 'special',
        requirement: { type: 'perfect', value: 5 },
        progress: 0,
        unlocked: false,
        points: 100
      },
      {
        id: 'combo-master',
        title: { en: 'Combo Master', de: 'Combo-Meister' },
        description: { en: 'Achieve a 20x combo', de: 'Erreiche eine 20x Combo' },
        icon: '🔥',
        category: 'combat',
        requirement: { type: 'combo', value: 20 },
        progress: 0,
        unlocked: false,
        points: 75
      },
      {
        id: 'space-explorer',
        title: { en: 'Space Explorer', de: 'Weltraum-Entdecker' },
        description: { en: 'Complete 10 Space quests', de: 'Schließe 10 Weltraum-Quests ab' },
        icon: '🚀',
        category: 'collection',
        requirement: { type: 'quests', value: 10, theme: 'space' },
        progress: 0,
        unlocked: false,
        points: 30
      }
    ];

    achievements.forEach(achievement => {
      const existing = this.progress.achievements.find(a => a.id === achievement.id);
      if (existing?.unlocked) return;

      let progress = 0;
      let unlocked = false;

      switch (achievement.requirement.type) {
        case 'quests':
          if (achievement.requirement.theme) {
            progress = this.progress.themes[achievement.requirement.theme].questsCompleted;
          } else {
            progress = Object.values(this.progress.themes).reduce(
              (sum, theme) => sum + theme.questsCompleted, 0
            );
          }
          break;
        
        case 'bosses':
          progress = this.progress.statistics.totalBossesDefeated;
          break;
        
        case 'perfect':
          progress = this.progress.statistics.perfectQuests;
          break;
        
        case 'combo':
          progress = this.progress.statistics.bestCombo;
          break;
      }

      unlocked = progress >= achievement.requirement.value;
      achievement.progress = progress;
      achievement.unlocked = unlocked;

      if (unlocked && !existing?.unlocked) {
        achievement.unlockedAt = new Date();
      }

      if (existing) {
        Object.assign(existing, achievement);
      } else {
        this.progress.achievements.push(achievement);
      }
    });
  }

  public getUnlockedAchievements(): Achievement[] {
    return this.progress.achievements.filter(a => a.unlocked);
  }

  public getAchievementProgress(): Achievement[] {
    return this.progress.achievements;
  }

  public getTotalAchievementPoints(): number {
    return this.progress.achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);
  }

  public resetProgress(): void {
    this.progress = this.createNewProgress();
    this.saveProgress();
  }

  public exportProgress(): string {
    return btoa(JSON.stringify(this.progress));
  }

  public importProgress(data: string): boolean {
    try {
      const imported = JSON.parse(atob(data));
      // Validate the imported data structure
      if (imported.playerId && imported.themes && imported.achievements) {
        this.progress = imported;
        this.saveProgress();
        return true;
      }
    } catch (error) {
      console.error('Failed to import progress:', error);
    }
    return false;
  }
}