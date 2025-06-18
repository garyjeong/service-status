import React, { useState, useEffect } from 'react';
import { RefreshCw, Wifi, Clock, Settings, Star, ChevronDown, ChevronUp, Globe, Zap, TrendingUp, Activity } from 'lucide-react';
import { serviceFetchers, serviceNames } from '../services/api';
import type { Service, ServiceComponent } from '../services/api';

// 이미지 import 추가
import openaiIcon from '@/assets/gpt.png';
import anthropicIcon from '@/assets/claude.png';
import cursorIcon from '@/assets/cursor.png';
import googleaiIcon from '@/assets/google-ai-studio.png';
import githubIcon from '@/assets/github.png';
import netlifyIcon from '@/assets/netlify.png';
import dockerIcon from '@/assets/docker.png';
import awsIcon from '@/assets/aws.png';
import slackIcon from '@/assets/slack.png';
import firebaseIcon from '@/assets/firebase.png';
import supabaseIcon from '@/assets/supabase.jpg';

interface DashboardProps {
  className?: string;
}

interface ComponentFilter {
  [serviceName: string]: {
    [componentName: string]: boolean;
  };
}

interface Favorites {
  [serviceName: string]: {
    [componentName: string]: boolean;
  };
}

interface ServiceExpansion {
  [serviceName: string]: boolean;
}

interface ServiceLoadingState {
  [serviceName: string]: boolean;
}

// 언어 타입 정의
type Language = 'ko' | 'en';

// 번역 데이터
const translations = {
  ko: {
    title: '서비스 상태 대시보드',
    refresh: '새로고침',
    filter: '필터',
    autoUpdate: '자동 업데이트: 15초마다',
    monitoring: '모니터링 중인 서비스',
    services: '개',
    subtitle: 'AI 서비스(OpenAI, Anthropic, Cursor, Google AI)와 외부 서비스(GitHub, Netlify, Docker Hub, AWS, Slack, Firebase)의 실시간 상태를 모니터링합니다.',
    loading: '상태 정보를 불러오는 중...',
    error: '상태 정보를 불러오는데 실패했습니다.',
    favorites: '즐겨찾기',
    allServices: '전체 서비스 상태',
    statusPage: '상태 페이지',
    operational: '정상',
    degraded: '성능 저하',
    outage: '장애',
    clickToExpand: '클릭하여 세부 정보 보기',
    refreshService: '서비스 새로고침',
    // 서비스 설명
    services_desc: {
      openai: 'ChatGPT 웹 인터페이스 및 OpenAI API',
      anthropic: 'Claude 채팅 인터페이스 및 Anthropic API',
      cursor: 'AI 기반 코드 에디터 및 개발 도구',
      googleai: 'Google Gemini API 및 AI Studio 플랫폼',
      github: '코드 저장소 및 협업 플랫폼',
      netlify: '정적 사이트 호스팅 및 배포 플랫폼',
      dockerhub: '컨테이너 이미지 레지스트리 및 저장소',
      aws: '아마존 웹 서비스 클라우드 플랫폼',
      slack: '팀 커뮤니케이션 및 협업 플랫폼',
      firebase: 'Google 백엔드 서비스 플랫폼',
      supabase: '오픈소스 Firebase 대안 백엔드 플랫폼'
    }
  },
  en: {
    title: 'Service Status Dashboard',
    refresh: 'Refresh',
    filter: 'Filter',
    autoUpdate: 'Auto Update: Every 15 seconds',
    monitoring: 'Monitoring Services',
    services: 'services',
    subtitle: 'Real-time monitoring of AI services (OpenAI, Anthropic, Cursor, Google AI) and external services (GitHub, Netlify, Docker Hub, AWS, Slack, Firebase).',
    loading: 'Loading status information...',
    error: 'Failed to load status information.',
    favorites: 'Favorites',
    allServices: 'All Services Status',
    statusPage: 'Status Page',
    operational: 'Operational',
    degraded: 'Degraded',
    outage: 'Outage',
    clickToExpand: 'Click to view details',
    refreshService: 'Refresh service',
    // 서비스 설명
    services_desc: {
      openai: 'ChatGPT web interface and OpenAI API',
      anthropic: 'Claude chat interface and Anthropic API',
      cursor: 'AI-powered code editor and development tools',
      googleai: 'Google Gemini API and AI Studio platform',
      github: 'Code repository and collaboration platform',
      netlify: 'Static site hosting and deployment platform',
      dockerhub: 'Container image registry and repository',
      aws: 'Amazon Web Services cloud platform',
      slack: 'Team communication and collaboration platform',
      firebase: 'Google backend service platform',
      supabase: 'Open source Firebase alternative backend platform'
    }
  }
};

// 이미지 아이콘 매핑
const getServiceIcon = (iconName: string): string => {
  const iconMap: { [key: string]: string } = {
    openai: openaiIcon,
    anthropic: anthropicIcon,
    cursor: cursorIcon,
    googleai: googleaiIcon,
    github: githubIcon,
    netlify: netlifyIcon,
    dockerhub: dockerIcon,
    aws: awsIcon,
    slack: slackIcon,
    firebase: firebaseIcon,
    supabase: supabaseIcon,
  };
  return iconMap[iconName] || '';
};

const ServiceIcon = ({ iconName, size = 20 }: { iconName: string; size?: number }) => {
  const iconSrc = getServiceIcon(iconName);
  
  if (iconSrc) {
    // GitHub과 Cursor 아이콘에만 흰색 배경 적용
    const needsWhiteBackground = iconName === 'github' || iconName === 'cursor';
    
    return (
      <div className="relative group">
        <img 
          src={iconSrc} 
          alt={iconName}
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            objectFit: 'contain',
            borderRadius: '8px',
            backgroundColor: needsWhiteBackground ? '#ffffff' : 'transparent',
            padding: needsWhiteBackground ? '2px' : '0'
          }}
          className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
      </div>
    );
  }
  
  // 폴백 아이콘
  return <Wifi style={{ width: `${size}px`, height: `${size}px` }} className="text-blue-400" />;
};

// 상태에 따른 이모지 반환
const getStatusEmoji = (status: string) => {
  switch (status) {
    case 'operational': return '✅';
    case 'degraded': return '⚠️';
    case 'outage': return '🔴';
    default: return '❓';
  }
};

// 상태에 따른 아이콘 반환
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational': return <Activity className="w-4 h-4 text-green-400" />;
    case 'degraded': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
    case 'outage': return <Zap className="w-4 h-4 text-red-400" />;
    default: return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

// 스켈레톤 로딩 컴포넌트
const ServiceCardSkeleton = () => (
  <div className="service-card animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 bg-gray-600 rounded-lg"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 bg-gray-600 rounded w-32"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          </div>
          <div className="h-4 bg-gray-700 rounded w-48 mb-3"></div>
          <div className="h-3 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
      <div className="w-8 h-8 bg-gray-600 rounded"></div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ className = '' }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceLoadingStates, setServiceLoadingStates] = useState<ServiceLoadingState>({});
  const [filters, setFilters] = useState<ComponentFilter>({});
  const [favorites, setFavorites] = useState<Favorites>({});
  const [expandedServices, setExpandedServices] = useState<ServiceExpansion>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [language, setLanguage] = useState<Language>('ko');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // 현재 언어의 번역 가져오기
  const t = translations[language];

  // 서비스 설명 번역 함수
  const getServiceDescription = (serviceName: string) => {
    return t.services_desc[serviceName as keyof typeof t.services_desc] || services.find(s => s.service_name === serviceName)?.description || '';
  };

  // 기본 필터 및 즐겨찾기 설정 생성
  const getDefaultFilters = (serviceList: Service[]): ComponentFilter => {
    const filters: ComponentFilter = {};
    serviceList.forEach(service => {
      filters[service.service_name] = {};
      service.components.forEach(component => {
        filters[service.service_name][component.name] = true;
      });
    });
    return filters;
  };

  const getDefaultFavorites = (serviceList: Service[]): Favorites => {
    const favorites: Favorites = {};
    serviceList.forEach(service => {
      favorites[service.service_name] = {};
      service.components.forEach(component => {
        favorites[service.service_name][component.name] = false;
      });
    });
    return favorites;
  };

  const getDefaultExpansion = (serviceList: Service[]): ServiceExpansion => {
    const expansion: ServiceExpansion = {};
    serviceList.forEach(service => {
      expansion[service.service_name] = false; // 기본적으로 모두 접힌 상태
    });
    return expansion;
  };

  // 개별 서비스 로딩 함수
  const loadServiceData = async (serviceName: keyof typeof serviceFetchers, isInitialLoad = false) => {
    try {
      setServiceLoadingStates(prev => ({ ...prev, [serviceName]: true }));
      
      const serviceData = await serviceFetchers[serviceName]();
      
      setServices(prev => {
        const newServices = [...prev];
        const existingIndex = newServices.findIndex(s => s.service_name === serviceName);
        
        if (existingIndex >= 0) {
          newServices[existingIndex] = serviceData;
        } else {
          newServices.push(serviceData);
        }
        
        return newServices.sort((a, b) => {
          const order = ['openai', 'anthropic', 'cursor', 'googleai', 'github', 'netlify', 'dockerhub', 'aws', 'slack', 'firebase', 'supabase'];
          return order.indexOf(a.service_name) - order.indexOf(b.service_name);
        });
      });
      
      // 초기 로드일 때만 필터와 즐겨찾기 초기화
      if (isInitialLoad) {
        const singleServiceArray = [serviceData];
        
        // 필터 초기화 (기존 필터가 없거나 새로운 컴포넌트가 추가된 경우에만)
        setFilters(prev => {
          const existingServiceFilter = prev[serviceName as string] || {};
          const newServiceFilter: { [key: string]: boolean } = {};
          
          // 새로운 컴포넌트들에 대해서만 기본값 설정
          serviceData.components.forEach(component => {
            if (existingServiceFilter[component.name] === undefined) {
              newServiceFilter[component.name] = true; // 새로운 컴포넌트는 기본적으로 표시
            } else {
              newServiceFilter[component.name] = existingServiceFilter[component.name]; // 기존 설정 유지
            }
          });
          
          return {
            ...prev,
            [serviceName as string]: newServiceFilter
          };
        });
        
        // 즐겨찾기 초기화 (기존 즐겨찾기가 없거나 새로운 컴포넌트가 추가된 경우에만)
        setFavorites(prev => {
          const existingServiceFavorites = prev[serviceName as string] || {};
          const newServiceFavorites: { [key: string]: boolean } = {};
          
          // 새로운 컴포넌트들에 대해서만 기본값 설정
          serviceData.components.forEach(component => {
            if (existingServiceFavorites[component.name] === undefined) {
              newServiceFavorites[component.name] = false; // 새로운 컴포넌트는 기본적으로 즐겨찾기 해제
            } else {
              newServiceFavorites[component.name] = existingServiceFavorites[component.name]; // 기존 설정 유지
            }
          });
          
          return {
            ...prev,
            [serviceName as string]: newServiceFavorites
          };
        });
        
        // 확장 상태 초기화 (기존 상태가 없는 경우에만)
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
  };

  // 모든 서비스 로딩 함수
  const loadAllServicesData = async (isInitialLoad = false) => {
    setLastUpdate(new Date());
    
    // 모든 서비스를 병렬로 로딩
    const loadPromises = serviceNames.map((serviceName: keyof typeof serviceFetchers) => 
      loadServiceData(serviceName, isInitialLoad)
    );
    await Promise.allSettled(loadPromises);
  };

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

    // 초기 모든 서비스 로딩 상태 설정
    const initialLoadingState: ServiceLoadingState = {};
    serviceNames.forEach((name: string) => {
      initialLoadingState[name] = true;
    });
    setServiceLoadingStates(initialLoadingState);

    // 초기 상태 데이터 로드
    loadAllServicesData(true);
  }, []);

  // 15초마다 자동 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      loadAllServicesData();
    }, 15000); // 15초 간격

    return () => clearInterval(interval);
  }, []);

  // 윈도우 리사이즈 이벤트 리스너
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-dropdown')) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);

  const toggleComponentFilter = (serviceName: string, componentName: string) => {
    setFilters(prev => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        [componentName]: !prev[serviceName]?.[componentName]
      }
    }));
  };

  const toggleFavorite = (serviceName: string, componentName: string) => {
    setFavorites(prev => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        [componentName]: !prev[serviceName]?.[componentName]
      }
    }));
  };

  const toggleServiceExpansion = (serviceName: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
  };

  const refreshData = async () => {
    await loadAllServicesData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'status-operational';
      case 'degraded': return 'status-degraded';
      case 'outage': return 'status-major-outage';
      default: return 'status-unknown';
    }
  };

  // 하위 컴포넌트들의 상태에 따라 상위 서비스 상태를 계산하는 함수
  const calculateServiceStatus = (components: ServiceComponent[]): 'operational' | 'degraded' | 'outage' => {
    if (components.some(c => c.status === 'outage')) {
      // 하나라도 완전 장애가 있으면 전체를 장애로 표시
      const outageCount = components.filter(c => c.status === 'outage').length;
      const totalCount = components.length;
      
      // 모든 서비스가 장애인 경우만 빨간색(outage)
      if (outageCount === totalCount) {
        return 'outage';
      }
      // 일부만 장애인 경우 노란색(degraded)
      return 'degraded';
    }
    if (components.some(c => c.status === 'degraded')) {
      return 'degraded';
    }
    return 'operational';
  };

  // 계산된 상태를 포함한 서비스 데이터를 가져오는 함수
  const getServicesWithCalculatedStatus = () => {
    return services.map(service => ({
      ...service,
      status: calculateServiceStatus(service.components)
    }));
  };

  // 즐겨찾기 항목들을 가져오는 함수
  const getFavoriteComponents = () => {
    const favoriteItems: Array<{
      serviceName: string;
      serviceDisplayName: string;
      componentName: string;
      status: string;
      icon: string;
    }> = [];

    getServicesWithCalculatedStatus().forEach(service => {
      service.components.forEach(component => {
        if (favorites[service.service_name]?.[component.name]) {
          favoriteItems.push({
            serviceName: service.service_name,
            serviceDisplayName: service.display_name,
            componentName: component.name,
            status: component.status,
            icon: service.icon
          });
        }
      });
    });

    return favoriteItems;
  };

  // 전체 상태 요약 계산
  const getOverallStats = () => {
    const servicesWithStatus = getServicesWithCalculatedStatus();
    const totalServices = servicesWithStatus.length;
    const operational = servicesWithStatus.filter(s => s.status === 'operational').length;
    const degraded = servicesWithStatus.filter(s => s.status === 'degraded').length;
    const outage = servicesWithStatus.filter(s => s.status === 'outage').length;
    
    return { totalServices, operational, degraded, outage };
  };

  // 로딩 중인 서비스 수 계산
  const getLoadingServicesCount = () => {
    return Object.values(serviceLoadingStates).filter(Boolean).length;
  };

  const stats = getOverallStats();
  const loadingCount = getLoadingServicesCount();
  const isAnyLoading = loadingCount > 0;

  return (
    <div className={`bg-background text-foreground layout-sticky-both ${className}`}>
      {/* 헤더 섹션 */}
      <header className="header-section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gradient">{t.title}</h1>
              <button
                onClick={refreshData}
                className="btn-icon focus-ring hover-lift"
                aria-label={t.refresh}
                disabled={isAnyLoading}
              >
                <RefreshCw className={`w-5 h-5 ${isAnyLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-start md:items-center">
              {/* 상태 요약 카드 */}
              <div className="flex items-center gap-4 text-sm">
                {loadingCount > 0 && (
                  <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                    <span className="text-blue-400 font-medium">{loadingCount}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">{stats.operational}</span>
                </div>
                {stats.degraded > 0 && (
                  <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-400 font-medium">{stats.degraded}</span>
                  </div>
                )}
                {stats.outage > 0 && (
                  <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-medium">{stats.outage}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="btn-secondary focus-ring flex items-center justify-center gap-2 hover-lift"
                >
                  <Settings className="w-4 h-4" />
                  <span>{t.filter}</span>
                </button>
                
                {/* 언어 선택 드롭다운 */}
                <div className="relative language-dropdown">
                  <button
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    className="btn-secondary focus-ring flex items-center justify-center gap-2 w-full md:w-auto hover-lift"
                  >
                    {language === 'ko' ? (
                      <>
                        <span className="text-lg">🇰🇷</span>
                        <span>한국어</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">🇺🇸</span>
                        <span>English</span>
                      </>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {isLanguageDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50 backdrop-blur-lg">
                      <button
                        onClick={() => {
                          setLanguage('ko');
                          setIsLanguageDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-accent transition-colors text-sm ${
                          language === 'ko' ? 'bg-accent' : ''
                        }`}
                      >
                        <span className="text-lg">🇰🇷</span>
                        <span>한국어</span>
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('en');
                          setIsLanguageDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-accent transition-colors text-sm ${
                          language === 'en' ? 'bg-accent' : ''
                        }`}
                      >
                        <span className="text-lg">🇺🇸</span>
                        <span>English</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="main-content">
        <div className="container mx-auto px-4 py-6">

        {isFilterOpen && (
          <div className="card-base mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <div key={service.service_name} className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <ServiceIcon iconName={service.icon} size={20} />
                    {service.display_name}
                  </h3>
                  <div className="space-y-1">
                    {service.components.map(component => (
                      <label key={component.name} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters[service.service_name]?.[component.name] || false}
                          onChange={() => toggleComponentFilter(service.service_name, component.name)}
                          className="w-4 h-4 rounded border-border bg-secondary focus-ring"
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {component.name}
                        </span>
                        {getStatusEmoji(component.status)}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 즐겨찾기 섹션 */}
        {getFavoriteComponents().length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-lg animate-pulse"></div>
              </div>
              <h2 className="text-2xl font-bold text-gradient">
                {t.favorites}
              </h2>
              <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                <span className="text-yellow-400 font-medium text-sm">
                  {getFavoriteComponents().length}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getFavoriteComponents().map((item, index) => (
                <div key={`${item.serviceName}-${item.componentName}-${index}`} className="favorite-card hover-lift">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <ServiceIcon iconName={item.icon} size={24} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`status-dot ${getStatusColor(item.status)}`} />
                          {getStatusIcon(item.status)}
                          <span className="text-xs text-muted-foreground truncate">
                            {item.serviceDisplayName}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.componentName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(item.serviceName, item.componentName)}
                      className="btn-icon focus-ring flex-shrink-0 mt-1"
                    >
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-8 pt-8">
              <h2 className="text-2xl font-bold text-gradient mb-6">
                {t.allServices}
              </h2>
            </div>
          </div>
        )}

        {/* 전체 서비스 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceNames.map((serviceName: string) => {
            const service = services.find(s => s.service_name === serviceName);
            const isLoading = serviceLoadingStates[serviceName];
            
            if (isLoading || !service) {
              return <ServiceCardSkeleton key={serviceName} />;
            }

            const serviceWithStatus = {
              ...service,
              status: calculateServiceStatus(service.components)
            };

            return (
              <div 
                key={service.service_name} 
                className="service-card hover-lift cursor-pointer"
                onClick={() => toggleServiceExpansion(service.service_name)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex flex-col items-center gap-2">
                      <ServiceIcon iconName={service.icon} size={32} />
                      <div className="flex items-center gap-1">
                        <div className={`status-dot ${getStatusColor(serviceWithStatus.status)}`} />
                        {getStatusIcon(serviceWithStatus.status)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-lg font-semibold text-foreground">{service.display_name}</h2>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            loadServiceData(service.service_name as keyof typeof serviceFetchers);
                          }}
                          className="btn-icon focus-ring opacity-60 hover:opacity-100 transition-opacity"
                          aria-label={`${service.display_name} ${t.refreshService}`}
                          disabled={isLoading}
                        >
                          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{getServiceDescription(service.service_name)}</p>
                      {!expandedServices[service.service_name] && (
                        <p className="text-xs text-muted-foreground mb-3 opacity-70">
                          {t.clickToExpand}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn-icon focus-ring -mt-1 -mr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleServiceExpansion(service.service_name);
                    }}
                  >
                    {expandedServices[service.service_name] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {expandedServices[service.service_name] && (
                  <div className="mt-4 space-y-2">
                    {service.components
                      .filter(component => filters[service.service_name]?.[component.name])
                      .map(component => (
                        <div key={component.name} className="component-card">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`status-dot ${getStatusColor(component.status)}`} />
                              {getStatusIcon(component.status)}
                              <span className="text-sm text-foreground">{component.name}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(service.service_name, component.name);
                              }}
                              className="btn-icon focus-ring"
                            >
                              <Star
                                className={`w-4 h-4 transition-all duration-300 ${
                                  favorites[service.service_name]?.[component.name]
                                    ? 'text-yellow-500 fill-yellow-500 scale-110'
                                    : 'text-muted-foreground hover:text-yellow-400'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* 상태 확인 링크를 카드 하단에 배치 */}
                <div className="mt-4 pt-3 border-t border-border/50">
                  <a 
                    href={service.page_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors focus-ring rounded px-2 py-1 hover:bg-blue-500/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="w-3 h-3" />
                    <span>{t.statusPage}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        </div>
      </main>

      {/* 푸터 섹션 */}
      <footer className="footer-section">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <p className="flex items-center gap-2">
                <div className="relative">
                  <RefreshCw className={`w-4 h-4 ${isAnyLoading ? 'animate-spin' : ''}`} />
                  {isAnyLoading && <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm"></div>}
                </div>
                <span>{t.autoUpdate}</span>
              </p>
              <span className="hidden sm:inline">|</span>
              <p className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>{t.monitoring}: {getServicesWithCalculatedStatus().length}{t.services}</span>
              </p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground opacity-70">
              {t.subtitle}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;