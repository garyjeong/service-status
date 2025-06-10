import React, { useState, useEffect } from 'react';
import { RefreshCw, Moon, Sun, Monitor, Clock, Wifi } from 'lucide-react';

// 이미지 import 추가
import claudeIcon from '../assets/claude.png';
import cursorIcon from '../assets/cursor.webp';
import googleAiIcon from '../assets/google-ai-studio.svg';
import gptIcon from '../assets/gpt.svg';

interface DashboardProps {
  className?: string;
}

// 하위 컴포넌트 타입
interface ServiceComponent {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
}

// 서비스 타입
interface Service {
  service_name: string;
  display_name: string;
  description: string;
  status: 'operational' | 'degraded' | 'outage';
  page_url: string;
  icon: string;
  components: ServiceComponent[];
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

// 아이콘 컴포넌트 매핑 - 실제 이미지 사용
const ServiceIcon = ({ iconName, size = 20 }: { iconName: string; size?: number }) => {
  const imageStyle: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    objectFit: 'contain',
  };
  
  switch (iconName) {
    case 'gpt':
      return <img src={gptIcon} alt="GPT" style={imageStyle} />;
    case 'claude':
      return <img src={claudeIcon} alt="Claude" style={imageStyle} />;
    case 'cursor':
      return <img src={cursorIcon} alt="Cursor" style={imageStyle} />;
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

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
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div style={containerStyle} className={className}>
      <header style={{ 
        borderBottom: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
        backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
        padding: '20px 0',
        marginBottom: '30px',
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
              <button
                onClick={toggleTheme}
                style={{
                  background: 'none',
                  border: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
                  borderRadius: '6px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'inherit',
                }}
              >
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 30px 20px' }}>
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
                {operationalCount}/{totalCount} 서비스 정상 운영 중
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: theme === 'dark' ? '#a0a0a0' : '#666666' }}>
            <Clock size={16} />
            <span>{lastUpdated.toLocaleString('ko-KR')}</span>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div>
          {services.map((service) => {
            const statusInfo = getStatusInfo(service.status);
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

                {/* 하위 컴포넌트 상태 */}
                {service.components && service.components.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: theme === 'dark' ? '#a0a0a0' : '#666666', 
                      margin: '0 0 12px 0' 
                    }}>
                      컴포넌트 상태
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '8px' 
                    }}>
                      {service.components.map((component) => {
                        const compStatusInfo = getStatusInfo(component.status);
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
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>
                              {component.name}
                            </span>
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

                <div>
                  <a 
                    href={service.page_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      fontSize: '12px', 
                      color: '#3b82f6', 
                      textDecoration: 'none',
                    }}
                  >
                    상태 페이지 보기 →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          color: theme === 'dark' ? '#a0a0a0' : '#666666', 
          fontSize: '14px',
          margin: '30px 0',
        }}>
          마지막 업데이트: {lastUpdated.toLocaleString('ko-KR')}
        </div>
      </main>

      <footer style={{
        borderTop: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
        backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
        padding: '30px 20px',
        marginTop: '50px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: theme === 'dark' ? '#a0a0a0' : '#666666', margin: '0 0 8px 0' }}>
            AI 서비스 상태는 30초마다 자동으로 업데이트됩니다.
          </p>
          <p style={{ fontSize: '12px', color: theme === 'dark' ? '#808080' : '#888888', margin: 0 }}>
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