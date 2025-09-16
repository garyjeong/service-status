import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronUp, ChevronDown, Globe, Activity, TrendingUp, Zap, Clock } from 'lucide-react';
import type { Service, ServiceComponent } from '../services/api';

// 이미지 import
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
import perplexityIcon from '@/assets/perplexity.png';
import v0Icon from '@/assets/v0.png';
import replitIcon from '@/assets/replit.png';
import grokIcon from '@/assets/grok.png';
import herokuIcon from '@/assets/heroku.png';
import atlassianIcon from '@/assets/atlassian.png';
import circleciIcon from '@/assets/circleci.png';
import auth0Icon from '@/assets/auth0.png';
import sendgridIcon from '@/assets/sendgrid.png';
import cloudflareIcon from '@/assets/cloudflare.png';
import datadogIcon from '@/assets/datadog.png';

interface ServiceCardProps {
  service: Service & { status: string };
  isExpanded: boolean;
  isLoading: boolean;
  language: 'ko' | 'en';
  onToggleExpansion: () => void;
  onRefresh: () => void;
  getServiceDescription: (serviceName: string) => string;
  getStatusText: (status: string) => string;
  getStatusColorClass: (status: string) => string;
  getStatusColor: (status: string) => string;
  translations: {
    refreshService: string;
    statusPage: string;
  };
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

const ServiceIcon = ({ iconName, size = 20 }: { iconName: string; size?: number }) => {
  const iconSrc = getServiceIcon(iconName);
  
  if (iconSrc) {
    const needsWhiteBackground = ['github', 'cursor', 'netlify', 'perplexity', 'v0', 'replit', 'circleci', 'grok'].includes(iconName);
    
    return (
      <div className="service-icon-premium group" style={{ '--icon-size': `${size}px` } as React.CSSProperties}>
        <div className="service-icon-container">
          <img 
            src={iconSrc} 
            alt={`${iconName} icon`} 
            className="service-icon-image"
            style={{ 
              width: `${size}px`, 
              height: `${size}px`,
              objectFit: 'contain',
              borderRadius: '10px',
              backgroundColor: needsWhiteBackground ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              padding: needsWhiteBackground ? '3px' : '0'
            }}
          />
          {/* 글래스 오버레이 */}
          <div className="service-icon-glass"></div>
          {/* 네온 글로우 */}
          <div className="service-icon-glow"></div>
        </div>
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
  
  const gradients = [
    'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', // blue
    'linear-gradient(135deg, #10b981 0%, #047857 100%)', // green
    'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)', // purple
    'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', // red
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // yellow
    'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', // indigo
    'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', // pink
    'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)'  // teal
  ];
  const gradient = gradients[colorIndex];
  
  return (
    <div 
      className="service-icon-premium group"
      style={{ '--icon-size': `${size}px` } as React.CSSProperties}
    >
      <div 
        className="service-icon-container service-icon-fallback"
        style={{ 
          background: gradient,
          fontSize: `${size * 0.4}px`
        }}
      >
        <span className="relative z-10 font-bold text-white">
          {firstLetter}
        </span>
        <div className="service-icon-glass"></div>
        <div className="service-icon-glow"></div>
      </div>
    </div>
  );
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

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isExpanded,
  isLoading,
  language,
  onToggleExpansion,
  onRefresh,
  getServiceDescription,
  getStatusText,
  getStatusColorClass,
  getStatusColor,
  translations
}) => {
  // 상태별 네온 보더 색상
  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'operational': return 'rgba(46, 255, 180, 0.4)';
      case 'degraded': return 'rgba(230, 165, 50, 0.4)';
      case 'outage': return 'rgba(214, 48, 49, 0.6)';
      case 'partial-outage': return 'rgba(214, 48, 49, 0.5)';
      default: return 'rgba(237, 236, 232, 0.2)';
    }
  };

  // 상태별 글로우 효과
  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'operational': return '0 0 20px rgba(46, 255, 180, 0.15)';
      case 'degraded': return '0 0 20px rgba(230, 165, 50, 0.15)';
      case 'outage': return '0 0 20px rgba(214, 48, 49, 0.2)';
      case 'partial-outage': return '0 0 20px rgba(214, 48, 49, 0.18)';
      default: return '0 0 10px rgba(237, 236, 232, 0.1)';
    }
  };

  // Framer Motion 애니메이션 정의
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      rotateX: 2,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.div
      className={`service-card-premium ${isExpanded ? 'expanded' : ''} group cursor-pointer`}
      onClick={onToggleExpansion}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleExpansion();
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-label={`${service.display_name} 서비스 상세 정보 보기`}
      style={{
        '--status-border': getStatusBorderColor(service.status),
        '--status-glow': getStatusGlow(service.status)
      } as React.CSSProperties}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
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
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
            disabled={isLoading}
            className="btn-icon"
            aria-label={translations.refreshService}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpansion();
            }}
            className="btn-icon md:hidden"
            aria-label={isExpanded ? "접기" : "펼치기"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 중앙: 설명, 상태 */}
      <div className="flex-1 flex flex-col min-h-0 mb-3">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: "auto",
                transition: {
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                transition: {
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              }}
              className="mt-2 -mx-1 pr-1 custom-scrollbar overflow-y-auto"
            >
              {service.components && service.components.length > 0 ? (
                <motion.ul 
                  className="space-y-2 py-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                >
                  {service.components.map((component: ServiceComponent, index: number) => (
                    <motion.li 
                      key={index} 
                      className="flex items-center justify-between text-sm"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { 
                          opacity: 1, 
                          x: 0,
                          transition: {
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }
                        }
                      }}
                    >
                      <span className="text-gray-300 truncate flex-1 mr-2">{component.name}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-medium ${getStatusColorClass(component.status)}`}>
                          {getStatusText(component.status)}
                        </span>
                        {getStatusIcon(component.status)}
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.p 
                  className="text-sm text-muted-foreground text-center py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {language === 'ko' ? '세부 컴포넌트 정보가 없습니다.' : 'No detailed component information available.'}
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -10,
                transition: {
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              }}
              className="flex flex-col justify-center flex-1"
            >
              <motion.p 
                className="service-description text-sm text-muted-foreground mb-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.1, duration: 0.3 }
                }}
              >
                {getServiceDescription(service.service_name)}
              </motion.p>
              <motion.div 
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.2, duration: 0.3 }
                }}
              >
                <div className={`status-dot ${getStatusColor(service.status)}`} />
                {getStatusIcon(service.status)}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </motion.div>
  );
};

export default ServiceCard;
