import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Worksheet, Problem, WorksheetSettings } from '@/types';
import { MathProblem } from './MathProblem';
import { useTranslation } from 'next-i18next';
import confetti from 'canvas-confetti';
import { generateWorksheetProblems } from '@/lib/problemGenerator';
import { 
  useGameFeatures, 
  ComboDisplay, 
  SpeedBonusIndicator,
  MathPet,
  MathJoke,
  MathFact,
  HiddenEmoji
} from './GameFeatures';

interface ImprovedMultiStepPlayModeProps {
  worksheet: Worksheet;
  onProblemAnswer: (problemId: string, answer: number, isCorrect: boolean) => void;
  problemsCompleted: number;
  score: number;
  onExit: () => void;
  onStartNewGame: (settings: WorksheetSettings, problems: Problem[]) => void;
}

interface RecommendedMode {
  title: string;
  settings: WorksheetSettings;
  icon: string;
  color: string;
  description: string;
}

export const ImprovedMultiStepPlayMode: React.FC<ImprovedMultiStepPlayModeProps> = ({
  worksheet,
  onProblemAnswer,
  problemsCompleted,
  score,
  onExit,
  onStartNewGame
}) => {
  const { t } = useTranslation('common');
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [showJoke, setShowJoke] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [isGoldenProblem, setIsGoldenProblem] = useState(false);
  const [showBossMode, setShowBossMode] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const startTimeRef = useRef(Date.now());
  
  const {
    features,
    updateCombo,
    checkSpeedBonus,
    addAchievement,
    updateScore,
    evolvePet
  } = useGameFeatures();
  
  const currentProblem = worksheet.problems[currentProblemIndex];
  const isComplete = currentProblemIndex >= worksheet.problems.length;

  // Check for special events
  useEffect(() => {
    // Lucky 7
    if ((currentProblemIndex + 1) % 7 === 0 && currentProblemIndex > 0) {
      setIsGoldenProblem(true);
    }

    // Boss battle every 20 problems
    if ((currentProblemIndex + 1) % 20 === 0 && currentProblemIndex > 0) {
      setShowBossMode(true);
    }

    // Random jokes and facts
    if (Math.random() < 0.1) {
      Math.random() < 0.5 ? setShowJoke(true) : setShowFact(true);
      setTimeout(() => {
        setShowJoke(false);
        setShowFact(false);
      }, 5000);
    }
  }, [currentProblemIndex]);

  // Evolve pet based on performance
  useEffect(() => {
    if (features.perfectStreak >= 10) {
      evolvePet();
      addAchievement('Perfect 10!');
    }
  }, [features.perfectStreak]);

  const handleAnswer = (answer: number, isCorrect: boolean) => {
    startTimeRef.current = Date.now();
    const isSpeed = checkSpeedBonus();
    updateCombo(isCorrect);
    
    if (isCorrect) {
      const basePoints = 10;
      const multiplier = isGoldenProblem ? 5 : (features.combo >= 3 ? 2 : 1);
      const speedBonus = isSpeed ? 5 : 0;
      const totalPoints = (basePoints * multiplier) + speedBonus;
      
      updateScore(totalPoints);
      onProblemAnswer(currentProblem.id, answer, isCorrect);
      
      // Celebrations based on combo
      if (features.combo >= 3) {
        confetti({
          particleCount: features.combo * 10,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      // Move to next problem after a short delay
      setTimeout(() => {
        setCurrentProblemIndex(prev => prev + 1);
        setIsGoldenProblem(false);
        setShowBossMode(false);
      }, 1000);
    } else {
      onProblemAnswer(currentProblem.id, answer, isCorrect);
    }
  };

  const getRecommendedModes = (): RecommendedMode[] => {
    const currentRange = worksheet.settings.numberRange || { min: 1, max: 10 };
    const difficultySpread = currentRange.max - currentRange.min;
    
    return [
      {
        title: 'Similar Challenge',
        settings: {
          ...worksheet.settings,
          problemsPerPage: worksheet.problems.length,
        },
        icon: '🔄',
        color: 'bg-blue-500',
        description: 'Same difficulty, new problems'
      },
      {
        title: 'Level Up!',
        settings: {
          ...worksheet.settings,
          numberRange: { min: currentRange.min + 10, max: currentRange.max + 20 },
          problemsPerPage: worksheet.problems.length + 5,
        },
        icon: '📈',
        color: 'bg-green-500',
        description: 'Slightly harder challenge'
      },
      {
        title: 'Boss Mode',
        settings: {
          ...worksheet.settings,
          numberRange: { min: currentRange.max, max: currentRange.max * 2 },
          operations: ['addition', 'subtraction', 'multiplication', 'division'],
          problemsPerPage: 30,
        },
        icon: '👾',
        color: 'bg-red-500',
        description: 'Ultimate challenge!'
      }
    ];
  };

  const handleRecommendedMode = (mode: RecommendedMode) => {
    const problems = generateWorksheetProblems(mode.settings);
    onStartNewGame(mode.settings, problems);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Fixed Header - No animation to prevent sliding */}
      <div className="bg-white shadow-md z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-blue-700 font-bold text-lg">{score}</span>
            </div>
            <div className="text-sm text-gray-600">
              {currentProblemIndex}/{worksheet.problems.length}
            </div>
          </div>
          <button
            onClick={onExit}
            className="text-red-600 font-semibold text-sm"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Game Features */}
      <ComboDisplay combo={features.combo} />
      <SpeedBonusIndicator show={features.speedBonus} />
      <MathPet level={features.mathPetLevel} />
      <MathJoke show={showJoke} />
      <MathFact show={showFact} />

      {/* Hidden Emojis */}
      <HiddenEmoji 
        emoji="🎯" 
        position={{ x: '10px', y: '50%' }}
        onFound={() => addAchievement('Hidden Treasure!')}
      />

      {/* Main Content - Fixed positioning */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={currentProblemIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
            >
              <div className={`relative ${isGoldenProblem ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : `theme-${worksheet.settings.theme}`} p-6 rounded-2xl shadow-xl`}>
                {isGoldenProblem && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-4 -right-4 text-4xl"
                  >
                    ⭐
                  </motion.div>
                )}
                
                {showBossMode && (
                  <div className="absolute top-2 left-2 text-2xl animate-bounce">
                    👾
                  </div>
                )}

                {/* Progress dots */}
                <div className="flex justify-center items-center space-x-1 mb-4">
                  {worksheet.problems.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={{
                        scale: index === currentProblemIndex ? 1.5 : 1,
                        backgroundColor: 
                          index < currentProblemIndex ? '#10b981' : 
                          index === currentProblemIndex ? '#3b82f6' : 
                          '#d1d5db'
                      }}
                      className="w-1.5 h-1.5 rounded-full"
                    />
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <div className="transform scale-110">
                    <MathProblem
                      problem={currentProblem}
                      showSolution={false}
                      isInteractive={true}
                      onAnswer={handleAnswer}
                      theme={worksheet.settings.theme}
                      index={0}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-4xl font-bold mb-4 text-green-600 text-center">
                  {t('game.complete')}! 🎉
                </h2>
                <div className="text-center mb-6">
                  <p className="text-2xl font-bold">{score} points</p>
                  <p className="text-gray-600">
                    {features.combo > 0 && `Best combo: ${features.combo}x`}
                  </p>
                </div>

                {!showRecommendations ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowRecommendations(true)}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={onExit}
                      className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                    >
                      Back to Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold mb-2">Choose your next challenge:</h3>
                    {getRecommendedModes().map((mode, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleRecommendedMode(mode)}
                        className={`w-full p-4 ${mode.color} text-white rounded-lg hover:shadow-lg transition-all`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{mode.icon}</span>
                            <div className="text-left">
                              <div className="font-semibold">{mode.title}</div>
                              <div className="text-sm opacity-90">{mode.description}</div>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};