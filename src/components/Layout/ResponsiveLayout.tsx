import React from 'react';
import { useResponsive, getContainerClass } from '../../hooks/useResponsive';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 반응형 레이아웃 컴포넌트
 * 화면 크기에 따라 적절한 컨테이너 스타일을 적용
 */
const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, className = '' }) => {
  const screenInfo = useResponsive();
  const containerClass = getContainerClass(screenInfo);
  
  return (
    <div className={`${containerClass} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;
