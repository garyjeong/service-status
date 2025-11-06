import { useEffect, useRef, useCallback } from 'react';
import type { Service } from '../services/api';
import { StatusUtils } from '../services/api';
import { StatusType } from '../types/status';

interface UseNotificationOptions {
  enabled?: boolean;
  language?: 'ko' | 'en';
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

interface ServiceStatusChange {
  serviceName: string;
  displayName: string;
  previousStatus: StatusType;
  currentStatus: StatusType;
}

export const useNotification = (
  services: Service[],
  options: UseNotificationOptions = {}
) => {
  const { enabled = true, language = 'ko', onPermissionGranted, onPermissionDenied } = options;
  const previousServicesRef = useRef<Map<string, StatusType>>(new Map());
  const permissionRef = useRef<NotificationPermission>('default');

  // 알림 권한 요청
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      if (import.meta.env.DEV) {
        console.warn('This browser does not support notifications');
      }
      return false;
    }

    if (Notification.permission === 'granted') {
      permissionRef.current = 'granted';
      onPermissionGranted?.();
      return true;
    }

    if (Notification.permission === 'denied') {
      permissionRef.current = 'denied';
      onPermissionDenied?.();
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      permissionRef.current = permission;
      
      if (permission === 'granted') {
        onPermissionGranted?.();
        return true;
      } else {
        onPermissionDenied?.();
        return false;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error requesting notification permission:', error);
      }
      return false;
    }
  }, [onPermissionGranted, onPermissionDenied]);

  // 상태 텍스트 가져오기
  const getStatusText = useCallback((status: StatusType): string => {
    const texts = {
      ko: {
        [StatusType.OPERATIONAL]: '정상 운영',
        [StatusType.DEGRADED_PERFORMANCE]: '성능 저하',
        [StatusType.PARTIAL_OUTAGE]: '부분 장애',
        [StatusType.MAJOR_OUTAGE]: '심각한 장애',
        [StatusType.UNDER_MAINTENANCE]: '점검 중',
        [StatusType.UNKNOWN]: '알 수 없음'
      },
      en: {
        [StatusType.OPERATIONAL]: 'Operational',
        [StatusType.DEGRADED_PERFORMANCE]: 'Degraded Performance',
        [StatusType.PARTIAL_OUTAGE]: 'Partial Outage',
        [StatusType.MAJOR_OUTAGE]: 'Major Outage',
        [StatusType.UNDER_MAINTENANCE]: 'Under Maintenance',
        [StatusType.UNKNOWN]: 'Unknown'
      }
    };
    return texts[language][status] || status;
  }, [language]);

  // 알림 보내기
  const sendNotification = useCallback((change: ServiceStatusChange) => {
    if (!enabled || permissionRef.current !== 'granted') {
      return;
    }

    const { serviceName, displayName, previousStatus, currentStatus } = change;
    
    // 정상으로 복구된 경우만 알림 (또는 장애 발생 시)
    const isCriticalChange = 
      currentStatus === StatusType.MAJOR_OUTAGE || 
      currentStatus === StatusType.PARTIAL_OUTAGE ||
      (previousStatus !== StatusType.OPERATIONAL && currentStatus === StatusType.OPERATIONAL);

    if (!isCriticalChange) {
      return;
    }

    const isRecovery = previousStatus !== StatusType.OPERATIONAL && currentStatus === StatusType.OPERATIONAL;
    const isOutage = currentStatus === StatusType.MAJOR_OUTAGE || currentStatus === StatusType.PARTIAL_OUTAGE;

    const title = isRecovery
      ? (language === 'ko' ? '✅ 서비스 복구' : '✅ Service Recovered')
      : (language === 'ko' ? '⚠️ 서비스 장애' : '⚠️ Service Outage');

    const body = isRecovery
      ? (language === 'ko' 
          ? `${displayName} 서비스가 정상 운영 상태로 복구되었습니다.`
          : `${displayName} service has recovered and is now operational.`)
      : (language === 'ko'
          ? `${displayName} 서비스에 ${getStatusText(currentStatus)} 상태가 발생했습니다.`
          : `${displayName} service is experiencing ${getStatusText(currentStatus)}.`);

    const icon = '/favicon.ico'; // 기본 아이콘

    try {
      const notification = new Notification(title, {
        body,
        icon,
        badge: icon,
        tag: `service-${serviceName}`, // 같은 서비스의 중복 알림 방지
        requireInteraction: isOutage, // 장애 시 사용자 상호작용 필요
        silent: false
      });

      // 알림 클릭 시 해당 서비스 상태 페이지로 이동
      notification.onclick = () => {
        window.focus();
        const service = services.find(s => s.service_name === serviceName);
        if (service?.page_url) {
          window.open(service.page_url, '_blank');
        }
        notification.close();
      };

      // 5초 후 자동 닫기 (복구 알림만)
      if (isRecovery) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error sending notification:', error);
      }
    }
  }, [enabled, language, services, getStatusText]);

  // 서비스 상태 변경 감지
  useEffect(() => {
    if (!enabled || services.length === 0) {
      return;
    }

    // 초기 로드 시 이전 상태 저장
    if (previousServicesRef.current.size === 0) {
      services.forEach(service => {
        const calculatedStatus = StatusUtils.calculateServiceStatus(service.components);
        previousServicesRef.current.set(service.service_name, calculatedStatus);
      });
      return;
    }

    // 상태 변경 감지 및 알림
    services.forEach(service => {
      const previousStatus = previousServicesRef.current.get(service.service_name);
      const currentStatus = StatusUtils.calculateServiceStatus(service.components);

      if (previousStatus && previousStatus !== currentStatus) {
        sendNotification({
          serviceName: service.service_name,
          displayName: service.display_name,
          previousStatus,
          currentStatus
        });
      }

      // 현재 상태를 이전 상태로 업데이트
      previousServicesRef.current.set(service.service_name, currentStatus);
    });
  }, [services, enabled, sendNotification]);

  // 권한 요청 함수 반환
  return {
    requestPermission,
    permission: permissionRef.current,
    isSupported: 'Notification' in window
  };
};

