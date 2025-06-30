import React from 'react';
import { motion } from 'framer-motion';
import { Quest, QuestNode, ThemeColors } from '@/lib/questSystem/types';
import { useTranslation } from 'next-i18next';

interface MobileQuestProgressProps {
  quest: Quest;
  currentNodeIndex: number;
  themeColors: ThemeColors;
  onNodeClick?: (index: number) => void;
  isPlaying?: boolean;
}

export const MobileQuestProgress: React.FC<MobileQuestProgressProps> = ({
  quest,
  currentNodeIndex,
  themeColors,
  onNodeClick,
  isPlaying = false
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

  if (isPlaying) {
    // Compact view during gameplay
    return (
      <div className="w-full bg-black/20 backdrop-blur-sm">
        <div className="px-4 py-2 pr-20"> {/* Extra padding right for menu button */}
          {/* Quest Title - Smaller during play */}
          <h3 className="text-sm font-medium text-white/90 mb-1">
            Quest #{quest.number}: {quest.title[lang]}
          </h3>
          
          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ backgroundColor: themeColors.accent }}
              initial={{ width: 0 }}
              animate={{ 
                width: `${(currentNodeIndex / (quest.path.length - 1)) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Current Node Info */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-white/70">
              {quest.path[currentNodeIndex].name?.[lang] || 'Challenge'}
            </span>
            <span className="text-xs text-white/70">
              {currentNodeIndex + 1} / {quest.path.length}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Full view for quest selection/overview
  return (
    <div className="w-full p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 className="text-xl font-bold text-white mb-1">
          {quest.title[lang]}
        </h2>
        <div className="flex items-center justify-center space-x-3 text-xs text-gray-300">
          <span>Quest #{quest.number}</span>
          <span>•</span>
          <span>{quest.totalProblems} Problems</span>
        </div>
      </motion.div>

      {/* Horizontal Scrollable Progress */}
      <div className="relative">
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex items-center space-x-4" style={{ minWidth: 'max-content' }}>
            {quest.path.map((node, index) => {
              const status = getNodeStatus(index);
              const isClickable = onNodeClick && status !== 'locked';

              return (
                <React.Fragment key={`${node.type}-${index}`}>
                  {index > 0 && (
                    <div 
                      className="w-8 h-0.5"
                      style={{
                        backgroundColor: status === 'completed' ? themeColors.accent : '#374151'
                      }}
                    />
                  )}
                  
                  <motion.div
                    className="relative flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Node Circle */}
                    <motion.button
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all ${
                        isClickable ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      style={{
                        backgroundColor: status === 'completed' 
                          ? themeColors.accent 
                          : status === 'current' 
                          ? themeColors.secondary 
                          : '#374151',
                        boxShadow: status === 'current' 
                          ? `0 0 15px ${themeColors.accent}` 
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

                    {/* Current Node Indicator */}
                    {status === 'current' && (
                      <motion.div
                        className="absolute -top-6"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <div className="text-sm">👇</div>
                      </motion.div>
                    )}

                    {/* Node Label */}
                    <p className="text-xs text-gray-300 mt-1 text-center max-w-[60px]">
                      {node.name?.[lang]?.split(' ')[0] || 'Node'}
                    </p>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rewards Section - Only show if not playing */}
      {quest.rewards.length > 0 && !isPlaying && (
        <motion.div
          className="mt-6 p-3 bg-black/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-white mb-2">
            {lang === 'en' ? 'Quest Rewards' : 'Quest-Belohnungen'}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quest.rewards.slice(0, 4).map((reward, index) => (
              <motion.div
                key={reward.id}
                className="flex items-center space-x-2 bg-black/50 px-2 py-1.5 rounded"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <span className="text-lg">{reward.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
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