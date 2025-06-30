import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Worksheet, Problem, WorksheetSettings } from '@/types';
import { PersistentMathProblem } from './PersistentMathProblem';
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

interface MobileOptimizedPlayModeProps {
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

export const MobileOptimizedPlayMode: React.FC<MobileOptimizedPlayModeProps> = ({
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const startTimeRef = useRef(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  
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

  // Detect keyboard height on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const keyboardH = window.innerHeight - window.visualViewport.height;
        setKeyboardHeight(keyboardH);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

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
          origin: { y: 0.3 }
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
    
    return [
      {
        title: 'Same Level',
        settings: {
          ...worksheet.settings,
          problemsPerPage: worksheet.problems.length,
        },
        icon: '🔄',
        color: 'bg-blue-500',
        description: 'Try again'
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
        description: 'Harder'
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
        description: 'Expert'
      }
    ];
  };

  const handleRecommendedMode = (mode: RecommendedMode) => {
    const problems = generateWorksheetProblems(mode.settings);
    onStartNewGame(mode.settings, problems);
  };

  // Calculate available height for content
  const availableHeight = `calc(${window.innerHeight}px - ${keyboardHeight}px - 60px)`;

  return (
    <div className="fixed inset-0 bg-gray-50" ref={containerRef}>
      {/* Compact Header */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 px-2 py-0.5 rounded-full">
              <span className="text-blue-700 font-bold text-sm">{score}</span>
            </div>
            <div className="text-xs text-gray-600">
              {currentProblemIndex}/{worksheet.problems.length}
            </div>
          </div>
          <button
            onClick={onExit}
            className="text-red-600 text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Game Features - Positioned absolutely */}
      <div className="absolute top-12 right-2 z-40">
        <ComboDisplay combo={features.combo} />
      </div>
      
      {/* Main Content - Centered in visible area */}
      <div 
        className="absolute inset-0 flex items-center justify-center px-4"
        style={{ 
          top: '60px',
          height: availableHeight,
          paddingBottom: '20px'
        }}
      >
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={currentProblemIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-sm"
            >
              <div className={`relative ${isGoldenProblem ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-white'} p-4 rounded-xl shadow-lg`}>
                {isGoldenProblem && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-3 -right-3 text-2xl"
                  >
                    ⭐
                  </motion.div>
                )}
                
                {/* Compact Progress dots */}
                <div className="flex justify-center items-center space-x-0.5 mb-3">
                  {worksheet.problems.map((_, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-300 ${
                        index < currentProblemIndex
                          ? 'w-1.5 h-1.5 bg-green-500 rounded-full'
                          : index === currentProblemIndex
                          ? 'w-2 h-2 bg-blue-500 rounded-full'
                          : 'w-1 h-1 bg-gray-300 rounded-full'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Math Problem - No scaling needed on mobile */}
                <PersistentMathProblem
                  problem={currentProblem}
                  showSolution={false}
                  isInteractive={true}
                  onAnswer={handleAnswer}
                  theme={worksheet.settings.theme}
                  index={0}
                  keepKeyboardVisible={true}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-3xl font-bold mb-3 text-green-600 text-center">
                  Complete! 🎉
                </h2>
                <div className="text-center mb-4">
                  <p className="text-xl font-bold">{score} points</p>
                  {features.combo > 0 && (
                    <p className="text-sm text-gray-600">
                      Best combo: {features.combo}x
                    </p>
                  )}
                </div>

                {!showRecommendations ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowRecommendations(true)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
                    >
                      Continue
                    </button>
                    <button
                      onClick={onExit}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                    >
                      Exit
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getRecommendedModes().map((mode, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleRecommendedMode(mode)}
                        className={`w-full p-3 ${mode.color} text-white rounded-lg flex items-center justify-between`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{mode.icon}</span>
                          <div className="text-left">
                            <div className="font-semibold text-sm">{mode.title}</div>
                            <div className="text-xs opacity-90">{mode.description}</div>
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

      {/* Hidden features for discovery */}
      <MathJoke show={showJoke} />
      <MathFact show={showFact} />
      <SpeedBonusIndicator show={features.speedBonus} />
    </div>
  );
};