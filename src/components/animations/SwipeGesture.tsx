import React from 'react';
import { motion, PanInfo } from 'framer-motion';

interface SwipeGestureProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  swipeThreshold?: number;
  className?: string;
  disabled?: boolean;
}

const SwipeGesture: React.FC<SwipeGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 50,
  className = '',
  disabled = false
}) => {
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;

    const { offset, velocity } = info;
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
      return Math.abs(offset) * velocity;
    };

    // 수평 스와이프
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > swipeThreshold || swipePower(offset.x, velocity.x) > swipeConfidenceThreshold) {
        onSwipeRight?.();
      } else if (offset.x < -swipeThreshold || swipePower(offset.x, velocity.x) < -swipeConfidenceThreshold) {
        onSwipeLeft?.();
      }
    }
    // 수직 스와이프  
    else {
      if (offset.y > swipeThreshold || swipePower(offset.y, velocity.y) > swipeConfidenceThreshold) {
        onSwipeDown?.();
      } else if (offset.y < -swipeThreshold || swipePower(offset.y, velocity.y) < -swipeConfidenceThreshold) {
        onSwipeUp?.();
      }
    }
  };

  const gestureVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.div
      className={className}
      drag={disabled ? false : true}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      variants={gestureVariants}
      whileHover={disabled ? {} : "hover"}
      whileTap={disabled ? {} : "tap"}
      style={{
        cursor: disabled ? 'default' : 'grab'
      }}
    >
      {children}
    </motion.div>
  );
};

export default SwipeGesture;
