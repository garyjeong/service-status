// UI 관련 타입 정의

export type ViewMode = 'category' | 'list';
export type SortType = 'default' | 'name-asc' | 'name-desc';
export type Language = 'ko' | 'en';

export interface ComponentFilter {
  [serviceName: string]: {
    [componentName: string]: boolean;
  };
}

export interface Favorites {
  [serviceName: string]: {
    [componentName: string]: boolean;
  };
}

export interface ServiceExpansion {
  [serviceName: string]: boolean;
}

export interface ServiceStats {
  operational: number;
  degraded: number;
  outage: number;
  loading: number;
  total: number;
}

export interface Translations {
  ko: TranslationStrings;
  en: TranslationStrings;
}

export interface TranslationStrings {
  title: string;
  refresh: string;
  filter: string;
  autoUpdate: string;
  monitoring: string;
  services: string;
  subtitle: string;
  loading: string;
  error: string;
  operational: string;
  degradedPerformance: string;
  majorOutage: string;
  unknown: string;
  retry: string;
  lastUpdated: string;
  favorites: string;
  clearFavorites: string;
  noFavorites: string;
  sortDefault: string;
  sortNameAsc: string;
  sortNameDesc: string;
  category: string;
  list: string;
  closeFilter: string;
  // 카테고리 번역
  aiServices: string;
  cloudInfrastructure: string;
  developmentTools: string;
  communicationTools: string;
  databases: string;
  monitoring: string;
  cicd: string;
  authServices: string;
  emailServices: string;
  cdn: string;
  analytics: string;
  paymentProcessing: string;
  marketingAutomation: string;
  versioning: string;
  mlPlatforms: string;
  other: string;
}

// 서비스 상태 관련 타입 확장
export type ServiceStatus = 'operational' | 'degraded_performance' | 'major_outage' | 'unknown';

export interface StatusConfig {
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  borderColor: string;
  textColor: string;
  dotColor: string;
  label: string;
}
