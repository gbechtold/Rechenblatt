import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeType } from '@/lib/questSystem/types';
import { themeDictionaries } from '@/lib/questSystem/themeDictionaries';
import { ProgressManager } from '@/lib/questSystem/progressManager';
import { useTranslation } from 'next-i18next';

interface QuestSelectionProps {
  onSelectTheme: (theme: ThemeType) => void;
  onBack: () => void;
}

export const QuestSelection: React.FC<QuestSelectionProps> = ({
  onSelectTheme,
  onBack
}) => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'en' | 'de';
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null);
  const progressManager = ProgressManager.getInstance();
  const progress = progressManager.getProgress();

  const themes: ThemeType[] = ['space', 'dino', 'medieval', 'ocean', 'circus'];

  const handleThemeSelect = (theme: ThemeType) => {
    setSelectedTheme(theme);
    setTimeout(() => {
      onSelectTheme(theme);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 transition-colors flex items-center space-x-2"
          >
            <span className="text-2xl">←</span>
            <span>{t('back', 'Back')}</span>
          </button>
          
          <h1 className="text-3xl font-bold text-white">
            {t('quests.selectAdventure', 'Select Your Adventure')}
          </h1>
          
          <div className="text-right">
            <p className="text-sm text-gray-400">
              {t('quests.totalScore', 'Total Score')}
            </p>
            <p className="text-2xl font-bold text-yellow-400">
              {progress.statistics.totalScore.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => {
            const themeData = themeDictionaries[theme];
            const themeProgress = progress.themes[theme];
            const isSelected = selectedTheme === theme;
            
            return (
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  className={`relative w-full p-6 rounded-2xl overflow-hidden transition-all ${
                    isSelected ? 'scale-105' : 'hover:scale-102'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${themeData.colors.primary}, ${themeData.colors.secondary})`,
                    boxShadow: isSelected 
                      ? `0 20px 40px ${themeData.colors.accent}40` 
                      : '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                  onClick={() => handleThemeSelect(theme)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`,
                    }} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Theme Icon */}
                    <motion.div
                      className="text-6xl mb-4"
                      animate={isSelected ? {
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1.1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {themeData.icon}
                    </motion.div>

                    {/* Theme Name */}
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {themeData.name[lang]}
                    </h2>

                    {/* Progress */}
                    <div className="space-y-2 text-white/80 text-sm">
                      <div className="flex justify-between">
                        <span>{t('quests.completed', 'Quests Completed')}</span>
                        <span className="font-semibold">{themeProgress.questsCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('quests.bosses', 'Bosses Defeated')}</span>
                        <span className="font-semibold">{themeProgress.bossesDefeated.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('quests.score', 'Theme Score')}</span>
                        <span className="font-semibold">{themeProgress.totalScore.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Current Quest Indicator */}
                    {themeProgress.currentQuest && (
                      <motion.div
                        className="mt-4 p-2 bg-white/20 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <p className="text-xs text-white/60">
                          {t('quests.inProgress', 'Quest in Progress')}
                        </p>
                        <p className="text-sm font-medium text-white">
                          Quest #{themeProgress.questsCompleted + 1}
                        </p>
                      </motion.div>
                    )}

                    {/* Start Button */}
                    <motion.div
                      className="mt-4 py-2 px-4 bg-white/20 rounded-full text-white font-medium"
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
                    >
                      {themeProgress.currentQuest 
                        ? t('quests.continue', 'Continue Quest')
                        : t('quests.start', 'Start Quest')
                      }
                    </motion.div>
                  </div>

                  {/* Glow Effect */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div 
                          className="absolute inset-0 animate-pulse"
                          style={{
                            background: `radial-gradient(circle at center, ${themeData.colors.accent}20 0%, transparent 70%)`
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <motion.div
          className="mt-8 p-6 bg-gray-800/50 rounded-2xl backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {t('quests.yourProgress', 'Your Progress')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                {Object.values(progress.themes).reduce((sum, t) => sum + t.questsCompleted, 0)}
              </p>
              <p className="text-sm text-gray-400">
                {t('quests.totalQuests', 'Total Quests')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">
                {progress.statistics.totalBossesDefeated}
              </p>
              <p className="text-sm text-gray-400">
                {t('quests.totalBosses', 'Bosses Defeated')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">
                {progressManager.getTotalAchievementPoints()}
              </p>
              <p className="text-sm text-gray-400">
                {t('quests.achievementPoints', 'Achievement Points')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">
                {progress.statistics.perfectQuests}
              </p>
              <p className="text-sm text-gray-400">
                {t('quests.perfectQuests', 'Perfect Quests')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">
                {progress.statistics.bestCombo}x
              </p>
              <p className="text-sm text-gray-400">
                {t('quests.bestCombo', 'Best Combo')}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};