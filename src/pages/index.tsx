import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';

export default function Home() {
  const { t } = useTranslation('common');
  const { userMode } = useStore();

  const features = [
    {
      icon: '🎨',
      title: 'Beautiful Themes',
      description: 'Choose from 5 engaging themes to make math fun',
    },
    {
      icon: '🖨️',
      title: 'Print Ready',
      description: 'Generate worksheets optimized for printing',
    },
    {
      icon: '🎮',
      title: 'Interactive Mode',
      description: 'Play and learn with instant feedback',
    },
    {
      icon: '👨‍🏫',
      title: 'Teacher Tools',
      description: 'Track progress and manage assignments',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            {t('app.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            {t('app.description')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Link
              href="/create"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              {t('actions.generate')}
            </Link>
            <Link
              href="/play"
              className="px-8 py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition"
            >
              {t('actions.play')}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {userMode === 'teacher' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">{t('teacher.classManagement')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Link
                href="/teacher/classes"
                className="p-6 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
              >
                <h3 className="text-xl font-semibold mb-2">Manage Classes</h3>
                <p className="text-gray-600">Create and organize your classes</p>
              </Link>
              <Link
                href="/teacher/assignments"
                className="p-6 bg-green-100 rounded-lg hover:bg-green-200 transition"
              >
                <h3 className="text-xl font-semibold mb-2">{t('teacher.assignments')}</h3>
                <p className="text-gray-600">Create and track assignments</p>
              </Link>
              <Link
                href="/teacher/reports"
                className="p-6 bg-purple-100 rounded-lg hover:bg-purple-200 transition"
              >
                <h3 className="text-xl font-semibold mb-2">{t('teacher.reports')}</h3>
                <p className="text-gray-600">View student progress reports</p>
              </Link>
            </div>
          </div>
        </section>
      )}
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