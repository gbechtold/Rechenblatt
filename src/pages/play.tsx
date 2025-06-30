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
import { PlayModeSelector } from '@/components/PlayModeSelector';
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
      <PlayModeSelector
        worksheets={worksheets}
        onStartClassicGame={startCustomGame}
        onStartWorksheetGame={startNewGame}
      />
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