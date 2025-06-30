import React, { ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { userMode, setUserMode, currentTheme, isPlaying } = useStore();

  const toggleMode = () => {
    setUserMode(userMode === 'teacher' ? 'student' : 'teacher');
  };

  const toggleLanguage = () => {
    const newLocale = router.locale === 'en' ? 'de' : 'en';
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  // Hide header navigation when playing on mobile
  const shouldHideHeader = isPlaying && router.pathname === '/play';

  return (
    <div className={cn('min-h-screen flex flex-col', `theme-${currentTheme}`)}>
      {!shouldHideHeader && (
        <nav className="no-print bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-2xl font-bold hover:text-gray-700 transition-colors"
              >
                Rechenblatt
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/create"
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    router.pathname === '/create'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {t('nav.create')}
                </Link>
                <Link
                  href="/play"
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    router.pathname === '/play'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {t('nav.play')}
                </Link>
                {/* Component Library - only visible in development */}
                {process.env.NODE_ENV === 'development' && (
                  <Link
                    href="/library"
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      router.pathname === '/library'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    Library
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="text-sm font-medium px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                {router.locale === 'en' ? 'DE' : 'EN'}
              </button>
              <button
                onClick={toggleMode}
                className={cn(
                  'text-sm font-medium px-4 py-2 rounded-md',
                  userMode === 'teacher'
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-600 text-white'
                )}
              >
                {t(`mode.${userMode}`)}
              </button>
            </div>
          </div>
        </div>
      </nav>
      )}
      <main className="flex-grow flex flex-col">{children}</main>
      {!shouldHideHeader && (
        <footer className="no-print bg-gray-800 text-white py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm">{t('home.footer')}</p>
          </div>
        </footer>
      )}
    </div>
  );
};