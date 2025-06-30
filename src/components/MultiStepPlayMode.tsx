import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Worksheet, Problem } from '@/types';
import { MathProblem } from './MathProblem';
import { useTranslation } from 'next-i18next';
import confetti from 'canvas-confetti';

interface MultiStepPlayModeProps {
  worksheet: Worksheet;
  onProblemAnswer: (problemId: string, answer: number, isCorrect: boolean) => void;
  problemsCompleted: number;
  score: number;
  onExit: () => void;
}

export const MultiStepPlayMode: React.FC<MultiStepPlayModeProps> = ({
  worksheet,
  onProblemAnswer,
  problemsCompleted,
  score,
  onExit
}) => {
  const { t } = useTranslation('common');
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const currentProblem = worksheet.problems[currentProblemIndex];
  const isComplete = currentProblemIndex >= worksheet.problems.length;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHeaderHidden(true);
      } else {
        setIsHeaderHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    const handleFocus = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setIsHeaderHidden(true);
      }
    };

    const handleBlur = () => {
      setIsHeaderHidden(false);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Add focus/blur listeners to all input elements
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, [lastScrollY]);

  const handleAnswer = (answer: number, isCorrect: boolean) => {
    onProblemAnswer(currentProblem.id, answer, isCorrect);
    
    if (isCorrect) {
      // Small celebration
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Move to next problem after a short delay
      setTimeout(() => {
        setCurrentProblemIndex(prev => prev + 1);
      }, 1000);
    }
  };

  const handleCompletionCelebration = () => {
    // Big celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  useEffect(() => {
    if (isComplete) {
      handleCompletionCelebration();
    }
  }, [isComplete]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isHeaderHidden ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 bg-white shadow-md z-50"
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-gray-600 text-sm">Score:</span>
                <span className="ml-1 text-xl font-bold text-blue-600">{score}</span>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Progress:</span>
                <span className="ml-1 text-lg font-semibold">
                  {currentProblemIndex} / {worksheet.problems.length}
                </span>
              </div>
            </div>
            <button
              onClick={onExit}
              className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Exit Game
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 flex items-center justify-center px-4 transition-all duration-300 ${isHeaderHidden ? 'pt-4' : 'pt-20'}`}>
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={currentProblemIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className={`theme-${worksheet.settings.theme} p-8 rounded-lg shadow-lg`}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">{worksheet.title}</h2>
                  <div className="flex justify-center items-center space-x-1">
                    {worksheet.problems.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index < currentProblemIndex
                            ? 'bg-green-500'
                            : index === currentProblemIndex
                            ? 'bg-blue-500 w-3 h-3'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="transform scale-125 md:scale-150">
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
              className="text-center"
            >
              <h2 className="text-5xl font-bold mb-4 text-green-600">
                {t('game.complete')}
              </h2>
              <p className="text-2xl mb-8">
                Final Score: {score} {t('game.points')}
              </p>
              <button
                onClick={onExit}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700"
              >
                Back to Worksheets
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};