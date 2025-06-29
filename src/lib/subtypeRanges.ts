import { AdditionSubtype, SubtractionSubtype, NumberRange } from '@/types';

// Get number range for specific addition subtypes
export function getAdditionSubtypeRange(subtype: AdditionSubtype): { operand1: NumberRange; operand2: NumberRange } {
  switch (subtype) {
    case 'E+E': // Ones + Ones
      return {
        operand1: { min: 1, max: 9 },
        operand2: { min: 1, max: 9 }
      };
    
    case 'Z+E': // Tens + Ones
      return {
        operand1: { min: 10, max: 90 },
        operand2: { min: 1, max: 9 }
      };
    
    case 'ZE+E': // Two-digit + Ones
      return {
        operand1: { min: 10, max: 99 },
        operand2: { min: 1, max: 9 }
      };
    
    case 'ZE+Z': // Two-digit + Tens
      return {
        operand1: { min: 10, max: 99 },
        operand2: { min: 10, max: 90 }
      };
    
    case 'ZE+ZE': // Two-digit + Two-digit
      return {
        operand1: { min: 10, max: 99 },
        operand2: { min: 10, max: 99 }
      };
    
    case 'HZE+HZE': // Three-digit + Three-digit
      return {
        operand1: { min: 100, max: 999 },
        operand2: { min: 100, max: 999 }
      };
    
    default:
      return {
        operand1: { min: 1, max: 99 },
        operand2: { min: 1, max: 99 }
      };
  }
}

// Get number range for specific subtraction subtypes
export function getSubtractionSubtypeRange(subtype: SubtractionSubtype): { operand1: NumberRange; operand2: NumberRange } {
  switch (subtype) {
    case 'E-E': // Ones - Ones
      return {
        operand1: { min: 1, max: 9 },
        operand2: { min: 1, max: 9 }
      };
    
    case 'Z-E': // Tens - Ones
      return {
        operand1: { min: 10, max: 90 },
        operand2: { min: 1, max: 9 }
      };
    
    case 'ZE-E': // Two-digit - Ones
      return {
        operand1: { min: 10, max: 99 },
        operand2: { min: 1, max: 9 }
      };
    
    case 'ZE-Z': // Two-digit - Tens
      return {
        operand1: { min: 10, max: 99 },
        operand2: { min: 10, max: 90 }
      };
    
    case 'ZE-ZE': // Two-digit - Two-digit
      return {
        operand1: { min: 10, max: 99 },
        operand2: { min: 10, max: 99 }
      };
    
    case 'HZE-HZE': // Three-digit - Three-digit
      return {
        operand1: { min: 100, max: 999 },
        operand2: { min: 100, max: 999 }
      };
    
    default:
      return {
        operand1: { min: 1, max: 99 },
        operand2: { min: 1, max: 99 }
      };
  }
}

// Generate a number that's a multiple of 10 (for Z operations)
export function generateTensNumber(range: NumberRange): number {
  const min = Math.ceil(range.min / 10) * 10;
  const max = Math.floor(range.max / 10) * 10;
  const tensCount = (max - min) / 10 + 1;
  return min + Math.floor(Math.random() * tensCount) * 10;
}

// Check if a number is "trivial" for filtering
export function isTrivialProblem(operand1: number, operand2: number, operation: string): boolean {
  switch (operation) {
    case 'addition':
      return (operand1 === 0 || operand2 === 0) || 
             (operand1 === 1 && operand2 === 1);
    
    case 'subtraction':
      return operand1 === operand2 || operand2 === 0;
    
    case 'multiplication':
      return operand1 === 0 || operand2 === 0 || 
             operand1 === 1 || operand2 === 1;
    
    case 'division':
      return operand2 === 1 || operand1 === 0;
    
    default:
      return false;
  }
}