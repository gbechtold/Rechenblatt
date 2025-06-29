import React, { forwardRef } from 'react';
import { Worksheet } from '@/types';
import { MathProblem } from './MathProblem';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface WorksheetViewProps {
  worksheet: Worksheet;
  isInteractive?: boolean;
  onProblemAnswer?: (problemId: string, answer: number, isCorrect: boolean) => void;
}

export const WorksheetView = forwardRef<HTMLDivElement, WorksheetViewProps>(
  ({ worksheet, isInteractive = false, onProblemAnswer }, ref) => {
    const { settings, problems, title } = worksheet;
    
    // Group problems by operation if multiple operations are selected
    const problemsByOperation = settings.operations && settings.operations.length > 1
      ? problems.reduce((acc, problem) => {
          if (!acc[problem.operation]) {
            acc[problem.operation] = [];
          }
          acc[problem.operation].push(problem);
          return acc;
        }, {} as Record<string, typeof problems>)
      : null;
    
    const getColumnsClass = (columns: number) => {
      switch (columns) {
        case 1: return 'grid-cols-1';
        case 2: return 'grid-cols-2';
        case 3: return 'grid-cols-3';
        default: return 'grid-cols-2';
      }
    };

    const getThemeDecorations = (theme: string) => {
      switch (theme) {
        case 'space':
          return (
            <>
              <div className="absolute top-4 right-4 text-6xl opacity-20">🚀</div>
              <div className="absolute bottom-4 left-4 text-6xl opacity-20">🌟</div>
            </>
          );
        case 'dino':
          return (
            <>
              <div className="absolute top-4 right-4 text-6xl opacity-20">🦕</div>
              <div className="absolute bottom-4 left-4 text-6xl opacity-20">🦴</div>
            </>
          );
        case 'castle':
          return (
            <>
              <div className="absolute top-4 right-4 text-6xl opacity-20">🏰</div>
              <div className="absolute bottom-4 left-4 text-6xl opacity-20">⚔️</div>
            </>
          );
        case 'ocean':
          return (
            <>
              <div className="absolute top-4 right-4 text-6xl opacity-20">🐠</div>
              <div className="absolute bottom-4 left-4 text-6xl opacity-20">🌊</div>
            </>
          );
        case 'circus':
          return (
            <>
              <div className="absolute top-4 right-4 text-6xl opacity-20">🎪</div>
              <div className="absolute bottom-4 left-4 text-6xl opacity-20">🤹</div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div ref={ref} className="worksheet-page bg-white p-8 print:p-0 relative overflow-hidden">
        {!isInteractive && getThemeDecorations(settings.theme)}
        
        {/* Header Section */}
        <div className="print:border-b print:border-gray-300 print:pb-4 print:mb-6">
          <h1 className="text-3xl font-bold text-center mb-6 print:text-2xl print:mb-4">{title}</h1>
          <div className="flex justify-between items-start max-w-2xl mx-auto print:max-w-full">
            <div className="flex flex-col print:flex-1">
              <span className="text-gray-700 text-sm font-medium mb-1 print:text-base">Name:</span>
              <div className="border-b-2 border-gray-400 w-64 h-8 print:w-full print:mr-8"></div>
            </div>
            <div className="flex flex-col print:w-40">
              <span className="text-gray-700 text-sm font-medium mb-1 print:text-base">Datum:</span>
              <div className="border-b-2 border-gray-400 w-32 h-8 print:w-full"></div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="print:px-8 print:py-4">
          {/* Render problems grouped by operation if multiple operations are selected */}
          {problemsByOperation ? (
            <div className="space-y-6 print:space-y-8">
              {settings.operations!.map((operation, opIndex) => {
                const operationProblems = problemsByOperation[operation] || [];
                if (operationProblems.length === 0) return null;
                
                const columns = settings.columnsPerOperation?.[operation] || settings.columns;
                return (
                  <div key={operation} className="print:break-inside-avoid">
                    {settings.operations!.length > 1 && (
                      <h3 className="text-lg font-semibold mb-3 print:mb-4 text-gray-700">
                        {operation === 'addition' && 'Addition'}
                        {operation === 'subtraction' && 'Subtraktion'}
                        {operation === 'multiplication' && 'Multiplikation'}
                        {operation === 'division' && 'Division'}
                      </h3>
                    )}
                    <div className={cn('grid gap-x-8 gap-y-4 print:gap-x-12 print:gap-y-6', getColumnsClass(columns))}>
                      {operationProblems.map((problem, index) => (
                    <MathProblem
                      key={problem.id}
                      problem={problem}
                      showSolution={settings.showSolutions}
                      isInteractive={isInteractive}
                      onAnswer={(answer, isCorrect) => 
                        onProblemAnswer && onProblemAnswer(problem.id, answer, isCorrect)
                      }
                      theme={settings.theme}
                      index={settings.showNumbers ? problems.indexOf(problem) + 1 : 0}
                    />
                  ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={cn('grid gap-x-8 gap-y-4 print:gap-x-12 print:gap-y-6', getColumnsClass(settings.columns))}>
              {problems.map((problem, index) => (
              <MathProblem
                key={problem.id}
                problem={problem}
                showSolution={settings.showSolutions}
                isInteractive={isInteractive}
                onAnswer={(answer, isCorrect) => 
                  onProblemAnswer && onProblemAnswer(problem.id, answer, isCorrect)
                }
                theme={settings.theme}
                index={settings.showNumbers ? index + 1 : 0}
              />
            ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 print:hidden">
          Page 1 of 1
        </div>
      </div>
    );
  }
);

WorksheetView.displayName = 'WorksheetView';