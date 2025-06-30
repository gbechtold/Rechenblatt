import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { WorksheetSettings, Problem } from '@/types';
import { generateWorksheetProblems } from '@/lib/problemGenerator';

interface QuickStartProps {
  onStartGame: (settings: WorksheetSettings, problems: Problem[]) => void;
}

interface QuickStartLevel {
  id: string;
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'genius' | 'impossible' | 'legendary';
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
  range: [number, number];
  problemCount: number;
  icon: string;
  color: string;
  description: string;
}

const quickStartLevels: QuickStartLevel[] = [
  {
    id: 'beginner',
    difficulty: 'beginner',
    operation: 'addition',
    range: [1, 10],
    problemCount: 10,
    icon: '🌱',
    color: 'bg-green-400',
    description: 'Simple addition (1-10)'
  },
  {
    id: 'easy',
    difficulty: 'easy',
    operation: 'subtraction',
    range: [1, 20],
    problemCount: 12,
    icon: '🌿',
    color: 'bg-green-500',
    description: 'Basic subtraction (1-20)'
  },
  {
    id: 'medium-add',
    difficulty: 'medium',
    operation: 'addition',
    range: [10, 50],
    problemCount: 15,
    icon: '🌳',
    color: 'bg-yellow-400',
    description: 'Addition (10-50)'
  },
  {
    id: 'medium-mult',
    difficulty: 'medium',
    operation: 'multiplication',
    range: [1, 10],
    problemCount: 15,
    icon: '⭐',
    color: 'bg-yellow-500',
    description: 'Times tables (1-10)'
  },
  {
    id: 'hard-mixed',
    difficulty: 'hard',
    operation: 'mixed',
    range: [1, 100],
    problemCount: 20,
    icon: '🔥',
    color: 'bg-orange-500',
    description: 'Mixed operations (1-100)'
  },
  {
    id: 'expert-div',
    difficulty: 'expert',
    operation: 'division',
    range: [1, 100],
    problemCount: 20,
    icon: '💎',
    color: 'bg-red-500',
    description: 'Division challenges'
  },
  {
    id: 'master',
    difficulty: 'master',
    operation: 'multiplication',
    range: [10, 50],
    problemCount: 25,
    icon: '🚀',
    color: 'bg-purple-500',
    description: 'Advanced multiplication'
  },
  {
    id: 'genius',
    difficulty: 'genius',
    operation: 'mixed',
    range: [50, 500],
    problemCount: 30,
    icon: '🧠',
    color: 'bg-indigo-600',
    description: 'Big number challenge'
  },
  {
    id: 'legendary',
    difficulty: 'legendary',
    operation: 'mixed',
    range: [100, 1000],
    problemCount: 40,
    icon: '👑',
    color: 'bg-gradient-to-r from-purple-600 to-pink-600',
    description: 'Ultimate math master'
  }
];

export const QuickStart: React.FC<QuickStartProps> = ({ onStartGame }) => {
  const { t } = useTranslation('common');

  const handleQuickStart = (level: QuickStartLevel) => {
    const settings: WorksheetSettings = {
      operation: level.operation as any,
      operations: level.operation === 'mixed' ? ['addition', 'subtraction', 'multiplication', 'division'] : undefined,
      difficulty: 'medium' as any,
      numberRange: { min: level.range[0], max: level.range[1] },
      problemsPerPage: level.problemCount,
      columns: 1,
      showNumbers: true,
      showSolutions: false,
      carryOver: level.range[1] > 20,
      theme: 'space',
      placeholders: false,
      mixedOperations: level.operation === 'mixed'
    };

    const problems = generateWorksheetProblems(settings);
    onStartGame(settings, problems);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{t('play.quickStart', 'Quick Start')}</h2>
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
        {quickStartLevels.map((level, index) => (
          <motion.button
            key={level.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickStart(level)}
            className={`relative p-4 rounded-lg shadow-lg text-white ${level.color} hover:shadow-xl transition-all`}
          >
            <div className="text-3xl mb-1">{level.icon}</div>
            <div className="text-xs font-semibold opacity-90">{level.description}</div>
            <div className="absolute top-1 right-1 text-xs opacity-75">
              {level.problemCount}q
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};