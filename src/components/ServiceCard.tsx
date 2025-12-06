import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Globe } from 'lucide-react';
import { Service, ServiceComponent, StatusType } from '../types/status';
import { getCategoryForService } from '../types/categories';
import { useTheme } from '../design-system/ThemeContext';
import { Icon } from '../design-system/Icon';
import { Button } from '../design-system/Button';
import { cn } from '../utils/cn';

// 이미지 import (유지)
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
import groqIcon from '@/assets/groq.png';
import zetaglobalIcon from '@/assets/zetaglobal.png';
import vercelIcon from '@/assets/vercel.png';
import stripeIcon from '@/assets/stripe.png';
import mongodbIcon from '@/assets/mongodb.png';
import huggingfaceIcon from '@/assets/huggingface.png';
import gitlabIcon from '@/assets/gitlab.svg';

interface ServiceCardProps {
  service: ServiceStatus;
  isExpanded: boolean;
  isLoading: boolean;
  language: 'ko' | 'en';
  onToggleExpansion: () => void;
  onRefresh: () => void;
  getServiceDescription: (serviceName: string) => string;
  getStatusText: (status: StatusType) => string;
  translations: {
    refreshService: string;
    statusPage: string;
  };
}

// 이미지 아이콘 매핑 (유지)
const getServiceIcon = (iconName: string): string => {
  const iconMap: { [key: string]: string } = {
    openai: openaiIcon, anthropic: anthropicIcon, cursor: cursorIcon, googleai: googleaiIcon, github: githubIcon,
    netlify: netlifyIcon, docker: dockerIcon, aws: awsIcon, slack: slackIcon, firebase: firebaseIcon,
    supabase: supabaseIcon, perplexity: perplexityIcon, v0: v0Icon, replit: replitIcon, grok: grokIcon,
    heroku: herokuIcon, atlassian: atlassianIcon, circleci: circleciIcon, auth0: auth0Icon, sendgrid: sendgridIcon,
    cloudflare: cloudflareIcon, datadog: datadogIcon, groq: groqIcon, zetaglobal: zetaglobalIcon,
    vercel: vercelIcon, stripe: stripeIcon, mongodb: mongodbIcon, huggingface: huggingfaceIcon, gitlab: gitlabIcon,
  };
  return iconMap[iconName] || '';
};

// ServiceIcon 컴포넌트 (분리 가능, 현재는 유지)
export const ServiceIcon = ({ iconName, size = 20 }: { iconName: string; size?: number }) => {
  const iconSrc = getServiceIcon(iconName);
  if (iconSrc) {
    const needsWhiteBackground = ['github', 'cursor', 'netlify', 'perplexity', 'v0', 'replit', 'circleci', 'grok'].includes(iconName);
    return (
      <div className="service-icon-premium group" style={{ '--icon-size': `${size}px` } as React.CSSProperties}>
        <div className="service-icon-container">
          <img 
            src={iconSrc} alt={`${iconName} icon`} className="service-icon-image"
            style={{ width: `${size}px`, height: `${size}px`, objectFit: 'contain', borderRadius: '10px', backgroundColor: needsWhiteBackground ? 'rgba(255, 255, 255, 0.9)' : 'transparent', padding: needsWhiteBackground ? '3px' : '0' }}
          />
          <div className="service-icon-glass"></div>
          <div className="service-icon-glow"></div>
        </div>
      </div>
    );
  }
  const firstLetter = iconName.charAt(0).toUpperCase();
  const gradients = [
    'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)', 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)'
  ];
  const gradient = gradients[iconName.charCodeAt(0) % gradients.length];
  return (
    <div className="service-icon-premium group" style={{ '--icon-size': `${size}px` } as React.CSSProperties}>
      <div className="service-icon-container service-icon-fallback" style={{ background: gradient, fontSize: `${size * 0.4}px` }}>
        <span className="relative z-10 font-bold text-white">{firstLetter}</span>
        <div className="service-icon-glass"></div>
        <div className="service-icon-glow"></div>
      </div>
    </div>
  );
};


const ServiceCard: React.FC<ServiceCardProps> = React.memo(({
  service, isExpanded, isLoading, language, onToggleExpansion, onRefresh, getServiceDescription, getStatusText, translations
}) => {
  const { theme, statusColors } = useTheme();

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
    hover: { y: -8, scale: 1.02, rotateX: 2, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  };

  const category = getCategoryForService(service.service_name);
  const categoryClass = category ? `service-card-${category.id.replace('-', '')}` : '';

  const getStatusPriorityClass = (status: StatusType) => {
    switch (status) {
      case StatusType.MAJOR_OUTAGE: return 'status-critical';
      case StatusType.PARTIAL_OUTAGE:
      case StatusType.DEGRADED_PERFORMANCE: return 'status-warning';
      case StatusType.OPERATIONAL: return 'status-normal';
      case StatusType.UNDER_MAINTENANCE: return 'status-maintenance';
      default: return 'status-normal';
    }
  };

  const statusPriorityClass = getStatusPriorityClass(service.overall_status);
  const statusColor = statusColors[service.overall_status];

  return (
    <motion.div
      className={cn(
        'service-card-premium group cursor-pointer',
        categoryClass,
        statusPriorityClass,
        isExpanded && 'expanded'
      )}
      onClick={onToggleExpansion}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleExpansion(); } }}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-label={`${service.display_name} 서비스 상세 정보 보기`}
      style={{
        '--status-border': statusColor.glow,
        '--status-glow': statusColor.glow,
        color: theme.colors.textPrimary,
      } as React.CSSProperties}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      {/* 상단: 아이콘, 제목, 새로고침/확장 버튼 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <ServiceIcon iconName={service.icon_url || service.service_name} size={24} />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold truncate" style={{ color: theme.colors.textPrimary }}>{service.display_name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onRefresh(); }}
            isLoading={isLoading}
            aria-label={translations.refreshService}
          >
            {!isLoading && <Icon name="RefreshCw" size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onToggleExpansion(); }}
            className="md:hidden"
            aria-label={isExpanded ? "접기" : "펼치기"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* 중앙: 설명, 상태 */}
      <div className="flex flex-col flex-1 min-h-0 mb-2">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto", transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
              className="mt-2 -mx-1 pr-1 custom-scrollbar overflow-y-auto"
            >
              {service.components && service.components.length > 0 ? (
                <motion.ul 
                  className="space-y-2 py-1"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                  {service.components.map((component: ServiceComponent) => (
                    <motion.li 
                      key={component.id} 
                      className="flex items-center justify-between text-sm"
                      variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } } }}
                    >
                      <span className="truncate flex-1 mr-2" style={{ color: theme.colors.textSecondary }}>{component.name}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-medium" style={{ color: statusColors[component.status].main }}>
                          {getStatusText(component.status)}
                        </span>
                        <Icon name={component.status} size={14} />
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.p className="text-sm text-center py-4" style={{ color: theme.colors.textSecondary }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  {language === 'ko' ? '세부 컴포넌트 정보가 없습니다.' : 'No detailed component information available.'}
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
              className="flex flex-col justify-center flex-1"
            >
              <p className="service-description text-sm mb-2" style={{ color: theme.colors.textSecondary }}>
                {getServiceDescription(service.service_name)}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="status-dot" style={{ backgroundColor: statusColor.main }} />
                <Icon name={service.overall_status} size={16} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 하단: 상태 페이지 링크 */}
      <div className="pt-2 border-t mt-auto" style={{ borderColor: theme.colors.cardBorder }}>
        <a
          href={service.page_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs focus-ring rounded px-2 py-1"
          style={{ color: theme.colors.textSecondary }}
          onClick={(e) => e.stopPropagation()}
        >
          <Globe className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{translations.statusPage}</span>
        </a>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
