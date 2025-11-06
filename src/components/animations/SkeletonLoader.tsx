import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  animate?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  animate = true
}) => {
  const skeletonVariants = {
    loading: {
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    loaded: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const shimmerVariants = {
    shimmer: {
      x: ['-100%', '100%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`skeleton-loader relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius
      }}
      variants={skeletonVariants}
      animate={animate ? "loading" : "loaded"}
    >
      {animate && (
        <motion.div
          className="skeleton-shimmer absolute inset-0"
          variants={shimmerVariants}
          animate="shimmer"
        />
      )}
    </motion.div>
  );
};

// 서비스 카드용 스켈레톤 컴포넌트
interface ServiceCardSkeletonProps {
  className?: string;
}

export const ServiceCardSkeleton: React.FC<ServiceCardSkeletonProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`service-card-premium p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }}
    >
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <SkeletonLoader width={40} height={40} borderRadius="12px" />
          <div className="flex flex-col gap-2">
            <SkeletonLoader width={120} height={20} />
            <SkeletonLoader width={80} height={14} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SkeletonLoader width={32} height={32} borderRadius="8px" />
          <SkeletonLoader width={32} height={32} borderRadius="8px" />
        </div>
      </div>

      {/* 내용 영역 */}
      <div className="space-y-3 mb-4">
        <SkeletonLoader width="90%" height={16} />
        <SkeletonLoader width="60%" height={16} />
      </div>

      {/* 상태 영역 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SkeletonLoader width={12} height={12} borderRadius="50%" />
          <SkeletonLoader width={60} height={14} />
        </div>
        <SkeletonLoader width={80} height={32} borderRadius="16px" />
      </div>
    </motion.div>
  );
};

export default SkeletonLoader;
