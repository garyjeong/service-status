// src/design-system/Button.tsx
import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-react';

// -----------------
// BUTTON STYLES
// -----------------
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-foreground hover:bg-accent/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent/10 hover:text-accent',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

// -----------------
// BUTTON COMPONENT
// -----------------
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>,
    MotionProps {
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, children, leftIcon, rightIcon, isLoading, disabled, ...props },
    ref
  ) => {
    const showLoader = isLoading;
    const showContent = !isLoading || (isLoading && size !== 'icon');

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {showLoader && <Loader2 className={cn('animate-spin', children && 'mr-2')} />}
        {showContent && children}
        {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
