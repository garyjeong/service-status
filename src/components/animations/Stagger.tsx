import React from 'react';
import { motion, Variants } from 'framer-motion';

interface StaggerProps {
  children: React.ReactNode;
  delay?: number;
  staggerDelay?: number; // 각 자식 요소 간의 지연 시간
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  distance?: number;
  className?: string;
  trigger?: boolean;
}

const Stagger: React.FC<StaggerProps> = ({
  children,
  delay = 0,
  staggerDelay = 0.1,
  duration = 0.6,
  direction = 'up',
  distance = 30,
  className = '',
  trigger = true
}) => {
  // 방향별 초기 위치 계산
  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      case 'scale':
        return { scale: 0.8, opacity: 0 };
      default:
        return { opacity: 0 };
    }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants: Variants = {
    hidden: getInitialState(),
    visible: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: direction === 'scale' ? "spring" : "tween",
        stiffness: direction === 'scale' ? 200 : undefined,
        damping: direction === 'scale' ? 20 : undefined
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={trigger ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Stagger;
