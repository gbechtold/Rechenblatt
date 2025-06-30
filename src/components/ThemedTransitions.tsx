import React from 'react';
import { motion } from 'framer-motion';
import { ThemeType, ThemeColors } from '@/lib/questSystem/types';

interface ThemedTransitionProps {
  theme: ThemeType;
  themeColors: ThemeColors;
  type: 'quest-start' | 'quest-complete' | 'boss-intro' | 'level-up' | 'achievement';
  children: React.ReactNode;
}

export const ThemedTransition: React.FC<ThemedTransitionProps> = ({
  theme,
  themeColors,
  type,
  children
}) => {
  const getTransitionVariants = () => {
    switch (type) {
      case 'quest-start':
        return {
          initial: { scale: 0, rotate: -180, opacity: 0 },
          animate: { 
            scale: 1, 
            rotate: 0, 
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 15,
              duration: 1.5
            }
          },
          exit: { 
            scale: 0, 
            rotate: 180, 
            opacity: 0,
            transition: { duration: 0.5 }
          }
        };
        
      case 'quest-complete':
        return {
          initial: { y: 100, opacity: 0 },
          animate: { 
            y: 0, 
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 80,
              damping: 20,
              duration: 1
            }
          },
          exit: { 
            y: -100, 
            opacity: 0,
            transition: { duration: 0.5 }
          }
        };
        
      case 'boss-intro':
        return {
          initial: { scale: 3, opacity: 0, filter: 'blur(20px)' },
          animate: { 
            scale: 1, 
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
              duration: 1.5,
              ease: [0.43, 0.13, 0.23, 0.96]
            }
          },
          exit: { 
            scale: 0.5, 
            opacity: 0,
            filter: 'blur(10px)',
            transition: { duration: 0.5 }
          }
        };
        
      case 'level-up':
        return {
          initial: { scale: 0.8, y: 50, opacity: 0 },
          animate: { 
            scale: [0.8, 1.2, 1],
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.8,
              times: [0, 0.6, 1],
              ease: "easeOut"
            }
          },
          exit: { 
            scale: 1.2,
            y: -50,
            opacity: 0,
            transition: { duration: 0.4 }
          }
        };
        
      case 'achievement':
        return {
          initial: { x: -100, rotate: -45, opacity: 0 },
          animate: { 
            x: 0,
            rotate: [0, 10, -10, 0],
            opacity: 1,
            transition: {
              x: { duration: 0.5 },
              rotate: { duration: 0.5, delay: 0.5 },
              opacity: { duration: 0.3 }
            }
          },
          exit: { 
            x: 100,
            rotate: 45,
            opacity: 0,
            transition: { duration: 0.5 }
          }
        };
        
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };

  const getBackgroundEffect = () => {
    switch (theme) {
      case 'space':
        return (
          <>
            {/* Stars */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
            {/* Nebula effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${themeColors.accent}40 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />
          </>
        );
        
      case 'dino':
        return (
          <>
            {/* Leaves falling */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`leaf-${i}`}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-50px',
                }}
                animate={{
                  y: window.innerHeight + 100,
                  x: [0, 30, -30, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  x: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  },
                }}
              >
                🍃
              </motion.div>
            ))}
          </>
        );
        
      case 'medieval':
        return (
          <>
            {/* Sparks */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`spark-${i}`}
                className="absolute w-2 h-2 bg-orange-400 rounded-full"
                style={{
                  left: '50%',
                  bottom: '0%',
                }}
                animate={{
                  y: [0, -200 - Math.random() * 200],
                  x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        );
        
      case 'ocean':
        return (
          <>
            {/* Bubbles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`bubble-${i}`}
                className="absolute bg-white/20 rounded-full"
                style={{
                  width: 5 + Math.random() * 15,
                  height: 5 + Math.random() * 15,
                  left: `${Math.random() * 100}%`,
                  bottom: '-50px',
                }}
                animate={{
                  y: -(window.innerHeight + 100),
                  x: [0, 20, -20, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  x: {
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  },
                }}
              />
            ))}
          </>
        );
        
      case 'circus':
        return (
          <>
            {/* Confetti */}
            {[...Array(25)].map((_, i) => {
              const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
              return (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute w-2 h-4"
                  style={{
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    left: `${Math.random() * 100}%`,
                    top: '-20px',
                  }}
                  animate={{
                    y: window.innerHeight + 20,
                    rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                    x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              );
            })}
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
      }}
      variants={getTransitionVariants()}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {getBackgroundEffect()}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Overlay gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, ${themeColors.background}40 100%)`,
        }}
      />
    </motion.div>
  );
};