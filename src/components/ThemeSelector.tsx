import React from 'react';
import { useTranslation } from 'next-i18next';
import { Theme } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
}

const themes: Theme[] = ['space', 'dino', 'castle', 'ocean', 'circus'];

const themeIcons: Record<Theme, string> = {
  space: '🚀',
  dino: '🦖',
  castle: '🏰',
  ocean: '🌊',
  circus: '🎪',
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onSelectTheme,
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {themes.map((theme) => (
        <motion.button
          key={theme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectTheme(theme)}
          className={cn(
            'p-6 rounded-lg border-2 transition-all',
            'flex flex-col items-center space-y-2',
            selectedTheme === theme
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <span className="text-4xl">{themeIcons[theme]}</span>
          <span className="text-sm font-medium">{t(`themes.${theme}`)}</span>
        </motion.button>
      ))}
    </div>
  );
};