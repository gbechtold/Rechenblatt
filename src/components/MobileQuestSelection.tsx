import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeType } from '@/lib/questSystem/types';
import { themeDictionaries } from '@/lib/questSystem/themeDictionaries';
import { ProgressManager } from '@/lib/questSystem/progressManager';
import { useTranslation } from 'next-i18next';

interface MobileQuestSelectionProps {
  onSelectTheme: (theme: ThemeType) => void;
  onBack: () => void;
}

export const MobileQuestSelection: React.FC<MobileQuestSelectionProps> = ({
  onSelectTheme,
  onBack
}) => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'en' | 'de';
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null);
  const [showStats, setShowStats] = useState(false);
  const progressManager = ProgressManager.getInstance();
  const progress = progressManager.getProgress();

  const themes: ThemeType[] = ['space', 'dino', 'medieval', 'ocean', 'circus'];

  const handleThemeSelect = (theme: ThemeType) => {
    setSelectedTheme(theme);
    setTimeout(() => {
      onSelectTheme(theme);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 transition-colors flex items-center space-x-1"
          >
            <span className="text-xl">←</span>
            <span className="text-sm">{t('back', 'Back')}</span>
          </button>
          
          <div className="text-right">
            <p className="text-xs text-gray-400">
              {t('quests.totalScore', 'Total Score')}
            </p>
            <p className="text-lg font-bold text-yellow-400">
              {progress.statistics.totalScore.toLocaleString()}
            </p>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center pb-4">
          {t('quests.selectAdventure', 'Select Your Adventure')}
        </h1>
      </div>

      {/* Theme Cards - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 space-y-4">
          {themes.map((theme, index) => {
            const themeData = themeDictionaries[theme];
            const themeProgress = progress.themes[theme];
            const isSelected = selectedTheme === theme;
            
            return (
              <motion.button
                key={theme}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`w-full relative overflow-hidden rounded-2xl shadow-xl transition-all ${
                  isSelected ? 'scale-98' : 'hover:scale-102'
                }`}
                onClick={() => handleThemeSelect(theme)}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="p-6"
                  style={{
                    background: `linear-gradient(135deg, ${themeData.colors.primary}, ${themeData.colors.secondary})`
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div 
                      className="absolute inset-0" 
                      style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`,
                      }} 
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="text-4xl"
                          animate={isSelected ? {
                            rotate: [0, -10, 10, -10, 0],
                          } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {themeData.icon}
                        </motion.div>
                        <div className="text-left">
                          <h2 className="text-xl font-bold text-white">
                            {themeData.name[lang]}
                          </h2>
                          <p className="text-sm text-white/70">
                            {themeProgress.questsCompleted > 0 
                              ? `Quest #${themeProgress.questsCompleted + 1}`
                              : t('quests.newAdventure', 'New Adventure')
                            }
                          </p>
                        </div>
                      </div>
                      
                      {themeProgress.currentQuest && (
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                          {t('quests.inProgress', 'In Progress')}
                        </span>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white/10 rounded-lg p-2">
                        <p className="text-lg font-bold text-white">{themeProgress.questsCompleted}</p>
                        <p className="text-xs text-white/70">{t('quests.quests', 'Quests')}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <p className="text-lg font-bold text-white">{themeProgress.bossesDefeated.length}</p>
                        <p className="text-xs text-white/70">{t('quests.bosses', 'Bosses')}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <p className="text-lg font-bold text-white">
                          {themeProgress.totalScore > 999 
                            ? `${Math.floor(themeProgress.totalScore / 1000)}k` 
                            : themeProgress.totalScore
                          }
                        </p>
                        <p className="text-xs text-white/70">{t('score', 'Score')}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.div
                      className="mt-3 py-2 bg-white/20 rounded-full text-white font-medium text-sm"
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
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Stats Summary - Fixed */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <motion.button
          onClick={() => setShowStats(!showStats)}
          className="w-full p-3 flex items-center justify-between"
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-white font-medium">
            {t('quests.yourProgress', 'Your Progress')}
          </span>
          <motion.span
            animate={{ rotate: showStats ? 180 : 0 }}
            className="text-white"
          >
            ▲
          </motion.span>
        </motion.button>
        
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 grid grid-cols-2 gap-4 border-t border-gray-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {Object.values(progress.themes).reduce((sum, t) => sum + t.questsCompleted, 0)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t('quests.totalQuests', 'Total Quests')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">
                    {progress.statistics.totalBossesDefeated}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t('quests.totalBosses', 'Bosses Defeated')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">
                    {progressManager.getTotalAchievementPoints()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t('quests.achievementPoints', 'Achievement Points')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">
                    {progress.statistics.bestCombo}x
                  </p>
                  <p className="text-xs text-gray-400">
                    {t('quests.bestCombo', 'Best Combo')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};