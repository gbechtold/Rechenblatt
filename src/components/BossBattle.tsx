import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Boss, ThemeColors } from '@/lib/questSystem/types';
import { Problem } from '@/types';
import { PersistentMathProblem } from './PersistentMathProblem';
import { useTranslation } from 'next-i18next';
import confetti from 'canvas-confetti';

interface BossBattleProps {
  boss: Boss;
  themeColors: ThemeColors;
  onComplete: (success: boolean) => void;
  onProblemAnswer: (isCorrect: boolean) => void;
  generateProblem: () => Problem;
}

export const BossBattle: React.FC<BossBattleProps> = ({
  boss,
  themeColors,
  onComplete,
  onProblemAnswer,
  generateProblem
}) => {
  const { t, i18n } = useTranslation('common');
  const [health, setHealth] = useState(boss.health);
  const [playerHealth, setPlayerHealth] = useState(3);
  const [currentProblem, setCurrentProblem] = useState<Problem>(generateProblem());
  const [timeLeft, setTimeLeft] = useState(boss.timeLimit);
  const [isShielded, setIsShielded] = useState(false);
  const [showDamage, setShowDamage] = useState(false);
  const [showPlayerDamage, setShowPlayerDamage] = useState(false);
  const [battlePhase, setBattlePhase] = useState<'intro' | 'battle' | 'victory' | 'defeat'>('intro');
  const timerRef = useRef<NodeJS.Timeout>();

  const bossName = boss.name[i18n.language as 'en' | 'de'] || boss.name.en;

  useEffect(() => {
    if (battlePhase === 'intro') {
      setTimeout(() => setBattlePhase('battle'), 2000);
    }
  }, [battlePhase]);

  useEffect(() => {
    if (battlePhase === 'battle' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else if (timeLeft === 0 && battlePhase === 'battle') {
      handleTimeout();
    }
  }, [timeLeft, battlePhase]);

  useEffect(() => {
    // Shield phase activation
    if (boss.specialMechanics?.shieldPhase && health === Math.floor(boss.health / 2)) {
      setIsShielded(true);
      setTimeout(() => setIsShielded(false), 5000);
    }
  }, [health, boss]);

  const handleTimeout = () => {
    setShowPlayerDamage(true);
    setPlayerHealth(prev => prev - 1);
    
    setTimeout(() => {
      setShowPlayerDamage(false);
      if (playerHealth <= 1) {
        setBattlePhase('defeat');
        onComplete(false);
      } else {
        setCurrentProblem(generateProblem());
        setTimeLeft(boss.timeLimit);
      }
    }, 1000);
  };

  const handleAnswer = (answer: number, isCorrect: boolean) => {
    onProblemAnswer(isCorrect);
    
    if (isCorrect && !isShielded) {
      // Boss takes damage
      setShowDamage(true);
      setHealth(prev => prev - 1);
      
      setTimeout(() => {
        setShowDamage(false);
        if (health <= 1) {
          setBattlePhase('victory');
          celebrateVictory();
          onComplete(true);
        } else {
          setCurrentProblem(generateProblem());
          setTimeLeft(boss.timeLimit);
        }
      }, 1000);
    } else if (!isCorrect) {
      // Player takes damage
      setShowPlayerDamage(true);
      setPlayerHealth(prev => prev - 1);
      
      setTimeout(() => {
        setShowPlayerDamage(false);
        if (playerHealth <= 1) {
          setBattlePhase('defeat');
          onComplete(false);
        } else {
          setCurrentProblem(generateProblem());
          setTimeLeft(boss.timeLimit);
        }
      }, 1000);
    } else if (isShielded) {
      // Attack blocked by shield
      setTimeout(() => {
        setCurrentProblem(generateProblem());
        setTimeLeft(boss.timeLimit);
      }, 1000);
    }
  };

  const celebrateVictory = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [themeColors.primary, themeColors.secondary, themeColors.accent]
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${themeColors.background}, #000)`
      }}
    >
      <AnimatePresence mode="wait">
        {battlePhase === 'intro' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                {boss.sprite}
              </motion.div>
              <h1 className="text-4xl font-bold text-white mb-2">{bossName}</h1>
              <p className="text-xl text-gray-300">
                {t('boss.prepare', 'Prepare for battle!')}
              </p>
            </div>
          </motion.div>
        )}

        {battlePhase === 'battle' && (
          <div className="h-full flex flex-col">
            {/* Boss Health Bar */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white">{bossName}</h2>
                <div className="text-4xl">{boss.sprite}</div>
              </div>
              <div className="bg-gray-800 h-8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400"
                  animate={{ width: `${(health / boss.health) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {isShielded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-yellow-400 text-center"
                >
                  🛡️ {t('boss.shielded', 'SHIELDED!')}
                </motion.div>
              )}
            </div>

            {/* Battle Arena */}
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="relative">
                {/* Boss Sprite */}
                <motion.div
                  animate={showDamage ? {
                    x: [-10, 10, -10, 10, 0],
                    filter: ['brightness(1)', 'brightness(2)', 'brightness(0.5)', 'brightness(2)', 'brightness(1)']
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-9xl mb-8 text-center"
                >
                  {boss.sprite}
                </motion.div>

                {/* Damage Indicator */}
                <AnimatePresence>
                  {showDamage && (
                    <motion.div
                      initial={{ y: 0, opacity: 1, scale: 0.5 }}
                      animate={{ y: -50, opacity: 0, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 text-6xl font-bold text-red-500"
                    >
                      -1
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Math Problem */}
                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-2xl">
                  <PersistentMathProblem
                    problem={currentProblem}
                    showSolution={false}
                    isInteractive={true}
                    onAnswer={handleAnswer}
                    theme={themeColors.primary}
                    keepKeyboardVisible={true}
                  />
                </div>
              </div>
            </div>

            {/* Player Status */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white">❤️</span>
                  {[...Array(playerHealth)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={showPlayerDamage && i === playerHealth - 1 ? {
                        scale: [1, 1.5, 0],
                        opacity: [1, 1, 0]
                      } : {}}
                      className="w-8 h-8 bg-red-500 rounded"
                    />
                  ))}
                </div>
                
                {/* Timer */}
                <div 
                  className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}
                >
                  ⏱️ {timeLeft}s
                </div>
              </div>
            </div>
          </div>
        )}

        {battlePhase === 'victory' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-8xl mb-4"
              >
                🏆
              </motion.div>
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">
                {t('boss.victory', 'VICTORY!')}
              </h1>
              <p className="text-xl text-white">
                {t('boss.defeated', '{{boss}} has been defeated!', { boss: bossName })}
              </p>
            </div>
          </motion.div>
        )}

        {battlePhase === 'defeat' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80"
          >
            <div className="text-center">
              <div className="text-8xl mb-4">💀</div>
              <h1 className="text-4xl font-bold text-red-500 mb-2">
                {t('boss.defeat', 'DEFEATED')}
              </h1>
              <p className="text-xl text-gray-300">
                {t('boss.tryAgain', 'Try again!')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};