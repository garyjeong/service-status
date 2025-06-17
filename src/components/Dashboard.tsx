import React, { useState, useEffect } from 'react';
import { RefreshCw, Wifi, Clock, Settings, Star, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { fetchAllServicesStatus } from '../services/api';
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
      firebase: 'Google 백엔드 서비스 플랫폼'
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
      firebase: 'Google backend service platform'
    }
  }
};

// 새로운 AI 서비스 및 외부 서비스 데이터
const mockServices: Service[] = [
  // AI 서비스들
  {
    service_name: 'openai',
    display_name: 'OpenAI ChatGPT',
    description: 'ChatGPT 웹 인터페이스 및 OpenAI API',
    status: 'operational',
    page_url: 'https://status.openai.com',
    icon: 'openai',
    components: [
      { name: 'ChatGPT Web', status: 'operational' },
      { name: 'OpenAI API', status: 'operational' },
      { name: 'DALL-E', status: 'operational' },
      { name: 'Whisper API', status: 'operational' },
      { name: 'GPT-4 API', status: 'operational' },
      { name: 'GPT-3.5 API', status: 'operational' }
    ]
  },
  {
    service_name: 'anthropic',
    display_name: 'Anthropic Claude',
    description: 'Claude 채팅 인터페이스 및 Anthropic API',
    status: 'operational', // 이 값은 이제 무시되고 하위 컴포넌트 상태로 계산됨
    page_url: 'https://status.anthropic.com',
    icon: 'anthropic',
    components: [
      { name: 'Claude Chat', status: 'operational' },
      { name: 'Anthropic API', status: 'degraded' }, // 성능 저하 상태로 변경
      { name: 'Claude Pro', status: 'operational' },
      { name: 'API Console', status: 'operational' },
      { name: 'Claude-3 Opus', status: 'operational' },
      { name: 'Claude-3 Sonnet', status: 'operational' },
      { name: 'Claude-3 Haiku', status: 'operational' }
    ]
  },
  {
    service_name: 'cursor',
    display_name: 'Cursor Editor',
    description: 'AI 기반 코드 에디터 및 개발 도구',
    status: 'operational',
    page_url: 'https://status.cursor.sh',
    icon: 'cursor',
    components: [
      { name: 'Desktop App', status: 'operational' },
      { name: 'AI Copilot', status: 'operational' },
      { name: 'Sync Service', status: 'operational' },
      { name: 'Extensions', status: 'operational' },
      { name: 'Editor Core', status: 'operational' },
      { name: 'AI Assistant', status: 'operational' },
      { name: 'Code Completion', status: 'operational' },
      { name: 'Chat Interface', status: 'operational' }
    ]
  },
  {
    service_name: 'googleai',
    display_name: 'Google AI Studio',
    description: 'Google Gemini API 및 AI Studio 플랫폼',
    status: 'operational',
    page_url: 'https://aistudio.google.com',
    icon: 'googleai',
    components: [
      { name: 'Gemini API', status: 'operational' },
      { name: 'AI Studio', status: 'operational' },
      { name: 'Model Garden', status: 'operational' },
      { name: 'Vertex AI', status: 'operational' },
      { name: 'Gemini Vision', status: 'operational' }
    ]
  },
  // 외부 서비스들
  {
    service_name: 'github',
    display_name: 'GitHub',
    description: '코드 저장소 및 협업 플랫폼',
    status: 'operational', // 이 값은 이제 무시되고 하위 컴포넌트 상태로 계산됨
    page_url: 'https://www.githubstatus.com',
    icon: 'github',
    components: [
      { name: 'Git Operations', status: 'operational' },
      { name: 'API Requests', status: 'operational' },
      { name: 'Issues & PRs', status: 'degraded' }, // 성능 저하 상태로 변경
      { name: 'Actions', status: 'outage' }, // 장애 상태로 변경
      { name: 'Pages', status: 'operational' },
      { name: 'Packages', status: 'operational' },
      { name: 'Codespaces', status: 'operational' },
      { name: 'Copilot', status: 'operational' }
    ]
  },
  {
    service_name: 'netlify',
    display_name: 'Netlify',
    description: '정적 사이트 호스팅 및 배포 플랫폼',
    status: 'operational',
    page_url: 'https://www.netlifystatus.com',
    icon: 'netlify',
    components: [
      { name: 'CDN', status: 'operational' },
      { name: 'Builds', status: 'operational' },
      { name: 'Edge Functions', status: 'operational' },
      { name: 'Forms', status: 'operational' },
      { name: 'DNS', status: 'operational' },
      { name: 'Identity', status: 'operational' },
      { name: 'Analytics', status: 'operational' }
    ]
  },
  {
    service_name: 'dockerhub',
    display_name: 'Docker Hub',
    description: '컨테이너 이미지 레지스트리 및 저장소',
    status: 'operational',
    page_url: 'https://status.docker.com',
    icon: 'dockerhub',
    components: [
      { name: 'Registry', status: 'operational' },
      { name: 'Build Service', status: 'operational' },
      { name: 'Webhooks', status: 'operational' },
      { name: 'Organizations', status: 'operational' },
      { name: 'Authentication', status: 'operational' },
      { name: 'Container Registry', status: 'operational' }
    ]
  },
  {
    service_name: 'aws',
    display_name: 'AWS',
    description: '아마존 웹 서비스 클라우드 플랫폼',
    status: 'operational',
    page_url: 'https://status.aws.amazon.com',
    icon: 'aws',
    components: [
      { name: 'EC2', status: 'outage' }, // 모든 서비스를 장애 상태로 변경
      { name: 'S3', status: 'outage' },
      { name: 'RDS', status: 'outage' },
      { name: 'Lambda', status: 'outage' },
      { name: 'CloudFront', status: 'outage' },
      { name: 'Route 53', status: 'outage' },
      { name: 'CloudWatch', status: 'outage' },
      { name: 'IAM', status: 'outage' },
      { name: 'ECS', status: 'outage' },
      { name: 'EKS', status: 'outage' }
    ]
  },
  {
    service_name: 'slack',
    display_name: 'Slack',
    description: '팀 커뮤니케이션 및 협업 플랫폼',
    status: 'operational',
    page_url: 'https://status.slack.com',
    icon: 'slack',
    components: [
      { name: 'Messaging', status: 'operational' },
      { name: 'Calls', status: 'operational' },
      { name: 'File Sharing', status: 'operational' },
      { name: 'Apps & Integrations', status: 'operational' },
      { name: 'Notifications', status: 'operational' },
      { name: 'Search', status: 'operational' },
      { name: 'Workspace Admin', status: 'operational' },
      { name: 'Enterprise Grid', status: 'operational' }
    ]
  },
  {
    service_name: 'firebase',
    display_name: 'Firebase',
    description: 'Google 백엔드 서비스 플랫폼',
    status: 'operational',
    page_url: 'https://status.firebase.google.com',
    icon: 'firebase',
    components: [
      { name: 'Realtime Database', status: 'operational' },
      { name: 'Firestore', status: 'operational' },
      { name: 'Authentication', status: 'degraded' }, // 성능 저하 상태로 변경
      { name: 'Hosting', status: 'operational' },
      { name: 'Functions', status: 'outage' }, // 장애 상태로 변경
      { name: 'Storage', status: 'operational' },
      { name: 'Cloud Messaging', status: 'operational' },
      { name: 'Remote Config', status: 'operational' },
      { name: 'Crashlytics', status: 'operational' },
      { name: 'Performance', status: 'operational' }
    ]
  }
];

const getDefaultFilters = (): ComponentFilter => {
  const filters: ComponentFilter = {};
  mockServices.forEach(service => {
    filters[service.service_name] = {};
    service.components.forEach(component => {
      filters[service.service_name][component.name] = true;
    });
  });
  return filters;
};

const getDefaultFavorites = (): Favorites => {
  const favorites: Favorites = {};
  mockServices.forEach(service => {
    favorites[service.service_name] = {};
    service.components.forEach(component => {
      favorites[service.service_name][component.name] = false;
    });
  });
  return favorites;
};

const getDefaultExpansion = (): ServiceExpansion => {
  const expansion: ServiceExpansion = {};
  mockServices.forEach(service => {
    expansion[service.service_name] = false; // 기본적으로 모두 접힌 상태
  });
  return expansion;
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
  };
  return iconMap[iconName] || '';
};

const ServiceIcon = ({ iconName, size = 20 }: { iconName: string; size?: number }) => {
  const iconSrc = getServiceIcon(iconName);
  
  if (iconSrc) {
    // GitHub과 Cursor 아이콘에만 흰색 배경 적용
    const needsWhiteBackground = iconName === 'github' || iconName === 'cursor';
    
    return (
      <img 
        src={iconSrc} 
        alt={iconName}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          objectFit: 'contain',
          borderRadius: '6px',
          backgroundColor: needsWhiteBackground ? '#ffffff' : 'transparent',
          padding: needsWhiteBackground ? '2px' : '0'
        }} 
      />
    );
  }
  
  // 폴백 아이콘
  return <Wifi style={{ width: `${size}px`, height: `${size}px` }} />;
};

const Dashboard: React.FC<DashboardProps> = ({ className = '' }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [services, setServices] = useState<Service[]>([]);
  const [filters, setFilters] = useState<ComponentFilter>({});
  const [favorites, setFavorites] = useState<Favorites>({});
  const [expandedServices, setExpandedServices] = useState<ServiceExpansion>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // 상태 데이터 로드 함수
  const loadStatusData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const statusData = await fetchAllServicesStatus();
      setServices(statusData);
      
      // 필터와 즐겨찾기 초기화 (기존 설정이 없는 경우만)
      if (Object.keys(filters).length === 0) {
        setFilters(getDefaultFilters(statusData));
      }
      if (Object.keys(favorites).length === 0) {
        setFavorites(getDefaultFavorites(statusData));
      }
      if (Object.keys(expandedServices).length === 0) {
        setExpandedServices(getDefaultExpansion(statusData));
      }
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('상태 데이터 로드 실패:', err);
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
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

    // 초기 상태 데이터 로드
    loadStatusData();
  }, []);

  // 15초마다 자동 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      loadStatusData();
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
    await loadStatusData();
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

  // 로딩 상태 표시
  if (isLoading && services.length === 0) {
    return (
      <div className={`bg-background text-foreground layout-sticky-both ${className}`}>
        <header className="header-section">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
            </div>
          </div>
        </header>
        <main className="main-content">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center min-h-64">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-lg text-muted-foreground">{t.loading}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 오류 상태 표시
  if (error && services.length === 0) {
    return (
      <div className={`bg-background text-foreground layout-sticky-both ${className}`}>
        <header className="header-section">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
            </div>
          </div>
        </header>
        <main className="main-content">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center min-h-64">
              <div className="text-center">
                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-4"></div>
                <p className="text-lg text-red-500 mb-4">{error}</p>
                <button
                  onClick={refreshData}
                  className="btn-primary focus-ring"
                >
                  다시 시도
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`bg-background text-foreground layout-sticky-both ${className}`}>
      {/* 헤더 섹션 */}
      <header className="header-section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
              <button
                onClick={refreshData}
                className="btn-icon focus-ring"
                aria-label={t.refresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="btn-secondary focus-ring flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span>{t.filter}</span>
              </button>
              
              {/* 언어 선택 드롭다운 */}
              <div className="relative language-dropdown">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="btn-secondary focus-ring flex items-center justify-center gap-2 w-full md:w-auto"
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
                  <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
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
      </header>

      {/* 메인 컨텐츠 */}
      <main className="main-content">
        <div className="container mx-auto px-4 py-6">

        {isFilterOpen && (
          <div className="card-base mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <div key={service.service_name} className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{service.display_name}</h3>
                  <div className="space-y-1">
                    {service.components.map(component => (
                      <label key={component.name} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters[service.service_name]?.[component.name] || false}
                          onChange={() => toggleComponentFilter(service.service_name, component.name)}
                          className="w-4 h-4 rounded border-border bg-secondary focus-ring"
                        />
                        <span className="text-sm text-muted-foreground">{component.name}</span>
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
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-semibold text-foreground">
                {language === 'ko' ? '즐겨찾기' : 'Favorites'}
              </h2>
              <span className="text-sm text-muted-foreground">
                ({getFavoriteComponents().length})
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getFavoriteComponents().map((item, index) => (
                <div key={`${item.serviceName}-${item.componentName}-${index}`} className="favorite-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <ServiceIcon iconName={item.icon} size={24} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className={`status-dot ${getStatusColor(item.status)}`} />
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
                      className="btn-icon focus-ring flex-shrink-0"
                    >
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-6 pt-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {language === 'ko' ? '전체 서비스 상태' : 'All Services Status'}
              </h2>
            </div>
          </div>
        )}

        {/* 전체 서비스 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getServicesWithCalculatedStatus().map((service) => (
            <div key={service.service_name} className="service-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <ServiceIcon iconName={service.icon} size={32} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-foreground">{service.display_name}</h2>
                      <div className={`status-dot ${getStatusColor(service.status)}`} />
                    </div>
                    <p className="text-sm text-muted-foreground">{getServiceDescription(service.service_name)}</p>
                    {/* 상태 확인 링크 추가 */}
                    <a 
                      href={service.page_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1 focus-ring"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{language === 'ko' ? '상태 페이지' : 'Status Page'}</span>
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => toggleServiceExpansion(service.service_name)}
                  className="btn-icon focus-ring"
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
                            <span className="text-sm text-foreground">{component.name}</span>
                          </div>
                          <button
                            onClick={() => toggleFavorite(service.service_name, component.name)}
                            className="btn-icon focus-ring"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                favorites[service.service_name]?.[component.name]
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        </div>
      </main>

      {/* 푸터 섹션 */}
      <footer className="footer-section">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <p className="flex items-center gap-2">
                <span className="animate-spin">🔄</span>
                <span>{t.autoUpdate}</span>
              </p>
              <span className="hidden sm:inline">|</span>
              <p className="flex items-center gap-2">
                <span>📊</span>
                <span>{t.monitoring}: {getServicesWithCalculatedStatus().length}{t.services}</span>
              </p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground opacity-70">
              {t.subtitle}
            </p>
            <p className="mt-1 text-xs text-muted-foreground opacity-50">
              <a 
                href="https://github.com/garyjeong/service-status-check" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors focus-ring"
              >
                https://github.com/garyjeong/service-status-check
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;