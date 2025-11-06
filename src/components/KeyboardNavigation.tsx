import React, { useEffect, useCallback } from 'react';

interface KeyboardNavigationProps {
  onRefresh?: () => void;
  onToggleFilter?: () => void;
  onToggleLanguage?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onStatusFilter?: (status: 'degraded_performance' | 'major_outage' | null) => void;
  disabled?: boolean;
}

const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  onRefresh,
  onToggleFilter,
  onToggleLanguage,
  onEscape,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onEnter,
  onSpace,
  onStatusFilter,
  disabled = false
}) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    // 입력 필드에서는 키보드 단축키 비활성화
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    switch (event.key) {
      case 'r':
      case 'R':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onRefresh?.();
        }
        break;

      case 'f':
      case 'F':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onToggleFilter?.();
        }
        break;

      case 'l':
      case 'L':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onToggleLanguage?.();
        }
        break;

      case 'Escape':
        onEscape?.();
        break;

      case 'ArrowUp':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onArrowUp?.();
        }
        break;

      case 'ArrowDown':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onArrowDown?.();
        }
        break;

      case 'ArrowLeft':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onArrowLeft?.();
        }
        break;

      case 'ArrowRight':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onArrowRight?.();
        }
        break;

      case 'Enter':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onEnter?.();
        }
        break;

      case ' ':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onSpace?.();
        }
        break;

      // 숫자 키로 상태별 필터링
      case '1':
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          onStatusFilter?.(null); // 모든 서비스 표시
        }
        break;

      case '2':
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          onStatusFilter?.('degraded_performance'); // 성능 저하 서비스만
        }
        break;

      case '3':
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          onStatusFilter?.('major_outage'); // 장애 서비스만
        }
        break;

      // 추가 단축키들
      case '?':
        // 도움말 표시 (향후 구현)
        // 개발 환경에서만 표시
        if (import.meta.env.DEV) {
          console.log('Keyboard shortcuts:', {
            'Ctrl/Cmd + R': 'Refresh all services',
            'Ctrl/Cmd + F': 'Toggle filter',
            'Ctrl/Cmd + L': 'Toggle language',
            'Escape': 'Close modals/overlays',
            'Ctrl/Cmd + Arrow Keys': 'Navigate',
            'Ctrl/Cmd + Enter': 'Confirm action',
            'Ctrl/Cmd + Space': 'Quick action',
            '1': 'Show all services',
            '2': 'Show degraded services only',
            '3': 'Show outage services only'
          });
        }
        break;

      default:
        break;
    }
  }, [
    disabled,
    onRefresh,
    onToggleFilter,
    onToggleLanguage,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onSpace,
    onStatusFilter
  ]);

  useEffect(() => {
    if (disabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, disabled]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
};

export default KeyboardNavigation;
