import React from 'react';
import { motion, Variants } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'none',
  distance = 30,
  className = ''
}) => {
  // 방향별 초기 위치 계산
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      default:
        return { opacity: 0 };
    }
  };

  const variants: Variants = {
    hidden: getInitialPosition(),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuart
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
