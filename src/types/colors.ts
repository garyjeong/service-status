// Tailwind 색상 시스템의 TypeScript 타입 정의

export type StatusColor =
  | 'operational'
  | 'degraded'
  | 'partial'
  | 'outage'
  | 'maintenance'
  | 'unknown';

export type BrandColor =
  | 'mint-primary'
  | 'mint-light'
  | 'green-success'
  | 'black-primary'
  | 'gray-secondary';

export type BackgroundColor = 'primary' | 'secondary' | 'tertiary' | 'accent';

export type SystemColor =
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'destructive-foreground'
  | 'border'
  | 'input'
  | 'ring';

// Tailwind 색상 클래스 생성 유틸리티
export const getStatusColorClass = (
  status: StatusColor,
  property: 'text' | 'bg' | 'border' = 'text'
): string => {
  return `${property}-status-${status}`;
};

export const getBrandColorClass = (
  color: BrandColor,
  property: 'text' | 'bg' | 'border' = 'text'
): string => {
  const colorMap: Record<BrandColor, string> = {
    'mint-primary': 'brand-mint-primary',
    'mint-light': 'brand-mint-light',
    'green-success': 'brand-green-success',
    'black-primary': 'brand-black-primary',
    'gray-secondary': 'brand-gray-secondary',
  };

  return `${property}-${colorMap[color]}`;
};

export const getBackgroundColorClass = (color: BackgroundColor): string => {
  return `bg-bg-${color}`;
};

// CSS 변수 값 가져오기 유틸리티
export const getCSSVariable = (variable: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

// 상태별 색상 값 매핑
export const STATUS_COLORS: Record<StatusColor, string> = {
  operational: 'rgb(0, 168, 107)',
  degraded: 'rgb(230, 165, 50)',
  partial: 'rgb(214, 48, 49)',
  outage: 'rgb(214, 48, 49)',
  maintenance: 'rgb(46, 255, 180)',
  unknown: 'rgb(237, 236, 232)',
};

// 브랜드 색상 값 매핑
export const BRAND_COLORS: Record<BrandColor, string> = {
  'mint-primary': '#2EFFB4',
  'mint-light': '#D1F7E3',
  'green-success': '#00A86B',
  'black-primary': '#030303',
  'gray-secondary': '#EDECE8',
};

// 배경 색상 값 매핑
export const BACKGROUND_COLORS: Record<BackgroundColor, string> = {
  primary: '#0A0A0A',
  secondary: '#141414',
  tertiary: '#1A1A1A',
  accent: '#1F1F1F',
};
