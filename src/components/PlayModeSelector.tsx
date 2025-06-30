import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { QuickStart } from './QuickStart';
import { PlaySettings } from './PlaySettings';
import { QuestSelection } from './QuestSelection';
import { MobileQuestSelection } from './MobileQuestSelection';
import { QuestPlay } from './QuestPlay';
import { WorksheetSettings, Problem, Worksheet } from '@/types';
import { ThemeType } from '@/lib/questSystem/types';
import { useStore } from '@/lib/store';

interface PlayModeSelectorProps {
  worksheets: Worksheet[];
  onStartClassicGame: (settings: WorksheetSettings, problems: Problem[]) => void;
  onStartWorksheetGame: (worksheet: Worksheet) => void;
}

type PlayMode = 'selection' | 'classic' | 'quest' | 'quest-play';

export const PlayModeSelector: React.FC<PlayModeSelectorProps> = ({
  worksheets,
  onStartClassicGame,
  onStartWorksheetGame
}) => {
  const { t } = useTranslation('common');
  const { startGame, endGame } = useStore();
  const [currentMode, setCurrentMode] = useState<PlayMode>('selection');
  const [selectedQuestTheme, setSelectedQuestTheme] = useState<ThemeType>('space');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelectQuestTheme = (theme: ThemeType) => {
    setSelectedQuestTheme(theme);
    setCurrentMode('quest-play');
    startGame(); // Set isPlaying to true for quest mode
  };

  if (currentMode === 'quest-play') {
    return (
      <QuestPlay
        theme={selectedQuestTheme}
        onExit={() => {
          setCurrentMode('quest');
          endGame(); // Set isPlaying to false when exiting
        }}
        operationTypes={['addition', 'subtraction']}
        difficulty={1}
      />
    );
  }

  if (currentMode === 'quest') {
    return isMobile ? (
      <MobileQuestSelection
        onSelectTheme={handleSelectQuestTheme}
        onBack={() => setCurrentMode('selection')}
      />
    ) : (
      <QuestSelection
        onSelectTheme={handleSelectQuestTheme}
        onBack={() => setCurrentMode('selection')}
      />
    );
  }

  if (currentMode === 'classic') {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setCurrentMode('selection')}
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
            >
              <span className="text-2xl">←</span>
              <span>{t('back', 'Back')}</span>
            </button>
            <h1 className="text-4xl font-bold text-center">{t('play.classicMode', 'Classic Mode')}</h1>
            <div className="w-20" />
          </div>
          
          {/* Quick Start Grid */}
          <QuickStart onStartGame={onStartClassicGame} />
          
          {/* Custom Game Settings */}
          <PlaySettings onStartGame={onStartClassicGame} />
          
          {/* Existing Worksheets */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">{t('play.savedWorksheets')}</h2>
            
            {worksheets.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-600 mb-4">{t('play.noWorksheets')}</p>
                <a href="/create" className="text-blue-600 hover:underline">
                  {t('play.createFirst')} →
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {worksheets.map((worksheet) => (
                  <motion.div
                    key={worksheet.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
                    onClick={() => onStartWorksheetGame(worksheet)}
                  >
                    <h3 className="text-xl font-semibold mb-2">{worksheet.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {worksheet.problems.length} problems
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`theme-${worksheet.settings.theme} px-3 py-1 rounded text-white text-sm`}>
                        {t(`themes.${worksheet.settings.theme}`)}
                      </span>
                      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Play
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Selection Mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <motion.h1 
          className="text-3xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('play.selectMode', 'Select Play Mode')}
        </motion.h1>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Classic Mode */}
          <motion.button
            className="relative overflow-hidden rounded-2xl shadow-xl transform transition-all hover:scale-105 h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setCurrentMode('classic')}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 md:p-8 text-white h-full flex flex-col">
              <div className="text-5xl md:text-6xl mb-3">📝</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('play.classicMode', 'Classic Mode')}</h2>
              <p className="text-base md:text-lg opacity-90 mb-4 flex-grow">
                {t('play.classicDescription', 'Practice with worksheets and custom problems')}
              </p>
              <div className="space-y-2 text-left text-sm md:text-base">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">✓</span>
                  <span>{t('play.quickStart', 'Quick start levels')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">✓</span>
                  <span>{t('play.customSettings', 'Custom difficulty')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">✓</span>
                  <span>{t('play.savedWorksheets', 'Saved worksheets')}</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
          </motion.button>

          {/* Quest Mode */}
          <motion.button
            className="relative overflow-hidden rounded-2xl shadow-xl transform transition-all hover:scale-105 h-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setCurrentMode('quest')}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 md:p-8 text-white h-full flex flex-col">
              <div className="text-5xl md:text-6xl mb-3">🚀</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('play.questMode', 'Quest Mode')}</h2>
              <p className="text-base md:text-lg opacity-90 mb-4 flex-grow">
                {t('play.questDescription', 'Epic adventures with themed challenges')}
              </p>
              <div className="space-y-2 text-left text-sm md:text-base">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⭐</span>
                  <span>{t('play.themes', '5 Amazing themes')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏆</span>
                  <span>{t('play.achievements', 'Achievements & rewards')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">👾</span>
                  <span>{t('play.bossBattles', 'Epic boss battles')}</span>
                </div>
              </div>
              <motion.div
                className="absolute -top-2 -right-2 bg-yellow-400 text-purple-800 px-3 py-1 rounded-full text-sm font-bold transform rotate-12"
                animate={{ rotate: [12, 15, 12] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                NEW!
              </motion.div>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
          </motion.button>
        </div>

        {/* Feature Comparison - Hidden on mobile for better spacing */}
        <motion.div
          className="mt-8 max-w-4xl mx-auto hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              {t('play.whichMode', 'Which mode is right for you?')}
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-3 text-blue-600">
                  {t('play.chooseClassic', 'Choose Classic Mode if you want to:')}
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• {t('play.classic1', 'Practice specific math operations')}</li>
                  <li>• {t('play.classic2', 'Create custom worksheets')}</li>
                  <li>• {t('play.classic3', 'Focus on fundamentals')}</li>
                  <li>• {t('play.classic4', 'Track simple progress')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">
                  {t('play.chooseQuest', 'Choose Quest Mode if you want to:')}
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• {t('play.quest1', 'Experience themed adventures')}</li>
                  <li>• {t('play.quest2', 'Battle epic bosses')}</li>
                  <li>• {t('play.quest3', 'Unlock achievements')}</li>
                  <li>• {t('play.quest4', 'Share challenges with friends')}</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};