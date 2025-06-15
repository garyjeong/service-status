import React, { useState, useEffect } from 'react';
import { RefreshCw, Wifi, Clock, Settings, Star, ChevronDown, ChevronUp, Filter, BarChart3, Zap } from 'lucide-react';
import AdSenseAd from './AdSenseAd';
import { ADSENSE_CONFIG } from '../config/adsense';

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

interface ServiceComponent {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
}

interface Service {
  service_name: string;
  display_name: string;
  description: string;
  status: 'operational' | 'degraded' | 'outage';
  page_url: string;
  icon: string;
  components: ServiceComponent[];
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
    status: 'operational',
    page_url: 'https://status.anthropic.com',
    icon: 'anthropic',
    components: [
      { name: 'Claude Chat', status: 'operational' },
      { name: 'Anthropic API', status: 'operational' },
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
    status: 'operational',
    page_url: 'https://www.githubstatus.com',
    icon: 'github',
    components: [
      { name: 'Git Operations', status: 'operational' },
      { name: 'API Requests', status: 'operational' },
      { name: 'Issues & PRs', status: 'operational' },
      { name: 'Actions', status: 'operational' },
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
      { name: 'EC2', status: 'operational' },
      { name: 'S3', status: 'operational' },
      { name: 'RDS', status: 'operational' },
      { name: 'Lambda', status: 'operational' },
      { name: 'CloudFront', status: 'operational' },
      { name: 'Route 53', status: 'operational' },
      { name: 'CloudWatch', status: 'operational' },
      { name: 'IAM', status: 'operational' },
      { name: 'ECS', status: 'operational' },
      { name: 'EKS', status: 'operational' }
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
      { name: 'Notifications', status: 'operational' },
      { name: 'Apps & Integrations', status: 'operational' },
      { name: 'Calls', status: 'operational' },
      { name: 'Workflows', status: 'operational' },
      { name: 'Search', status: 'operational' },
      { name: 'File Sharing', status: 'operational' }
    ]
  },
  {
    service_name: 'firebase',
    display_name: 'Firebase',
    description: 'Google의 모바일 및 웹 앱 개발 플랫폼',
    status: 'operational',
    page_url: 'https://status.firebase.google.com',
    icon: 'firebase',
    components: [
      { name: 'Hosting', status: 'operational' },
      { name: 'Realtime Database', status: 'operational' },
      { name: 'Firestore', status: 'operational' },
      { name: 'Authentication', status: 'operational' },
      { name: 'Functions', status: 'operational' },
      { name: 'Storage', status: 'operational' },
      { name: 'Analytics', status: 'operational' },
      { name: 'Crashlytics', status: 'operational' }
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
      expansion[service.service_name] = false;
    });
    return expansion;
  };

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
    return (
      <img
        src={iconSrc}
        alt={iconName}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="rounded-sm"
      />
    );
  }
  
  // 폴백 아이콘
  return <Wifi style={{ width: `${size}px`, height: `${size}px` }} />;
};

const Dashboard: React.FC<DashboardProps> = ({ className = '' }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [filters, setFilters] = useState<ComponentFilter>(getDefaultFilters());
  const [favorites, setFavorites] = useState<Favorites>(getDefaultFavorites());
  const [expandedServices, setExpandedServices] = useState<ServiceExpansion>(getDefaultExpansion());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // localStorage 저장
  useEffect(() => {
    const savedFilters = localStorage.getItem('service-status-component-filters');
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('service-status-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('service-status-component-filters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('service-status-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 윈도우 리사이즈 이벤트 리스너
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 30초마다 자동 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'outage': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatLastUpdate = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTotalComponents = () => {
    return mockServices.reduce((total, service) => total + service.components.length, 0);
  };

  const getOperationalCount = () => {
    return mockServices.reduce((count, service) => {
      return count + service.components.filter(comp => comp.status === 'operational').length;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 고도화된 헤더 - 고정 위치 */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto">
          {/* 메인 헤더 */}
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* 좌측: 타이틀 및 서브타이틀 - 모바일 최적화 */}
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate">
                      서비스 상태 모니터링
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5 truncate">
                      AI 및 외부 서비스 실시간 상태 대시보드
                    </p>
                  </div>
                </div>
              </div>

              {/* 우측: 컨트롤 버튼들 - 모바일 최적화 */}
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                {/* 필터 버튼 */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isFilterOpen
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">필터</span>
                </button>

                {/* 새로고침 버튼 */}
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline text-sm">새로고침</span>
                </button>
              </div>
            </div>
          </div>

          {/* 필터 패널 - 모바일 최적화 */}
          {isFilterOpen && (
            <div className="border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
              <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-h-60 sm:max-h-none overflow-y-auto">
                  {mockServices.map(service => (
                    <div key={service.service_name} className="bg-gray-700/30 rounded-lg p-2 sm:p-3 border border-gray-600/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <ServiceIcon iconName={service.icon} size={14} />
                        <h3 className="font-semibold text-xs sm:text-sm text-white truncate">{service.display_name}</h3>
                      </div>
                      <div className="space-y-1 max-h-24 sm:max-h-32 overflow-y-auto">
                        {service.components.map(component => (
                          <label key={component.name} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters[service.service_name]?.[component.name] ?? true}
                              onChange={() => toggleComponentFilter(service.service_name, component.name)}
                              className="w-3 h-3 rounded border-gray-500 bg-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-1 flex-shrink-0"
                            />
                            <span className="text-xs text-gray-300 truncate">{component.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main 
        className="pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 transition-all duration-300"
        style={{ 
          paddingTop: isFilterOpen 
            ? (isMobile ? '18rem' : '20rem') // 모바일: 288px로 줄임, 데스크톱: 320px
            : (isMobile ? '6rem' : '7rem')   // 모바일: 96px로 줄임, 데스크톱: 112px
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                        {mockServices.map(service => (
              <div
                key={service.service_name}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-6 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300 shadow-xl hover:shadow-2xl group"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className="p-1.5 sm:p-2 bg-gray-700/50 rounded-xl group-hover:bg-gray-600/50 transition-colors flex-shrink-0">
                      <ServiceIcon iconName={service.icon} size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                        {service.display_name}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-400 mt-0.5 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleServiceExpansion(service.service_name)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 flex-shrink-0"
                  >
                    {expandedServices[service.service_name] ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>

                {/* 서비스 상태 표시 */}
                <div className="flex items-center space-x-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: getStatusColor(service.status) }}
                  />
                  <span className="text-sm font-medium text-green-400">정상 운영</span>
                </div>

                {/* 컴포넌트 상세 */}
                {expandedServices[service.service_name] && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {service.components
                      .filter(component => filters[service.service_name]?.[component.name] ?? true)
                      .map(component => (
                        <div
                          key={component.name}
                          className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl border border-gray-600/20 hover:bg-gray-700/50 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getStatusColor(component.status) }}
                            />
                            <span className="text-sm text-gray-200">{component.name}</span>
                          </div>
                          <button
                            onClick={() => toggleFavorite(service.service_name, component.name)}
                            className="p-1 hover:bg-gray-600/50 rounded-lg transition-all duration-200"
                          >
                            <Star
                              className={`w-4 h-4 transition-colors ${
                                favorites[service.service_name]?.[component.name]
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-500 hover:text-yellow-400'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* 서비스 항목 하단에 광고 배치 */}
            <div className="md:col-span-2 lg:col-span-3">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-4 sm:p-6">
                <div className="text-center mb-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">광고</span>
                </div>
                <AdSenseAd 
                  adSlot={ADSENSE_CONFIG.adSlots.rectangle}
                  adFormat="rectangle"
                  className="w-full flex justify-center"
                  adStyle={{ 
                    display: 'block',
                    minHeight: '250px',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 고도화된 푸터 - 고정 위치 */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50 shadow-xl">
        {/* Google AdSense 배너 광고 */}
        <div className="border-b border-gray-700/30 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <AdSenseAd 
              adSlot={ADSENSE_CONFIG.adSlots.banner}
              adFormat="horizontal"
              className="w-full"
              adStyle={{ 
                display: 'block',
                minHeight: '50px',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        </div>

        {/* 기존 푸터 정보 - 모바일에서 컴팩트하게 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-1 sm:space-y-0">
            {/* 좌측: 업데이트 시간 */}
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span>업데이트: {formatLastUpdate(lastUpdate)}</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-600" />
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="hidden sm:inline">30초마다 자동 갱신</span>
                <span className="sm:hidden">자동갱신</span>
              </div>
            </div>

            {/* 우측: 서비스 통계 */}
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-400">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                <span>서비스: <span className="text-white font-medium">{mockServices.length}개</span></span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-600" />
              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-400">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span>정상: <span className="text-green-400 font-medium">{getOperationalCount()}/{getTotalComponents()}</span></span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;