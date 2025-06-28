import React, { useState, useEffect } from 'react';
import { Problem } from '@/types';
import { getOperationSymbol } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    if (isNaN(answer)) return;

    const correct = checkAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (onAnswer) {
      onAnswer(answer, correct);
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
      return <div className="math-box">__</div>;
    }
    return <div className="math-box">{value}</div>;
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
      className="math-problem p-4 flex items-center justify-center"
      variants={problemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col items-center space-y-2">
        {index > 0 && (
          <span className="text-sm font-semibold text-gray-600">
            {index}.
          </span>
        )}
        <div className="flex items-center space-x-2">
          {renderOperand(problem.operand1, problem.placeholder === 'operand1')}
          <span className="text-2xl font-bold">
            {getOperationSymbol(problem.operation)}
          </span>
          {renderOperand(problem.operand2, problem.placeholder === 'operand2')}
          <span className="text-2xl font-bold">=</span>
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
              'mt-2 px-4 py-2 rounded text-white font-bold',
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            )}
          >
            {isCorrect ? '✓ Correct!' : '✗ Try Again'}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};