import React from 'react';
import ServiceCard from './ServiceCard';
import ServiceCardSkeleton from '../../ui/ServiceCardSkeleton';
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
