import { Operation, Difficulty, Problem, WorksheetSettings, NumberRange, AdditionSubtype, SubtractionSubtype } from '@/types';
import { getAdditionSubtypeRange, getSubtractionSubtypeRange, generateTensNumber, isTrivialProblem } from './subtypeRanges';

const difficultyRanges: Record<Difficulty, NumberRange> = {
  easy: { min: 1, max: 10 },
  medium: { min: 1, max: 20 },
  hard: { min: 1, max: 100 },
  expert: { min: 1, max: 1000 },
};

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function getRandomNumber(range: NumberRange): number {
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function getOperandRangesForSubtype(operation: Operation, subtype: string): { operand1: NumberRange; operand2: NumberRange } | null {
  if (operation === 'addition') {
    return getAdditionSubtypeRange(subtype as AdditionSubtype);
  } else if (operation === 'subtraction') {
    return getSubtractionSubtypeRange(subtype as SubtractionSubtype);
  }
  return null;
}

function calculateAnswer(operand1: number, operand2: number, operation: Operation): number {
  switch (operation) {
    case 'addition':
      return operand1 + operand2;
    case 'subtraction':
      return operand1 - operand2;
    case 'multiplication':
      return operand1 * operand2;
    case 'division':
      return Math.floor(operand1 / operand2);
    default:
      return 0;
  }
}

function hasCarryOver(operand1: number, operand2: number, operation: Operation): boolean {
  if (operation === 'addition') {
    const onesPlace1 = operand1 % 10;
    const onesPlace2 = operand2 % 10;
    return onesPlace1 + onesPlace2 >= 10;
  }
  if (operation === 'subtraction') {
    const onesPlace1 = operand1 % 10;
    const onesPlace2 = operand2 % 10;
    return onesPlace1 < onesPlace2;
  }
  return false;
}

function generateProblem(settings: WorksheetSettings, usedProblems?: Set<string>): Problem {
  let operation = settings.operation;
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    attempts++;
    
    // Handle multiple operations
    if (settings.mixedOperations && settings.operations && settings.operations.length > 0) {
      operation = settings.operations[Math.floor(Math.random() * settings.operations.length)];
    } else if (settings.mixedOperations) {
      const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
      operation = operations[Math.floor(Math.random() * operations.length)];
    }

    // Get operation subtypes if specified
    const subtypes = settings.operationSubtypes?.[operation];
    let selectedSubtype = subtypes && subtypes.length > 0 
      ? subtypes[Math.floor(Math.random() * subtypes.length)]
      : null;

    // Get ranges based on subtype or default
    let operand1: number;
    let operand2: number;
    
    if (selectedSubtype && (operation === 'addition' || operation === 'subtraction')) {
      const ranges = getOperandRangesForSubtype(operation, selectedSubtype);
      if (ranges) {
        // For 'Z' operations, ensure we generate multiples of 10
        if (selectedSubtype.includes('Z+E') || selectedSubtype.includes('Z-E')) {
          operand1 = generateTensNumber(ranges.operand1);
          operand2 = getRandomNumber(ranges.operand2);
        } else if (selectedSubtype.includes('ZE+Z') || selectedSubtype.includes('ZE-Z')) {
          operand1 = getRandomNumber(ranges.operand1);
          operand2 = generateTensNumber(ranges.operand2);
        } else {
          operand1 = getRandomNumber(ranges.operand1);
          operand2 = getRandomNumber(ranges.operand2);
        }
      } else {
        const range = settings.numberRange || difficultyRanges[settings.difficulty];
        operand1 = getRandomNumber(range);
        operand2 = getRandomNumber(range);
      }
    } else {
      const range = settings.numberRange || difficultyRanges[settings.difficulty];
      operand1 = getRandomNumber(range);
      operand2 = getRandomNumber(range);
    }

    // Handle multiplication tables
    if ((operation === 'multiplication' || operation === 'division') && 
        settings.multiplicationTables && 
        settings.multiplicationTables.length > 0) {
      const table = settings.multiplicationTables[Math.floor(Math.random() * settings.multiplicationTables.length)];
      
      if (operation === 'multiplication') {
        operand1 = table;
        operand2 = getRandomNumber({ min: 1, max: 10 });
        if (Math.random() > 0.5) {
          [operand1, operand2] = [operand2, operand1];
        }
      } else if (operation === 'division') {
        operand2 = table;
        const multiplier = getRandomNumber({ min: 1, max: 10 });
        operand1 = operand2 * multiplier;
      }
    }
    // Ensure valid problems for non-multiplication table cases
    else if (operation === 'subtraction') {
      if (operand2 > operand1) {
        [operand1, operand2] = [operand2, operand1];
      }
    } else if (operation === 'division' && !selectedSubtype) {
      operand1 = operand2 * getRandomNumber({ min: 1, max: 10 });
    }

    // Check carry-over requirement
    if (settings.carryOver && (operation === 'addition' || operation === 'subtraction')) {
      if (!hasCarryOver(operand1, operand2, operation)) {
        continue; // Try again
      }
    }

    // Check for trivial problems
    if (settings.suppressTrivial && isTrivialProblem(operand1, operand2, operation)) {
      continue; // Try again
    }

    // Check for duplicates
    const problemKey = `${operand1}${operation}${operand2}`;
    if (settings.avoidDuplicates && usedProblems?.has(problemKey)) {
      continue; // Try again
    }

    const answer = calculateAnswer(operand1, operand2, operation);
    
    const problem: Problem = {
      id: generateId(),
      operand1,
      operand2,
      operation,
      answer,
    };

    // Add placeholder if enabled
    if (settings.placeholders) {
      const placeholderOptions: ('operand1' | 'operand2' | 'answer')[] = ['operand1', 'operand2', 'answer'];
      problem.placeholder = placeholderOptions[Math.floor(Math.random() * placeholderOptions.length)];
    }

    return problem;
  }

  // Fallback if we couldn't generate a valid problem
  const range = settings.numberRange || difficultyRanges[settings.difficulty];
  return {
    id: generateId(),
    operand1: getRandomNumber(range),
    operand2: getRandomNumber(range),
    operation,
    answer: 0,
  };
}

export function generateWorksheetProblems(settings: WorksheetSettings): Problem[] {
  const problems: Problem[] = [];
  const problemCount = settings.problemsPerPage;
  const usedProblems = new Set<string>();

  for (let i = 0; i < problemCount; i++) {
    const problem = generateProblem(settings, usedProblems);
    problems.push(problem);
    
    // Track used problems if avoiding duplicates
    if (settings.avoidDuplicates) {
      const problemKey = `${problem.operand1}${problem.operation}${problem.operand2}`;
      usedProblems.add(problemKey);
    }
  }

  return problems;
}

export function checkAnswer(problem: Problem, userAnswer: number): boolean {
  if (problem.placeholder === 'operand1') {
    return userAnswer === problem.operand1;
  } else if (problem.placeholder === 'operand2') {
    return userAnswer === problem.operand2;
  } else {
    return userAnswer === problem.answer;
  }
}