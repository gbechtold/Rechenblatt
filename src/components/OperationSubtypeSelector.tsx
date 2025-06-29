import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Operation, AdditionSubtype, SubtractionSubtype, OperationSubtype } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface OperationSubtypeSelectorProps {
  selectedOperations: Operation[];
  selectedSubtypes: Partial<Record<Operation, OperationSubtype[]>>;
  onSubtypesChange: (operation: Operation, subtypes: OperationSubtype[]) => void;
}

const additionSubtypes: AdditionSubtype[] = ['E+E', 'Z+E', 'ZE+E', 'ZE+Z', 'ZE+ZE', 'HZE+HZE'];
const subtractionSubtypes: SubtractionSubtype[] = ['E-E', 'Z-E', 'ZE-E', 'ZE-Z', 'ZE-ZE', 'HZE-HZE'];

export function OperationSubtypeSelector({
  selectedOperations,
  selectedSubtypes,
  onSubtypesChange,
}: OperationSubtypeSelectorProps) {
  const { t } = useTranslation('common');
  const [expandedOperation, setExpandedOperation] = useState<Operation | null>(null);

  const getSubtypesForOperation = (operation: Operation): OperationSubtype[] => {
    switch (operation) {
      case 'addition':
        return additionSubtypes;
      case 'subtraction':
        return subtractionSubtypes;
      default:
        return [];
    }
  };

  const toggleSubtype = (operation: Operation, subtype: OperationSubtype) => {
    const currentSubtypes = selectedSubtypes[operation] || [];
    
    if (currentSubtypes.includes(subtype)) {
      const newSubtypes = currentSubtypes.filter(st => st !== subtype);
      onSubtypesChange(operation, newSubtypes);
    } else {
      onSubtypesChange(operation, [...currentSubtypes, subtype]);
    }
  };

  const toggleAllSubtypes = (operation: Operation) => {
    const allSubtypes = getSubtypesForOperation(operation);
    const currentSubtypes = selectedSubtypes[operation] || [];
    
    if (currentSubtypes.length === allSubtypes.length) {
      onSubtypesChange(operation, []);
    } else {
      onSubtypesChange(operation, allSubtypes);
    }
  };

  const getSubtypeLabel = (subtype: string): string => {
    const labels: Record<string, string> = {
      'E+E': '1-9 + 1-9',
      'Z+E': '10,20,30... + 1-9',
      'ZE+E': '10-99 + 1-9',
      'ZE+Z': '10-99 + 10,20,30...',
      'ZE+ZE': '10-99 + 10-99',
      'HZE+HZE': '100-999 + 100-999',
      'E-E': '1-9 - 1-9',
      'Z-E': '10,20,30... - 1-9',
      'ZE-E': '10-99 - 1-9',
      'ZE-Z': '10-99 - 10,20,30...',
      'ZE-ZE': '10-99 - 10-99',
      'HZE-HZE': '100-999 - 100-999',
    };
    return labels[subtype] || subtype;
  };

  const hasSubtypes = selectedOperations.some(op => op === 'addition' || op === 'subtraction');

  if (!hasSubtypes) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('operations.advancedTypes')}</h3>
      
      {selectedOperations.map((operation) => {
        const subtypes = getSubtypesForOperation(operation);
        if (subtypes.length === 0) return null;

        const isExpanded = expandedOperation === operation;
        const currentSubtypes = selectedSubtypes[operation] || [];

        return (
          <div key={operation} className="border rounded-lg p-3">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedOperation(isExpanded ? null : operation)}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{t(`operations.${operation}`)}</span>
                {currentSubtypes.length > 0 && (
                  <span className="text-sm text-gray-600">
                    ({currentSubtypes.length} {t('common.selected')})
                  </span>
                )}
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 space-y-2"
                >
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllSubtypes(operation);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {currentSubtypes.length === subtypes.length 
                        ? t('actions.selectNone') 
                        : t('actions.selectAll')}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {subtypes.map((subtype) => (
                      <button
                        key={subtype}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubtype(operation, subtype);
                        }}
                        className={`p-2 text-sm rounded-lg border-2 transition-all text-left ${
                          currentSubtypes.includes(subtype)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-medium">{subtype}</div>
                        <div className="text-xs text-gray-600">{getSubtypeLabel(subtype)}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}