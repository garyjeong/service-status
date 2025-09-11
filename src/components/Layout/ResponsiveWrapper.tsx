import React from 'react';
import { useResponsive, DeviceType } from '../../hooks/useResponsive';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  // 보여질 디바이스 타입들
  showOn?: DeviceType[];
  // 숨겨질 디바이스 타입들  
  hideOn?: DeviceType[];
  // 커스텀 조건
  when?: (screenInfo: ReturnType<typeof useResponsive>) => boolean;
  // 폴백 컴포넌트
  fallback?: React.ReactNode;
}

/**
 * 조건부 렌더링을 위한 반응형 래퍼 컴포넌트
 */
const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  showOn,
  hideOn,
  when,
  fallback = null,
}) => {
  const screenInfo = useResponsive();
  
  // 커스텀 조건이 있는 경우 우선 적용
  if (when) {
    return when(screenInfo) ? <>{children}</> : <>{fallback}</>;
  }
  
  // hideOn 조건 확인
  if (hideOn && hideOn.includes(screenInfo.deviceType)) {
    return <>{fallback}</>;
  }
  
  // showOn 조건 확인
  if (showOn && !showOn.includes(screenInfo.deviceType)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// 편의성을 위한 미리 정의된 컴포넌트들
export const MobileOnly: React.FC<Omit<ResponsiveWrapperProps, 'showOn'>> = (props) => (
  <ResponsiveWrapper {...props} showOn={['mobile']} />
);

export const TabletOnly: React.FC<Omit<ResponsiveWrapperProps, 'showOn'>> = (props) => (
  <ResponsiveWrapper {...props} showOn={['tablet']} />
);

export const DesktopOnly: React.FC<Omit<ResponsiveWrapperProps, 'showOn'>> = (props) => (
  <ResponsiveWrapper {...props} showOn={['desktop']} />
);

export const MobileAndTablet: React.FC<Omit<ResponsiveWrapperProps, 'showOn'>> = (props) => (
  <ResponsiveWrapper {...props} showOn={['mobile', 'tablet']} />
);

export const TabletAndDesktop: React.FC<Omit<ResponsiveWrapperProps, 'showOn'>> = (props) => (
  <ResponsiveWrapper {...props} showOn={['tablet', 'desktop']} />
);

export default ResponsiveWrapper;
