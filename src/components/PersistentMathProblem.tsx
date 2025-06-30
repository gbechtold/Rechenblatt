import React, { useState, useEffect, useRef } from 'react';
import { Problem } from '@/types';
import { getOperationSymbol } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import confetti from 'canvas-confetti';

interface PersistentMathProblemProps {
  problem: Problem;
  showSolution: boolean;
  isInteractive?: boolean;
  onAnswer?: (answer: number, isCorrect: boolean) => void;
  theme?: string;
  index?: number;
  className?: string;
  keepKeyboardVisible?: boolean;
  streak?: number;
}

const motivationalMessages = [
  "Great job! 🌟",
  "Amazing! 🎉",
  "You're on fire! 🔥",
  "Brilliant! 💫",
  "Fantastic! 🏆",
  "Keep it up! 💪",
  "Excellent! ⭐",
  "Wonderful! 🌈",
  "Super! 🚀",
  "Awesome! 🎯"
];

export const PersistentMathProblem: React.FC<PersistentMathProblemProps> = ({
  problem,
  showSolution,
  isInteractive = false,
  onAnswer,
  theme = 'default',
  index = 0,
  className,
  keepKeyboardVisible = true,
  streak = 0,
}) => {
  const { t } = useTranslation('common');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const submitTimeoutRef = useRef<NodeJS.Timeout>();

  // Keep focus on input to maintain keyboard visibility
  useEffect(() => {
    if (isInteractive && keepKeyboardVisible && inputRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [problem.id, isInteractive, keepKeyboardVisible]);

  // Reset state when problem changes
  useEffect(() => {
    setUserAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);
    setIsSubmitting(false);
    setShowTimer(false);
    // Clear any pending submit timeout
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }
    if (isInteractive && keepKeyboardVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [problem.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = () => {
    if (isSubmitting || showFeedback) return;
    
    const answer = parseInt(userAnswer);
    if (isNaN(answer)) return;

    setIsSubmitting(true);
    const correct = checkAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(attempts + 1);
    
    if (onAnswer && correct) {
      onAnswer(answer, correct);
      
      // Set motivational message
      setMotivationalMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
      
      // Celebrate with confetti!
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      });
      
      // Extra celebration for streaks
      if (streak && streak >= 5) {
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#fbbf24', '#f59e0b', '#f97316']
          });
        }, 250);
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#fbbf24', '#f59e0b', '#f97316']
          });
        }, 400);
      }
      
      // Clear answer after correct submission
      setTimeout(() => {
        setUserAnswer('');
        setShowFeedback(false);
        setIsSubmitting(false);
        setMotivationalMessage('');
        // Keep focus on hidden input to maintain keyboard
        if (keepKeyboardVisible && hiddenInputRef.current) {
          hiddenInputRef.current.focus();
        }
      }, 1200);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setUserAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const checkAnswer = (answer: number): boolean => {
    if (problem.placeholder === 'operand1') {
      return answer === problem.operand1;
    } else if (problem.placeholder === 'operand2') {
      return answer === problem.operand2;
    } else {
      return answer === problem.answer;
    }
  };

  const getGrowthMindsetMessage = () => {
    const messages = t('game.growthMindset', { returnObjects: true }) as string[];
    return messages[attempts % messages.length] || messages[0];
  };

  const renderOperand = (value: number, isPlaceholder: boolean) => {
    if (isPlaceholder && !showSolution) {
      if (isInteractive) {
        return (
          <div className="flex items-center space-x-1">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                // Clear any existing timeout
                if (submitTimeoutRef.current) {
                  clearTimeout(submitTimeoutRef.current);
                }
                // Auto-submit after 3 seconds on mobile
                if (keepKeyboardVisible && e.target.value.length >= 1 && !showFeedback) {
                  const answer = parseInt(e.target.value);
                  if (!isNaN(answer)) {
                    setShowTimer(true);
                    submitTimeoutRef.current = setTimeout(() => {
                      handleSubmit();
                      setShowTimer(false);
                    }, 3000);
                  }
                } else {
                  setShowTimer(false);
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-16 h-16 text-2xl font-bold text-center border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 bg-blue-50"
              disabled={showFeedback && isCorrect}
              autoComplete="off"
              enterKeyHint="done"
              placeholder=""
            />
            {/* Hidden input to keep keyboard visible during transitions */}
            {keepKeyboardVisible && showFeedback && isCorrect && (
              <input
                ref={hiddenInputRef}
                type="number"
                inputMode="numeric"
                className="absolute opacity-0 pointer-events-none"
                autoFocus
              />
            )}
          </div>
        );
      }
      return <div className="w-16 h-16 text-2xl font-bold flex items-center justify-center print:w-12 print:h-10 print:text-base"></div>;
    }
    return <div className="w-16 h-16 text-2xl font-bold flex items-center justify-center print:w-12 print:h-10 print:text-base">{value}</div>;
  };

  const problemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        delay: index * 0.1,
        duration: 0.3,
        type: "spring",
        bounce: 0.3
      },
    },
  };

  return (
    <motion.div
      className={cn("math-problem p-2 print:p-0 flex", className)}
      variants={problemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col items-center space-y-4 w-full">
        <div className="flex items-center space-x-3 print:space-x-2">
          {index > 0 && (
            <span className="text-sm font-semibold text-gray-600 print:text-base print:w-8">
              {index}.
            </span>
          )}
          <div className="flex items-center space-x-2 print:space-x-3">
            {renderOperand(problem.operand1, problem.placeholder === 'operand1')}
            <span className="text-2xl font-bold print:text-xl print:px-1">
              {getOperationSymbol(problem.operation)}
            </span>
            {renderOperand(problem.operand2, problem.placeholder === 'operand2')}
            <span className="text-2xl font-bold print:text-xl print:px-1">=</span>
            <div className="flex items-center">
              {renderOperand(problem.answer, problem.placeholder === 'answer' || !problem.placeholder)}
            </div>
          </div>
        </div>
        {/* Submit button below the problem */}
        {isInteractive && keepKeyboardVisible && userAnswer && !showFeedback && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 active:bg-green-700 relative min-w-[120px]"
            >
              {showTimer ? (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 0.8 }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="flex items-center justify-center"
                >
                  <span className="text-sm">3s</span>
                </motion.div>
              ) : (
                'Prüfen ✓'
              )}
            </button>
          </div>
        )}
        {isInteractive && !showFeedback && userAnswer && !keepKeyboardVisible && (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
          >
            Check
          </button>
        )}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'px-6 py-4 rounded-lg shadow-lg',
              isCorrect ? 'bg-green-500 text-white' : 'bg-yellow-100 text-gray-800'
            )}
          >
            {isCorrect ? (
              <div className="text-center">
                <div className="font-bold text-xl mb-1">
                  {motivationalMessage || `✓ ${t('game.correct')}`}
                </div>
                {streak && streak >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm mt-2"
                  >
                    {streak} in a row! 🔥
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-semibold text-center">{getGrowthMindsetMessage()}</div>
                <button
                  onClick={handleRetry}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  {t('game.tryAgain')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};