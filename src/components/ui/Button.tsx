import React from 'react';
import { getButtonStyles, cn } from '../../utils/tailwind';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * 통합된 버튼 컴포넌트
 * Tailwind 색상 시스템과 완전히 통합
 */
const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props 
}) => {
  return (
    <button 
      className={cn(getButtonStyles(variant, size), className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
