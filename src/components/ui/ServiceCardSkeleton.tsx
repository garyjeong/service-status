import React from 'react';

interface ServiceCardSkeletonProps {
  variant?: 'default' | 'compact';
}

const ServiceCardSkeleton: React.FC<ServiceCardSkeletonProps> = ({ 
  variant = 'default' 
}) => {
  return (
    <div className="service-card skeleton-container">
      <div className="skeleton-wrapper">
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* 서비스 아이콘 스켈레톤 */}
            <div className="skeleton-icon w-7 h-7 rounded-lg flex-shrink-0" />
            
            {/* 서비스 이름 스켈레톤 */}
            <div className="flex-1 min-w-0 self-center">
              <div className="skeleton-text h-5 rounded w-32" />
            </div>
          </div>
          
          {/* 새로고침 버튼 스켈레톤 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="skeleton-button w-8 h-8 rounded" />
          </div>
        </div>
        
        {/* 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-0 mb-3">
          <div className="flex flex-col justify-center flex-1">
            {/* 컴포넌트 목록 스켈레톤 */}
            <div className="space-y-2 mb-4">
              <div className="skeleton-line h-4 rounded w-full" />
              <div className="skeleton-line h-4 rounded w-4/5" />
              {variant === 'default' && (
                <div className="skeleton-line h-4 rounded w-3/5" />
              )}
            </div>
            
            {/* 상태 표시 스켈레톤 */}
            <div className="flex items-center gap-1.5">
              <div className="skeleton-status w-3 h-3 rounded-full" />
              <div className="skeleton-badge w-16 h-4 rounded" />
            </div>
          </div>
        </div>
        
        {/* 푸터 영역 */}
        <div className="pt-3 border-t border-border/50 mt-auto">
          <div className="inline-flex items-center gap-2">
            <div className="skeleton-footer-icon w-4 h-4 rounded" />
            <div className="skeleton-footer-text h-3 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardSkeleton;
