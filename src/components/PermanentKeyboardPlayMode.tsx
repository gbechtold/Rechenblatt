import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Worksheet, Problem, WorksheetSettings } from '@/types';
import { PersistentMathProblem } from './PersistentMathProblem';
import { ConfirmDialog } from './ConfirmDialog';
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
} from './GameFeatures';

interface PermanentKeyboardPlayModeProps {
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

export const PermanentKeyboardPlayMode: React.FC<PermanentKeyboardPlayModeProps> = ({
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
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showCombo, setShowCombo] = useState(false);
  const startTimeRef = useRef(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const comboTimeoutRef = useRef<NodeJS.Timeout>();
  
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

  // Lock viewport height on mount
  useEffect(() => {
    // Use visualViewport if available for more accurate height
    const height = window.visualViewport?.height || window.innerHeight;
    setViewportHeight(height);
    
    // Keep hidden input focused to maintain keyboard
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Update viewport meta tag to prevent zooming
    let metaViewport = document.querySelector('meta[name="viewport"]');
    const originalContent = metaViewport?.getAttribute('content') || '';
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Listen for visual viewport changes
    const handleViewportChange = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      }
    };
    
    window.visualViewport?.addEventListener('resize', handleViewportChange);
    
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      // Restore body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      // Restore viewport meta tag
      if (metaViewport) {
        metaViewport.setAttribute('content', originalContent);
      }
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

  // Show combo display temporarily
  useEffect(() => {
    if (features.combo >= 3) {
      setShowCombo(true);
      // Clear existing timeout
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
      // Hide after 3 seconds
      comboTimeoutRef.current = setTimeout(() => {
        setShowCombo(false);
      }, 3000);
    } else {
      setShowCombo(false);
    }
    
    return () => {
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
    };
  }, [features.combo]);

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
      
      // Celebrations based on combo - confined to margins
      if (features.combo >= 3) {
        // Left side confetti
        confetti({
          particleCount: Math.min(features.combo * 3, 15),
          spread: 30,
          origin: { x: 0.1, y: 0.3 },
          gravity: 1.5,
          angle: 45
        });
        // Right side confetti
        confetti({
          particleCount: Math.min(features.combo * 3, 15),
          spread: 30,
          origin: { x: 0.9, y: 0.3 },
          gravity: 1.5,
          angle: 135
        });
      }
      
      // Move to next problem after a longer delay to reduce shakiness
      setTimeout(() => {
        setCurrentProblemIndex(prev => prev + 1);
        setIsGoldenProblem(false);
        setShowBossMode(false);
      }, 1500);
    } else {
      onProblemAnswer(currentProblem.id, answer, isCorrect);
    }
  };

  const handleExitAttempt = () => {
    if (problemsCompleted > 0 || currentProblemIndex > 0) {
      setShowExitDialog(true);
    } else {
      onExit();
    }
  };

  const getRecommendedModes = (): RecommendedMode[] => {
    const currentRange = worksheet.settings.numberRange || { min: 1, max: 10 };
    
    return [
      {
        title: 'Nochmal!',
        settings: {
          ...worksheet.settings,
          problemsPerPage: worksheet.problems.length,
        },
        icon: '🔄',
        color: 'bg-blue-500',
        description: 'Gleiche Schwierigkeit'
      },
      {
        title: 'Schwerer',
        settings: {
          ...worksheet.settings,
          numberRange: { min: currentRange.min + 10, max: currentRange.max + 20 },
          problemsPerPage: worksheet.problems.length + 5,
        },
        icon: '📈',
        color: 'bg-green-500',
        description: '+10 Zahlenbereich'
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
        description: 'Alle Rechenarten!'
      }
    ];
  };

  const handleRecommendedMode = (mode: RecommendedMode) => {
    const problems = generateWorksheetProblems(mode.settings);
    onStartNewGame(mode.settings, problems);
  };

  // Swipe handlers
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    
    if (isLeftSwipe) {
      // Go back to previous problem or exit
      if (currentProblemIndex > 0) {
        setCurrentProblemIndex(prev => prev - 1);
      } else {
        setShowExitDialog(true);
      }
    }
  };

  // Use locked viewport height
  const fixedHeight = viewportHeight || window.innerHeight;

  return (
    <div 
      className="fixed inset-0 bg-gray-50 overflow-hidden"
      style={{ 
        height: `${fixedHeight}px`,
        maxHeight: `${fixedHeight}px`,
        touchAction: 'pan-y'
      }}
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Hidden input to keep keyboard always visible */}
      <input
        ref={hiddenInputRef}
        type="number"
        inputMode="numeric"
        className="absolute -top-10 -left-10 opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Fixed Header Zone with integrated combo display */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-2">
        <div className="flex items-center justify-between">
          <button onClick={handleExitAttempt} className="text-xl font-bold">
            Rechenblatt
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 px-2 py-0.5 rounded-full">
              <span className="text-blue-700 font-bold text-sm">{score}</span>
            </div>
            <div className="text-xs text-gray-600">
              {currentProblemIndex}/{worksheet.problems.length}
            </div>
            <button
              onClick={handleExitAttempt}
              className="text-gray-600 text-sm font-semibold"
            >
              Menü
            </button>
          </div>
        </div>
      </div>

      {/* Floating Combo Display - High z-index */}
      <AnimatePresence>
        {showCombo && features.combo >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ 
              top: '120px',
              zIndex: 100 // Very high z-index to avoid collisions
            }}
          >
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-full shadow-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold">Combo x{features.combo}</span>
                <span className="text-2xl">
                  {features.combo >= 10 ? '🔥🔥🔥' : features.combo >= 7 ? '🔥🔥' : '🔥'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content Zone - Fixed position from top */}
      <div className="absolute left-0 right-0 px-4" style={{ 
        top: '80px', // Fixed distance from top
        zIndex: 20 // Below header (50) and popups (30) but above background
      }}>
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={currentProblemIndex}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
              className="w-full max-w-sm mx-auto"
            >
              <div className={`relative ${isGoldenProblem ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-white'} p-6 rounded-xl shadow-lg`} style={{ minHeight: '240px' }}>
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
                <div className="flex justify-center items-center space-x-0.5 mb-4">
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
                
                {/* Math Problem */}
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
              className="w-full max-w-sm mx-auto"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-3xl font-bold mb-3 text-green-600 text-center">
                  Fertig! 🎉
                </h2>
                <div className="text-center mb-6">
                  <p className="text-xl font-bold">{score} Punkte</p>
                  {features.combo > 0 && (
                    <p className="text-sm text-gray-600">
                      Beste Combo: {features.combo}x
                    </p>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {getRecommendedModes().map((mode, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleRecommendedMode(mode)}
                      className={`w-full p-3 ${mode.color} text-white rounded-lg`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{mode.icon}</span>
                          <div className="text-left">
                            <div className="font-semibold text-sm">{mode.title}</div>
                            <div className="text-xs opacity-90">{mode.description}</div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <button
                  onClick={onExit}
                  className="text-gray-600 text-sm underline hover:text-gray-800 block text-center w-full"
                >
                  Beenden
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showExitDialog}
        title="Zum Menü zurückkehren?"
        message={`Du hast ${currentProblemIndex} von ${worksheet.problems.length} Aufgaben gelöst. Möchtest du wirklich zum Menü zurückkehren?`}
        confirmText="Zum Menü"
        cancelText="Weiterspielen"
        onConfirm={onExit}
        onCancel={() => setShowExitDialog(false)}
      />

      {/* Bottom Zone for popups - fixed below main content */}
      <div className="absolute left-0 right-0 px-4 pointer-events-none" style={{ 
        top: '340px', // Fixed position below main content box
        height: '80px',
        zIndex: 30
      }}>
        {showJoke && (
          <div className="bg-blue-100 rounded-lg p-3 shadow-lg pointer-events-auto">
            <MathJoke show={true} />
          </div>
        )}
        {showFact && !showJoke && (
          <div className="bg-purple-100 rounded-lg p-3 shadow-lg pointer-events-auto">
            <MathFact show={true} />
          </div>
        )}
        {features.speedBonus && !showJoke && !showFact && (
          <div className="flex justify-center">
            <SpeedBonusIndicator show={true} />
          </div>
        )}
      </div>
    </div>
  );
};