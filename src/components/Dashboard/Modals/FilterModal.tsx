import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Service } from '../../../services/api';
import { ComponentFilter } from '../../../types/ui';

// 이미지 import
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

interface FilterModalProps {
  isOpen: boolean;
  services: Service[];
  filters: ComponentFilter;
  filterExpandedServices: { [key: string]: boolean };
  
  translations: {
    filterTitle: string;
    filterDescription: string;
    close: string;
  };
  
  onClose: () => void;
  onToggleComponentFilter: (serviceName: string, componentName: string) => void;
  onToggleFilterServiceExpansion: (serviceName: string) => void;
  onToggleAllComponentsForService: (serviceName: string) => void;
  onToggleAllServices: () => void;
  getMasterSelectionState: () => 'all' | 'none' | 'some';
  getServiceSelectionState: (serviceName: string) => 'all' | 'none' | 'some';
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

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  services,
  filters,
  filterExpandedServices,
  translations,
  onClose,
  onToggleComponentFilter,
  onToggleFilterServiceExpansion,
  onToggleAllComponentsForService,
  onToggleAllServices,
  getMasterSelectionState,
  getServiceSelectionState,
}) => {
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
      >
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h2 id="filter-modal-title" className="modal-title">
            {translations.filterTitle}
          </h2>
          <div className="flex items-center gap-3">
            <button 
              className="filter-master-toggle"
              onClick={onToggleAllServices}
            >
              전체 {getMasterSelectionState() === 'all' ? '해제' : '선택'}
            </button>
            <button
              onClick={onClose}
              className="modal-close-button focus-ring"
              aria-label={translations.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* 모달 바디 */}
        <div className="modal-body">
          <p className="text-sm text-muted-foreground mb-6">
            {translations.filterDescription}
          </p>
          
          <div className="filter-grid">
            {services.map(service => (
              <div key={service.service_name} className="filter-service-section">
                <div className="filter-service-header">
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => onToggleFilterServiceExpansion(service.service_name)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggleFilterServiceExpansion(service.service_name);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={filterExpandedServices[service.service_name] || false}
                    aria-label={`${service.display_name} 서비스 펼치기/접기`}
                  >
                    <ServiceIcon iconName={service.icon} size={24} />
                    <h3 className="filter-service-title">
                      {service.display_name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="filter-service-checkbox focus-ring"
                      checked={getServiceSelectionState(service.service_name) === 'all'}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = getServiceSelectionState(service.service_name) === 'some';
                        }
                      }}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleAllComponentsForService(service.service_name);
                      }}
                    />
                    <button
                      onClick={() => onToggleFilterServiceExpansion(service.service_name)}
                      className="p-1 hover:bg-primary/10 rounded"
                    >
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-300 ${
                          filterExpandedServices[service.service_name] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                {filterExpandedServices[service.service_name] && (
                  <div className="filter-component-list">
                    {service.components.map(component => (
                      <label 
                        key={component.name} 
                        className="filter-component-item"
                      >
                        <input
                          type="checkbox"
                          checked={filters[service.service_name]?.[component.name] || false}
                          onChange={() => onToggleComponentFilter(service.service_name, component.name)}
                          className="filter-checkbox focus-ring"
                        />
                        <span className="filter-component-label">
                          {component.name}
                        </span>
                        <div className={`status-dot ${getStatusColor(component.status)}`} />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
