import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ShortUrlService } from '@/lib/questSystem/shortUrlService';
import { ChallengeLink, ThemeType } from '@/lib/questSystem/types';
import { themeDictionaries } from '@/lib/questSystem/themeDictionaries';
import { QuestPlay } from '@/components/QuestPlay';
import { useStore } from '@/lib/store';

interface ChallengePageProps {
  challenge: ChallengeLink | null;
  code: string;
}

export default function ChallengePage({ challenge, code }: ChallengePageProps) {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { startGame } = useStore();
  const [acceptedChallenge, setAcceptedChallenge] = useState(false);
  
  if (acceptedChallenge && challenge) {
    return (
      <QuestPlay
        theme={challenge.quest.theme}
        onExit={() => router.push('/play')}
        operationTypes={['addition', 'subtraction']}
        difficulty={1}
      />
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">{t('challenge.notFound', 'Challenge Not Found')}</h1>
          <p className="text-gray-600 mb-6">
            {t('challenge.notFoundDesc', 'This challenge link is invalid or has expired.')}
          </p>
          <button
            onClick={() => router.push('/play')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            {t('challenge.goToPlay', 'Go to Play Mode')}
          </button>
        </div>
      </div>
    );
  }

  const lang = i18n.language as 'en' | 'de';
  const themeData = themeDictionaries[challenge.quest.theme];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${themeData.colors.background}, ${themeData.colors.primary})`
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl max-w-2xl w-full"
      >
        {/* Challenge Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            ⚔️
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">
            {t('challenge.title', 'You\'ve Been Challenged!')}
          </h1>
          <p className="text-lg text-gray-600">
            {challenge.challenger.name} {t('challenge.invites', 'invites you to beat their score')}
          </p>
        </div>

        {/* Quest Info */}
        <div 
          className="rounded-2xl p-6 mb-6"
          style={{ 
            background: `linear-gradient(135deg, ${themeData.colors.primary}10, ${themeData.colors.secondary}10)` 
          }}
        >
          <h2 className="text-2xl font-bold mb-3 flex items-center justify-center space-x-2">
            <span>{themeData.icon}</span>
            <span>{challenge.quest.title[lang]}</span>
          </h2>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/80 rounded-xl p-4">
              <p className="text-3xl font-bold" style={{ color: themeData.colors.primary }}>
                {challenge.stats.score}
              </p>
              <p className="text-sm text-gray-600">{t('score', 'Score')}</p>
            </div>
            
            <div className="bg-white/80 rounded-xl p-4">
              <p className="text-3xl font-bold" style={{ color: themeData.colors.secondary }}>
                {challenge.stats.combo}x
              </p>
              <p className="text-sm text-gray-600">{t('combo', 'Combo')}</p>
            </div>
            
            <div className="bg-white/80 rounded-xl p-4">
              <p className="text-3xl font-bold" style={{ color: themeData.colors.accent }}>
                {challenge.stats.perfect ? '⭐' : `${Math.floor(challenge.stats.time / 60)}:${(challenge.stats.time % 60).toString().padStart(2, '0')}`}
              </p>
              <p className="text-sm text-gray-600">
                {challenge.stats.perfect ? t('perfect', 'Perfect') : t('time', 'Time')}
              </p>
            </div>
          </div>
        </div>

        {/* Challenge Message */}
        <div className="bg-gray-100 rounded-xl p-4 mb-6">
          <p className="text-center text-gray-700 italic">
            "{challenge.message}"
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              startGame();
              setAcceptedChallenge(true);
            }}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            {t('challenge.accept', 'Accept Challenge')} 🎯
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/play')}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            {t('challenge.decline', 'Maybe Later')}
          </motion.button>
        </div>

        {/* Challenge Date */}
        <p className="text-center text-xs text-gray-500 mt-4">
          {t('challenge.created', 'Challenge created')} {new Date(challenge.createdAt).toLocaleDateString()}
        </p>
      </motion.div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const code = params?.code as string;
  
  // Get challenge data
  const shortUrlService = ShortUrlService.getInstance();
  const challenge = shortUrlService.getChallenge(code);

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
      challenge,
      code,
    },
  };
};