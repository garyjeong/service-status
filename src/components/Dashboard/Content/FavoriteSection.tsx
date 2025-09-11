import React from 'react';
import { Star } from 'lucide-react';
import { Service } from '../../../services/api';
import { Language, Favorites, ComponentFilter } from '../../../types/ui';

// 이미지 import (ServiceCard에서 가져옴)
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

interface FavoriteSectionProps {
  services: Service[];
  favorites: Favorites;
  filters: ComponentFilter;
  language: Language;
  
  translations: {
    favorites: string;
    allServices: string;
  };
  
  onToggleFavorite: (serviceName: string, componentName: string) => void;
}

// 이미지 아이콘 매핑 (ServiceCard와 동일)
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

// 서비스 아이콘 컴포넌트 (ServiceCard와 동일)
const ServiceIcon = ({ iconName, size = 20 }: { iconName: string; size?: number }) => {
  const iconSrc = getServiceIcon(iconName);
  
  if (iconSrc) {
    const needsWhiteBackground = ['github', 'cursor', 'netlify', 'perplexity', 'v0', 'replit', 'circleci', 'grok'].includes(iconName);
    
    return (
      <div className="relative group">
        <img 
          src={iconSrc} 
          alt={`${iconName} icon`} 
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

const FavoriteSection: React.FC<FavoriteSectionProps> = ({
  services,
  favorites,
  filters,
  language,
  translations,
  onToggleFavorite,
}) => {
  // 즐겨찾기 항목들을 가져오는 함수
  const getFavoriteComponents = () => {
    const favoriteItems: Array<{
      serviceName: string;
      serviceDisplayName: string;
      componentName: string;
      status: string;
      icon: string;
    }> = [];

    // 필터링된 서비스만 고려
    const filteredServices = services.filter(service => {
      const hasSelectedComponent = service.components.some(component => 
        filters[service.service_name]?.[component.name]
      );
      return hasSelectedComponent;
    });

    filteredServices.forEach(service => {
      service.components.forEach(component => {
        if (favorites[service.service_name]?.[component.name] && 
            filters[service.service_name]?.[component.name]) {
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

  // 상태에 따른 아이콘 반환
  const getStatusIcon = (status: string) => {
    const iconClasses = "w-4 h-4";
    switch (status) {
      case 'operational': return <span className={`${iconClasses} text-green-400`}>✓</span>;
      case 'degraded': return <span className={`${iconClasses} text-yellow-400`}>⚠</span>;
      case 'outage': return <span className={`${iconClasses} text-red-400`}>✗</span>;
      default: return <span className={`${iconClasses} text-gray-400`}>?</span>;
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

  const favoriteComponents = getFavoriteComponents();

  if (favoriteComponents.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="relative">
          <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-yellow-400" />
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-lg animate-pulse"></div>
        </div>
        <h2 className="text-lg md:text-2xl font-bold text-gradient">
          {translations.favorites}
        </h2>
        <div className="flex items-center gap-1 md:gap-2 bg-yellow-500/10 px-2 md:px-3 py-1 rounded-full border border-yellow-500/20">
          <span className="text-yellow-400 font-medium text-xs md:text-sm">
            {favoriteComponents.length}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {favoriteComponents.map((item, index) => (
          <div key={`${item.serviceName}-${item.componentName}-${index}`} className="favorite-card hover-lift">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                <ServiceIcon iconName={item.icon} size={20} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className={`status-dot ${getStatusColor(item.status)}`} />
                    {getStatusIcon(item.status)}
                  </div>
                  <p className="text-xs md:text-sm font-medium text-foreground truncate">
                    {item.componentName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onToggleFavorite(item.serviceName, item.componentName)}
                className="btn-icon focus-ring flex-shrink-0"
                aria-label={`${item.serviceName} ${item.componentName} 즐겨찾기에서 제거`}
              >
                <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border mt-6 md:mt-8 pt-6 md:pt-8">
        <h2 className="text-lg md:text-2xl font-bold text-gradient mb-4 md:mb-6">
          {translations.allServices}
        </h2>
      </div>
    </div>
  );
};

export default FavoriteSection;
