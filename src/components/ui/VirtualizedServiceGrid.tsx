import React, { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Service } from '../../services/api';
import { Language, ServiceExpansion } from '../../types/ui';
import ServiceCard from '../Dashboard/Content/ServiceCard';
import ServiceCardSkeleton from './ServiceCardSkeleton';

interface VirtualizedServiceGridProps {
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
  
  // Virtualization 관련 props
  /**
   * 서비스 카드 높이 (px) - 가상화 계산용
   * @default 200
   */
  itemHeight?: number;
  
  /**
   * 가상화를 시작할 최소 서비스 수
   * @default 20
   */
  virtualizationThreshold?: number;
  
  /**
   * 컨테이너 최대 높이 (px)
   * @default 800
   */
  maxHeight?: number;
}

const VirtualizedServiceGrid: React.FC<VirtualizedServiceGridProps> = ({
  services,
  expandedServices,
  serviceLoadingStates,
  language,
  isAnimating,
  translations,
  onToggleExpansion,
  onRefreshService,
  itemHeight = 200,
  virtualizationThreshold = 20,
  maxHeight = 800,
}) => {
  // 가상화 사용 여부 결정
  const shouldVirtualize = services.length >= virtualizationThreshold;

  // 가상화를 위한 컨테이너 ref
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Grid 레이아웃을 위한 계산
  const { gridColumns, gridGap } = useMemo(() => {
    // Tailwind의 grid 시스템과 일치
    return {
      gridColumns: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      },
      gridGap: 16, // 1rem = 16px
    };
  }, []);

  // 현재 화면 크기에 따른 컬럼 수 계산
  const getColumnsForWidth = (width: number) => {
    if (width < 768) return gridColumns.mobile;
    if (width < 1024) return gridColumns.tablet;
    return gridColumns.desktop;
  };

  // 가상화 설정
  const virtualizer = useVirtualizer({
    count: shouldVirtualize ? Math.ceil(services.length / getColumnsForWidth(window.innerWidth)) : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight + gridGap,
    overscan: 2, // 화면 밖 2개 아이템 미리 렌더링
  });

  // 가상화 없이 렌더링 (서비스 수가 적을 때)
  if (!shouldVirtualize) {
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
  }

  // 가상화된 렌더링
  const items = virtualizer.getVirtualItems();
  const columnsCount = getColumnsForWidth(window.innerWidth);

  return (
    <div className="virtualized-service-grid-container">
      <div
        ref={parentRef}
        className="virtualized-service-grid-viewport"
        style={{
          height: `${maxHeight}px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {items.map((virtualRow) => {
            const rowIndex = virtualRow.index;
            const startIndex = rowIndex * columnsCount;
            const endIndex = Math.min(startIndex + columnsCount, services.length);
            const rowServices = services.slice(startIndex, endIndex);

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div 
                  className="service-grid-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
                    gap: `${gridGap}px`,
                    height: `${itemHeight}px`,
                  }}
                >
                  {rowServices.map((service) => {
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
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 가상화 정보 표시 (개발 모드) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="virtualized-info text-xs text-muted-foreground mt-2">
          가상화 활성: {services.length}개 서비스 중 {items.length}개 행 렌더링
        </div>
      )}
    </div>
  );
};

export default VirtualizedServiceGrid;
