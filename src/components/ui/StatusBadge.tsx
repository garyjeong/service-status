import React from 'react';
import { type StatusColor, getStatusStyles } from '../../utils/tailwind';

interface StatusBadgeProps {
  status: StatusColor;
  children: React.ReactNode;
  variant?: 'dot' | 'badge' | 'text';
  className?: string;
}

/**
 * 통합된 상태 표시 컴포넌트
 * Tailwind 색상 시스템과 완전히 통합
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  children, 
  variant = 'badge',
  className = '' 
}) => {
  const styles = getStatusStyles(status);
  
  if (variant === 'dot') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={styles.dot} />
        <span className={styles.text}>{children}</span>
      </div>
    );
  }
  
  if (variant === 'text') {
    return <span className={`${styles.text} ${className}`}>{children}</span>;
  }
  
  // badge variant (default)
  return (
    <span className={`${styles.badge} ${className}`}>
      {children}
    </span>
  );
};

export default StatusBadge;
