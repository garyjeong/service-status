import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Globe, Activity, TrendingUp, Zap, Clock } from 'lucide-react';
import type { Service, ServiceComponent } from '../services/api';
import { ServiceIcon } from './ServiceCard';

interface ServiceDetailBottomSheetProps {
  isOpen: boolean;
  service: (Service & { status: string }) | null;
  language: 'ko' | 'en';
  isLoading: boolean;
  onClose: () => void;
  onRefresh: () => void;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
  translations: {
    refreshService: string;
    statusPage: string;
  };
}

// 상태에 따른 아이콘 반환
const getStatusIcon = (status: string, size: number = 16) => {
  const sizeClass = `w-${size / 4} h-${size / 4}`;
  switch (status) {
    case 'operational': return <Activity className={`${sizeClass} text-green-400`} style={{ width: size, height: size }} />;
    case 'degraded':
    case 'degraded_performance': return <TrendingUp className={`${sizeClass} text-yellow-400`} style={{ width: size, height: size }} />;
    case 'outage':
    case 'partial_outage':
    case 'major_outage': return <Zap className={`${sizeClass} text-red-400`} style={{ width: size, height: size }} />;
    case 'maintenance':
    case 'under_maintenance': return <Clock className={`${sizeClass} text-blue-400`} style={{ width: size, height: size }} />;
    default: return <Clock className={`${sizeClass} text-gray-400`} style={{ width: size, height: size }} />;
  }
};

const ServiceDetailBottomSheet: React.FC<ServiceDetailBottomSheetProps> = ({
  isOpen,
  service,
  language,
  isLoading,
  onClose,
  onRefresh,
  getStatusText,
  getStatusColor,
  translations
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // 드래그 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;

    if (diff > 100) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }

    startY.current = 0;
    currentY.current = 0;
  };

  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이 */}
          <motion.div
            className="service-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* 바텀시트 */}
          <motion.div
            ref={sheetRef}
            className="service-detail-bottom-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 드래그 핸들 */}
            <div className="sheet-handle-container">
              <div className="sheet-handle" />
            </div>

            {/* 헤더 */}
            <div className="sheet-header">
              <div className="flex items-center gap-3">
                <ServiceIcon iconName={service.icon} size={40} />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-foreground truncate">
                    {service.display_name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`status-dot ${getStatusColor(service.status)}`} />
                    <span className="text-sm font-medium">{getStatusText(service.status)}</span>
                    {getStatusIcon(service.status, 16)}
                  </div>
                </div>
              </div>

              {/* 버튼들 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRefresh();
                  }}
                  disabled={isLoading}
                  className="btn-icon"
                  aria-label={translations.refreshService}
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="btn-icon"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 컴포넌트 목록 */}
            <div className="sheet-content custom-scrollbar">
              {service.components && service.components.length > 0 ? (
                <ul className="space-y-3">
                  {service.components.map((component: ServiceComponent, index: number) => (
                    <motion.li
                      key={index}
                      className="component-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <span className="component-name">{component.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`component-status ${getStatusColor(component.status)}`}>
                          {getStatusText(component.status)}
                        </span>
                        {getStatusIcon(component.status, 16)}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {language === 'ko' ? '세부 컴포넌트 정보가 없습니다.' : 'No detailed component information available.'}
                </p>
              )}
            </div>

            {/* 상태 페이지 링크 */}
            <div className="sheet-footer">
              <a
                href={service.page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="sheet-status-link"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-4 h-4" />
                <span>{translations.statusPage}</span>
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServiceDetailBottomSheet;
