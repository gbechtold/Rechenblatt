import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quest, QuestNode, ThemeColors } from '@/lib/questSystem/types';
import { useTranslation } from 'next-i18next';

interface QuestProgressProps {
  quest: Quest;
  currentNodeIndex: number;
  themeColors: ThemeColors;
  onNodeClick?: (index: number) => void;
}

export const QuestProgress: React.FC<QuestProgressProps> = ({
  quest,
  currentNodeIndex,
  themeColors,
  onNodeClick
}) => {
  const { i18n } = useTranslation('common');
  const lang = i18n.language as 'en' | 'de';

  const getNodeIcon = (node: QuestNode): string => {
    switch (node.type) {
      case 'intro': return '🚀';
      case 'challenge': return '⚔️';
      case 'miniBoss': return '👹';
      case 'finalBoss': return '👾';
      case 'reward': return '🏆';
      default: return '📍';
    }
  };

  const getNodeStatus = (index: number): 'completed' | 'current' | 'locked' => {
    if (index < currentNodeIndex) return 'completed';
    if (index === currentNodeIndex) return 'current';
    return 'locked';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          {quest.title[lang]}
        </h2>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
          <span>Quest #{quest.number}</span>
          <span>•</span>
          <span>{quest.totalProblems} Problems</span>
        </div>
      </motion.div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2"
          style={{ backgroundColor: themeColors.accent }}
          initial={{ width: 0 }}
          animate={{ 
            width: `${(currentNodeIndex / (quest.path.length - 1)) * 100}%` 
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Quest Nodes */}
        <div className="relative flex justify-between">
          {quest.path.map((node, index) => {
            const status = getNodeStatus(index);
            const isClickable = onNodeClick && status !== 'locked';

            return (
              <motion.div
                key={`${node.type}-${index}`}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Node Circle */}
                <motion.button
                  className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  style={{
                    backgroundColor: status === 'completed' 
                      ? themeColors.accent 
                      : status === 'current' 
                      ? themeColors.secondary 
                      : '#374151',
                    boxShadow: status === 'current' 
                      ? `0 0 20px ${themeColors.accent}` 
                      : 'none'
                  }}
                  whileHover={isClickable ? { scale: 1.1 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  onClick={() => isClickable && onNodeClick(index)}
                  disabled={!isClickable}
                  animate={status === 'current' ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={status === 'current' ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                >
                  {status === 'completed' ? '✓' : getNodeIcon(node)}
                </motion.button>

                {/* Node Label */}
                <motion.div
                  className="absolute top-20 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <p className="text-xs text-gray-300 whitespace-nowrap">
                    {node.name?.[lang] || 'Node'}
                  </p>
                  {node.problems && (
                    <p className="text-xs text-gray-500 mt-1">
                      {node.problems} problems
                    </p>
                  )}
                </motion.div>

                {/* Current Node Indicator */}
                <AnimatePresence>
                  {status === 'current' && (
                    <motion.div
                      className="absolute -top-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-2xl"
                      >
                        👇
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Rewards Preview */}
      {quest.rewards.length > 0 && (
        <motion.div
          className="mt-8 p-4 bg-black/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            {lang === 'en' ? 'Quest Rewards' : 'Quest-Belohnungen'}
          </h3>
          <div className="flex flex-wrap gap-3">
            {quest.rewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                className="flex items-center space-x-2 bg-black/50 px-3 py-2 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <span className="text-xl">{reward.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">
                    {reward.name[lang]}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {reward.rarity}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};