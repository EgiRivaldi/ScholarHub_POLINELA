import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground({ variant = 'public' }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Coordinates normalized relative to viewport center (-0.5 to 0.5) mapped to offset pixels
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 80,
        y: (e.clientY / window.innerHeight - 0.5) * 80,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Configured positions, sizes, delays, and durations for floating glowing particles
  const particles = [
    { size: 8, left: '5%', top: '15%', delay: 0, duration: 18, xTarget: 15, yTarget: -120 },
    { size: 14, left: '18%', top: '45%', delay: 2, duration: 24, xTarget: -20, yTarget: -140 },
    { size: 6, left: '32%', top: '75%', delay: 4, duration: 16, xTarget: 25, yTarget: -110 },
    { size: 12, left: '48%', top: '22%', delay: 1, duration: 20, xTarget: -10, yTarget: -150 },
    { size: 16, left: '62%', top: '65%', delay: 3, duration: 28, xTarget: 30, yTarget: -160 },
    { size: 8, left: '78%', top: '35%', delay: 5, duration: 17, xTarget: -15, yTarget: -125 },
    { size: 10, left: '90%', top: '80%', delay: 6, duration: 22, xTarget: 20, yTarget: -135 },
    { size: 12, left: '12%', top: '88%', delay: 7, duration: 25, xTarget: -25, yTarget: -145 },
    { size: 7, left: '40%', top: '55%', delay: 8, duration: 19, xTarget: 10, yTarget: -115 },
    { size: 14, left: '28%', top: '12%', delay: 9, duration: 26, xTarget: -5, yTarget: -155 },
    { size: 10, left: '68%', top: '92%', delay: 3.5, duration: 23, xTarget: 18, yTarget: -130 },
    { size: 8, left: '85%', top: '18%', delay: 1.5, duration: 15, xTarget: -12, yTarget: -110 },
    { size: 11, left: '52%', top: '82%', delay: 5.5, duration: 21, xTarget: 22, yTarget: -138 },
    { size: 9, left: '72%', top: '48%', delay: 2.5, duration: 20, xTarget: -18, yTarget: -125 },
    { size: 13, left: '94%', top: '10%', delay: 4.5, duration: 27, xTarget: 15, yTarget: -148 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Moving Dot Grid Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-[0.25] sm:opacity-[0.35] animate-drift-slow" />
      
      {/* Radial soft background overlay blend */}
      <div className={`absolute inset-0 ${variant === 'admin' ? 'bg-[#F8FFF9]' : 'bg-[#A3E635]'}`} />

      {/* Dynamic colorful fluid mesh blobs */}
      {/* Blob 1: Top-Left (Electric Purple Glow) */}
      <motion.div
        animate={{
          x: mousePos.x * 0.5,
          y: mousePos.y * 0.5,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 60 }}
        className="absolute -top-48 -left-48 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-gradient-to-br from-[#6D28D9]/6 via-[#8B5CF6]/4 to-transparent blur-3xl animate-liquid-1 opacity-90"
      />
      
      {/* Blob 2: Center-Right (Soft Lime/Green Glow) */}
      <motion.div
        animate={{
          x: mousePos.x * -0.6,
          y: mousePos.y * -0.6,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 60 }}
        className="absolute top-[20%] -right-48 w-[400px] sm:w-[750px] h-[400px] sm:h-[750px] bg-gradient-to-bl from-[#84CC16]/6 via-emerald-400/4 to-transparent blur-3xl animate-liquid-2 opacity-95"
      />
      
      {/* Blob 3: Bottom-Left (Soft White and Mint Glow) */}
      <motion.div
        animate={{
          x: mousePos.x * 0.4,
          y: mousePos.y * -0.4,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 60 }}
        className="absolute bottom-[15%] -left-36 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-gradient-to-tr from-white/30 via-emerald-300/4 to-[#6D28D9]/4 blur-3xl animate-liquid-1 opacity-90"
      />
      
      {/* Blob 4: Bottom-Right (Subtle Purple/Lime Glow) */}
      <motion.div
        animate={{
          x: mousePos.x * -0.3,
          y: mousePos.y * 0.3,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 60 }}
        className="absolute bottom-[-150px] right-[-150px] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-br from-[#6D28D9]/5 via-white/20 to-[#84CC16]/5 blur-3xl animate-liquid-2 opacity-85"
      />

      {/* Floating Sparkle Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[0.2px] ${
            i % 3 === 0
              ? 'bg-[#6D28D9]'
              : i % 3 === 1
              ? 'bg-[#84CC16]'
              : 'bg-white'
          } shadow-[0_0_6px_rgba(255,255,255,0.3)]`}
          style={{
            width: p.size / 2.5 + 1.5,
            height: p.size / 2.5 + 1.5,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, p.yTarget, 0],
            x: [0, p.xTarget, 0],
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration + 5,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
