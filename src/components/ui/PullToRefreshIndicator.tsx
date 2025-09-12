import React from 'react';
import { RefreshCw, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface PullToRefreshIndicatorProps {
  /**
   * 당김 거리 (px)
   */
  pullDistance: number;
  
  /**
   * 새로고침 가능 상태인지
   */
  canRefresh: boolean;
  
  /**
   * 새로고침 중인지
   */
  isRefreshing: boolean;
  
  /**
   * 터치 중인지
   */
  isTouching: boolean;
  
  /**
   * 진행률 (0-1)
   */
  progress: number;
}

const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullDistance,
  canRefresh,
  isRefreshing,
  isTouching,
  progress,
}) => {
  const { t } = useTranslation('dashboard');
  
  // 표시할지 결정
  const shouldShow = isTouching || isRefreshing;
  
  if (!shouldShow) return null;

  // 아이콘 회전 각도 계산
  const rotation = Math.min(progress * 180, 180);
  
  // 투명도 계산
  const opacity = Math.min(progress * 2, 1);

  return (
    <div
      className="pull-to-refresh-indicator"
      style={{
        transform: `translateY(${Math.min(pullDistance, 100)}px)`,
        opacity,
      }}
    >
      <div className="pull-to-refresh-content">
        {isRefreshing ? (
          // 새로고침 중
          <RefreshCw 
            className="w-6 h-6 text-primary animate-spin" 
            aria-hidden="true"
          />
        ) : canRefresh ? (
          // 새로고침 가능 상태
          <RefreshCw 
            className="w-6 h-6 text-primary"
            style={{ transform: `rotate(${rotation}deg)` }}
            aria-hidden="true"
          />
        ) : (
          // 당기는 중
          <ChevronDown 
            className="w-6 h-6 text-muted-foreground"
            style={{ transform: `rotate(${rotation}deg)` }}
            aria-hidden="true"
          />
        )}
        
        <span className="pull-to-refresh-text">
          {isRefreshing 
            ? t('refreshing')
            : canRefresh 
              ? t('releaseToRefresh')
              : t('pullToRefresh')
          }
        </span>
      </div>
    </div>
  );
};

export default PullToRefreshIndicator;
