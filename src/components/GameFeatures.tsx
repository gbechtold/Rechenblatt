import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameFeaturesState {
  combo: number;
  totalScore: number;
  speedBonus: boolean;
  perfectStreak: number;
  mathPetLevel: number;
  achievements: string[];
  lastAnswerTime: number;
}

export const useGameFeatures = () => {
  const [features, setFeatures] = useState<GameFeaturesState>({
    combo: 0,
    totalScore: 0,
    speedBonus: false,
    perfectStreak: 0,
    mathPetLevel: 1,
    achievements: [],
    lastAnswerTime: Date.now(),
  });

  const updateCombo = (isCorrect: boolean) => {
    setFeatures(prev => ({
      ...prev,
      combo: isCorrect ? prev.combo + 1 : 0,
      perfectStreak: isCorrect ? prev.perfectStreak + 1 : prev.perfectStreak,
    }));
  };

  const checkSpeedBonus = () => {
    const timeDiff = Date.now() - features.lastAnswerTime;
    const isSpeed = timeDiff < 3000;
    setFeatures(prev => ({
      ...prev,
      speedBonus: isSpeed,
      lastAnswerTime: Date.now(),
    }));
    return isSpeed;
  };

  const addAchievement = (achievement: string) => {
    setFeatures(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement],
    }));
  };

  const updateScore = (points: number, multiplier: number = 1) => {
    setFeatures(prev => ({
      ...prev,
      totalScore: prev.totalScore + (points * multiplier),
    }));
  };

  const evolvePet = () => {
    setFeatures(prev => ({
      ...prev,
      mathPetLevel: Math.min(prev.mathPetLevel + 1, 5),
    }));
  };

  return {
    features,
    updateCombo,
    checkSpeedBonus,
    addAchievement,
    updateScore,
    evolvePet,
  };
};

const mathJokes = [
  "Why was 6 afraid of 7? Because 7, 8, 9!",
  "Why do plants hate math? Because it gives them square roots!",
  "What's a math teacher's favorite place in NYC? Times Square!",
  "Why was the equal sign so humble? It knew it wasn't less than or greater than anyone else!",
  "What do you call a number that can't keep still? A roamin' numeral!",
];

const mathFacts = [
  "Did you know 111,111,111 × 111,111,111 = 12,345,678,987,654,321?",
  "The number 4 is the only number with the same number of letters as its value in English!",
  "Zero is the only number that can't be represented in Roman numerals!",
  "A 'jiffy' is an actual unit of time: 1/100th of a second!",
  "2520 is the smallest number divisible by all numbers from 1 to 10!",
];

export const MathJoke: React.FC<{ show: boolean }> = ({ show }) => {
  const [joke, setJoke] = useState('');

  useEffect(() => {
    if (show) {
      setJoke(mathJokes[Math.floor(Math.random() * mathJokes.length)]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="text-center text-sm"
    >
      <p className="text-yellow-800">😄 {joke}</p>
    </motion.div>
  );
};

export const MathFact: React.FC<{ show: boolean }> = ({ show }) => {
  const [fact, setFact] = useState('');

  useEffect(() => {
    if (show) {
      setFact(mathFacts[Math.floor(Math.random() * mathFacts.length)]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="text-center"
    >
      <p className="text-sm font-semibold text-purple-800">💡 Fun Fact!</p>
      <p className="text-xs mt-1 text-purple-700">{fact}</p>
    </motion.div>
  );
};

export const ComboDisplay: React.FC<{ combo: number }> = ({ combo }) => {
  const getComboEmoji = () => {
    if (combo >= 10) return '🔥🔥🔥';
    if (combo >= 7) return '🔥🔥';
    if (combo >= 5) return '🔥';
    if (combo >= 3) return '⭐';
    return '';
  };

  return (
    <AnimatePresence>
      {combo >= 3 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          className="fixed top-20 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full shadow-lg"
        >
          <span className="font-bold">Combo x{combo} {getComboEmoji()}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const SpeedBonusIndicator: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full shadow-lg inline-block"
    >
      <span className="font-bold text-sm">⚡ Speed Bonus!</span>
    </motion.div>
  );
};

const petEmojis = ['🥚', '🐣', '🐤', '🐦', '🦅'];

export const MathPet: React.FC<{ level: number }> = ({ level }) => {
  const petIndex = Math.min(level - 1, petEmojis.length - 1);
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-4 left-4 bg-white p-3 rounded-full shadow-lg"
    >
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          rotate: [-5, 5, -5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
        className="text-3xl"
      >
        {petEmojis[petIndex]}
      </motion.div>
      <div className="text-xs text-center mt-1 text-gray-600">Lv.{level}</div>
    </motion.div>
  );
};

export const HiddenEmoji: React.FC<{ 
  emoji: string; 
  position: { x: string; y: string };
  onFound: () => void;
}> = ({ emoji, position, onFound }) => {
  const [found, setFound] = useState(false);

  const handleClick = () => {
    if (!found) {
      setFound(true);
      onFound();
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0.1 }}
      animate={{ opacity: found ? 1 : 0.1 }}
      whileHover={{ opacity: 0.5 }}
      onClick={handleClick}
      className="absolute text-2xl"
      style={{ left: position.x, top: position.y }}
    >
      {found ? emoji : '❓'}
    </motion.button>
  );
};