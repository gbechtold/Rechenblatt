import React, { useState, useEffect } from 'react';
import { Problem } from '@/types';
import { getOperationSymbol } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';

interface MathProblemProps {
  problem: Problem;
  showSolution: boolean;
  isInteractive?: boolean;
  onAnswer?: (answer: number, isCorrect: boolean) => void;
  theme?: string;
  index?: number;
}

export const MathProblem: React.FC<MathProblemProps> = ({
  problem,
  showSolution,
  isInteractive = false,
  onAnswer,
  theme = 'default',
  index = 0,
}) => {
  const { t } = useTranslation('common');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    if (isNaN(answer)) return;

    const correct = checkAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(attempts + 1);
    
    if (onAnswer && correct) {
      onAnswer(answer, correct);
    }
  };

  const handleRetry = () => {
    setUserAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);
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
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-12 h-12 text-center border-2 border-gray-400 rounded"
            disabled={showFeedback}
          />
        );
      }
      return <div className="math-box print:border-gray-600"></div>;
    }
    return <div className="math-box print:border-gray-600">{value}</div>;
  };

  const problemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1 },
    },
  };

  return (
    <motion.div
      className="math-problem p-2 print:p-0 flex"
      variants={problemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center space-x-3 print:space-x-2 w-full">
        {index > 0 && (
          <span className="text-sm font-semibold text-gray-600 print:text-base print:w-8">
            {index}.
          </span>
        )}
        <div className="flex items-center space-x-2 print:space-x-3 flex-1">
          {renderOperand(problem.operand1, problem.placeholder === 'operand1')}
          <span className="text-2xl font-bold print:text-xl print:px-1">
            {getOperationSymbol(problem.operation)}
          </span>
          {renderOperand(problem.operand2, problem.placeholder === 'operand2')}
          <span className="text-2xl font-bold print:text-xl print:px-1">=</span>
          {renderOperand(problem.answer, problem.placeholder === 'answer' || !problem.placeholder)}
        </div>
        {isInteractive && !showFeedback && userAnswer && (
          <button
            onClick={handleSubmit}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Check
          </button>
        )}
        {showFeedback && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              'mt-2 px-4 py-2 rounded-lg shadow-lg',
              isCorrect ? 'bg-green-500 text-white' : 'bg-yellow-100 text-gray-800'
            )}
          >
            {isCorrect ? (
              <div className="text-center font-bold">
                ✓ {t('game.correct')}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-semibold">{getGrowthMindsetMessage()}</div>
                <button
                  onClick={handleRetry}
                  className="w-full px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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