import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface EasterEggProps {
  problemIndex: number;
  theme: string;
}

const easterEggs = {
  space: {
    emoji: '🚀',
    messages: [
      'Houston, wir haben eine Lösung!',
      'Zum Mond und zurück!',
      'Du bist ein echter Astronaut!',
      'Sternenklar gelöst!'
    ]
  },
  dino: {
    emoji: '🦕',
    messages: [
      'Dino-tastisch!',
      'Prähistorisch gut!',
      'T-Rex würde stolz sein!',
      'Fossil-fantastisch!'
    ]
  },
  castle: {
    emoji: '🏰',
    messages: [
      'Ritterlich gemeistert!',
      'Königliche Leistung!',
      'Du bist ein Mathe-Ritter!',
      'Drachenstarke Lösung!'
    ]
  },
  ocean: {
    emoji: '🐠',
    messages: [
      'Hai-lightastisch!',
      'Tief getaucht und gelöst!',
      'Wellen-mäßig gut!',
      'Meerjungfrauen-Mathe!'
    ]
  },
  circus: {
    emoji: '🎪',
    messages: [
      'Manege frei für dich!',
      'Artistisch gelöst!',
      'Zauberhaft gerechnet!',
      'Applaus, Applaus!'
    ]
  }
};

export const EasterEgg: React.FC<EasterEggProps> = ({ problemIndex, theme }) => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    // Show easter egg every 5 problems
    if ((problemIndex + 1) % 5 === 0 && problemIndex > 0) {
      const themeEggs = easterEggs[theme as keyof typeof easterEggs] || easterEggs.space;
      const randomMessage = themeEggs.messages[Math.floor(Math.random() * themeEggs.messages.length)];
      setCurrentMessage(randomMessage);
      setShowEasterEgg(true);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Hide after 3 seconds
      setTimeout(() => setShowEasterEgg(false), 3000);
    }
  }, [problemIndex, theme]);

  return (
    <AnimatePresence>
      {showEasterEgg && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-8 rounded-2xl shadow-2xl text-center">
            <div className="text-6xl mb-4">
              {easterEggs[theme as keyof typeof easterEggs]?.emoji || '🎉'}
            </div>
            <div className="text-2xl font-bold">{currentMessage}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};