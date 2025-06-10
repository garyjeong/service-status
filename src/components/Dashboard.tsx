import React, { useState, useEffect } from 'react';
import { RefreshCw, Wifi, Clock, Settings, Star } from 'lucide-react';

// 이미지 import
import gptIcon from '../assets/gpt.svg';
import claudeIcon from '../assets/claude.png';
import cursorIcon from '../assets/cursor.webp';
import googleAiIcon from '../assets/google-ai-studio.svg';

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

// 간단한 mock 데이터 (하위 컴포넌트 포함)
const mockServices: Service[] = [
  {
    service_name: 'openai',
    display_name: 'OpenAI ChatGPT',
    description: 'GPT-4, GPT-3.5 API 및 웹 인터페이스',
    status: 'operational',
    page_url: 'https://status.openai.com',
    icon: 'gpt',
    components: [
      { name: 'ChatGPT Web', status: 'operational' },
      { name: 'GPT-4 API', status: 'operational' },
      { name: 'GPT-3.5 API', status: 'operational' },
      { name: 'DALL-E API', status: 'operational' },
      { name: 'GPT-4 Turbo', status: 'operational' },
      { name: 'Whisper API', status: 'operational' },
    ],
  },
  {
    service_name: 'anthropic',
    display_name: 'Anthropic Claude',
    description: 'Claude-3 Opus, Sonnet, Haiku',
    status: 'operational',
    page_url: 'https://status.anthropic.com',
    icon: 'claude',
    components: [
      { name: 'Claude Web', status: 'operational' },
      { name: 'Claude-3 Opus', status: 'operational' },
      { name: 'Claude-3 Sonnet', status: 'operational' },
      { name: 'Claude-3 Haiku', status: 'operational' },
      { name: 'Claude API', status: 'operational' },
    ],
  },
  {
    service_name: 'cursor',
    display_name: 'Cursor AI',
    description: 'AI 기반 코드 에디터',
    status: 'operational',
    page_url: 'https://cursor.sh',
    icon: 'cursor',
    components: [
      { name: 'Editor Core', status: 'operational' },
      { name: 'AI Assistant', status: 'operational' },
      { name: 'Code Completion', status: 'operational' },
      { name: 'Chat Interface', status: 'operational' },
    ],
  },
  {
    service_name: 'googleai',
    display_name: 'Google AI Studio',
    description: 'Gemini Pro API 및 웹 인터페이스',
    status: 'operational',
    page_url: 'https://aistudio.google.com',
    icon: 'googleai',
    components: [
      { name: 'AI Studio Web', status: 'operational' },
      { name: 'Gemini Pro API', status: 'operational' },
      { name: 'Gemini Vision', status: 'operational' },
      { name: 'Vertex AI', status: 'operational' },
    ],
  },
];

// 기본 필터 설정 (모든 컴포넌트 표시)
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

// 기본 즐겨찾기 설정 (모두 false)
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

// localStorage 키들
const STORAGE_KEYS = {
  THEME: 'ai-status-theme',
  COMPONENT_FILTERS: 'ai-status-component-filters',
  FAVORITES: 'ai-status-favorites',
};

// 아이콘 컴포넌트 매핑 - 실제 이미지 사용
const ServiceIcon = ({ iconName, size = 20 }: { iconName: string; size?: number }) => {
  const imageStyle: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    objectFit: 'cover',
    borderRadius: '8px',
  };

  // Cursor 아이콘만 특별히 크기 조정
  const cursorStyle: React.CSSProperties = {
    ...imageStyle,
    transform: 'scale(1.2)', // 20% 크게
  };
  
  switch (iconName) {
    case 'gpt':
      return <img src={gptIcon} alt="GPT" style={imageStyle} />;
    case 'claude':
      return <img src={claudeIcon} alt="Claude" style={imageStyle} />;
    case 'cursor':
      return <img src={cursorIcon} alt="Cursor" style={cursorStyle} />;
    case 'googleai':
      return <img src={googleAiIcon} alt="Google AI" style={imageStyle} />;
    default:
      return <img src={gptIcon} alt="Default" style={imageStyle} />;
  }
};

// 상태에 따른 스타일과 텍스트
const getStatusInfo = (status: string) => {
  switch (status) {
    case 'operational':
      return { color: '#10b981', text: '정상 운영' };
    case 'degraded':
      return { color: '#f59e0b', text: '성능 저하' };
    case 'outage':
      return { color: '#ef4444', text: '서비스 장애' };
    default:
      return { color: '#6b7280', text: '알 수 없음' };
  }
};

const Dashboard: React.FC<DashboardProps> = ({ className = '' }) => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [theme] = useState<'light' | 'dark'>('dark'); // 다크모드 전용
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showComponentSettings, setShowComponentSettings] = useState(false);
  const [componentFilters, setComponentFilters] = useState<ComponentFilter>(getDefaultFilters());
  const [favorites, setFavorites] = useState<Favorites>(getDefaultFavorites());

  // localStorage에서 설정 로드
  useEffect(() => {
    try {
      // 다크모드 전용으로 테마 강제 설정
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');

      // 컴포넌트 필터 설정 로드
      const savedFilters = localStorage.getItem(STORAGE_KEYS.COMPONENT_FILTERS);
      if (savedFilters) {
        setComponentFilters(JSON.parse(savedFilters));
      }

      // 즐겨찾기 설정 로드
      const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('설정을 불러오는 중 오류가 발생했습니다:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPONENT_FILTERS, JSON.stringify(componentFilters));
  }, [componentFilters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  // 다크모드 전용으로 테마 토글 기능 제거

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // 시뮬레이션: 랜덤 상태 변경
      const statuses: Array<'operational' | 'degraded' | 'outage'> = ['operational', 'degraded', 'outage'];
      const newServices = services.map(service => ({
        ...service,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        components: service.components.map(component => ({
          ...component,
          status: statuses[Math.floor(Math.random() * statuses.length)]
        }))
      }));
      setServices(newServices);
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  // 컴포넌트 필터 토글
  const toggleComponentFilter = (serviceName: string, componentName: string) => {
    setComponentFilters(prev => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        [componentName]: !prev[serviceName][componentName]
      }
    }));
  };

  // 즐겨찾기 토글
  const toggleFavorite = (serviceName: string, componentName: string) => {
    setFavorites(prev => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        [componentName]: !prev[serviceName][componentName]
      }
    }));
  };

  // 빠른 필터 프리셋
  const applyPreset = (preset: 'all' | 'favorites' | 'core') => {
    const newFilters = { ...componentFilters };
    
    mockServices.forEach(service => {
      service.components.forEach(component => {
        switch (preset) {
          case 'all':
            newFilters[service.service_name][component.name] = true;
            break;
          case 'favorites':
            newFilters[service.service_name][component.name] = favorites[service.service_name][component.name];
            break;
          case 'core':
            // 각 서비스의 처음 3개 컴포넌트만 표시
            const componentIndex = service.components.indexOf(component);
            newFilters[service.service_name][component.name] = componentIndex < 3;
            break;
        }
      });
    });
    
    setComponentFilters(newFilters);
  };

  // 필터링된 컴포넌트 가져오기
  const getFilteredComponents = (service: Service) => {
    return service.components.filter(component => 
      componentFilters[service.service_name]?.[component.name] !== false
    );
  };

  // 선택된 컴포넌트 수 계산
  const getSelectedCount = () => {
    let total = 0;
    let selected = 0;
    mockServices.forEach(service => {
      service.components.forEach(component => {
        total++;
        if (componentFilters[service.service_name]?.[component.name] !== false) {
          selected++;
        }
      });
    });
    return { selected, total };
  };

  // body 스타일 적용
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#f5f5f5';
      document.body.style.color = '#000000';
    }
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // 설정 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showComponentSettings && !target.closest('.component-settings-dropdown')) {
        setShowComponentSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showComponentSettings]);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };

  // 전체 상태 계산
  const operationalCount = services.filter(s => s.status === 'operational').length;
  const totalCount = services.length;
  const { selected, total } = getSelectedCount();

  return (
    <div style={containerStyle} className={className}>
      <header style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
        backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
        padding: '20px 0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                🤖 AI 서비스 상태 모니터링
              </h1>
              <p style={{ fontSize: '14px', color: theme === 'dark' ? '#a0a0a0' : '#666666', margin: 0 }}>
                실시간으로 AI 서비스들의 상태를 확인하세요
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* 컴포넌트 설정 드롭다운 */}
              <div className="component-settings-dropdown" style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowComponentSettings(!showComponentSettings)}
                  style={{
                    background: 'none',
                    border: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'inherit',
                    fontSize: '13px',
                  }}
                >
                  <Settings size={16} />
                  <span>필터 ({selected}/{total})</span>
                </button>

                {showComponentSettings && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
                    borderRadius: '8px',
                    padding: '16px',
                    minWidth: '300px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                  }}>
                    {/* 빠른 필터 */}
                    <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}` }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>빠른 필터</div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => applyPreset('all')} style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>전체</button>
                        <button onClick={() => applyPreset('favorites')} style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>즐겨찾기</button>
                        <button onClick={() => applyPreset('core')} style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>핵심만</button>
                      </div>
                    </div>

                    {/* 서비스별 컴포넌트 설정 */}
                    {mockServices.map(service => (
                      <div key={service.service_name} style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ServiceIcon iconName={service.icon} size={16} />
                          {service.display_name}
                        </div>
                        <div style={{ marginLeft: '24px' }}>
                          {service.components.map(component => (
                            <div key={component.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                                <input
                                  type="checkbox"
                                  checked={componentFilters[service.service_name]?.[component.name] !== false}
                                  onChange={() => toggleComponentFilter(service.service_name, component.name)}
                                  style={{ cursor: 'pointer' }}
                                />
                                {component.name}
                              </label>
                              <button
                                onClick={() => toggleFavorite(service.service_name, component.name)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '2px',
                                  color: favorites[service.service_name]?.[component.name] ? '#f59e0b' : (theme === 'dark' ? '#666' : '#ccc'),
                                }}
                              >
                                <Star size={14} fill={favorites[service.service_name]?.[component.name] ? '#f59e0b' : 'none'} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 다크모드 전용으로 테마 토글 버튼 제거 */}
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isRefreshing ? 0.7 : 1,
                }}
              >
                <RefreshCw size={16} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                새로고침
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '140px 20px 30px 20px' }}>
        <div style={{
          ...cardStyle,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Wifi size={24} style={{ color: operationalCount === totalCount ? '#10b981' : '#f59e0b' }} />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>
                전체 시스템 상태: {operationalCount === totalCount ? '정상' : '일부 문제'}
              </h2>
              <p style={{ fontSize: '14px', color: theme === 'dark' ? '#a0a0a0' : '#666666', margin: 0 }}>
                {operationalCount}/{totalCount} 서비스 정상 운영 중 | {selected}/{total} 컴포넌트 표시 중
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: theme === 'dark' ? '#a0a0a0' : '#666666' }}>
            <Clock size={16} />
            <span>{lastUpdated.toLocaleString('ko-KR')}</span>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', paddingTop: '20px', paddingBottom: '120px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '20px'
        }}>
          {services.map((service) => {
            const statusInfo = getStatusInfo(service.status);
            const filteredComponents = getFilteredComponents(service);
            
            return (
              <div key={service.service_name} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ServiceIcon iconName={service.icon} size={48} />
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                        {service.display_name}
                      </h3>
                      <p style={{ fontSize: '14px', color: theme === 'dark' ? '#a0a0a0' : '#666666', margin: 0 }}>
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: statusInfo.color,
                    }} />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: statusInfo.color }}>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>

                {/* 하위 컴포넌트 상태 - 필터링 적용 */}
                {filteredComponents.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: theme === 'dark' ? '#a0a0a0' : '#666666', 
                      margin: '0 0 12px 0' 
                    }}>
                      컴포넌트 상태 ({filteredComponents.length}/{service.components.length})
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '8px' 
                    }}>
                      {filteredComponents.map((component) => {
                        const compStatusInfo = getStatusInfo(component.status);
                        const isFavorite = favorites[service.service_name]?.[component.name];
                        return (
                          <div 
                            key={component.name} 
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
                              border: `1px solid ${theme === 'dark' ? '#404040' : '#e9ecef'}`,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {isFavorite && <Star size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />}
                              <span style={{ fontSize: '13px', fontWeight: '500' }}>
                                {component.name}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <div style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: compStatusInfo.color,
                              }} />
                              <span style={{ 
                                fontSize: '11px', 
                                color: theme === 'dark' ? '#a0a0a0' : '#666666' 
                              }}>
                                {compStatusInfo.text}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </main>

      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
        backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
        padding: '16px 20px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: theme === 'dark' ? '#a0a0a0' : '#666666', margin: '0 0 6px 0' }}>
            마지막 업데이트: {lastUpdated.toLocaleString('ko-KR')}
          </p>
          <p style={{ fontSize: '12px', color: theme === 'dark' ? '#a0a0a0' : '#666666', margin: '0 0 4px 0' }}>
            AI 서비스 상태는 15초마다 자동으로 업데이트됩니다.
          </p>
          <p style={{ fontSize: '11px', color: theme === 'dark' ? '#808080' : '#888888', margin: 0 }}>
            React + TypeScript + Vite로 구축된 AI 상태 모니터링 대시보드
          </p>
        </div>
      </footer>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard; 