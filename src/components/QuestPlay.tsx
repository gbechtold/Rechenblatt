import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quest, QuestNode, ThemeType } from '@/lib/questSystem/types';
import { Problem } from '@/types';
import { QuestGenerator } from '@/lib/questSystem/questGenerator';
import { ProgressManager } from '@/lib/questSystem/progressManager';
import { ShareManager } from '@/lib/questSystem/shareManager';
import { themeDictionaries } from '@/lib/questSystem/themeDictionaries';
import { QuestProgress } from './QuestProgress';
import { MobileQuestProgress } from './MobileQuestProgress';
import { BossBattle } from './BossBattle';
import { PersistentMathProblem } from './PersistentMathProblem';
import { QuestCompletionScreen } from './QuestCompletionScreen';
import { ThemeSpecificGameplay } from './ThemeSpecificGameplay';
import { useTranslation } from 'next-i18next';
import confetti from 'canvas-confetti';
import { generateWorksheetProblems } from '@/lib/problemGenerator';
import { WorksheetSettings } from '@/types';

interface QuestPlayProps {
  theme: ThemeType;
  onExit: () => void;
  operationTypes?: string[];
  difficulty?: number;
}

export const QuestPlay: React.FC<QuestPlayProps> = ({
  theme,
  onExit,
  operationTypes = ['addition', 'subtraction'],
  difficulty = 1
}) => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'en' | 'de';
  
  const progressManager = ProgressManager.getInstance();
  const questGenerator = QuestGenerator.getInstance();
  const shareManager = ShareManager.getInstance();
  
  const themeData = themeDictionaries[theme];
  const [quest, setQuest] = useState<Quest | null>(null);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [nodeProgress, setNodeProgress] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionType, setTransitionType] = useState<'node' | 'quest' | 'boss'>('node');
  const [combo, setCombo] = useState(0);
  const [questStats, setQuestStats] = useState({
    score: 0,
    mistakes: 0,
    startTime: Date.now()
  });

  useEffect(() => {
    // Initialize quest
    const themeProgress = progressManager.getProgress().themes[theme];
    const questNumber = themeProgress.questsCompleted + 1;
    const newQuest = questGenerator.generateQuest(theme, questNumber);
    setQuest(newQuest);
    progressManager.startQuest(newQuest);
  }, [theme]);

  // Check if current node needs automatic completion (like reward nodes)
  useEffect(() => {
    if (quest && !showTransition) {
      const currentNode = quest.path[currentNodeIndex];
      
      // Auto-advance to reward nodes
      if (currentNode?.type === 'reward') {
        setTimeout(() => {
          // No problems to complete, show reward screen immediately
          checkNodeCompletion();
        }, 500);
      }
    }
  }, [currentNodeIndex, quest, showTransition]);

  const generateMathProblem = (): Problem => {
    const settings: WorksheetSettings = {
      theme: theme as any, // Use quest theme
      difficulty: difficulty === 1 ? 'easy' : difficulty === 2 ? 'medium' : 'hard',
      operation: operationTypes[0] as any, // Primary operation
      operations: operationTypes as any[],
      mixedOperations: operationTypes.length > 1,
      problemsPerPage: 1,
      avoidDuplicates: true,
      columns: 1,
      showNumbers: true,
      showSolutions: false,
      carryOver: false,
      placeholders: false,
      numberRange: { min: 1, max: difficulty === 1 ? 20 : difficulty === 2 ? 50 : 100 }
    };
    
    const problems = generateWorksheetProblems(settings);
    return problems[0];
  };

  const handleProblemAnswer = (answer: number, isCorrect: boolean) => {
    if (isCorrect) {
      setCombo(prev => prev + 1);
      const score = 10 * (1 + combo * 0.1); // Combo multiplier
      setQuestStats(prev => ({ ...prev, score: prev.score + score }));
      setNodeProgress(prev => prev + 1);
      
      progressManager.updateQuestProgress(theme, false, score, 0);
      progressManager.updateStatistics({ 
        totalProblems: progressManager.getProgress().statistics.totalProblems + 1,
        bestCombo: Math.max(combo + 1, progressManager.getProgress().statistics.bestCombo)
      });
    } else {
      setCombo(0);
      setQuestStats(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
      progressManager.updateQuestProgress(theme, false, 0, 1);
    }

    checkNodeCompletion();
  };

  const checkNodeCompletion = () => {
    if (!quest) return;
    
    const currentNode = quest.path[currentNodeIndex];
    const requiredProblems = currentNode.problems || 0;
    
    // For reward nodes or other nodes without problems, complete immediately
    if (requiredProblems === 0 || nodeProgress + 1 >= requiredProblems) {
      // Node completed
      progressManager.updateQuestProgress(theme, true, 0, 0);
      
      if (currentNodeIndex === quest.path.length - 1) {
        // Quest completed
        completeQuest();
      } else {
        // Move to next node
        showNodeTransition();
      }
    }
  };

  const showNodeTransition = () => {
    setTransitionType('node');
    setShowTransition(true);
    
    setTimeout(() => {
      setCurrentNodeIndex(prev => prev + 1);
      setNodeProgress(0);
      setShowTransition(false);
    }, 2000);
  };

  const completeQuest = () => {
    if (!quest) return;
    
    progressManager.completeQuest(theme, quest);
    setTransitionType('quest');
    setShowTransition(true);
    
    // Celebration
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 },
      colors: [themeData.colors.primary, themeData.colors.secondary, themeData.colors.accent]
    });
  };

  const handleBossProblemAnswer = (isCorrect: boolean) => {
    handleProblemAnswer(0, isCorrect); // Answer value not used for boss battles
  };

  const handleBossComplete = (success: boolean) => {
    if (!quest) return;
    
    const currentNode = quest.path[currentNodeIndex];
    if (success && currentNode.boss) {
      progressManager.defeatBoss(theme, currentNode.boss);
      setCombo(prev => prev + 10); // Big combo boost for boss defeat
      setQuestStats(prev => ({ ...prev, score: prev.score + 500 })); // Boss bonus
    }
    
    checkNodeCompletion();
  };

  const handleShare = () => {
    if (!quest) return;
    
    const stats = {
      score: questStats.score,
      combo: progressManager.getProgress().statistics.bestCombo,
      time: Math.floor((Date.now() - questStats.startTime) / 1000),
      perfect: questStats.mistakes === 0
    };
    
    const challengeLink = shareManager.createChallengeLink(
      progressManager.getProgress(),
      quest,
      stats
    );
    
    // Show share dialog
    const message = `I just completed ${quest.title[lang]}! Score: ${stats.score} | Best Combo: ${stats.combo}x`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Rechenblatt Quest Challenge',
        text: message,
        url: challengeLink
      });
    } else {
      shareManager.shareVia('copy', challengeLink, message);
    }
  };

  if (!quest) return null;

  const currentNode = quest.path[currentNodeIndex];

  return (
    <div 
      className="fixed inset-0 flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${themeData.colors.background}, ${themeData.colors.primary})`
      }}
    >
      {/* Quest Progress Bar - Mobile optimized with padding from menu button */}
      <div className="flex-shrink-0">
        <div className="relative">
          <MobileQuestProgress
            quest={quest}
            currentNodeIndex={currentNodeIndex}
            themeColors={themeData.colors}
            isPlaying={!showTransition && currentNode.type !== 'reward'}
          />
          {/* Exit Button - Positioned over progress bar */}
          <button
            onClick={onExit}
            className="absolute top-2 right-2 z-30 px-3 py-1.5 min-w-[64px] min-h-[36px] bg-gray-700/80 text-white text-sm rounded-lg hover:bg-gray-600/80 transition-colors flex items-center justify-center"
          >
            {t('menu', 'Menu')}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {showTransition ? (
          <motion.div
            key="transition"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, ${themeData.colors.accent}40, transparent)`
            }}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-8xl mb-4"
              >
                {transitionType === 'quest' ? '🏆' : currentNode.type === 'reward' ? '🎁' : '✨'}
              </motion.div>
              <h2 className="text-4xl font-bold text-white">
                {transitionType === 'quest' 
                  ? t('quest.completed', 'Quest Completed!')
                  : t('quest.nodeCompleted', 'Stage Completed!')
                }
              </h2>
            </div>
          </motion.div>
        ) : currentNode.type === 'miniBoss' || currentNode.type === 'finalBoss' ? (
          <BossBattle
            key={`boss-${currentNodeIndex}`}
            boss={currentNode.boss!}
            themeColors={themeData.colors}
            onComplete={handleBossComplete}
            onProblemAnswer={handleBossProblemAnswer}
            generateProblem={generateMathProblem}
          />
        ) : currentNode.type === 'reward' ? (
          <QuestCompletionScreen
            quest={quest}
            themeColors={themeData.colors}
            stats={{
              score: questStats.score,
              combo: progressManager.getProgress().statistics.bestCombo,
              mistakes: questStats.mistakes,
              time: Math.floor((Date.now() - questStats.startTime) / 1000)
            }}
            onShare={handleShare}
            onNextQuest={() => {
              const nextQuest = questGenerator.generateQuest(theme, quest.number + 1);
              setQuest(nextQuest);
              setCurrentNodeIndex(0);
              setNodeProgress(0);
              setShowTransition(false);
              setQuestStats({ score: 0, mistakes: 0, startTime: Date.now() });
              setCombo(0);
              progressManager.startQuest(nextQuest);
            }}
            onBackToSelection={onExit}
          />
        ) : (
          <motion.div
            key={`node-${currentNodeIndex}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Fixed top section with problem and info */}
            <div className="flex-shrink-0 px-4 pt-4 pb-2">
              {/* Node Header */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white mb-1">
                  {currentNode.name?.[lang] || 'Challenge'}
                </h2>
                <p className="text-sm text-white/80">
                  {t('quest.progress', 'Problem {{current}} of {{total}}', {
                    current: nodeProgress + 1,
                    total: currentNode.problems || 1
                  })}
                </p>
              </div>

              {/* Themed Gameplay Card - Always at top */}
              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-2xl">
                <ThemeSpecificGameplay
                  theme={theme}
                  challenge={currentNode.challenge}
                  problem={generateMathProblem()}
                  onAnswer={handleProblemAnswer}
                  themeColors={themeData.colors}
                  nodeProgress={nodeProgress}
                  totalProblems={currentNode.problems || 1}
                />
              </div>
            </div>

            {/* Combo Display - Fixed position in top right */}
            <AnimatePresence>
              {combo > 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="absolute top-20 right-4 bg-yellow-400/90 text-gray-900 px-3 py-1.5 rounded-full shadow-lg"
                >
                  <p className="text-lg font-bold">
                    {combo}x {t('combo', 'COMBO')}!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spacer to push content up when keyboard is visible */}
            <div className="flex-1" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};