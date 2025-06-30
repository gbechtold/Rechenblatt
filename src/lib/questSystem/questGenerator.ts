import { Quest, QuestNode, ThemeType, LocalizedString, Challenge, Boss, Reward } from './types';
import { themeDictionaries } from './themeDictionaries';
import { SeededRandom } from './seededRandom';

export class QuestGenerator {
  private static instance: QuestGenerator;

  private constructor() {}

  public static getInstance(): QuestGenerator {
    if (!QuestGenerator.instance) {
      QuestGenerator.instance = new QuestGenerator();
    }
    return QuestGenerator.instance;
  }

  public generateQuest(theme: ThemeType, questNumber: number): Quest {
    const dictionary = themeDictionaries[theme];
    const seed = this.generateSeed(theme, questNumber);
    const rng = new SeededRandom(seed);

    // Generate quest structure based on quest number patterns
    const structure = this.generateQuestStructure(questNumber, rng);
    
    // Generate localized title
    const title = this.generateTitle(dictionary, rng);
    
    // Build quest path
    const path = this.buildQuestPath(dictionary, structure, rng);
    
    // Select rewards
    const rewards = this.selectRewards(dictionary, questNumber, rng);

    return {
      id: `${theme}-quest-${questNumber}`,
      theme,
      number: questNumber,
      title,
      path,
      totalProblems: path.reduce((sum, node) => sum + (node.problems || 0), 0),
      rewards,
      seed
    };
  }

  private generateSeed(theme: ThemeType, questNumber: number): number {
    // Create a deterministic seed based on theme and quest number
    const themeSeeds: Record<ThemeType, number> = {
      space: 1000,
      dino: 2000,
      medieval: 3000,
      ocean: 4000,
      circus: 5000
    };
    
    return themeSeeds[theme] + questNumber * 137; // 137 is a prime number for better distribution
  }

  private generateQuestStructure(questNumber: number, rng: SeededRandom): string[] {
    // Different quest structures based on quest progression
    const structures = [
      ['intro', 'challenge', 'miniBoss', 'reward'],
      ['intro', 'challenge', 'challenge', 'miniBoss', 'reward'],
      ['intro', 'challenge', 'miniBoss', 'challenge', 'finalBoss', 'reward'],
      ['intro', 'challenge', 'challenge', 'miniBoss', 'challenge', 'finalBoss', 'reward']
    ];

    // Quest complexity increases with number
    const complexity = Math.min(Math.floor(questNumber / 10), structures.length - 1);
    
    // Add variation every 5 quests
    if (questNumber % 5 === 0) {
      return structures[structures.length - 1]; // Always use most complex for milestone quests
    }
    
    return rng.pick(structures.slice(0, complexity + 1));
  }

  private generateTitle(dictionary: typeof themeDictionaries.space, rng: SeededRandom): LocalizedString {
    const action = rng.pick(dictionary.actions);
    const location = rng.pick(dictionary.locations);
    
    return {
      en: `${action.en} the ${location.en}`,
      de: `${action.de} ${location.de}`
    };
  }

  private buildQuestPath(
    dictionary: typeof themeDictionaries.space,
    structure: string[],
    rng: SeededRandom
  ): QuestNode[] {
    const path: QuestNode[] = [];
    const usedChallenges = new Set<string>();
    const usedBosses = new Set<string>();

    for (const nodeType of structure) {
      switch (nodeType) {
        case 'intro':
          path.push({
            type: 'intro',
            name: { 
              en: 'Prepare for Adventure', 
              de: 'Bereite dich auf das Abenteuer vor' 
            },
            problems: 5,
            completed: false
          });
          break;

        case 'challenge':
          const availableChallenges = dictionary.challenges.filter(c => !usedChallenges.has(c.id));
          if (availableChallenges.length > 0) {
            const challenge = rng.pick(availableChallenges);
            usedChallenges.add(challenge.id);
            path.push({
              type: 'challenge',
              name: challenge.name,
              challenge,
              problems: challenge.problemCount,
              completed: false
            });
          }
          break;

        case 'miniBoss':
          const availableMiniBosses = dictionary.miniBosses.filter(b => !usedBosses.has(b.id));
          if (availableMiniBosses.length > 0) {
            const boss = rng.pick(availableMiniBosses);
            usedBosses.add(boss.id);
            path.push({
              type: 'miniBoss',
              name: boss.name,
              boss,
              completed: false
            });
          }
          break;

        case 'finalBoss':
          const availableFinalBosses = dictionary.finalBosses.filter(b => !usedBosses.has(b.id));
          if (availableFinalBosses.length > 0) {
            const boss = rng.pick(availableFinalBosses);
            usedBosses.add(boss.id);
            path.push({
              type: 'finalBoss',
              name: boss.name,
              boss,
              completed: false
            });
          }
          break;

        case 'reward':
          path.push({
            type: 'reward',
            name: { 
              en: 'Claim Your Rewards!', 
              de: 'Hole deine Belohnungen ab!' 
            },
            completed: false
          });
          break;
      }
    }

    return path;
  }

  private selectRewards(
    dictionary: typeof themeDictionaries.space,
    questNumber: number,
    rng: SeededRandom
  ): typeof dictionary.rewards {
    // Higher quest numbers have better rewards
    const rewardCount = Math.min(1 + Math.floor(questNumber / 20), 3);
    
    // Weight rewards by rarity
    const weightedRewards = dictionary.rewards.map(reward => ({
      item: reward,
      weight: {
        common: 100,
        rare: 50,
        epic: 20,
        legendary: 5
      }[reward.rarity]
    }));

    const selectedRewards: Reward[] = [];
    for (let i = 0; i < rewardCount; i++) {
      const reward = rng.weighted(weightedRewards);
      if (!selectedRewards.find(r => r.id === reward.id)) {
        selectedRewards.push(reward);
      }
    }

    return selectedRewards;
  }

  // Get a preview of upcoming quests
  public getQuestPreview(theme: ThemeType, startNumber: number, count: number): Quest[] {
    const quests: Quest[] = [];
    for (let i = 0; i < count; i++) {
      quests.push(this.generateQuest(theme, startNumber + i));
    }
    return quests;
  }

  // Check if a quest is a special milestone quest
  public isSpecialQuest(questNumber: number): boolean {
    return questNumber % 10 === 0 || questNumber % 25 === 0;
  }

  // Get special quest bonuses
  public getQuestBonuses(questNumber: number): { scoreMultiplier: number; specialReward: boolean } {
    if (questNumber % 25 === 0) {
      return { scoreMultiplier: 2.0, specialReward: true };
    } else if (questNumber % 10 === 0) {
      return { scoreMultiplier: 1.5, specialReward: true };
    } else if (questNumber % 5 === 0) {
      return { scoreMultiplier: 1.2, specialReward: false };
    }
    return { scoreMultiplier: 1.0, specialReward: false };
  }
}