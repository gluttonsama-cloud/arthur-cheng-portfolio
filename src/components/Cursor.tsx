import React, { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'motion/react';

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    setIsMobile(mql.matches);
    
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .cyber-btn, .cyber-dial, .cyber-power-btn, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen hidden md:block will-change-transform"
      style={{ 
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0
      }}
      animate={{
        scale: isHovering ? 1.4 : 1,
        rotate: isHovering ? 45 : 0
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 400, damping: 25 },
        rotate: { type: "spring", stiffness: 400, damping: 25 },
        opacity: { duration: 0.15 }
      }}
    >
      <div className="absolute -top-4 -left-4 w-8 h-8">
        <div className="absolute inset-0 border-[3px] border-cyan-400 translate-x-[-2px] translate-y-[2px] opacity-60 mix-blend-screen"></div>
        <div className="absolute inset-0 border-[3px] border-red-500 translate-x-[2px] translate-y-[-2px] opacity-60 mix-blend-screen"></div>
        <div className="absolute inset-0 border-[3px] border-white opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.4)]"></div>
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#4ade80]"></div>
      </div>
    </motion.div>
  );
}
