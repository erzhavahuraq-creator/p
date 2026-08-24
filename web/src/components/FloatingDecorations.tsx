import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FloatingElement } from '../types';
import { birthdaySynth } from '../audio/birthdaySynth';

interface PopEffect {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const FloatingDecorations: React.FC = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [pops, setPops] = useState<PopEffect[]>([]);

  // Generate initial floating particles
  useEffect(() => {
    const colors = [
      '#fb7185', // rose-400
      '#f43f5e', // rose-500
      '#ec4899', // pink-500
      '#db2777', // pink-600
      '#d946ef', // fuchsia-500
      '#c026d3', // fuchsia-600
      '#fda4af', // rose-300
      '#f472b6', // pink-400
    ];

    const types: FloatingElement['type'][] = ['heart', 'balloon', 'sparkle', 'rose'];

    const initialElements: FloatingElement[] = Array.from({ length: 26 }, (_, i) => ({
      id: i,
      type: types[i % types.length],
      x: Math.random() * 96 + 2, // percentage across screen
      size: Math.random() * 22 + 18, // 18px - 40px
      duration: Math.random() * 12 + 14, // 14s - 26s
      delay: Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      sway: Math.random() * 40 - 20, // horizontal sway range
      opacity: Math.random() * 0.45 + 0.35,
    }));

    setElements(initialElements);
  }, []);

  const handlePop = (el: FloatingElement, e: React.MouseEvent) => {
    e.stopPropagation();
    birthdaySynth.playHeartPopFx();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newPop: PopEffect = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      color: el.color,
    };

    setPops((prev) => [...prev.slice(-10), newPop]);
    setTimeout(() => {
      setPops((prev) => prev.filter((p) => p.id !== newPop.id));
    }, 800);

    // Re-spawn the popped element at bottom with new random x
    setElements((prev) =>
      prev.map((item) =>
        item.id === el.id
          ? {
              ...item,
              x: Math.random() * 94 + 3,
              delay: 0,
              duration: Math.random() * 10 + 14,
            }
          : item
      )
    );
  };

  return (
    <div
      id="floating-decorations-container"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Background ambient glowing gradient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-300/25 blur-3xl" />
      <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-300/25 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-fuchsia-300/20 blur-3xl" />

      {/* Floating interactive items */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute cursor-pointer pointer-events-auto hover:scale-125 transition-transform"
          style={{
            left: `${el.x}%`,
            bottom: '-60px',
            opacity: el.opacity,
          }}
          animate={{
            y: ['0vh', '-120vh'],
            x: [0, el.sway, -el.sway, el.sway * 0.5, 0],
            rotate: [0, el.sway > 0 ? 12 : -12, 0, el.sway > 0 ? -8 : 8, 0],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: 'linear',
          }}
          onClick={(e) => handlePop(el, e)}
        >
          {el.type === 'balloon' && (
            <div className="relative group flex flex-col items-center">
              <svg
                width={el.size * 1.3}
                height={el.size * 1.6}
                viewBox="0 0 40 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm filter"
              >
                <ellipse cx="20" cy="20" rx="18" ry="20" fill={el.color} />
                {/* Balloon highlight */}
                <ellipse
                  cx="14"
                  cy="12"
                  rx="5"
                  ry="8"
                  fill="white"
                  fillOpacity="0.45"
                  transform="rotate(-25 14 12)"
                />
                {/* Knot */}
                <polygon points="17,39 23,39 20,44" fill={el.color} />
                {/* String */}
                <path
                  d="M20 44 Q 17 48, 21 52 T 20 60"
                  stroke={el.color}
                  strokeWidth="1.2"
                  fill="none"
                  strokeOpacity="0.7"
                />
              </svg>
            </div>
          )}

          {el.type === 'heart' && (
            <div className="relative flex items-center justify-center">
              <svg
                width={el.size}
                height={el.size}
                viewBox="0 0 24 24"
                fill={el.color}
                className="drop-shadow-sm transform hover:rotate-12 transition-transform"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          )}

          {el.type === 'sparkle' && (
            <div className="flex items-center justify-center">
              <svg
                width={el.size * 0.8}
                height={el.size * 0.8}
                viewBox="0 0 24 24"
                fill={el.color}
              >
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          )}

          {el.type === 'rose' && (
            <div className="text-xl select-none" style={{ fontSize: `${el.size * 0.85}px` }}>
              🌸
            </div>
          )}
        </motion.div>
      ))}

      {/* Pop particles animation */}
      <AnimatePresence>
        {pops.map((p) => (
          <React.Fragment key={p.id}>
            {[...Array(7)].map((_, i) => {
              const angle = (i / 7) * 2 * Math.PI;
              const dist = 32 + Math.random() * 20;
              return (
                <motion.div
                  key={`${p.id}-${i}`}
                  className="fixed w-2.5 h-2.5 rounded-full pointer-events-none z-50"
                  style={{
                    backgroundColor: p.color,
                    left: p.x,
                    top: p.y,
                  }}
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    scale: 0,
                    opacity: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};
