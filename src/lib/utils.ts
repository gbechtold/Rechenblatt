import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getOperationSymbol(operation: string): string {
  const symbols: Record<string, string> = {
    addition: '+',
    subtraction: '-',
    multiplication: '×',
    division: '÷',
  };
  return symbols[operation] || '+';
}