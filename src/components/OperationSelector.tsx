import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Operation } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface OperationSelectorProps {
  selectedOperations: Operation[];
  multiplicationTables: number[];
  onOperationsChange: (operations: Operation[]) => void;
  onMultiplicationTablesChange: (tables: number[]) => void;
}

export function OperationSelector({
  selectedOperations,
  multiplicationTables,
  onOperationsChange,
  onMultiplicationTablesChange,
}: OperationSelectorProps) {
  const { t } = useTranslation('common');
  const [showMultiplicationTables, setShowMultiplicationTables] = useState(false);

  const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];

  const toggleOperation = (operation: Operation) => {
    if (selectedOperations.includes(operation)) {
      const newOperations = selectedOperations.filter(op => op !== operation);
      onOperationsChange(newOperations.length > 0 ? newOperations : [operation]);
      
      // Hide multiplication tables if neither multiplication nor division is selected
      if (operation === 'multiplication' || operation === 'division') {
        const hasMultiplicationOrDivision = newOperations.includes('multiplication') || newOperations.includes('division');
        if (!hasMultiplicationOrDivision) {
          setShowMultiplicationTables(false);
        }
      }
    } else {
      onOperationsChange([...selectedOperations, operation]);
      
      // Show multiplication tables if multiplication or division is selected
      if (operation === 'multiplication' || operation === 'division') {
        setShowMultiplicationTables(true);
      }
    }
  };

  const toggleMultiplicationTable = (table: number) => {
    if (multiplicationTables.includes(table)) {
      const newTables = multiplicationTables.filter(t => t !== table);
      onMultiplicationTablesChange(newTables.length > 0 ? newTables : [table]);
    } else {
      onMultiplicationTablesChange([...multiplicationTables, table]);
    }
  };

  const toggleAllTables = () => {
    if (multiplicationTables.length === 10) {
      onMultiplicationTablesChange([1]);
    } else {
      onMultiplicationTablesChange([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('operations.title')}</h3>
        <div className="grid grid-cols-2 gap-2">
          {operations.map((op) => (
            <button
              key={op}
              onClick={() => toggleOperation(op)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedOperations.includes(op)
                  ? 'border-blue-500 bg-blue-50 font-semibold'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {t(`operations.${op}`)}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showMultiplicationTables && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-semibold">{t('operations.multiplicationTables')}</h4>
                <button
                  onClick={toggleAllTables}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {multiplicationTables.length === 10 ? t('actions.selectNone') : t('actions.selectAll')}
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((table) => (
                  <button
                    key={table}
                    onClick={() => toggleMultiplicationTable(table)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      multiplicationTables.includes(table)
                        ? 'border-blue-500 bg-blue-50 font-semibold'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {table}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}