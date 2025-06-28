import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useStore } from '@/lib/store';
import { WorksheetView } from '@/components/WorksheetView';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function Play() {
  const { t } = useTranslation('common');
  const { worksheets, currentWorksheet, setCurrentWorksheet, isPlaying, startGame, endGame, score, updateScore } = useStore();
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const handleProblemAnswer = (problemId: string, answer: number, isCorrect: boolean) => {
    if (isCorrect) {
      updateScore(10);
      setProblemsCompleted(prev => prev + 1);
      
      // Small celebration
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 }
      });
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

  if (!isPlaying || !currentWorksheet) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">{t('nav.play')}</h1>
          
          {worksheets.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-4">No worksheets available yet!</p>
              <a href="/create" className="text-blue-600 hover:underline">
                Create your first worksheet →
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
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-gray-600">Score:</span>
              <span className="ml-2 text-2xl font-bold text-blue-600">{score}</span>
            </div>
            <div>
              <span className="text-gray-600">Progress:</span>
              <span className="ml-2 text-lg font-semibold">
                {problemsCompleted} / {currentWorksheet.problems.length}
              </span>
            </div>
          </div>
          <button
            onClick={endGame}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Exit Game
          </button>
        </div>

        <AnimatePresence>
          {showCompletion ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-20"
            >
              <h2 className="text-5xl font-bold mb-4 text-green-600">
                {t('game.complete')}
              </h2>
              <p className="text-2xl mb-8">
                Final Score: {score} {t('game.points')}
              </p>
              <button
                onClick={endGame}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700"
              >
                Back to Worksheets
              </button>
            </motion.div>
          ) : (
            <div className={`theme-${currentWorksheet.settings.theme} p-8 rounded-lg`}>
              <WorksheetView
                worksheet={currentWorksheet}
                isInteractive={true}
                onProblemAnswer={handleProblemAnswer}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};