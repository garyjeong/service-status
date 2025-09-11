import React from 'react';
import ServiceCard from './ServiceCard';
import { Service } from '../../../services/api';
import { Language, ServiceExpansion } from '../../../types/ui';

interface ServiceGridProps {
  services: Service[];
  expandedServices: ServiceExpansion;
  serviceLoadingStates: { [serviceName: string]: boolean };
  language: Language;
  isAnimating: boolean;
  
  translations: {
    statusPage: string;
    refreshService: string;
  };
  
  onToggleExpansion: (serviceName: string) => void;
  onRefreshService: (serviceName: string) => void;
}

// 스켈레톤 로딩 컴포넌트
const ServiceCardSkeleton = () => (
  <div className="service-card animate-pulse" style={{ height: '200px' }}>
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ backgroundColor: 'rgba(237, 236, 232, 0.15)' }}></div>
        <div className="flex-1 min-w-0 self-center">
          <div className="h-5 rounded w-32" style={{ backgroundColor: 'rgba(237, 236, 232, 0.2)' }}></div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded" style={{ backgroundColor: 'rgba(237, 236, 232, 0.12)' }}></div>
      </div>
    </div>
    <div className="flex-1 flex flex-col min-h-0 mb-3">
      <div className="flex flex-col justify-center flex-1">
        <div className="space-y-2 mb-4">
          <div className="h-4 rounded w-full" style={{ backgroundColor: 'rgba(237, 236, 232, 0.1)' }}></div>
          <div className="h-4 rounded w-4/5" style={{ backgroundColor: 'rgba(237, 236, 232, 0.08)' }}></div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(46, 255, 180, 0.3)' }}></div>
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(237, 236, 232, 0.15)' }}></div>
        </div>
      </div>
    </div>
    <div className="pt-3 border-t border-border/50 mt-auto">
      <div className="inline-flex items-center gap-2">
        <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: 'rgba(237, 236, 232, 0.12)' }}></div>
        <div className="h-3 rounded w-16" style={{ backgroundColor: 'rgba(237, 236, 232, 0.1)' }}></div>
      </div>
    </div>
  </div>
);

const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  expandedServices,
  serviceLoadingStates,
  language,
  isAnimating,
  translations,
  onToggleExpansion,
  onRefreshService,
}) => {
  return (
    <div className={`service-grid ${isAnimating ? 'moving' : ''}`}>
      {services.map((service) => {
        const isLoading = serviceLoadingStates[service.service_name];
        
        if (isLoading) {
          return <ServiceCardSkeleton key={service.service_name} />;
        }

        return (
          <ServiceCard
            key={service.service_name}
            service={service}
            isExpanded={expandedServices[service.service_name] || false}
            isLoading={isLoading}
            language={language}
            translations={translations}
            onToggleExpansion={() => onToggleExpansion(service.service_name)}
            onRefresh={() => onRefreshService(service.service_name)}
          />
        );
      })}
    </div>
  );
};

export default ServiceGrid;
