import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Memory Match Mini-Game
export const MemoryMatch: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [cards, setCards] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // Generate pairs of numbers
    const numbers = Array.from({ length: 6 }, (_, i) => i + 1);
    const pairs = [...numbers, ...numbers];
    setCards(pairs.sort(() => Math.random() - 0.5));
  }, []);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
        
        if (matched.length + 2 === cards.length) {
          const score = Math.max(100 - moves * 2, 50);
          setTimeout(() => onComplete(score), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="bg-purple-100 p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-center">Memory Match!</h3>
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {cards.map((card, index) => (
          <motion.button
            key={index}
            onClick={() => handleCardClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-16 h-16 rounded-lg font-bold text-xl ${
              flipped.includes(index) || matched.includes(index)
                ? 'bg-purple-500 text-white'
                : 'bg-purple-300'
            }`}
          >
            {flipped.includes(index) || matched.includes(index) ? card : '?'}
          </motion.button>
        ))}
      </div>
      <p className="text-center mt-4 text-sm text-gray-600">Moves: {moves}</p>
    </div>
  );
};

// Time Attack Mini-Game
export const TimeAttack: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentProblem, setCurrentProblem] = useState({ a: 0, b: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    generateProblem();
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [score]);

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCurrentProblem({ a, b, answer: a + b });
    setUserAnswer('');
  };

  const handleSubmit = () => {
    if (parseInt(userAnswer) === currentProblem.answer) {
      setScore(score + 10);
      setFeedback('✓ Correct!');
      generateProblem();
    } else {
      setFeedback('✗ Try again!');
    }
    setTimeout(() => setFeedback(''), 1000);
  };

  return (
    <div className="bg-orange-100 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">⚡ Time Attack!</h3>
        <div className="text-lg font-bold text-orange-600">{timeLeft}s</div>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-3xl font-bold mb-4">
          {currentProblem.a} + {currentProblem.b} = ?
        </div>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-24 h-12 text-xl text-center border-2 border-orange-400 rounded"
          autoFocus
        />
      </div>
      
      <button
        onClick={handleSubmit}
        className="w-full py-2 bg-orange-500 text-white rounded font-bold hover:bg-orange-600"
      >
        Submit
      </button>
      
      <div className="mt-4 text-center">
        <p className="text-lg font-bold">Score: {score}</p>
        {feedback && <p className="text-sm mt-1">{feedback}</p>}
      </div>
    </div>
  );
};

// Pattern Finder Game
export const PatternFinder: React.FC<{ onComplete: (found: boolean) => void }> = ({ onComplete }) => {
  const [sequence] = useState([1, 1, 2, 3, 5, 8, 13]);
  const [revealed, setRevealed] = useState([true, true, true, true, false, false, false]);
  const [guess, setGuess] = useState(['', '', '']);
  
  const checkPattern = () => {
    const correct = 
      parseInt(guess[0]) === 5 &&
      parseInt(guess[1]) === 8 &&
      parseInt(guess[2]) === 13;
    
    if (correct) {
      onComplete(true);
    }
  };

  return (
    <div className="bg-green-100 p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-center">🔍 Find the Pattern!</h3>
      <p className="text-sm text-center mb-4">Can you complete the Fibonacci sequence?</p>
      
      <div className="flex justify-center space-x-2 mb-4">
        {sequence.map((num, index) => (
          <div key={index} className="w-12 h-12 bg-green-300 rounded flex items-center justify-center font-bold">
            {revealed[index] ? num : '?'}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center space-x-2 mb-4">
        {guess.map((g, index) => (
          <input
            key={index}
            type="number"
            value={g}
            onChange={(e) => {
              const newGuess = [...guess];
              newGuess[index] = e.target.value;
              setGuess(newGuess);
            }}
            className="w-12 h-12 text-center border-2 border-green-400 rounded"
            placeholder="?"
          />
        ))}
      </div>
      
      <button
        onClick={checkPattern}
        className="w-full py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600"
      >
        Check Pattern
      </button>
    </div>
  );
};

// Shake Detection Hook
export const useShakeDetection = (onShake: () => void) => {
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastTime = Date.now();
    
    const handleMotion = (event: DeviceMotionEvent) => {
      const current = event.accelerationIncludingGravity;
      if (!current) return;
      
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTime;
      
      if (timeDiff > 100) {
        const deltaX = Math.abs(lastX - (current.x || 0));
        const deltaY = Math.abs(lastY - (current.y || 0));
        const deltaZ = Math.abs(lastZ - (current.z || 0));
        
        if (deltaX + deltaY + deltaZ > 15) {
          onShake();
        }
        
        lastX = current.x || 0;
        lastY = current.y || 0;
        lastZ = current.z || 0;
        lastTime = currentTime;
      }
    };
    
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }
    
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [onShake]);
};

// Boss Battle Component
export const BossBattle: React.FC<{ 
  problem: { a: number; b: number; operation: string; answer: number };
  onDefeat: () => void;
}> = ({ problem, onDefeat }) => {
  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [userAnswer, setUserAnswer] = useState('');
  const [attacking, setAttacking] = useState(false);

  const getOperationSymbol = (op: string) => {
    switch (op) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      case 'division': return '÷';
      default: return '+';
    }
  };

  const handleAttack = () => {
    const correct = parseInt(userAnswer) === problem.answer;
    setAttacking(true);
    
    if (correct) {
      setBossHealth(prev => Math.max(0, prev - 25));
      if (bossHealth <= 25) {
        setTimeout(onDefeat, 1000);
      }
    } else {
      setPlayerHealth(prev => Math.max(0, prev - 20));
    }
    
    setUserAnswer('');
    setTimeout(() => setAttacking(false), 500);
  };

  return (
    <div className="bg-red-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-center">👾 BOSS BATTLE!</h3>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold">Boss</span>
          <span className="text-sm">{bossHealth}/100</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <motion.div 
            className="bg-red-500 h-4 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: `${bossHealth}%` }}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold">You</span>
          <span className="text-sm">{playerHealth}/100</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <motion.div 
            className="bg-green-500 h-4 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: `${playerHealth}%` }}
          />
        </div>
      </div>
      
      <motion.div
        animate={attacking ? { x: [-5, 5, -5, 5, 0] } : {}}
        className="text-center mb-4"
      >
        <div className="text-3xl font-bold">
          {problem.a} {getOperationSymbol(problem.operation)} {problem.b} = ?
        </div>
      </motion.div>
      
      <div className="flex space-x-2">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAttack()}
          className="flex-1 h-12 text-xl text-center border-2 border-red-400 rounded"
          autoFocus
        />
        <button
          onClick={handleAttack}
          className="px-6 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600"
        >
          Attack!
        </button>
      </div>
    </div>
  );
};