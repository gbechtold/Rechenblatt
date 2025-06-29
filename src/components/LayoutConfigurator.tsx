import { useTranslation } from 'next-i18next';
import { Operation } from '@/types';

interface LayoutConfiguratorProps {
  selectedOperations: Operation[];
  columnsPerOperation: Record<Operation, number>;
  pageFormat: 'A4' | 'Letter';
  onColumnsChange: (operation: Operation, columns: number) => void;
  onPageFormatChange: (format: 'A4' | 'Letter') => void;
}

export function LayoutConfigurator({
  selectedOperations,
  columnsPerOperation,
  pageFormat,
  onColumnsChange,
  onPageFormatChange,
}: LayoutConfiguratorProps) {
  const { t } = useTranslation('common');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('layout.title')}</h3>
        
        {/* Page Format Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">{t('layout.pageFormat')}</label>
          <div className="flex gap-2">
            <button
              onClick={() => onPageFormatChange('A4')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                pageFormat === 'A4'
                  ? 'border-blue-500 bg-blue-50 font-semibold'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              A4
            </button>
            <button
              onClick={() => onPageFormatChange('Letter')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                pageFormat === 'Letter'
                  ? 'border-blue-500 bg-blue-50 font-semibold'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Letter
            </button>
          </div>
        </div>

        {/* Columns per Operation */}
        {selectedOperations.length > 1 && (
          <div className="space-y-3">
            <label className="text-sm font-medium">{t('layout.columnsPerOperation')}</label>
            {selectedOperations.map((operation) => (
              <div key={operation} className="flex items-center justify-between">
                <span className="text-sm">{t(`operations.${operation}`)}</span>
                <select
                  value={columnsPerOperation[operation] || 2}
                  onChange={(e) => onColumnsChange(operation, parseInt(e.target.value))}
                  className="p-2 border rounded"
                >
                  <option value="1">1 {t('layout.column')}</option>
                  <option value="2">2 {t('layout.columns')}</option>
                  <option value="3">3 {t('layout.columns')}</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}