import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useStore } from '@/lib/store';
import { WorksheetView } from '@/components/WorksheetView';
import { PlaySettings } from '@/components/PlaySettings';
import { ImprovedMultiStepPlayMode } from '@/components/ImprovedMultiStepPlayMode';
import { MobileOptimizedPlayMode } from '@/components/MobileOptimizedPlayMode';
import { PermanentKeyboardPlayMode } from '@/components/PermanentKeyboardPlayMode';
import { QuickStart } from '@/components/QuickStart';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Worksheet, WorksheetSettings, Problem } from '@/types';

export default function Play() {
  const { t } = useTranslation('common');
  const { worksheets, currentWorksheet, setCurrentWorksheet, isPlaying, startGame, endGame, score, updateScore } = useStore();
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleProblemAnswer = (problemId: string, answer: number, isCorrect: boolean) => {
    if (isCorrect) {
      updateScore(10);
      setProblemsCompleted(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (currentWorksheet && problemsCompleted === currentWorksheet.problems.length) {
      setShowCompletion(true);
      // Big celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [problemsCompleted, currentWorksheet]);

  const startNewGame = (worksheet: any) => {
    setCurrentWorksheet(worksheet);
    setProblemsCompleted(0);
    setShowCompletion(false);
    startGame();
  };

  const startCustomGame = (settings: WorksheetSettings, problems: Problem[]) => {
    // Generate title based on selected operations
    let title = t(`themes.${settings.theme}`);
    if (settings.operations && settings.operations.length > 0) {
      if (settings.operations.length === 1) {
        title += ` - ${t(`operations.${settings.operations[0]}`)}`;
      } else {
        title += ` - ${t('settings.mixedOperations')}`;
      }
    } else {
      title += ` - ${t(`operations.${settings.operation}`)}`;
    }
    
    const customWorksheet: Worksheet = {
      id: 'custom-' + Date.now(),
      title: title + ' (' + t('play.customGame') + ')',
      settings,
      problems,
      createdAt: new Date(),
    };
    
    setCurrentWorksheet(customWorksheet);
    setProblemsCompleted(0);
    setShowCompletion(false);
    startGame();
  };

  if (!isPlaying || !currentWorksheet) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">{t('nav.play')}</h1>
          
          {/* Quick Start Grid */}
          <QuickStart onStartGame={startCustomGame} />
          
          {/* Custom Game Settings */}
          <PlaySettings onStartGame={startCustomGame} />
          
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
                  onClick={() => startNewGame(worksheet)}
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

  return isMobile ? (
    <PermanentKeyboardPlayMode
      worksheet={currentWorksheet}
      onProblemAnswer={handleProblemAnswer}
      problemsCompleted={problemsCompleted}
      score={score}
      onExit={endGame}
      onStartNewGame={startCustomGame}
    />
  ) : (
    <ImprovedMultiStepPlayMode
      worksheet={currentWorksheet}
      onProblemAnswer={handleProblemAnswer}
      problemsCompleted={problemsCompleted}
      score={score}
      onExit={endGame}
      onStartNewGame={startCustomGame}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};