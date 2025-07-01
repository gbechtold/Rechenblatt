import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeType, Challenge } from '@/lib/questSystem/types';
import { PersistentMathProblem } from './PersistentMathProblem';
import { Problem } from '@/types';

interface ThemeSpecificGameplayProps {
  theme: ThemeType;
  challenge?: Challenge;
  problem: Problem;
  onAnswer: (answer: number, isCorrect: boolean) => void;
  themeColors: any;
  nodeProgress: number;
  totalProblems: number;
}

export const ThemeSpecificGameplay: React.FC<ThemeSpecificGameplayProps> = ({
  theme,
  challenge,
  problem,
  onAnswer,
  themeColors,
  nodeProgress,
  totalProblems
}) => {
  const [gameState, setGameState] = useState<any>({});
  const [specialEffect, setSpecialEffect] = useState<string | null>(null);

  // Theme-specific game mechanics
  const getThemeMechanics = () => {
    switch (theme) {
      case 'space':
        return {
          name: 'Fuel Management',
          description: 'Each correct answer adds rocket fuel ⛽',
          visualEffect: 'rocket-boost',
          mechanic: 'fuel-system'
        };
      
      case 'dino':
        return {
          name: 'Fossil Discovery',
          description: 'Dig up fossils with correct answers 🦴',
          visualEffect: 'dig-animation',
          mechanic: 'fossil-collection'
        };
      
      case 'medieval':
        return {
          name: 'Castle Defense',
          description: 'Protect the castle with accurate calculations 🏰',
          visualEffect: 'shield-glow',
          mechanic: 'tower-defense'
        };
      
      case 'ocean':
        return {
          name: 'Underwater Navigation',
          description: 'Navigate through ocean currents 🌊',
          visualEffect: 'wave-motion',
          mechanic: 'depth-system'
        };
      
      case 'circus':
        return {
          name: 'Performance Show',
          description: 'Wow the audience with perfect timing! 🎪',
          visualEffect: 'spotlight',
          mechanic: 'applause-meter'
        };
      
      default:
        return {
          name: 'Standard Mode',
          description: 'Solve problems to progress',
          visualEffect: 'standard',
          mechanic: 'basic'
        };
    }
  };

  const mechanics = getThemeMechanics();

  // Special effects based on challenge rules
  useEffect(() => {
    if (challenge?.specialRules) {
      if (challenge.specialRules.timeBonus) {
        setSpecialEffect('time-pressure');
      }
      if (challenge.specialRules.reverseOrder) {
        setSpecialEffect('reverse-mode');
      }
      if (challenge.specialRules.noMistakes) {
        setSpecialEffect('perfect-mode');
      }
    }
  }, [challenge]);

  const handleAnswer = (answer: number, isCorrect: boolean) => {
    // Apply theme-specific scoring and effects
    const themeBonusScore = applyThemeBonus(isCorrect);
    
    // Trigger theme-specific animations
    if (isCorrect) {
      triggerThemeSuccess();
    } else {
      triggerThemeFailure();
    }

    onAnswer(answer, isCorrect);
  };

  const applyThemeBonus = (isCorrect: boolean): number => {
    if (!isCorrect) return 0;
    
    switch (theme) {
      case 'space':
        // Fuel efficiency bonus
        return nodeProgress >= 3 ? 5 : 0;
      
      case 'dino':
        // Fossil discovery bonus
        return Math.random() < 0.3 ? 10 : 0; // 30% chance for rare fossil
      
      case 'medieval':
        // Honor bonus for consistency
        return nodeProgress >= 5 ? 8 : 0;
      
      case 'ocean':
        // Depth exploration bonus
        return Math.floor(nodeProgress / 2) * 2;
      
      case 'circus':
        // Performance bonus for speed
        return 15; // Always bonus for circus flair
      
      default:
        return 0;
    }
  };

  const triggerThemeSuccess = () => {
    switch (theme) {
      case 'space':
        setSpecialEffect('rocket-boost');
        setTimeout(() => setSpecialEffect(null), 1000);
        break;
      
      case 'dino':
        setSpecialEffect('fossil-found');
        setTimeout(() => setSpecialEffect(null), 1200);
        break;
      
      case 'medieval':
        setSpecialEffect('sword-clash');
        setTimeout(() => setSpecialEffect(null), 800);
        break;
      
      case 'ocean':
        setSpecialEffect('bubble-burst');
        setTimeout(() => setSpecialEffect(null), 1000);
        break;
      
      case 'circus':
        setSpecialEffect('applause');
        setTimeout(() => setSpecialEffect(null), 1500);
        break;
    }
  };

  const triggerThemeFailure = () => {
    switch (theme) {
      case 'space':
        setSpecialEffect('system-error');
        break;
      
      case 'dino':
        setSpecialEffect('dig-miss');
        break;
      
      case 'medieval':
        setSpecialEffect('shield-crack');
        break;
      
      case 'ocean':
        setSpecialEffect('current-drift');
        break;
      
      case 'circus':
        setSpecialEffect('crowd-disappointment');
        break;
    }
    setTimeout(() => setSpecialEffect(null), 800);
  };

  const renderThemeBackground = () => {
    const baseClass = "absolute inset-0 pointer-events-none";
    
    switch (theme) {
      case 'space':
        return (
          <div className={baseClass}>
            <div className="absolute top-4 left-4 text-2xl animate-pulse">🌟</div>
            <div className="absolute top-8 right-8 text-xl animate-bounce">⭐</div>
            <div className="absolute bottom-16 left-8 text-lg">🛸</div>
            {specialEffect === 'rocket-boost' && (
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 100, opacity: 1 }}
                exit={{ x: 200, opacity: 0 }}
                className="absolute top-1/2 left-0 text-4xl"
              >
                🚀
              </motion.div>
            )}
          </div>
        );
      
      case 'dino':
        return (
          <div className={baseClass}>
            <div className="absolute top-6 right-6 text-2xl">🌿</div>
            <div className="absolute bottom-20 left-6 text-xl">🦕</div>
            <div className="absolute top-12 left-12 text-lg animate-pulse">🌴</div>
            {specialEffect === 'fossil-found' && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: -20 }}
                className="absolute top-1/2 right-1/4 text-3xl"
              >
                🦴✨
              </motion.div>
            )}
          </div>
        );
      
      case 'medieval':
        return (
          <div className={baseClass}>
            <div className="absolute top-4 right-4 text-2xl">🏰</div>
            <div className="absolute bottom-16 right-8 text-xl animate-bounce">⚔️</div>
            <div className="absolute top-16 left-6 text-lg">🛡️</div>
            {specialEffect === 'sword-clash' && (
              <motion.div
                initial={{ rotate: -45, scale: 0 }}
                animate={{ rotate: 45, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                className="absolute top-1/3 left-1/3 text-4xl"
              >
                ⚔️✨
              </motion.div>
            )}
          </div>
        );
      
      case 'ocean':
        return (
          <div className={baseClass}>
            <div className="absolute top-8 left-8 text-2xl animate-pulse">🌊</div>
            <div className="absolute bottom-20 right-10 text-xl">🐠</div>
            <div className="absolute top-20 right-12 text-lg">🐙</div>
            {specialEffect === 'bubble-burst' && (
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                className="absolute top-1/2 left-1/2 text-2xl transform -translate-x-1/2 -translate-y-1/2"
              >
                🫧🫧🫧
              </motion.div>
            )}
          </div>
        );
      
      case 'circus':
        return (
          <div className={baseClass}>
            <div className="absolute top-6 left-1/2 text-2xl transform -translate-x-1/2">🎪</div>
            <div className="absolute bottom-20 left-8 text-xl animate-spin">🎠</div>
            <div className="absolute top-16 right-8 text-lg">🎭</div>
            {specialEffect === 'applause' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xl"
              >
                👏👏👏
              </motion.div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderChallengeModifier = () => {
    if (!challenge?.specialRules) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs"
      >
        {challenge.specialRules.timeBonus && "⚡ Speed Bonus"}
        {challenge.specialRules.reverseOrder && "🔄 Reverse Mode"}
        {challenge.specialRules.noMistakes && "💯 Perfect Mode"}
      </motion.div>
    );
  };

  return (
    <div className="relative">
      {renderThemeBackground()}
      {renderChallengeModifier()}
      
      {/* Mechanic Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-center"
      >
        <div className="inline-block bg-white/10 backdrop-blur rounded-lg px-4 py-2">
          <p className="text-sm font-bold text-white">{mechanics.name}</p>
          <p className="text-xs text-white/80">{mechanics.description}</p>
        </div>
      </motion.div>

      {/* Main Problem */}
      <PersistentMathProblem
        problem={problem}
        showSolution={false}
        isInteractive={true}
        onAnswer={handleAnswer}
        theme={themeColors.primary}
        keepKeyboardVisible={true}
        streak={nodeProgress}
      />

      {/* Progress Indicator with Theme Elements */}
      <div className="mt-4 flex justify-center items-center space-x-2">
        {Array.from({ length: totalProblems }, (_, i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < nodeProgress
                ? 'bg-green-400'
                : i === nodeProgress
                ? 'bg-yellow-400 animate-pulse'
                : 'bg-white/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
};