import { Operation, Difficulty, Problem, WorksheetSettings, NumberRange } from '@/types';

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

function generateProblem(settings: WorksheetSettings): Problem {
  const range = settings.numberRange || difficultyRanges[settings.difficulty];
  let operand1 = getRandomNumber(range);
  let operand2 = getRandomNumber(range);
  let operation = settings.operation;

  if (settings.mixedOperations) {
    const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
    operation = operations[Math.floor(Math.random() * operations.length)];
  }

  // Ensure valid problems
  if (operation === 'subtraction') {
    // Make sure result is positive
    if (operand2 > operand1) {
      [operand1, operand2] = [operand2, operand1];
    }
  } else if (operation === 'division') {
    // Ensure clean division
    operand1 = operand2 * getRandomNumber({ min: 1, max: 10 });
  }

  // Check carry-over requirement
  if (settings.carryOver && (operation === 'addition' || operation === 'subtraction')) {
    let attempts = 0;
    while (!hasCarryOver(operand1, operand2, operation) && attempts < 50) {
      operand1 = getRandomNumber(range);
      operand2 = getRandomNumber(range);
      if (operation === 'subtraction' && operand2 > operand1) {
        [operand1, operand2] = [operand2, operand1];
      }
      attempts++;
    }
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

export function generateWorksheetProblems(settings: WorksheetSettings): Problem[] {
  const problems: Problem[] = [];
  const problemCount = settings.problemsPerPage;

  for (let i = 0; i < problemCount; i++) {
    problems.push(generateProblem(settings));
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