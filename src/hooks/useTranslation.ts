import { useMemo } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { Language } from '../types/ui';

// 번역 파일들을 동적으로 import
import dashboardKo from '../locales/ko/dashboard.json';
import dashboardEn from '../locales/en/dashboard.json';
import accessibilityKo from '../locales/ko/accessibility.json';
import accessibilityEn from '../locales/en/accessibility.json';
import servicesKo from '../locales/ko/services.json';
import servicesEn from '../locales/en/services.json';

type TranslationNamespace = 'dashboard' | 'accessibility' | 'services';

// 번역 리소스 타입 정의
interface TranslationResources {
  ko: {
    dashboard: typeof dashboardKo;
    accessibility: typeof accessibilityKo;
    services: typeof servicesKo;
  };
  en: {
    dashboard: typeof dashboardEn;
    accessibility: typeof accessibilityEn;
    services: typeof servicesEn;
  };
}

// 번역 리소스 객체
const translations: TranslationResources = {
  ko: {
    dashboard: dashboardKo,
    accessibility: accessibilityKo,
    services: servicesKo,
  },
  en: {
    dashboard: dashboardEn,
    accessibility: accessibilityEn,
    services: servicesEn,
  },
};

// 템플릿 변수 치환 함수 (예: "{{serviceName}}" -> "OpenAI")
const interpolate = (template: string, variables: Record<string, string> = {}): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] || match);
};

// 중첩된 객체에서 키로 값을 찾는 함수 (예: "errors.loadFailed")
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export function useTranslation(namespace: TranslationNamespace = 'dashboard') {
  const language = useDashboardStore(state => state.language);

  const t = useMemo(() => {
    return (key: string, variables?: Record<string, string>): string => {
      const namespaceTranslations = translations[language][namespace];
      const value = getNestedValue(namespaceTranslations, key);

      if (typeof value === 'string') {
        return interpolate(value, variables);
      }

      // 번역이 없으면 키를 그대로 반환 (개발 중 누락된 번역 식별용)
      console.warn(`Translation missing: ${namespace}.${key} for language ${language}`);
      return key;
    };
  }, [language, namespace]);

  // 서비스 설명을 가져오는 특별한 함수
  const getServiceDescription = useMemo(() => {
    return (serviceName: string): string => {
      const serviceTranslations = translations[language].services;
      const description =
        serviceTranslations.descriptions[
          serviceName as keyof typeof serviceTranslations.descriptions
        ];

      if (description) {
        return description;
      }

      // 기본 설명 반환
      return interpolate(serviceTranslations.fallback, { serviceName: serviceName.toUpperCase() });
    };
  }, [language]);

  // 현재 언어 반환
  const currentLanguage = language;

  // 언어 변경 함수
  const changeLanguage = useDashboardStore(state => state.setLanguage);

  return {
    t,
    getServiceDescription,
    currentLanguage,
    changeLanguage,
    // 각 네임스페이스 전체 객체 반환 (특수한 경우에 사용)
    translations: translations[language][namespace],
  };
}

// 타입 안전성을 위한 타입 추출
export type DashboardTranslations = typeof dashboardKo;
export type AccessibilityTranslations = typeof accessibilityKo;
export type ServicesTranslations = typeof servicesKo;

// 번역 키의 타입 안전성을 위한 유틸리티 타입들
export type DashboardTranslationKey = keyof DashboardTranslations;
export type AccessibilityTranslationKey = keyof AccessibilityTranslations;
export type ServicesTranslationKey = keyof ServicesTranslations['descriptions'];

// HOC나 다른 컴포넌트에서 사용할 수 있는 번역 함수
export const getTranslation = (
  language: Language,
  namespace: TranslationNamespace,
  key: string,
  variables?: Record<string, string>
): string => {
  const namespaceTranslations = translations[language][namespace];
  const value = getNestedValue(namespaceTranslations, key);

  if (typeof value === 'string') {
    return interpolate(value, variables);
  }

  return key;
};

// 서비스 설명을 가져오는 standalone 함수
export const getServiceDescription = (language: Language, serviceName: string): string => {
  const serviceTranslations = translations[language].services;
  const description =
    serviceTranslations.descriptions[serviceName as keyof typeof serviceTranslations.descriptions];

  if (description) {
    return description;
  }

  return interpolate(serviceTranslations.fallback, { serviceName: serviceName.toUpperCase() });
};
