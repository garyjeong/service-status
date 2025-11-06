import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wifi, Clock, Settings, Star, Eye, EyeOff, X, Activity, TrendingUp, Zap, ArrowUpDown, ArrowUp, ArrowDown, Globe } from 'lucide-react';
import { serviceFetchers, serviceNames, StatusUtils } from '../services/api';
import type { Service, ServiceComponent } from '../services/api';
import { SERVICE_CATEGORIES, groupServicesByCategory } from '../types/categories';
import { StatusType } from '../types/status';
import type { ComponentFilter, Favorites, ServiceExpansion, ViewMode, SortType, Language } from '../types/ui';
import AdFitBanner from './AdFitBanner';
import StatusBadge from './StatusBadge';
import LanguageSelector from './LanguageSelector';
import SortDropdown from './SortDropdown';
import Header from './Header';
import ServiceCard, { ServiceIcon, getStatusIcon } from './ServiceCard';
import SidebarFilter from './SidebarFilter';
import BottomSheetFilter from './BottomSheetFilter';
import KeyboardNavigation from './KeyboardNavigation';
import StatusSummaryPanel from './StatusSummaryPanel';
import LoadingProgressBar from './LoadingProgressBar';
import { useNotification } from '../hooks/useNotification';
import { useStatusHistory } from '../hooks/useStatusHistory';
import { Stagger, PageTransition, ServiceCardSkeleton } from './animations';


interface CompactDashboardProps {
  className?: string;
}

interface ServiceLoadingState {
  [serviceName: string]: boolean;
}

// 번역 데이터
const translations = {
  ko: {
    title: '서비스 상태 대시보드',
    refresh: '새로고침',
    filter: '필터',
    autoUpdate: '자동 업데이트: 1분마다',
    monitoring: '모니터링 중인 서비스',
    services: '개',
    subtitle: 'AI 서비스와 외부 서비스의 실시간 상태를 모니터링합니다.',
    loading: '상태 정보를 불러오는 중...',
    error: '상태 정보를 불러오는데 실패했습니다.',
    favorites: '즐겨찾기',
    allServices: '전체 서비스 상태',
    statusPage: '상태 페이지',
    operational: '정상',
    degraded: '성능 저하',
    degradedPerformance: '성능 저하',
    majorOutage: '장애',
    outage: '장애',
    clickToExpand: '클릭하여 세부 정보 보기',
    refreshService: '서비스 새로고침',
    sort: '정렬',
    sortDefault: '기본',
    sortNameAsc: '이름 오름차순',
    sortNameDesc: '이름 내림차순',
    maintenance: '점검 중',
    filterTitle: '서비스 필터',
    filterDescription: '표시할 서비스 구성 요소를 선택하세요',
    close: '닫기',
    categoryView: '카테고리 보기',
    listView: '목록 보기',
    hideCategory: '카테고리 숨기기',
    showCategory: '카테고리 표시하기'
  },
  en: {
    title: 'Service Status Dashboard',
    refresh: 'Refresh',
    filter: 'Filter',
    autoUpdate: 'Auto Update: Every 1 minute',
    monitoring: 'Monitoring Services',
    services: 'services',
    subtitle: 'Real-time monitoring of AI services and external services.',
    loading: 'Loading status information...',
    error: 'Failed to load status information.',
    favorites: 'Favorites',
    allServices: 'All Services Status',
    statusPage: 'Status Page',
    operational: 'Operational',
    degraded: 'Degraded',
    degradedPerformance: 'Degraded Performance',
    majorOutage: 'Major Outage',
    outage: 'Outage',
    clickToExpand: 'Click to view details',
    refreshService: 'Refresh service',
    sort: 'Sort',
    sortDefault: 'Default',
    sortNameAsc: 'Name A-Z',
    sortNameDesc: 'Name Z-A',
    maintenance: 'Maintenance',
    filterTitle: 'Service Filter',
    filterDescription: 'Select service components to display',
    close: 'Close',
    categoryView: 'Category View',
    listView: 'List View',
    hideCategory: 'Hide Category',
    showCategory: 'Show Category'
  }
};


// 스켈레톤 로딩 컴포넌트
// ServiceCardSkeleton은 이제 ./animations에서 import됨

const CompactDashboard: React.FC<CompactDashboardProps> = ({ className = '' }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceLoadingStates, setServiceLoadingStates] = useState<ServiceLoadingState>({});
  const [filters, setFilters] = useState<ComponentFilter>({});
  const [favorites, setFavorites] = useState<Favorites>({});
  const [expandedServices, setExpandedServices] = useState<ServiceExpansion>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterExpandedServices, setFilterExpandedServices] = useState<{[key: string]: boolean}>({});
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [language, setLanguage] = useState<Language>('ko');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>('default');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  // 테마 상태 관리
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('ui-theme') as 'light' | 'dark' | null;
      return savedTheme || 'light';
    }
    return 'light';
  });
  
  // 뷰 모드 상태 - 카테고리 뷰로 고정
  const [viewMode] = useState<ViewMode>('category');
  
  // 카테고리 표시 상태 - 🔥 빌게이츠 긴급 수정: 최소한 AI/ML은 표시
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set(['ai-ml', 'cloud']) // 🔥 최소한 AI/ML과 Cloud는 표시해서 정보 확인 가능하게!
  );
  
  // 모바일 스크롤 숨김 상태
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollThreshold] = useState(10);
  
  // 모바일 푸터 확장 상태
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);

  // 상태별 필터링 - 문제 서비스만 표시
  const [statusFilter, setStatusFilter] = useState<'degraded_performance' | 'major_outage' | null>(null);
  
  // 알림 설정
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notifications-enabled');
      return saved === 'true';
    }
    return false;
  });

  // 현재 언어의 번역 가져오기
  const t = translations[language];

  // 서비스 설명 번역 함수
  const getServiceDescription = (serviceName: string) => {
    const defaultDescriptions: { [key: string]: { ko: string; en: string } } = {
      'openai': { ko: 'ChatGPT 웹 인터페이스 및 OpenAI API', en: 'ChatGPT web interface and OpenAI API' },
      'anthropic': { ko: 'Claude 채팅 인터페이스 및 Anthropic API', en: 'Claude chat interface and Anthropic API' },
      'cursor': { ko: 'AI 기반 코드 에디터', en: 'AI-powered code editor' },
      'googleai': { ko: 'Google AI Studio 및 Gemini API', en: 'Google AI Studio and Gemini API' },
      'github': { ko: 'Git 저장소 호스팅 및 협업 플랫폼', en: 'Git repository hosting and collaboration platform' },
      'netlify': { ko: '정적 사이트 배포 및 호스팅', en: 'Static site deployment and hosting' },
      'dockerhub': { ko: '컨테이너 이미지 레지스트리', en: 'Container image registry' },
      'docker': { ko: '컨테이너 이미지 레지스트리', en: 'Container image registry' },
      'aws': { ko: 'Amazon 웹 서비스 클라우드 플랫폼', en: 'Amazon Web Services cloud platform' },
      'slack': { ko: '팀 커뮤니케이션 및 협업 도구', en: 'Team communication and collaboration tool' },
      'firebase': { ko: 'Google의 앱 개발 플랫폼', en: 'Google app development platform' },
      'supabase': { ko: '오픈소스 Firebase 대안', en: 'Open source Firebase alternative' },
      'perplexity': { ko: 'AI 검색 및 질의응답 플랫폼', en: 'AI search and Q&A platform' },
      'v0': { ko: 'Vercel의 AI 기반 UI 생성 도구', en: 'Vercel AI-powered UI generation tool' },
      'replit': { ko: '온라인 코딩 및 협업 IDE', en: 'Online coding and collaboration IDE' },
      'xai': { ko: 'Grok AI 모델 및 플랫폼', en: 'Grok AI model and platform' },
      'grok': { ko: 'Grok AI 모델 및 플랫폼', en: 'Grok AI model and platform' },
      'heroku': { ko: '클라우드 애플리케이션 플랫폼 (PaaS)', en: 'Cloud application platform (PaaS)' },
      'atlassian': { ko: 'Jira, Confluence, Bitbucket 등 개발 협업 도구', en: 'Jira, Confluence, Bitbucket and other dev collaboration tools' },
      'circleci': { ko: '지속적 통합 및 배포 (CI/CD) 플랫폼', en: 'Continuous integration and deployment (CI/CD) platform' },
      'auth0': { ko: '인증 및 권한 관리 플랫폼', en: 'Authentication and authorization platform' },
      'sendgrid': { ko: '이메일 전송 및 마케팅 플랫폼', en: 'Email delivery and marketing platform' },
      'cloudflare': { ko: 'CDN, DNS, 보안 및 성능 최적화 서비스', en: 'CDN, DNS, security and performance optimization services' },
      'datadog': { ko: '모니터링, 로깅, APM 및 보안 플랫폼', en: 'Monitoring, logging, APM and security platform' },
      'groq': { ko: 'AI 추론 가속 플랫폼', en: 'AI inference acceleration platform' },
      'leonardo': { ko: 'AI 이미지 생성 플랫폼', en: 'AI image generation platform' },
      'hailuo': { ko: 'AI 비디오 생성 플랫폼', en: 'AI video generation platform' },
      'consensus': { ko: 'AI 기반 연구 검색 엔진', en: 'AI-powered research search engine' },
      'deepseek': { ko: 'AI 모델 및 추론 플랫폼', en: 'AI model and inference platform' },
      'mage': { ko: 'AI 이미지 생성 도구', en: 'AI image generation tool' },
      'vooster': { ko: 'AI 기반 생산성 도구', en: 'AI-powered productivity tool' },
    };
    
    const defaultDesc = defaultDescriptions[serviceName];
    if (defaultDesc) {
      return language === 'ko' ? defaultDesc.ko : defaultDesc.en;
    }
    
    return language === 'ko' 
      ? `${serviceName.toUpperCase()} 서비스 상태를 모니터링합니다.` 
      : `Monitoring ${serviceName.toUpperCase()} service status.`;
  };

  // 서비스 정렬 순서 메모이제이션
  const serviceOrder = useMemo(() => [
    'openai', 'anthropic', 'cursor', 'googleai', 'github', 'netlify', 'dockerhub', 
    'aws', 'slack', 'firebase', 'supabase', 'perplexity', 'v0', 'replit', 'xai', 
    'heroku', 'atlassian', 'circleci', 'auth0', 'sendgrid', 'cloudflare', 'datadog', 
    'groq', 'leonardo', 'hailuo', 'consensus', 'deepseek', 'mage', 'vooster'
  ], []);

  // 기본 필터 및 즐겨찾기 설정 생성 (메모이제이션)
  const getDefaultFilters = useCallback((serviceList: Service[]): ComponentFilter => {
    const filters: ComponentFilter = {};
    serviceList.forEach(service => {
      filters[service.service_name] = {};
      service.components.forEach(component => {
        filters[service.service_name][component.name] = true;
      });
    });
    return filters;
  }, []);

  const getDefaultFavorites = useCallback((serviceList: Service[]): Favorites => {
    const favorites: Favorites = {};
    serviceList.forEach(service => {
      favorites[service.service_name] = {};
      service.components.forEach(component => {
        favorites[service.service_name][component.name] = false;
      });
    });
    return favorites;
  }, []);

  const getDefaultExpansion = useCallback((serviceList: Service[]): ServiceExpansion => {
    const expansion: ServiceExpansion = {};
    serviceList.forEach(service => {
      expansion[service.service_name] = false; // 기본적으로 모두 접힌 상태
    });
    return expansion;
  }, []);

  // 캐시 키 생성
  const getCacheKey = useCallback((serviceName: string) => {
    return `service-status-cache-${serviceName}`;
  }, []);

  // 캐시에서 서비스 데이터 가져오기 (5분 TTL)
  const getCachedServiceData = useCallback((serviceName: string): Service | null => {
    try {
      const cacheKey = getCacheKey(serviceName);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        const cacheAge = now - timestamp;
        const cacheTTL = 5 * 60 * 1000; // 5분
        
        if (cacheAge < cacheTTL) {
          return data;
        }
        // 캐시 만료 시 삭제
        localStorage.removeItem(cacheKey);
      }
    } catch (error) {
      // 캐시 파싱 실패 시 무시
    }
    return null;
  }, [getCacheKey]);

  // 서비스 데이터를 캐시에 저장
  const setCachedServiceData = useCallback((serviceName: string, data: Service) => {
    try {
      const cacheKey = getCacheKey(serviceName);
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      // localStorage 저장 실패 시 무시 (용량 초과 등)
    }
  }, [getCacheKey]);

  // 개별 서비스 로딩 함수 (캐싱 적용, useCallback으로 메모이제이션)
  const loadServiceData = useCallback(async (serviceName: keyof typeof serviceFetchers, isInitialLoad = false) => {
    try {
      setServiceLoadingStates(prev => ({ ...prev, [serviceName]: true }));
      
      // 캐시에서 먼저 확인
      const cachedData = getCachedServiceData(serviceName as string);
      if (cachedData && !isInitialLoad) {
        // 캐시된 데이터가 있고 초기 로드가 아니면 캐시 사용
        setServices(prev => {
          const newServices = [...prev];
          const existingIndex = newServices.findIndex(s => s.service_name === serviceName);
          
          if (existingIndex >= 0) {
            newServices[existingIndex] = cachedData;
          } else {
            newServices.push(cachedData);
          }
          
          return newServices.sort((a, b) => {
            return serviceOrder.indexOf(a.service_name) - serviceOrder.indexOf(b.service_name);
          });
        });
        setServiceLoadingStates(prev => ({ ...prev, [serviceName]: false }));
        return;
      }
      
      // 캐시에 없거나 초기 로드면 API 호출
      const serviceData = await serviceFetchers[serviceName]();
      
      // 캐시에 저장
      setCachedServiceData(serviceName as string, serviceData);
      
      setServices(prev => {
        const newServices = [...prev];
        const existingIndex = newServices.findIndex(s => s.service_name === serviceName);
        
        if (existingIndex >= 0) {
          newServices[existingIndex] = serviceData;
        } else {
          newServices.push(serviceData);
        }
        
        return newServices.sort((a, b) => {
          return serviceOrder.indexOf(a.service_name) - serviceOrder.indexOf(b.service_name);
        });
      });
      
      // 초기 로드일 때만 필터와 즐겨찾기 초기화
      if (isInitialLoad) {
        const singleServiceArray = [serviceData];
        
        setFilters(prev => {
          const existingServiceFilter = prev[serviceName as string] || {};
          const newServiceFilter: { [key: string]: boolean } = {};

          serviceData.components.forEach(component => {
            if (existingServiceFilter[component.name] === undefined) {
              newServiceFilter[component.name] = true;
            } else {
              newServiceFilter[component.name] = existingServiceFilter[component.name];
            }
          });
          
          return {
            ...prev,
            [serviceName as string]: newServiceFilter
          };
        });
        
        setFavorites(prev => {
          const existingServiceFavorites = prev[serviceName as string] || {};
          const newServiceFavorites: { [key: string]: boolean } = {};
          
          serviceData.components.forEach(component => {
            if (existingServiceFavorites[component.name] === undefined) {
              newServiceFavorites[component.name] = false;
            } else {
              newServiceFavorites[component.name] = existingServiceFavorites[component.name];
            }
          });
          
          return {
            ...prev,
            [serviceName as string]: newServiceFavorites
          };
        });
        
        if (expandedServices[serviceName as string] === undefined) {
          setExpandedServices(prev => ({
            ...prev,
            ...getDefaultExpansion(singleServiceArray)
          }));
        }
      }
      
    } catch (err) {
      console.error(`${String(serviceName)} 상태 데이터 로드 실패:`, err);
      setError(`${String(serviceName)} 서비스 로드 실패`);
    } finally {
      setServiceLoadingStates(prev => ({ ...prev, [serviceName]: false }));
    }
  }, [serviceOrder, getCachedServiceData, setCachedServiceData]);

  // 우선순위 서비스 목록 (중요한 서비스 먼저 로딩)
  const priorityServices = useMemo(() => [
    'openai', 'anthropic', 'cursor', 'github', 'googleai'
  ] as (keyof typeof serviceFetchers)[], []);

  // 모든 서비스 로딩 함수 (우선순위 기반 로딩, useCallback으로 메모이제이션)
  const loadAllServicesData = useCallback(async (isInitialLoad = false) => {
    setLastUpdate(new Date());
    
    // 1단계: 우선순위 서비스 먼저 로딩
    const priorityPromises = priorityServices.map((serviceName) => 
      loadServiceData(serviceName, isInitialLoad)
    );
    await Promise.allSettled(priorityPromises);
    
    // 2단계: 나머지 서비스 점진적 로딩
    const remainingServices = serviceNames.filter(
      (name) => !priorityServices.includes(name as keyof typeof serviceFetchers)
    ) as (keyof typeof serviceFetchers)[];
    
    const remainingPromises = remainingServices.map((serviceName) => 
      loadServiceData(serviceName, isInitialLoad)
    );
    await Promise.allSettled(remainingPromises);
  }, [loadServiceData, priorityServices]);

  // localStorage 저장 및 로드
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      localStorage.setItem('service-status-component-filters', JSON.stringify(filters));
    }
  }, [filters]);

  useEffect(() => {
    if (Object.keys(favorites).length > 0) {
      localStorage.setItem('service-status-favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('service-status-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('service-status-visible-categories', JSON.stringify(Array.from(visibleCategories)));
  }, [visibleCategories]);


  // 초기 데이터 로드
  useEffect(() => {
    // 언어 설정 로드
    const savedLanguage = localStorage.getItem('service-status-language') as Language;
    if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }


    // 즐겨찾기 설정 로드
    const savedFavorites = localStorage.getItem('service-status-favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Failed to parse saved favorites:', error);
      }
    }

    // 필터 설정 로드
    const savedFilters = localStorage.getItem('service-status-component-filters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
      } catch (error) {
        console.error('Failed to parse saved filters:', error);
      }
    }

    // 카테고리 표시 상태 로드 - 🔥 빌게이츠 긴급 수정: 최소한 하나는 표시!
    const savedVisibleCategories = localStorage.getItem('service-status-visible-categories');
    if (savedVisibleCategories) {
      try {
        const parsedVisibleCategories = JSON.parse(savedVisibleCategories) as string[];
        const savedSet = new Set<string>(parsedVisibleCategories);
        
        // 🔥 긴급 수정: 모든 카테고리가 숨겨져 있으면 강제로 AI/ML과 Cloud 표시
        if (savedSet.size === 0) {
          savedSet.add('ai-ml');
          savedSet.add('cloud');
        }
        
        setVisibleCategories(savedSet);
      } catch (error) {
        console.error('Failed to parse saved visible categories:', error);
      }
    }

    // 초기 모든 서비스 로딩 상태 설정
    const initialLoadingState: ServiceLoadingState = {};
    serviceNames.forEach((name: string) => {
      initialLoadingState[name] = true;
    });
    setServiceLoadingStates(initialLoadingState);

    // 초기 상태 데이터 로드
    loadAllServicesData(true);
  }, []);

  // 60초마다 자동 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      loadFilteredServicesData();
    }, 60000);

    return () => clearInterval(interval);
  }, [filters, services]);

  // 윈도우 리사이즈 이벤트 리스너
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsDesktop(width > 768);
      setWindowWidth(width);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 모바일 스크롤 방향 감지
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) {
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsScrollingDown(true);
      } 
      else if (currentScrollY < lastScrollY) {
        setIsScrollingDown(false);
      }
      else if (currentScrollY <= 50) {
        setIsScrollingDown(false);
      }

      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [isMobile, lastScrollY, scrollThreshold]);

  // 필터 닫기 함수
  const closeModal = () => {
    setIsFilterOpen(false);
  };

  // ESC 키로 필터 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isFilterOpen) {
          closeModal();
        } else if (isFooterExpanded && isMobile) {
          setIsFooterExpanded(false);
        }
      }
    };

    if (isFilterOpen || (isFooterExpanded && isMobile)) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFilterOpen, isFooterExpanded, isMobile]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-dropdown')) {
        setIsLanguageDropdownOpen(false);
      }
      if (!target.closest('.sort-dropdown-container')) {
        setIsSortDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen || isSortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isSortDropdownOpen]);

  // 테마 적용 useEffect
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleComponentFilter = (serviceName: string, componentName: string) => {
    setFilters(prev => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        [componentName]: !prev[serviceName]?.[componentName]
      }
    }));
    
    // 컴포넌트 필터가 변경되면 상태 필터도 리셋
    setStatusFilter(null);
  };

  const toggleFavorite = useCallback((serviceName: string, componentName: string) => {
    setFavorites(prev => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        [componentName]: !prev[serviceName]?.[componentName]
      }
    }));
  }, []);

  const toggleServiceExpansion = useCallback((serviceName: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
  }, []);

  const toggleFilterServiceExpansion = useCallback((serviceName: string) => {
    setFilterExpandedServices(prev => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
  }, []);

  // 카테고리 표시/숨김 토글 함수
  const toggleCategoryVisibility = (categoryName: string) => {
    setVisibleCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  // 모바일 푸터 토글 함수
  const toggleMobileFooter = () => {
    setIsFooterExpanded(prev => !prev);
    
    const footerElement = document.querySelector('.mobile-footer-compact');
    if (footerElement) {
      footerElement.classList.add('tap-feedback');
      setTimeout(() => {
        footerElement.classList.remove('tap-feedback');
      }, 300);
    }
  };

  // 서비스의 선택 상태 계산
  const getServiceSelectionState = (serviceName: string): 'all' | 'none' | 'some' => {
    const service = services.find(s => s.service_name === serviceName);
    if (!service || !service.components.length) return 'none';
    
    const selectedCount = service.components.filter(component => 
      filters[serviceName]?.[component.name]
    ).length;
    
    if (selectedCount === 0) return 'none';
    if (selectedCount === service.components.length) return 'all';
    return 'some';
  };

  // 서비스별 전체 선택/해제
  const toggleAllComponentsForService = (serviceName: string) => {
    const state = getServiceSelectionState(serviceName);
    const newValue = state !== 'all';
    
    setFilters(prev => {
      const service = services.find(s => s.service_name === serviceName);
      if (!service) return prev;
      
      const updatedServiceFilters: {[key: string]: boolean} = {};
      service.components.forEach(component => {
        updatedServiceFilters[component.name] = newValue;
      });
      
      return {
        ...prev,
        [serviceName]: updatedServiceFilters
      };
    });
    
    // 컴포넌트 필터가 변경되면 상태 필터도 리셋
    setStatusFilter(null);
  };

  // 전체 선택 상태 계산
  const getMasterSelectionState = (): 'all' | 'none' | 'some' => {
    if (!services.length) return 'none';
    
    const allStates = services.map(service => getServiceSelectionState(service.service_name));
    const allSelected = allStates.every(state => state === 'all');
    const noneSelected = allStates.every(state => state === 'none');
    
    if (allSelected) return 'all';
    if (noneSelected) return 'none';
    return 'some';
  };

  // 모든 서비스 전체 선택/해제
  const toggleAllServices = () => {
    const masterState = getMasterSelectionState();
    const newValue = masterState !== 'all';
    
    setFilters(prev => {
      const newFilters: ComponentFilter = {};
      services.forEach(service => {
        newFilters[service.service_name] = {};
        service.components.forEach(component => {
          newFilters[service.service_name][component.name] = newValue;
        });
      });
      return newFilters;
    });
    
    // 컴포넌트 필터가 변경되면 상태 필터도 리셋
    setStatusFilter(null);
  };

  // 필터링된 서비스 반환 (useMemo로 메모이제이션)
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // 컴포넌트 필터링
      const hasSelectedComponent = service.components.some(component => 
        filters[service.service_name]?.[component.name]
      );
      
      if (!hasSelectedComponent) return false;
      
      // 상태 필터링 - 특정 상태만 표시하도록 필터링
      if (statusFilter) {
        const serviceStatus = StatusUtils.calculateServiceStatus(service.components);
        
        // degraded_performance 필터가 활성화된 경우: degraded, maintenance 상태 서비스만 표시
        if (statusFilter === 'degraded_performance') {
          return serviceStatus === StatusType.DEGRADED_PERFORMANCE || serviceStatus === StatusType.UNDER_MAINTENANCE;
        }
        
        // major_outage 필터가 활성화된 경우: outage 상태 서비스만 표시
        if (statusFilter === 'major_outage') {
          return serviceStatus === StatusType.MAJOR_OUTAGE || serviceStatus === StatusType.PARTIAL_OUTAGE;
        }
      }
      
      return true;
    });
  }, [services, filters, statusFilter]);

  // 필터링된 서비스만 새로고침 (useCallback으로 메모이제이션)
  const loadFilteredServicesData = useCallback(async () => {
    const serviceNamesToLoad = filteredServices.map(s => s.service_name as keyof typeof serviceFetchers);
    
    setLastUpdate(new Date());
    
    const loadPromises = serviceNamesToLoad.map((serviceName) => 
      loadServiceData(serviceName, false)
    );
    await Promise.allSettled(loadPromises);
  }, [filteredServices, loadServiceData]);

  const refreshData = useCallback(async () => {
    await loadFilteredServicesData();
  }, [loadFilteredServicesData]);

  // 정렬된 서비스 반환 (useMemo로 메모이제이션)
  const sortedServices = useMemo(() => {
    const servicesWithStatus = filteredServices.map(service => ({
      ...service,
      status: StatusUtils.calculateServiceStatus(service.components)
    }));
    
    switch (sortType) {
      case 'name-asc':
        return [...servicesWithStatus].sort((a, b) => a.display_name.localeCompare(b.display_name));
      case 'name-desc':
        return [...servicesWithStatus].sort((a, b) => b.display_name.localeCompare(a.display_name));
      case 'default':
      default:
        return servicesWithStatus.sort((a, b) => {
          const aIndex = serviceOrder.indexOf(a.service_name);
          const bIndex = serviceOrder.indexOf(b.service_name);
          return aIndex - bIndex;
        });
    }
  }, [filteredServices, sortType, serviceOrder]);

  // 정렬 변경 핸들러
  const handleSortChange = async (newSortType: SortType) => {
    if (newSortType === sortType) return;
    
    setIsAnimating(true);
    setSortType(newSortType);
    setIsSortDropdownOpen(false);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // 정렬 아이콘 가져오기
  const getSortIcon = () => {
    switch (sortType) {
      case 'name-asc':
        return <ArrowUp className="w-4 h-4" />;
      case 'name-desc':
        return <ArrowDown className="w-4 h-4" />;
      default:
        return <ArrowUpDown className="w-4 h-4" />;
    }
  };

  // 정렬 라벨 가져오기
  const getSortLabel = () => {
    switch (sortType) {
      case 'name-asc':
        return t.sortNameAsc;
      case 'name-desc':
        return t.sortNameDesc;
      default:
        return t.sortDefault;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return t.operational;
      case 'degraded':
      case 'degraded_performance': return t.degraded;
      case 'outage':
      case 'partial_outage':
      case 'major_outage': return t.outage;
      case 'maintenance':
      case 'under_maintenance': return t.maintenance;
      default: return status;
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'operational':
        return 'border-green-500/50 hover:border-green-500/80';
      case 'degraded':
      case 'degraded_performance':
        return 'border-yellow-500/50 hover:border-yellow-500/80';
      case 'outage':
      case 'partial_outage':
      case 'major_outage':
        return 'border-red-500/50 hover:border-red-500/80';
      case 'maintenance':
      case 'under_maintenance':
        return 'border-blue-500/50 hover:border-blue-500/80';
      default:
        return 'border-gray-600/50 hover:border-gray-500/80';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'status-operational';
      case 'degraded':
      case 'degraded_performance':
        return 'status-degraded';
      case 'outage':
      case 'partial_outage':
      case 'major_outage':
        return 'status-major-outage';
      case 'maintenance':
      case 'under_maintenance':
        return 'status-maintenance';
      default:
        return 'status-unknown';
    }
  };

  // 계산된 상태를 포함한 서비스 데이터 (useMemo로 메모이제이션)
  const servicesWithCalculatedStatus = useMemo(() => {
    return services.map(service => ({
      ...service,
      status: StatusUtils.calculateServiceStatus(service.components)
    }));
  }, [services]);

  // 즐겨찾기 항목들을 가져오는 함수 (useMemo로 메모이제이션)
  const favoriteComponents = useMemo(() => {
    const items: Array<{
      serviceName: string;
      serviceDisplayName: string;
      componentName: string;
      status: string;
      icon: string;
    }> = [];

    filteredServices.forEach(service => {
      service.components.forEach(component => {
        if (favorites[service.service_name]?.[component.name] && 
            filters[service.service_name]?.[component.name]) {
          items.push({
            serviceName: service.service_name,
            serviceDisplayName: service.display_name,
            componentName: component.name,
            status: component.status,
            icon: service.icon
          });
        }
      });
    });

    return items;
  }, [filteredServices, favorites, filters]);

  // 전체 상태 요약 계산 (useMemo로 메모이제이션)
  const overallStats = useMemo(() => {
    const servicesWithStatus = filteredServices.map(service => ({
      ...service,
      status: StatusUtils.calculateServiceStatus(service.components)
    }));
    
    const totalServices = servicesWithStatus.length;
    const operational = servicesWithStatus.filter(s => s.status === StatusType.OPERATIONAL).length;
    const degraded = servicesWithStatus.filter(s => s.status === StatusType.DEGRADED_PERFORMANCE).length;
    const outage = servicesWithStatus.filter(s => s.status === StatusType.MAJOR_OUTAGE || s.status === StatusType.PARTIAL_OUTAGE).length;
    
    return { totalServices, operational, degraded, outage };
  }, [filteredServices]);


  const stats = overallStats;
  const loadingCount = useMemo(() => Object.values(serviceLoadingStates).filter(Boolean).length, [serviceLoadingStates]);
  const isAnyLoading = loadingCount > 0;
  
  // 로딩 진행률 계산
  const loadingProgress = useMemo(() => {
    const totalServices = serviceNames.length;
    const loadedServices = services.length;
    const loadingServices = loadingCount;
    return {
      loaded: loadedServices,
      total: totalServices,
      loading: loadingServices
    };
  }, [services.length, loadingCount]);

  // 알림 시스템
  const { requestPermission, permission, isSupported } = useNotification(services, {
    enabled: notificationsEnabled,
    language,
    onPermissionGranted: () => {
      if (import.meta.env.DEV) {
        console.log('Notification permission granted');
      }
    },
    onPermissionDenied: () => {
      if (import.meta.env.DEV) {
        console.log('Notification permission denied');
      }
      setNotificationsEnabled(false);
      localStorage.setItem('notifications-enabled', 'false');
    }
  });

  // 알림 설정 토글
  const toggleNotifications = useCallback(async () => {
    if (!isSupported) {
      if (import.meta.env.DEV) {
        console.warn('Notifications are not supported in this browser');
      }
      return;
    }

    if (!notificationsEnabled) {
      const granted = await requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        localStorage.setItem('notifications-enabled', 'true');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notifications-enabled', 'false');
    }
  }, [notificationsEnabled, isSupported, requestPermission]);

  // 상태 히스토리
  const { recordStatus, getPeriodStats } = useStatusHistory(services, {
    maxEntries: 1000,
    retentionDays: 30
  });

  // 서비스 상태 변경 시 히스토리 기록
  useEffect(() => {
    if (services.length > 0 && !isAnyLoading) {
      recordStatus(services);
    }
  }, [services, isAnyLoading, recordStatus]);

  // 모바일 스크롤 숨김 클래스 계산
  const getMobileScrollClass = () => {
    if (!isMobile) return '';
    return isScrollingDown ? 'mobile-scroll-hide' : 'mobile-scroll-show';
  };

  // 타이틀 클릭 이벤트 핸들러
  const handleTitleClick = () => {
    const titleElement = document.querySelector('.desktop-title, .text-gradient');
    if (titleElement) {
      titleElement.classList.add('clicked');
      setTimeout(() => {
        titleElement.classList.remove('clicked');
      }, 600);
    }
  };

  // 상태 필터 핸들러 - 문제 서비스만 표시/해제
  const handleStatusFilter = (status: 'degraded_performance' | 'major_outage' | null) => {
    setStatusFilter(status);
  };

  // 테마 토글 핸들러
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('ui-theme', newTheme);
  };

  // 카테고리별로 그룹화된 서비스 가져오기 (useMemo로 메모이제이션)
  const categorizedServices = useMemo(() => {
    return groupServicesByCategory(sortedServices);
  }, [sortedServices]);

  // 상태별로 그룹화된 서비스 가져오기 (useMemo로 메모이제이션)
  const servicesByStatus = useMemo(() => {
    const grouped: Record<string, Service[]> = {
      critical: [], // major_outage, partial_outage
      warning: [], // degraded_performance, under_maintenance
      normal: [], // operational
    };

    sortedServices.forEach(service => {
      const status = StatusUtils.calculateServiceStatus(service.components);
      
      if (status === StatusType.MAJOR_OUTAGE || status === StatusType.PARTIAL_OUTAGE) {
        grouped.critical.push(service);
      } else if (status === StatusType.DEGRADED_PERFORMANCE || status === StatusType.UNDER_MAINTENANCE) {
        grouped.warning.push(service);
      } else {
        grouped.normal.push(service);
      }
    });

    return grouped;
  }, [sortedServices]);

  // 필터링된 카테고리별 서비스 카운트 계산
  const getFilteredCategoryCount = (categoryServices: Service[]) => {
    const filteredServices = categoryServices.filter(service => {
      // 컴포넌트 필터링
      const hasSelectedComponent = service.components.some(component => 
        filters[service.service_name]?.[component.name]
      );
      
      if (!hasSelectedComponent) return false;
      
      // 상태 필터링 적용
      if (statusFilter) {
        const serviceStatus = StatusUtils.calculateServiceStatus(service.components);
        if (statusFilter === 'degraded_performance') {
          return serviceStatus === StatusType.DEGRADED_PERFORMANCE || serviceStatus === StatusType.UNDER_MAINTENANCE;
        }
        if (statusFilter === 'major_outage') {
          return serviceStatus === StatusType.MAJOR_OUTAGE || serviceStatus === StatusType.PARTIAL_OUTAGE;
        }
      }
      
      return true;
    });
    
    return filteredServices.length;
  };

  // 로딩 중일 때 표시
  if (services.length === 0 && isAnyLoading) {
    return (
      <div className={`bg-background text-foreground layout-sticky-both ${getMobileScrollClass()} ${className} min-h-dvh`}>
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="animate-spin w-6 h-6 mr-2 text-primary" />
          <span className="text-muted-foreground">{t.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className={`bg-background text-foreground layout-sticky-both ${getMobileScrollClass()} ${className} min-h-dvh`}>
      {/* 키보드 네비게이션 */}
      <KeyboardNavigation
        onRefresh={refreshData}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        onToggleLanguage={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
        onStatusFilter={handleStatusFilter}
        onEscape={() => {
          if (isFilterOpen) setIsFilterOpen(false);
          if (isFooterExpanded) setIsFooterExpanded(false);
          if (isLanguageDropdownOpen) setIsLanguageDropdownOpen(false);
          if (isSortDropdownOpen) setIsSortDropdownOpen(false);
        }}
      />
      
      {/* 헤더 섹션 */}
      <Header
        title={t.title}
        language={language}
        isAnyLoading={isAnyLoading}
        loadingCount={loadingCount}
        stats={stats}
                sortType={sortType}
        isSortDropdownOpen={isSortDropdownOpen}
        isLanguageDropdownOpen={isLanguageDropdownOpen}
        statusFilter={statusFilter}
        theme={theme}
        onRefresh={refreshData}
        onFilterOpen={() => setIsFilterOpen(!isFilterOpen)}
                onSortChange={handleSortChange}
        onSortDropdownToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
        onLanguageChange={setLanguage}
        onLanguageDropdownToggle={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
        onTitleClick={handleTitleClick}
        onStatusFilter={handleStatusFilter}
        onThemeToggle={handleThemeToggle}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={toggleNotifications}
                translations={{
          refresh: t.refresh,
          filter: t.filter,
          operational: t.operational,
          degradedPerformance: t.degradedPerformance,
          majorOutage: t.majorOutage,
          loading: t.loading,
                  sortDefault: t.sortDefault,
                  sortNameAsc: t.sortNameAsc,
                  sortNameDesc: t.sortNameDesc
                }}
              />
            
      {/* 메인 컨텐츠 */}
      <main className="main-content">
        <div className="container mx-auto px-4 py-6">
          
          {/* 상태 요약 대시보드 */}
          <StatusSummaryPanel
            stats={stats}
            totalServices={filteredServices.length}
            language={language}
            theme={theme}
            onStatusFilter={handleStatusFilter}
            statusFilter={statusFilter}
          />
          
          {/* 로딩 진행률 표시 */}
          {isAnyLoading && (
            <LoadingProgressBar
              loaded={loadingProgress.loaded}
              total={loadingProgress.total}
              loading={loadingProgress.loading}
              language={language}
              theme={theme}
              onRetry={refreshData}
              error={error}
            />
          )}
          
          {/* 활성 필터 표시 바 */}
          {statusFilter && (
            <motion.div 
              className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgb(239, 246, 255)',
                borderColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgb(191, 219, 254)',
                color: theme === 'dark' ? 'rgb(147, 197, 253)' : 'rgb(30, 58, 138)'
              }}
                      >
                        <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                <span className="font-medium">
                  {statusFilter === 'degraded_performance' 
                    ? (language === 'ko' ? '성능 저하 서비스만 표시 중' : 'Showing degraded services only')
                    : (language === 'ko' ? '장애 서비스만 표시 중' : 'Showing outage services only')
                  }
                </span>
                        </div>
                      <button
                onClick={() => setStatusFilter(null)}
                className="px-3 py-1 text-sm bg-current/10 hover:bg-current/20 rounded-md transition-colors"
              >
                {language === 'ko' ? '필터 해제' : 'Clear Filter'}
                      </button>
            </motion.div>
          )}

          {/* 상단 광고 배너 */}
          <div className="mb-6 flex justify-center">
            <AdFitBanner />
          </div>

          {/* 데스크톱: 사이드바 필터 */}
          <div className="hidden md:block">
            <SidebarFilter
              isOpen={isFilterOpen}
              services={services}
              filters={filters}
              expandedServices={filterExpandedServices}
              onClose={closeModal}
              onToggleComponentFilter={toggleComponentFilter}
              onToggleServiceExpansion={toggleFilterServiceExpansion}
              onToggleAllServices={toggleAllServices}
              onToggleAllComponentsForService={toggleAllComponentsForService}
              getServiceSelectionState={getServiceSelectionState}
              getMasterSelectionState={getMasterSelectionState}
              getStatusColor={getStatusColor}
              translations={{
                filterTitle: t.filterTitle,
                filterDescription: t.filterDescription,
                close: t.close
              }}
            />
                        </div>
                        
          {/* 모바일: 바텀시트 필터 */}
          <div className="md:hidden">
            <BottomSheetFilter
              isOpen={isFilterOpen}
              services={services}
              filters={filters}
              expandedServices={filterExpandedServices}
              onClose={closeModal}
              onToggleComponentFilter={toggleComponentFilter}
              onToggleServiceExpansion={toggleFilterServiceExpansion}
              onToggleAllServices={toggleAllServices}
              onToggleAllComponentsForService={toggleAllComponentsForService}
              getServiceSelectionState={getServiceSelectionState}
              getMasterSelectionState={getMasterSelectionState}
              getStatusColor={getStatusColor}
              translations={{
                filterTitle: t.filterTitle,
                filterDescription: t.filterDescription,
                close: t.close
              }}
            />
                          </div>

          {/* 즐겨찾기 섹션 */}
          {favoriteComponents.length > 0 && (
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="relative">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-yellow-400" />
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-lg animate-pulse"></div>
                </div>
                <h2 className="text-lg md:text-2xl font-bold text-gradient">
                  {t.favorites}
                </h2>
                <div className="flex items-center gap-1 md:gap-2 bg-yellow-500/10 px-2 md:px-3 py-1 rounded-full border border-yellow-500/20">
                  <span className="text-yellow-400 font-medium text-xs md:text-sm">
                    {favoriteComponents.length}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {favoriteComponents.map((item, index) => (
                  <div key={`${item.serviceName}-${item.componentName}-${index}`} className="favorite-card hover-lift">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                        <ServiceIcon iconName={item.icon} size={20} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className={`status-dot ${getStatusColor(item.status)}`} />
                            {getStatusIcon(item.status)}
                          </div>
                          <p className="text-xs md:text-sm font-medium text-foreground truncate">
                            {item.componentName}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(item.serviceName, item.componentName)}
                        className="btn-icon focus-ring flex-shrink-0"
                        aria-label={`${item.serviceName} ${item.componentName} 즐겨찾기에서 제거`}
                      >
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-6 md:mt-8 pt-6 md:pt-8">
                <h2 className="text-lg md:text-2xl font-bold text-gradient mb-4 md:mb-6">
                  {t.allServices}
                </h2>
              </div>
            </div>
          )}

          {/* 서비스 표시 영역 - 카테고리 뷰 */}
            <div className="space-y-4">
              {Object.entries(categorizedServices).map(([categoryName, categoryServices]) => (
                <motion.div 
                  key={categoryName} 
                  className="category-section-premium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 0.1
                  }}
                >
                  {/* 카테고리 헤더 */}
                  <motion.div 
                    className={`category-header-premium ${visibleCategories.has(categoryName) ? 'visible' : 'hidden'}`}
                    onClick={() => toggleCategoryVisibility(categoryName)}
                    title={visibleCategories.has(categoryName) ? t.hideCategory : t.showCategory}
                    role="button"
                    tabIndex={0}
                    whileHover={{
                      scale: 1.01,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{
                      scale: 0.99,
                      transition: { duration: 0.1 }
                    }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                        toggleCategoryVisibility(categoryName);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="category-icon-premium"
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {SERVICE_CATEGORIES.find(cat => cat.id === categoryName)?.icon || '📁'}
                      </motion.div>
                      <motion.h3 
                        className="category-title-premium"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        {SERVICE_CATEGORIES.find(cat => cat.id === categoryName)?.name || categoryName}
                      </motion.h3>
                      <motion.div 
                        className="category-count-premium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {getFilteredCategoryCount(categoryServices)}
                      </motion.div>
                              </div>
                    <motion.div 
                      className={`category-toggle-premium ${visibleCategories.has(categoryName) ? 'visible' : 'hidden'}`}
                      whileHover={{
                        scale: 1.1,
                        rotate: visibleCategories.has(categoryName) ? 0 : 180,
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{
                        scale: 0.9,
                        transition: { duration: 0.1 }
                      }}
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          rotate: visibleCategories.has(categoryName) ? 0 : 180,
                          transition: { duration: 0.3 }
                        }}
                      >
                        {visibleCategories.has(categoryName) ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* 카테고리 서비스 목록 */}
                  {visibleCategories.has(categoryName) && (
                    <Stagger
                      className={`service-grid ${isAnimating ? 'moving' : ''} mt-3`}
                      delay={0.1}
                      staggerDelay={0.08}
                      direction="up"
                      distance={30}
                    >
                      {categoryServices
                        .sort((a, b) => {
                          // 상태별 우선순위 정렬: Critical → Warning → Normal
                          const getStatusPriority = (service: Service) => {
                            const status = StatusUtils.calculateServiceStatus(service.components);
                            if (status === StatusType.MAJOR_OUTAGE || status === StatusType.PARTIAL_OUTAGE) return 0; // Critical
                            if (status === StatusType.DEGRADED_PERFORMANCE || status === StatusType.UNDER_MAINTENANCE) return 1; // Warning
                            return 2; // Normal
                          };
                          return getStatusPriority(a) - getStatusPriority(b);
                        })
                        .map((service) => {
                const isLoading = serviceLoadingStates[service.service_name];
                
                if (isLoading) {
                  return <ServiceCardSkeleton key={service.service_name} />;
                }

                return (
                        <ServiceCard
                    key={service.service_name}
                          service={service}
                          isExpanded={expandedServices[service.service_name] || false}
                          isLoading={serviceLoadingStates[service.service_name] || false}
                          language={language}
                          onToggleExpansion={() => toggleServiceExpansion(service.service_name)}
                          onRefresh={() => loadServiceData(service.service_name as keyof typeof serviceFetchers, false)}
                          getServiceDescription={getServiceDescription}
                          getStatusText={getStatusText}
                          getStatusColorClass={getStatusColorClass}
                          getStatusColor={getStatusColor}
                          translations={{
                            refreshService: t.refreshService,
                            statusPage: t.statusPage
                          }}
                        />
                );
              })}
                    </Stagger>
          )}
                </motion.div>
              ))}
            </div>

          {/* 하단 광고 배너 */}
          <div className="mt-4 mb-3 md:mt-8 md:mb-6 flex justify-center">
            <AdFitBanner 
              onNoAd={() => {
                // 광고 로드 실패 시 무시 (사용자 경험에 영향 없음)
              }}
            />
          </div>

        </div>
      </main>

      {/* 푸터 섹션 */}
      <footer className="footer-section">
        <div className="container mx-auto px-4">
          {/* 모바일: 콜랩시블 푸터 */}
          <div className="md:hidden">
            <div 
              className={`mobile-footer-compact ${isFooterExpanded ? 'expanded' : ''}`}
              onClick={toggleMobileFooter}
            >
              {/* 항상 표시되는 요약 */}
              <div className="mobile-footer-summary">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {language === 'ko' 
                      ? `${filteredServices.length}개 서비스 모니터링`
                      : `Monitoring ${filteredServices.length} Services`
                    }
                  </span>
                </div>
                <div className="mobile-footer-toggle-icon">
                  ▼
                </div>
              </div>
              
              {/* 확장 시에만 표시되는 상세 정보 */}
              <div className="mobile-footer-details">
                {/* 서비스 카테고리 배지 */}
                <div className="mobile-footer-badges">
                  <span className="mobile-footer-badge bg-blue-500/10 text-blue-400">
                    {language === 'ko' ? 'AI 13개' : '13 AI'}
                  </span>
                  <span className="mobile-footer-badge bg-green-500/10 text-green-400">
                    {language === 'ko' ? '클라우드 8개' : '8 Cloud'}
                  </span>
                  <span className="mobile-footer-badge bg-purple-500/10 text-purple-400">
                    {language === 'ko' ? '개발도구 7개' : '7 Dev'}
                  </span>
                  <span className="mobile-footer-badge bg-orange-500/10 text-orange-400">
                    {language === 'ko' ? '비즈니스 7개' : '7 Business'}
                  </span>
                </div>

                {/* 통계 정보 */}
                <div className="mobile-footer-stats">
                  <div className="mobile-footer-stat-item">
                    <Globe className="w-3 h-3 text-green-400" />
                    <span>
                      {overallStats.operational}/{filteredServices.length} {language === 'ko' ? '정상 운영' : 'Operational'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 데스크톱: 기존 푸터 유지 */}
          <div className="hidden md:block text-center text-sm text-muted-foreground py-4">
            {/* 서비스 카테고리 정보 */}
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-xs mb-3">
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                {language === 'ko' ? 'AI 서비스 13개' : '13 AI Services'}
              </span>
              <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded">
                {language === 'ko' ? '클라우드 8개' : '8 Cloud Services'}
              </span>
              <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded">
                {language === 'ko' ? '개발도구 7개' : '7 Dev Tools'}
              </span>
              <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded">
                {language === 'ko' ? '비즈니스 7개' : '7 Business'}
              </span>
            </div>

            {/* 메인 통계 정보 - 🔥 HTML 구조 수정: p 태그를 div로 변경 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="relative">
                  <RefreshCw className={`w-4 h-4 ${isAnyLoading ? 'animate-spin' : ''}`} />
                  {isAnyLoading && <span className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm"></span>}
                </span>
                <span>{language === 'ko' ? '자동 업데이트: 1분마다' : 'Auto Update: Every 1 minute'}</span>
              </div>
              <span className="hidden sm:inline text-gray-600">•</span>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>{t.monitoring}: {servicesWithCalculatedStatus.length}{t.services}</span>
              </div>
              <span className="hidden sm:inline text-gray-600">•</span>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-400" />
                <span>
                  {overallStats.operational}/{servicesWithCalculatedStatus.length} {language === 'ko' ? '정상 운영' : 'Operational'}
                </span>
            </div>
          </div>
        </div>
    </div>
      </footer>
    </PageTransition>
  );
};

export default CompactDashboard;