import { useState, useEffect } from 'react';

// 반응형 브레이크포인트 상수 (Tailwind와 동일)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

// 디바이스 타입 정의
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 현재 화면 크기 정보
export interface ScreenInfo {
  width: number;
  height: number;
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: BreakpointKey;
}

// 화면 크기를 기반으로 디바이스 타입 결정
const getDeviceType = (width: number): DeviceType => {
  if (width < BREAKPOINTS.md) return 'mobile';
  if (width < BREAKPOINTS.lg) return 'tablet';
  return 'desktop';
};

// 현재 브레이크포인트 결정
const getCurrentBreakpoint = (width: number): BreakpointKey => {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'sm'; // 기본값
};

// 반응형 정보를 제공하는 커스텀 훅
export const useResponsive = (): ScreenInfo => {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>(() => {
    // SSR 대응을 위한 기본값
    if (typeof window === 'undefined') {
      return {
        width: BREAKPOINTS.md,
        height: 800,
        deviceType: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        breakpoint: 'md',
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const deviceType = getDeviceType(width);

    return {
      width,
      height,
      deviceType,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      breakpoint: getCurrentBreakpoint(width),
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const deviceType = getDeviceType(width);

      setScreenInfo({
        width,
        height,
        deviceType,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
        breakpoint: getCurrentBreakpoint(width),
      });
    };

    // 디바운스를 위한 타이머
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);

    // 초기 실행
    handleResize();

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return screenInfo;
};

// 특정 브레이크포인트 이상인지 확인하는 훅
export const useBreakpoint = (breakpoint: BreakpointKey): boolean => {
  const { width } = useResponsive();
  return width >= BREAKPOINTS[breakpoint];
};

// 미디어 쿼리 문자열 생성 유틸리티
export const createMediaQuery = (
  breakpoint: BreakpointKey,
  type: 'min' | 'max' = 'min'
): string => {
  const value = BREAKPOINTS[breakpoint];
  return `(${type}-width: ${value}px)`;
};

// 반응형 클래스명 생성 유틸리티
export const getResponsiveClass = (
  baseClass: string,
  breakpointClasses: Partial<Record<BreakpointKey, string>>
): string => {
  const classes = [baseClass];

  Object.entries(breakpointClasses).forEach(([breakpoint, className]) => {
    if (className) {
      classes.push(`${breakpoint}:${className}`);
    }
  });

  return classes.join(' ');
};

// 컨테이너 크기 계산 유틸리티
export const getContainerClass = (screenInfo: ScreenInfo): string => {
  const { isMobile, isTablet, isDesktop } = screenInfo;

  if (isMobile) return 'container mx-auto px-4';
  if (isTablet) return 'container mx-auto px-6';
  if (isDesktop) return 'container mx-auto px-8';

  return 'container mx-auto px-4';
};
