import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Activity, TrendingUp, Zap, Clock } from 'lucide-react';
import type { Service } from '../services/api';

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
// Newly added service icons
import groqIcon from '@/assets/groq.png';
import zetaglobalIcon from '@/assets/zetaglobal.png';
import vercelIcon from '@/assets/vercel.png';
import stripeIcon from '@/assets/stripe.png';
import mongodbIcon from '@/assets/mongodb.png';
import huggingfaceIcon from '@/assets/huggingface.png';
import gitlabIcon from '@/assets/gitlab.svg';

interface ServiceCardProps {
  service: Service & { status: string };
  isLoading: boolean;
  language: 'ko' | 'en';
  onCardClick: () => void;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
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
    // Newly added mappings
    groq: groqIcon,
    zetaglobal: zetaglobalIcon,
    vercel: vercelIcon,
    stripe: stripeIcon,
    mongodb: mongodbIcon,
    huggingface: huggingfaceIcon,
    gitlab: gitlabIcon,
  };
  return iconMap[iconName] || '';
};

export const ServiceIcon = ({ iconName, size = 20 }: { iconName: string; size?: number }) => {
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
              backgroundColor: needsWhiteBackground ? 'var(--icon-bg)' : 'var(--icon-bg-transparent)',
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
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational': return <Activity className="w-4 h-4 text-green-400" />;
    case 'degraded':
    case 'degraded_performance': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
    case 'outage':
    case 'partial_outage':
    case 'major_outage': return <Zap className="w-4 h-4 text-red-400" />;
    case 'maintenance':
    case 'under_maintenance': return <Clock className="w-4 h-4 text-blue-400" />;
    default: return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

const ServiceCard: React.FC<ServiceCardProps> = React.memo(({
  service,
  isLoading,
  language,
  onCardClick,
  getStatusText,
  getStatusColor
}) => {
  // 상태별 CSS 클래스
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'operational': return 'status-operational';
      case 'degraded':
      case 'degraded_performance': return 'status-degraded';
      case 'outage':
      case 'partial_outage':
      case 'major_outage': return 'status-outage';
      case 'maintenance':
      case 'under_maintenance': return 'status-maintenance';
      default: return '';
    }
  };

  // Framer Motion 애니메이션 정의
  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    },
    tap: {
      scale: 0.96,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.div
      className={`service-card-minimal ${getStatusClass(service.status)}`}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={language === 'ko' ? `${service.display_name} 서비스 상세 정보 보기` : `View ${service.display_name} service details`}
      aria-haspopup="dialog"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileTap="tap"
    >
      {/* 서비스 아이콘 */}
      <ServiceIcon iconName={service.icon} size={48} />

      {/* 서비스 이름 */}
      <span className="service-name-text">
        {service.display_name}
      </span>

      {/* 상태 아이콘 + 텍스트 */}
      <div className="status-row">
        {isLoading ? (
          <RefreshCw className="status-row-icon animate-spin text-muted-foreground" />
        ) : (
          getStatusIcon(service.status)
        )}
        <span className="status-text">
          {getStatusText(service.status)}
        </span>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
