import React, { useState, useEffect } from 'react';
import { RefreshCw, Wifi, Clock, Settings, Star, ChevronDown, ChevronUp } from 'lucide-react';

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
      { name: 'Whisper API', status: 'operational' }
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
      { name: 'API Console', status: 'operational' }
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
      { name: 'Extensions', status: 'operational' }
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
      { name: 'Vertex AI', status: 'operational' }
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
      { name: 'Packages', status: 'operational' }
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
      { name: 'DNS', status: 'operational' }
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
      { name: 'Organizations', status: 'operational' }
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
      { name: 'Route 53', status: 'operational' }
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
      { name: 'Notifications', status: 'operational' }
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
      { name: 'Authentication', status: 'operational' },
      { name: 'Hosting', status: 'operational' },
      { name: 'Functions', status: 'operational' },
      { name: 'Storage', status: 'operational' }
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
  const [componentFilters, setComponentFilters] = useState<ComponentFilter>(getDefaultFilters);
  const [favorites, setFavorites] = useState<Favorites>(getDefaultFavorites);
  const [expandedServices, setExpandedServices] = useState<ServiceExpansion>(getDefaultExpansion);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // localStorage 저장
  useEffect(() => {
    localStorage.setItem('service-status-component-filters', JSON.stringify(componentFilters));
  }, [componentFilters]);

  useEffect(() => {
    localStorage.setItem('service-status-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 윈도우 리사이즈 이벤트 리스너
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleComponentFilter = (serviceName: string, componentName: string) => {
    setComponentFilters(prev => ({
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

  // 스타일 정의들
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#111827',
    color: '#f9fafb',
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#1f2937',
    borderBottom: '1px solid #374151',
    padding: windowWidth <= 900 ? '1rem 2rem' : '1.5rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: windowWidth <= 900 ? '80px' : '120px',
    transition: 'all 0.3s ease',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: 'white',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#374151',
    color: '#f9fafb',
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    paddingTop: windowWidth <= 900 ? '140px' : '200px', // 헤더 높이에 따라 조정
    paddingBottom: '120px', // 푸터 높이 고려
    paddingLeft: windowWidth <= 900 ? '1rem' : '2rem',
    paddingRight: windowWidth <= 900 ? '1rem' : '2rem',
    transition: 'all 0.3s ease',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1400px',
    margin: '0 auto',
    transition: 'all 0.3s ease',
  };

  const cardStyle: React.CSSProperties = {
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #374151',
    backgroundColor: '#1f2937',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    transform: 'translateZ(0)', // GPU 가속을 위한 속성
  };

  const serviceHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  };

  const serviceInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const serviceNameStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#f9fafb',
    margin: 0,
  };

  const serviceDescStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#d1d5db',
    margin: 0,
  };

  const statusDotStyle = (status: string): React.CSSProperties => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: getStatusColor(status),
  });

  const componentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem',
    backgroundColor: '#374151',
    borderRadius: '6px',
    marginBottom: '0.5rem',
  };

  const componentNameStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#d1d5db',
  };

  const settingsPanelStyle: React.CSSProperties = {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    border: '1px solid #374151',
  };

  const footerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#1f2937',
    borderTop: '1px solid #374151',
    padding: '1rem 2rem',
    textAlign: 'center',
    color: '#9ca3af',
  };



  return (
    <div style={containerStyle} className={className}>
      {/* 고정 헤더 */}
      <header style={headerStyle}>
        {windowWidth > 900 && (
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#f9fafb' 
            }}>
              🤖 AI 및 외부 서비스 상태 모니터링
            </h1>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '16px', 
              color: '#d1d5db' 
            }}>
              실시간으로 AI 서비스와 외부 서비스들의 상태를 확인하세요
            </p>
          </div>
        )}
        
        <div style={{
          ...controlsStyle,
          justifyContent: windowWidth <= 900 ? 'center' : 'flex-end',
          width: windowWidth <= 900 ? '100%' : 'auto'
        }}>
          <button
            onClick={refreshData}
            disabled={isLoading}
            style={{
              ...primaryButtonStyle,
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw style={{ width: '16px', height: '16px', animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
            새로 고침
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={secondaryButtonStyle}
          >
            <Settings style={{ width: '16px', height: '16px' }} />
            설정
          </button>
          
          {windowWidth > 900 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
              <Clock style={{ width: '16px', height: '16px' }} />
              마지막 업데이트: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main style={mainContentStyle}>
        {/* 설정 패널 */}
        {showSettings && (
          <div style={settingsPanelStyle}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#f9fafb', marginBottom: '1rem' }}>표시 설정</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {mockServices.map((service) => (
                <div key={service.service_name} style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: '500', color: '#f9fafb', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ServiceIcon iconName={service.icon} size={24} />
                    {service.display_name}
                  </h4>
                  {service.components.map((component) => (
                    <label key={component.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      <input
                        type="checkbox"
                        checked={componentFilters[service.service_name]?.[component.name] ?? true}
                        onChange={() => toggleComponentFilter(service.service_name, component.name)}
                        style={{ borderRadius: '4px' }}
                      />
                      <span style={{ color: '#d1d5db' }}>{component.name}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 서비스 그리드 */}
        <div style={gridStyle}>
          {mockServices.map((service) => (
            <div 
              key={service.service_name} 
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) translateZ(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px -1px rgba(0, 0, 0, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) translateZ(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)';
              }}
            >
              {/* 서비스 헤더 */}
              <div style={serviceHeaderStyle}>
                <div style={serviceInfoStyle}>
                  <ServiceIcon iconName={service.icon} size={32} />
                  <div>
                    <h3 style={serviceNameStyle}>{service.display_name}</h3>
                    <p style={serviceDescStyle}>{service.description}</p>
                  </div>
                </div>
                <div style={statusDotStyle(service.status)} />
              </div>

              {/* 전체 상태 */}
              <div style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#374151',
                borderRadius: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>전체 상태</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: getStatusColor(service.status) }}>
                    {service.status === 'operational' ? '정상' : 
                     service.status === 'degraded' ? '성능 저하' : '장애'}
                  </span>
                </div>
              </div>

              {/* 컴포넌트 상태 */}
              <div>
                <div 
                  onClick={() => toggleServiceExpansion(service.service_name)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    padding: '0.25rem 0',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', margin: 0 }}>
                    컴포넌트 상태 ({service.components.filter(component => componentFilters[service.service_name]?.[component.name] ?? true).length}개)
                  </h4>
                  {expandedServices[service.service_name] ? (
                    <ChevronUp style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                  ) : (
                    <ChevronDown style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                  )}
                </div>
                
                {expandedServices[service.service_name] && (
                  <div>
                    {service.components
                      .filter(component => componentFilters[service.service_name]?.[component.name] ?? true)
                      .map((component) => (
                        <div key={component.name} style={componentStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                              onClick={() => toggleFavorite(service.service_name, component.name)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: favorites[service.service_name]?.[component.name] ? '#f59e0b' : '#6b7280',
                                padding: '0',
                              }}
                            >
                              <Star style={{ width: '12px', height: '12px' }} />
                            </button>
                            <span style={componentNameStyle}>{component.name}</span>
                          </div>
                          <div style={statusDotStyle(component.status)} />
                        </div>
                      ))}
                  </div>
                )}
              </div>


            </div>
          ))}
        </div>
      </main>

      {/* 고정 푸터 */}
      <footer style={footerStyle}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px', 
            color: '#9ca3af' 
          }}>
            🔄 자동 업데이트: 30초마다 | 📊 모니터링 중인 서비스: {mockServices.length}개
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '13px', 
            color: '#6b7280' 
          }}>
            AI 서비스(OpenAI, Anthropic, Cursor, Google AI)와 외부 서비스(GitHub, Netlify, Docker Hub, AWS, Slack, Firebase)의 실시간 상태를 모니터링합니다.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;