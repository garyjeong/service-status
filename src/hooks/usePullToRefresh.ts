import { useCallback, useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  /**
   * 새로고침을 트리거할 최소 당김 거리 (px)
   * @default 80
   */
  threshold?: number;

  /**
   * 당김 저항값 (0-1 사이, 낮을수록 더 많이 당겨야 함)
   * @default 0.5
   */
  resistance?: number;

  /**
   * 새로고침 함수
   */
  onRefresh: () => Promise<void> | void;

  /**
   * 스크롤 가능한 컨테이너가 상단에 있을 때만 활성화 여부
   * @default true
   */
  enabled?: boolean;
}

interface PullToRefreshState {
  /**
   * 현재 당김 거리
   */
  pullDistance: number;

  /**
   * 새로고침이 트리거될 수 있는 상태인지
   */
  canRefresh: boolean;

  /**
   * 현재 새로고침 중인지
   */
  isRefreshing: boolean;

  /**
   * 터치 중인지
   */
  isTouching: boolean;
}

export const usePullToRefresh = ({
  threshold = 80,
  resistance = 0.5,
  onRefresh,
  enabled = true,
}: PullToRefreshOptions) => {
  const [state, setState] = useState<PullToRefreshState>({
    pullDistance: 0,
    canRefresh: false,
    isRefreshing: false,
    isTouching: false,
  });

  const touchStartRef = useRef<{ y: number; time: number } | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const isRefreshingRef = useRef(false);

  // 스크롤이 상단에 있는지 확인
  const isAtTop = useCallback(() => {
    if (!containerRef.current) return true;
    return containerRef.current.scrollTop === 0;
  }, []);

  // 터치 시작
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !isAtTop() || isRefreshingRef.current) return;

      const touch = e.touches[0];
      touchStartRef.current = {
        y: touch.clientY,
        time: Date.now(),
      };

      setState(prev => ({ ...prev, isTouching: true }));
    },
    [enabled, isAtTop]
  );

  // 터치 이동
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchStartRef.current || isRefreshingRef.current) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - touchStartRef.current.y;

      // 위로 스와이프하거나 스크롤이 상단이 아니면 무시
      if (deltaY <= 0 || !isAtTop()) return;

      // 기본 스크롤 동작 방지
      e.preventDefault();

      // 저항 적용하여 당김 거리 계산
      const pullDistance = Math.min(deltaY * resistance, threshold * 1.5);
      const canRefresh = pullDistance >= threshold;

      setState(prev => ({
        ...prev,
        pullDistance,
        canRefresh,
      }));
    },
    [enabled, resistance, threshold, isAtTop]
  );

  // 터치 종료
  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !touchStartRef.current || isRefreshingRef.current) return;

    const shouldRefresh = state.canRefresh && state.pullDistance >= threshold;

    if (shouldRefresh) {
      // 새로고침 시작
      setState(prev => ({
        ...prev,
        isRefreshing: true,
        isTouching: false,
      }));

      isRefreshingRef.current = true;

      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh error:', error);
      } finally {
        // 새로고침 완료
        isRefreshingRef.current = false;
        setState(prev => ({
          ...prev,
          pullDistance: 0,
          canRefresh: false,
          isRefreshing: false,
          isTouching: false,
        }));
      }
    } else {
      // 새로고침 취소
      setState(prev => ({
        ...prev,
        pullDistance: 0,
        canRefresh: false,
        isTouching: false,
      }));
    }

    touchStartRef.current = null;
  }, [enabled, state.canRefresh, state.pullDistance, threshold, onRefresh]);

  // 이벤트 리스너 등록
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Passive: false로 설정하여 preventDefault 가능하게 함
    const options = { passive: false };

    container.addEventListener('touchstart', handleTouchStart, options);
    container.addEventListener('touchmove', handleTouchMove, options);
    container.addEventListener('touchend', handleTouchEnd, options);
    container.addEventListener('touchcancel', handleTouchEnd, options);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ...state,
    containerRef,
    // 새로고침 진행률 (0-1)
    progress: Math.min(state.pullDistance / threshold, 1),
  };
};
