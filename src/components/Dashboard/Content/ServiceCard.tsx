import React, { useMemo, useCallback } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { Service, ServiceComponent } from '../../../services/api';
import { Language } from '../../../types/ui';
import { useTranslation } from '../../../hooks/useTranslation';
import { useResponsive } from '../../../hooks/useResponsive';

// 이미지 import (원본에서 가져옴)
import openaiIcon from '../../../assets/gpt.png';
import anthropicIcon from '../../../assets/claude.png';
import cursorIcon from '../../../assets/cursor.png';
import googleaiIcon from '../../../assets/google-ai-studio.png';
import githubIcon from '../../../assets/github.png';
import netlifyIcon from '../../../assets/netlify.png';
import dockerIcon from '../../../assets/docker.png';
import awsIcon from '../../../assets/aws.png';
import slackIcon from '../../../assets/slack.png';
import firebaseIcon from '../../../assets/firebase.png';
import supabaseIcon from '../../../assets/supabase.jpg';
import perplexityIcon from '../../../assets/perplexity.png';
import v0Icon from '../../../assets/v0.png';
import replitIcon from '../../../assets/replit.png';
import grokIcon from '../../../assets/grok.png';
import herokuIcon from '../../../assets/heroku.png';
import atlassianIcon from '../../../assets/atlassian.png';
import circleciIcon from '../../../assets/circleci.png';
import auth0Icon from '../../../assets/auth0.png';
import sendgridIcon from '../../../assets/sendgrid.png';
import cloudflareIcon from '../../../assets/cloudflare.png';
import datadogIcon from '../../../assets/datadog.png';

interface ServiceCardProps {
  service: Service;
  isExpanded: boolean;
  isLoading: boolean;
  language: Language;
  translations: {
    statusPage: string;
    refreshService: string;
  };
  onToggleExpansion: () => void;
  onRefresh: () => void;
}

// 이미지 아이콘 매핑
const getServiceIcon = (iconName: string): string => {
  const iconMap: { [key: string]: string } = {
    openai: openaiIcon,
    anthropic: anthropicIcon,
    cursor: cursorIcon,
    googleai: googleaiIcon,
    github: githubIcon,
    netlify: netlifyIcon,
    docker: dockerIcon,
    aws: awsIcon,
    slack: slackIcon,
    firebase: firebaseIcon,
    supabase: supabaseIcon,
    perplexity: perplexityIcon,
    v0: v0Icon,
    replit: replitIcon,
    grok: grokIcon,
    heroku: herokuIcon,
    atlassian: atlassianIcon,
    circleci: circleciIcon,
    auth0: auth0Icon,
    sendgrid: sendgridIcon,
    cloudflare: cloudflareIcon,
    datadog: datadogIcon,
  };
  return iconMap[iconName] || '';
};

// 서비스 아이콘 컴포넌트
const ServiceIcon = ({ iconName, size = 20 }: { iconName: string; size?: number }) => {
  const iconSrc = getServiceIcon(iconName);
  
  if (iconSrc) {
    const needsWhiteBackground = ['github', 'cursor', 'netlify', 'perplexity', 'v0', 'replit', 'circleci', 'grok'].includes(iconName);
    
    return (
      <div className="relative group">
        <img 
          src={iconSrc} 
          alt={`${iconName} icon`} 
          loading="lazy"
          decoding="async"
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
  
  // 아이콘이 없는 경우 서비스 이름의 첫 글자를 원형 배경에 표시
  const firstLetter = iconName.charAt(0).toUpperCase();
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
    'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
  ];
  const colorIndex = iconName.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];
  
  return (
    <div 
      className={`relative group flex items-center justify-center ${bgColor} text-white font-bold rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        fontSize: `${size * 0.5}px`
      }}
    >
      {firstLetter}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
    </div>
  );
};

const ServiceCard: React.FC<ServiceCardProps> = React.memo(({
  service,
  isExpanded,
  isLoading,
  language,
  translations,
  onToggleExpansion,
  onRefresh,
}) => {
  // 훅 사용
  const { getServiceDescription } = useTranslation('services');
  const { t: tA } = useTranslation('accessibility');
  const { isMobile, isTablet } = useResponsive();

  // 메모이제이션된 서비스 설명
  const serviceDescription = useMemo(() => 
    getServiceDescription(service.service_name), 
    [getServiceDescription, service.service_name]
  );

  // 이벤트 핸들러 메모이제이션
  const handleToggleExpansion = useCallback(() => {
    onToggleExpansion();
  }, [onToggleExpansion]);

  const handleRefresh = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRefresh();
  }, [onRefresh]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleExpansion();
    }
  }, [onToggleExpansion]);

  // 상태 아이콘 반환
  const getStatusIcon = useCallback((status: string) => {
    const iconClasses = "w-4 h-4";
    switch (status) {
      case 'operational': return <span className={`${iconClasses} text-green-400`}>✓</span>;
      case 'degraded': return <span className={`${iconClasses} text-yellow-400`}>⚠</span>;
      case 'outage': return <span className={`${iconClasses} text-red-400`}>✗</span>;
      default: return <span className={`${iconClasses} text-gray-400`}>?</span>;
    }
  }, []);

  // 상태 텍스트 반환
  const getStatusText = (status: string) => {
    const statusMap = {
      ko: {
        operational: '정상',
        degraded: '성능 저하',
        outage: '장애',
        maintenance: '점검 중'
      },
      en: {
        operational: 'Operational',
        degraded: 'Degraded',
        outage: 'Outage',
        maintenance: 'Maintenance'
      }
    };
    
    return statusMap[language][status as keyof typeof statusMap.ko] || status;
  };

  // 상태 색상 클래스 반환
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'operational':
        return 'border-green-500/50 hover:border-green-500/80';
      case 'degraded':
        return 'border-yellow-500/50 hover:border-yellow-500/80';
      case 'outage':
        return 'border-red-500/50 hover:border-red-500/80';
      default:
        return 'border-gray-600/50 hover:border-gray-500/80';
    }
  };

  // 상태 색상 반환
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'status-operational';
      case 'degraded':
        return 'status-degraded';
      case 'outage':
        return 'status-major-outage';
      default:
        return 'status-unknown';
    }
  };

  // 전체 서비스 상태 계산 (메모이제이션)
  const serviceStatus = useMemo(() => {
    if (!service.components || service.components.length === 0) return 'unknown';
    const statuses = service.components.map(comp => comp.status);
    if (statuses.some(status => status === 'outage' || status === 'major_outage')) return 'outage';
    if (statuses.some(status => status === 'degraded' || status === 'degraded_performance')) return 'degraded';
    if (statuses.every(status => status === 'operational')) return 'operational';
    return 'unknown';
  }, [service.components]);

  return (
    <div
      className={`service-card hover-lift ${isExpanded ? 'expanded' : ''}`}
      onClick={handleToggleExpansion}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-label={isExpanded 
        ? tA('collapseService', { serviceName: service.display_name })
        : tA('expandService', { serviceName: service.display_name })
      }
    >
      {/* 상단: 아이콘, 제목, 새로고침/확장 버튼 */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <ServiceIcon iconName={service.icon} size={28} />
          <div className="flex-1 min-w-0 self-center">
            <h2 className="text-lg font-semibold text-foreground truncate">{service.display_name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="btn-icon"
            aria-label={tA('refreshButton')}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {/* 모바일과 태블릿에서만 확장/축소 버튼 표시 */}
          {(isMobile || isTablet) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpansion();
              }}
              className="btn-icon"
              aria-label={isExpanded 
                ? tA('collapseService', { serviceName: service.display_name })
                : tA('expandService', { serviceName: service.display_name })
              }
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* 중앙: 설명, 상태 */}
      <div className="flex-1 flex flex-col min-h-0 mb-3">
        {isExpanded ? (
          <div className="mt-2 -mx-1 pr-1 custom-scrollbar overflow-y-auto">
            {service.components && service.components.length > 0 ? (
              <ul className="space-y-2 py-1">
                {service.components.map((component: ServiceComponent, index: number) => (
                  <li key={index} className="flex items-center justify-between text-sm animate-fade-in-up" style={{ animationDelay: `${index * 30}ms` }}>
                    <span className="text-gray-300 truncate flex-1 mr-2">{component.name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium ${getStatusColorClass(component.status)}`}>
                        {getStatusText(component.status)}
                      </span>
                      {getStatusIcon(component.status)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {useTranslation('services').t('noComponents')}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center flex-1">
            <p className="service-description text-sm text-muted-foreground mb-2">
              {serviceDescription}
            </p>
            <div className="flex items-center gap-1.5">
              <div className={`status-dot ${getStatusColor(serviceStatus)}`} />
              {getStatusIcon(serviceStatus)}
            </div>
          </div>
        )}
      </div>

      {/* 하단: 상태 페이지 링크 */}
      <div className="pt-3 border-t border-border/50 mt-auto">
        <a
          href={service.page_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs link-status-page focus-ring rounded px-2 py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Globe className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{translations.statusPage}</span>
        </a>
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
