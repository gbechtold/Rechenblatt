import { GetStaticProps } from 'next';
import { useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactToPrint } from 'react-to-print';
import { useStore } from '@/lib/store';
import { generateWorksheetProblems } from '@/lib/problemGenerator';
import { exportToPDF } from '@/lib/pdfExport';
import { WorksheetView } from '@/components/WorksheetView';
import { ThemeSelector } from '@/components/ThemeSelector';
import { OperationSelector } from '@/components/OperationSelector';
import { LayoutConfigurator } from '@/components/LayoutConfigurator';
import { OperationSubtypeSelector } from '@/components/OperationSubtypeSelector';
import { ProblemFilters } from '@/components/ProblemFilters';
import { Operation, Difficulty, Worksheet } from '@/types';
import { motion } from 'framer-motion';

export default function Create() {
  const { t } = useTranslation('common');
  const { worksheetSettings, updateWorksheetSettings, addWorksheet, currentTheme, setTheme } = useStore();
  const [currentWorksheet, setCurrentWorksheet] = useState<Worksheet | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleExportPDF = async () => {
    if (!printRef.current || !currentWorksheet) return;
    
    const result = await exportToPDF(printRef.current, {
      pageFormat: worksheetSettings.pageFormat || 'A4',
      filename: `${currentWorksheet.title.replace(/[^a-z0-9äöüßÄÖÜ\s]/gi, '_').replace(/\s+/g, '_').replace(/_+/g, '_')}.pdf`
    });
    
    if (!result.success) {
      console.error('Failed to export PDF:', result.error);
    }
  };

  const generateWorksheet = () => {
    // Update the settings with the current state
    const updatedSettings = {
      ...worksheetSettings,
      mixedOperations: (worksheetSettings.operations && worksheetSettings.operations.length > 1) || false,
    };
    
    const problems = generateWorksheetProblems(updatedSettings);
    
    // Generate title based on selected operations
    let title = t(`themes.${updatedSettings.theme}`);
    if (updatedSettings.operations && updatedSettings.operations.length > 0) {
      if (updatedSettings.operations.length === 1) {
        title += ` - ${t(`operations.${updatedSettings.operations[0]}`)}`;
      } else {
        title += ` - ${t('settings.mixedOperations')}`;
      }
    } else {
      title += ` - ${t(`operations.${updatedSettings.operation}`)}`;
    }
    
    const worksheet: Worksheet = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      settings: updatedSettings,
      problems,
      createdAt: new Date(),
    };
    setCurrentWorksheet(worksheet);
    addWorksheet(worksheet);
  };

  const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">{t('nav.create')}</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('nav.themes')}</h2>
              <ThemeSelector
                selectedTheme={worksheetSettings.theme}
                onSelectTheme={(theme) => {
                  updateWorksheetSettings({ theme });
                  setTheme(theme);
                }}
              />
            </div>

            {/* Operation Selector with Multiplication Tables */}
            <OperationSelector
              selectedOperations={worksheetSettings.operations || [worksheetSettings.operation]}
              multiplicationTables={worksheetSettings.multiplicationTables || []}
              onOperationsChange={(operations) => {
                updateWorksheetSettings({ 
                  operations,
                  operation: operations[0] || 'addition',
                });
              }}
              onMultiplicationTablesChange={(tables) => {
                updateWorksheetSettings({ multiplicationTables: tables });
              }}
            />

            {/* Operation Subtype Selector */}
            <OperationSubtypeSelector
              selectedOperations={worksheetSettings.operations || [worksheetSettings.operation]}
              selectedSubtypes={worksheetSettings.operationSubtypes || {}}
              onSubtypesChange={(operation, subtypes) => {
                updateWorksheetSettings({
                  operationSubtypes: {
                    ...(worksheetSettings.operationSubtypes || {}),
                    [operation]: subtypes
                  }
                });
              }}
            />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Difficulty</h2>
              <div className="grid grid-cols-2 gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => updateWorksheetSettings({ difficulty: diff })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      worksheetSettings.difficulty === diff
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {t(`difficulty.${diff}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Settings</h2>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t('settings.problemsPerPage')}</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={worksheetSettings.problemsPerPage}
                  onChange={(e) => updateWorksheetSettings({ problemsPerPage: parseInt(e.target.value) || 12 })}
                  className="w-20 p-2 border rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t('settings.columns')}</label>
                <select
                  value={worksheetSettings.columns}
                  onChange={(e) => updateWorksheetSettings({ columns: parseInt(e.target.value) })}
                  className="p-2 border rounded"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="space-y-2">
                {[
                  { key: 'showNumbers', label: t('settings.showNumbers') },
                  { key: 'showSolutions', label: t('settings.showSolutions') },
                  { key: 'carryOver', label: t('settings.carryOver') },
                  { key: 'placeholders', label: t('settings.placeholders') },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={worksheetSettings[key as keyof typeof worksheetSettings] as boolean}
                      onChange={(e) => updateWorksheetSettings({ [key]: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Problem Filters */}
            <ProblemFilters
              suppressTrivial={worksheetSettings.suppressTrivial || false}
              avoidDuplicates={worksheetSettings.avoidDuplicates || false}
              onSuppressTrivialChange={(value) => updateWorksheetSettings({ suppressTrivial: value })}
              onAvoidDuplicatesChange={(value) => updateWorksheetSettings({ avoidDuplicates: value })}
            />

            {/* Layout Configuration */}
            <LayoutConfigurator
              selectedOperations={worksheetSettings.operations || [worksheetSettings.operation]}
              columnsPerOperation={worksheetSettings.columnsPerOperation || {
                addition: 2,
                subtraction: 2,
                multiplication: 2,
                division: 2
              }}
              pageFormat={worksheetSettings.pageFormat || 'A4'}
              onColumnsChange={(operation, columns) => {
                updateWorksheetSettings({
                  columnsPerOperation: {
                    ...(worksheetSettings.columnsPerOperation || {
                      addition: 2,
                      subtraction: 2,
                      multiplication: 2,
                      division: 2
                    }),
                    [operation]: columns
                  }
                });
              }}
              onPageFormatChange={(format) => {
                updateWorksheetSettings({ pageFormat: format });
              }}
            />

            <div className="flex flex-wrap gap-3">
              <button
                onClick={generateWorksheet}
                className="flex-1 min-w-[120px] py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {t('actions.generate')}
              </button>
              {currentWorksheet && (
                <>
                  <button
                    onClick={handlePrint}
                    className="flex-1 min-w-[120px] py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    {t('actions.print')}
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="flex-1 min-w-[120px] py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    {t('actions.exportPDF')}
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-100 p-4 rounded-lg overflow-auto"
            style={{ maxHeight: '80vh' }}
          >
            {currentWorksheet ? (
              <div ref={printRef}>
                <WorksheetView worksheet={currentWorksheet} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-xl mb-2">No worksheet generated yet</p>
                  <p>Configure settings and click Generate</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
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