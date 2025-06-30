import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quest, ThemeColors } from '@/lib/questSystem/types';
import { QuestGenerator } from '@/lib/questSystem/questGenerator';
import { ShareManager } from '@/lib/questSystem/shareManager';
import { ProgressManager } from '@/lib/questSystem/progressManager';
import { useTranslation } from 'next-i18next';
import confetti from 'canvas-confetti';

interface QuestCompletionScreenProps {
  quest: Quest;
  themeColors: ThemeColors;
  stats: {
    score: number;
    combo: number;
    mistakes: number;
    time: number;
  };
  onShare: () => void;
  onNextQuest: () => void;
  onBackToSelection: () => void;
}

export const QuestCompletionScreen: React.FC<QuestCompletionScreenProps> = ({
  quest,
  themeColors,
  stats,
  onShare,
  onNextQuest,
  onBackToSelection
}) => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'en' | 'de';
  const [showSharePreview, setShowSharePreview] = useState(false);
  const [nextQuestPreview, setNextQuestPreview] = useState<Quest | null>(null);
  
  const questGenerator = QuestGenerator.getInstance();
  const progressManager = ProgressManager.getInstance();

  useEffect(() => {
    // Celebration animation
    const colors = [themeColors.primary, themeColors.secondary, themeColors.accent];
    
    // Multiple confetti bursts
    const count = 3;
    const defaults = {
      origin: { y: 0.7 },
      colors
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(200 * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // Generate next quest preview
    const nextQuest = questGenerator.generateQuest(quest.theme, quest.number + 1);
    setNextQuestPreview(nextQuest);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGrade = (): { emoji: string; text: string } => {
    if (stats.mistakes === 0 && stats.combo >= 20) {
      return { emoji: '🌟', text: t('grade.legendary', 'LEGENDARY!') };
    } else if (stats.mistakes === 0) {
      return { emoji: '⭐', text: t('grade.perfect', 'PERFECT!') };
    } else if (stats.mistakes <= 2) {
      return { emoji: '🎯', text: t('grade.excellent', 'EXCELLENT!') };
    } else if (stats.mistakes <= 5) {
      return { emoji: '👍', text: t('grade.good', 'GOOD!') };
    } else {
      return { emoji: '💪', text: t('grade.complete', 'COMPLETE!') };
    }
  };

  const grade = getGrade();

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${themeColors.background}, ${themeColors.primary})`
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: themeColors.accent,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-8xl mb-4"
            >
              {grade.emoji}
            </motion.div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
              {grade.text}
            </h1>
            <p className="text-xl text-gray-600">
              {quest.title[lang]} - Quest #{quest.number}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4 text-center"
            >
              <p className="text-3xl font-bold text-blue-700">{stats.score}</p>
              <p className="text-sm text-blue-600">{t('score', 'Score')}</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-4 text-center"
            >
              <p className="text-3xl font-bold text-green-700">{stats.combo}x</p>
              <p className="text-sm text-green-600">{t('bestCombo', 'Best Combo')}</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4 text-center"
            >
              <p className="text-3xl font-bold text-purple-700">
                {stats.mistakes === 0 ? '⭐' : stats.mistakes}
              </p>
              <p className="text-sm text-purple-600">{t('mistakes', 'Mistakes')}</p>
            </motion.div>
          </motion.div>

          {/* Time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-6 text-gray-600"
          >
            <p>⏱️ {t('completedIn', 'Completed in')} {formatTime(stats.time)}</p>
          </motion.div>

          {/* Rewards */}
          {quest.rewards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                {t('quest.rewardsEarned', 'Rewards Earned')}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {quest.rewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`
                      px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2
                      ${reward.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                        reward.rarity === 'epic' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                        reward.rarity === 'rare' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                        'bg-gradient-to-r from-gray-300 to-gray-400'}
                    `}
                  >
                    <span className="text-2xl">{reward.icon}</span>
                    <div className="text-white">
                      <p className="font-semibold">{reward.name[lang]}</p>
                      <p className="text-xs opacity-90">{reward.description[lang]}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Next Quest Preview */}
          {nextQuestPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mb-6 p-4 bg-gray-100 rounded-xl"
            >
              <p className="text-sm text-gray-600 mb-1">
                {t('quest.nextUp', 'Next up')}:
              </p>
              <p className="font-semibold text-gray-800">
                Quest #{nextQuestPreview.number}: {nextQuestPreview.title[lang]}
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSharePreview(true)}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <span>{t('quest.shareChallenge', 'Share Challenge')}</span>
              <span className="text-xl">🔗</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNextQuest}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <span>{t('quest.nextQuest', 'Next Quest')}</span>
              <span className="text-xl">→</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBackToSelection}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              {t('quest.backToSelection', 'Back to Selection')}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Share Preview Modal */}
      <AnimatePresence>
        {showSharePreview && (
          <SharePreviewModal
            quest={quest}
            stats={stats}
            themeColors={themeColors}
            onClose={() => setShowSharePreview(false)}
            onShare={() => {
              setShowSharePreview(false);
              onShare();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Share Preview Modal Component
const SharePreviewModal: React.FC<{
  quest: Quest;
  stats: any;
  themeColors: ThemeColors;
  onClose: () => void;
  onShare: () => void;
}> = ({ quest, stats, themeColors, onClose, onShare }) => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'en' | 'de';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
      >
        <h3 className="text-xl font-bold mb-4">{t('share.preview', 'Share Preview')}</h3>
        
        <div 
          className="rounded-lg p-4 mb-4"
          style={{ background: `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.secondary}20)` }}
        >
          <p className="text-lg font-semibold mb-2">🎯 {quest.title[lang]}</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <p className="font-bold">{stats.score}</p>
              <p className="text-gray-600">{t('points', 'Points')}</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{stats.combo}x</p>
              <p className="text-gray-600">{t('combo', 'Combo')}</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{stats.mistakes === 0 ? '⭐' : stats.mistakes}</p>
              <p className="text-gray-600">{t('mistakes', 'Mistakes')}</p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          {t('share.description', 'Share this challenge with friends and see if they can beat your score!')}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium"
          >
            {t('cancel', 'Cancel')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShare}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg font-medium"
          >
            {t('share', 'Share')} 🔗
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};