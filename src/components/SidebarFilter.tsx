import React from 'react';
import { X, Star, ChevronDown, ChevronUp } from 'lucide-react';
import type { Service } from '../services/api';
import type { ComponentFilter } from '../types/ui';

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

interface SidebarFilterProps {
  isOpen: boolean;
  services: Service[];
  filters: ComponentFilter;
  expandedServices: { [key: string]: boolean };
  onClose: () => void;
  onToggleComponentFilter: (serviceName: string, componentName: string) => void;
  onToggleServiceExpansion: (serviceName: string) => void;
  onToggleAllServices: () => void;
  onToggleAllComponentsForService: (serviceName: string) => void;
  getServiceSelectionState: (serviceName: string) => 'all' | 'none' | 'some';
  getMasterSelectionState: () => 'all' | 'none' | 'some';
  getStatusColor: (status: string) => string;
  translations: {
    filterTitle: string;
    filterDescription: string;
    close: string;
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
      <img 
        src={iconSrc} 
        alt={`${iconName} icon`} 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          objectFit: 'contain',
          borderRadius: '6px',
          backgroundColor: needsWhiteBackground ? '#ffffff' : 'transparent',
          padding: needsWhiteBackground ? '1px' : '0'
        }} 
        className="flex-shrink-0"
      />
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
      className={`flex items-center justify-center ${bgColor} text-white font-bold rounded-md flex-shrink-0`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        fontSize: `${size * 0.5}px`
      }}
    >
      {firstLetter}
    </div>
  );
};

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  isOpen,
  services,
  filters,
  expandedServices,
  onClose,
  onToggleComponentFilter,
  onToggleServiceExpansion,
  onToggleAllServices,
  onToggleAllComponentsForService,
  getServiceSelectionState,
  getMasterSelectionState,
  getStatusColor,
  translations
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* 사이드바 */}
      <div className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 flex flex-col animate-slide-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              {translations.filterTitle}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="btn-secondary text-xs px-2 py-1"
              onClick={onToggleAllServices}
            >
              전체 {getMasterSelectionState() === 'all' ? '해제' : '선택'}
            </button>
            <button
              onClick={onClose}
              className="btn-icon w-8 h-8"
              aria-label={translations.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* 설명 */}
        <div className="p-4 border-b border-border">
          <p className="text-sm text-muted-foreground">
            {translations.filterDescription}
          </p>
        </div>
        
        {/* 서비스 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {services.map(service => (
            <div key={service.service_name} className="bg-background/50 rounded-lg border border-border/50">
              {/* 서비스 헤더 */}
              <div className="flex items-center gap-3 p-3">
                <ServiceIcon iconName={service.icon} size={20} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {service.display_name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border"
                    checked={getServiceSelectionState(service.service_name) === 'all'}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = getServiceSelectionState(service.service_name) === 'some';
                      }
                    }}
                    onChange={() => onToggleAllComponentsForService(service.service_name)}
                  />
                  <button
                    onClick={() => onToggleServiceExpansion(service.service_name)}
                    className="btn-icon w-6 h-6"
                  >
                    {expandedServices[service.service_name] ? 
                      <ChevronUp className="w-3 h-3" /> : 
                      <ChevronDown className="w-3 h-3" />
                    }
                  </button>
                </div>
              </div>
              
              {/* 컴포넌트 목록 */}
              {expandedServices[service.service_name] && (
                <div className="px-3 pb-3 space-y-1">
                  {service.components.map(component => (
                    <label 
                      key={component.name} 
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent/50 cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={filters[service.service_name]?.[component.name] || false}
                        onChange={() => onToggleComponentFilter(service.service_name, component.name)}
                        className="w-3 h-3 rounded"
                      />
                      <span className="flex-1 text-muted-foreground truncate">
                        {component.name}
                      </span>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(component.status)}`} />
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SidebarFilter;
