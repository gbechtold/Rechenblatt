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
    const columnsClass = `grid-cols-${settings.columns}`;

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
      <div ref={ref} className="worksheet-page bg-white p-8 relative overflow-hidden">
        {getThemeDecorations(settings.theme)}
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <div className="flex justify-between items-center max-w-md mx-auto">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Name:</span>
              <div className="border-b-2 border-gray-400 w-48"></div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Date:</span>
              <div className="border-b-2 border-gray-400 w-32"></div>
            </div>
          </div>
        </div>

        <div className={cn('grid gap-8', columnsClass)}>
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

        <div className="mt-8 text-center text-sm text-gray-500 print:hidden">
          Page 1 of 1
        </div>
      </div>
    );
  }
);

WorksheetView.displayName = 'WorksheetView';