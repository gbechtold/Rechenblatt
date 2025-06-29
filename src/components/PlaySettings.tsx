import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSelector } from './ThemeSelector';
import { OperationSelector } from './OperationSelector';
import { OperationSubtypeSelector } from './OperationSubtypeSelector';
import { ProblemFilters } from './ProblemFilters';
import { WorksheetSettings, Operation, Difficulty } from '@/types';
import { generateWorksheetProblems } from '@/lib/problemGenerator';
import { useStore } from '@/lib/store';

interface PlaySettingsProps {
  onStartGame: (settings: WorksheetSettings, problems: any[]) => void;
}

export function PlaySettings({ onStartGame }: PlaySettingsProps) {
  const { t } = useTranslation('common');
  const { worksheetSettings: defaultSettings } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState<WorksheetSettings>({
    ...defaultSettings,
    problemsPerPage: 10, // Default for play mode
  });

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  const updateSettings = (updates: Partial<WorksheetSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleStartGame = () => {
    const updatedSettings = {
      ...settings,
      mixedOperations: (settings.operations && settings.operations.length > 1) || false,
    };
    
    const problems = generateWorksheetProblems(updatedSettings);
    onStartGame(updatedSettings, problems);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <h2 className="text-xl font-semibold">{t('play.settings.title')}</h2>
        </div>
        <span className="text-sm text-gray-600">
          {isExpanded ? t('actions.collapse') : t('actions.expand')}
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 space-y-6">
              {/* Theme Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('nav.themes')}</h3>
                <ThemeSelector
                  selectedTheme={settings.theme}
                  onSelectTheme={(theme) => updateSettings({ theme })}
                />
              </div>

              {/* Operation Selection */}
              <OperationSelector
                selectedOperations={settings.operations || [settings.operation]}
                multiplicationTables={settings.multiplicationTables || []}
                onOperationsChange={(operations) => {
                  updateSettings({ 
                    operations,
                    operation: operations[0] || 'addition',
                  });
                }}
                onMultiplicationTablesChange={(tables) => {
                  updateSettings({ multiplicationTables: tables });
                }}
              />

              {/* Operation Subtypes */}
              <OperationSubtypeSelector
                selectedOperations={settings.operations || [settings.operation]}
                selectedSubtypes={settings.operationSubtypes || {}}
                onSubtypesChange={(operation, subtypes) => {
                  updateSettings({
                    operationSubtypes: {
                      ...(settings.operationSubtypes || {}),
                      [operation]: subtypes
                    }
                  });
                }}
              />

              {/* Difficulty */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('play.settings.difficulty')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => updateSettings({ difficulty: diff })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        settings.difficulty === diff
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {t(`difficulty.${diff}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Problems */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('play.settings.problemCount')}</h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={settings.problemsPerPage}
                    onChange={(e) => updateSettings({ problemsPerPage: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-semibold">{settings.problemsPerPage}</span>
                </div>
              </div>

              {/* Additional Settings */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{t('play.settings.options')}</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.carryOver}
                    onChange={(e) => updateSettings({ carryOver: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t('settings.carryOver')}</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.placeholders}
                    onChange={(e) => updateSettings({ placeholders: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t('settings.placeholders')}</span>
                </label>
              </div>

              {/* Problem Filters */}
              <ProblemFilters
                suppressTrivial={settings.suppressTrivial || false}
                avoidDuplicates={settings.avoidDuplicates || false}
                onSuppressTrivialChange={(value) => updateSettings({ suppressTrivial: value })}
                onAvoidDuplicatesChange={(value) => updateSettings({ avoidDuplicates: value })}
              />

              {/* Start Button */}
              <button
                onClick={handleStartGame}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                {t('play.settings.startCustomGame')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}