import React from 'react';
import { motion, Variants } from 'framer-motion';

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
  className?: string;
  trigger?: boolean;
  hover?: boolean; // 호버 시 스케일 효과
}

const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  initialScale = 0.8,
  className = '',
  trigger = true,
  hover = false
}) => {
  const variants: Variants = {
    hidden: {
      scale: initialScale,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: hover ? {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    } : {}
  };

  const motionProps = hover ? {
    initial: "hidden",
    animate: trigger ? "visible" : "hidden",
    whileHover: "hover",
    variants
  } : {
    initial: "hidden",
    animate: trigger ? "visible" : "hidden",
    variants
  };

  return (
    <motion.div
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;
