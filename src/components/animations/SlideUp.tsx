import React from 'react';
import { motion, Variants } from 'framer-motion';

interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  trigger?: boolean; // 애니메이션 트리거 조건
}

const SlideUp: React.FC<SlideUpProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  distance = 50,
  className = '',
  trigger = true
}) => {
  const variants: Variants = {
    hidden: {
      y: distance,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={trigger ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default SlideUp;
