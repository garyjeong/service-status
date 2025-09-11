import { type StatusColor, getStatusColorClass } from '../types/colors';

// 클래스명 조합 유틸리티 (clsx와 유사한 기능)
export const cn = (...classes: Array<string | undefined | null | false>): string => {
  return classes.filter(Boolean).join(' ');
};

// 조건부 클래스 적용
export const conditionalClass = (
  condition: boolean,
  trueClass: string,
  falseClass: string = ''
): string => {
  return condition ? trueClass : falseClass;
};

// 반응형 클래스 생성
export const responsiveClass = (
  baseClass: string,
  smClass?: string,
  mdClass?: string,
  lgClass?: string,
  xlClass?: string
): string => {
  const classes = [baseClass];

  if (smClass) classes.push(`sm:${smClass}`);
  if (mdClass) classes.push(`md:${mdClass}`);
  if (lgClass) classes.push(`lg:${lgClass}`);
  if (xlClass) classes.push(`xl:${xlClass}`);

  return classes.join(' ');
};

// 상태 기반 스타일 생성
export const getStatusStyles = (status: StatusColor) => {
  const baseClasses = {
    operational: {
      text: 'text-status-operational',
      bg: 'bg-status-operational/10',
      border: 'border-status-operational/20',
      dot: 'bg-status-operational',
    },
    degraded: {
      text: 'text-status-degraded',
      bg: 'bg-status-degraded/10',
      border: 'border-status-degraded/20',
      dot: 'bg-status-degraded',
    },
    partial: {
      text: 'text-status-partial',
      bg: 'bg-status-partial/10',
      border: 'border-status-partial/20',
      dot: 'bg-status-partial',
    },
    outage: {
      text: 'text-status-outage',
      bg: 'bg-status-outage/10',
      border: 'border-status-outage/20',
      dot: 'bg-status-outage',
    },
    maintenance: {
      text: 'text-status-maintenance',
      bg: 'bg-status-maintenance/10',
      border: 'border-status-maintenance/20',
      dot: 'bg-status-maintenance',
    },
    unknown: {
      text: 'text-status-unknown',
      bg: 'bg-status-unknown/10',
      border: 'border-status-unknown/20',
      dot: 'bg-status-unknown',
    },
  };

  return baseClasses[status];
};

// 서비스 카드 스타일 생성
export const getServiceCardStyles = (status: StatusColor, isExpanded: boolean = false) => {
  const statusStyles = getStatusStyles(status);

  return {
    container: cn(
      'service-card transition-all duration-300 cursor-pointer',
      'bg-card border rounded-lg p-6',
      'hover:shadow-service-card-hover hover:-translate-y-0.5',
      isExpanded ? 'shadow-service-card-expanded' : 'shadow-service-card',
      statusStyles.border
    ),
    status: {
      text: statusStyles.text,
      dot: cn('w-2 h-2 rounded-full animate-pulse', statusStyles.dot),
      badge: cn(
        'px-2 py-1 rounded-full text-xs font-medium',
        statusStyles.bg,
        statusStyles.text,
        statusStyles.border,
        'border'
      ),
    },
  };
};

// 버튼 스타일 생성
export const getButtonStyles = (
  variant: 'primary' | 'secondary' | 'ghost' | 'icon' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md'
) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    icon: 'hover:bg-accent hover:text-accent-foreground',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-md',
    md: 'h-10 px-4 py-2 rounded-md',
    lg: 'h-12 px-8 text-lg rounded-lg',
  };

  return cn(baseClasses, variants[variant], sizes[size]);
};

// 컨테이너 스타일 생성 (반응형)
export const getContainerStyles = () => {
  return responsiveClass(
    'w-full mx-auto px-4', // base
    'px-6', // sm
    'px-6', // md
    'px-8', // lg
    'px-8' // xl
  );
};

// 그리드 스타일 생성 (반응형)
export const getGridStyles = () => {
  return responsiveClass(
    'grid grid-cols-1 gap-4', // base (모바일)
    'grid-cols-2 gap-6', // sm (태블릿)
    'grid-cols-2 gap-6', // md
    'grid-cols-3 gap-6', // lg
    'grid-cols-4 gap-8' // xl (데스크톱)
  );
};
