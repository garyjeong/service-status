import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Service } from '../services/api';
import { StatusUtils } from '../services/api';
import { StatusType } from '../types/status';

interface StatusHistoryEntry {
  timestamp: number;
  status: StatusType;
  serviceName: string;
}

interface AvailabilityStats {
  uptime: number; // 0-100
  downtime: number; // 0-100
  incidents: number;
  lastIncident?: number;
}

interface UseStatusHistoryOptions {
  maxEntries?: number; // 최대 저장 항목 수 (기본: 1000)
  retentionDays?: number; // 보관 기간 (기본: 30일)
}

export const useStatusHistory = (
  services: Service[],
  options: UseStatusHistoryOptions = {}
) => {
  const { maxEntries = 1000, retentionDays = 30 } = options;
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);

  // localStorage에서 히스토리 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem('service-status-history');
      if (saved) {
        const parsed = JSON.parse(saved) as StatusHistoryEntry[];
        // 오래된 항목 제거 (retentionDays 기준)
        const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
        const filtered = parsed.filter(entry => entry.timestamp >= cutoff);
        setHistory(filtered);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading status history:', error);
      }
    }
  }, [retentionDays]);

  // 히스토리 저장
  const saveHistory = useCallback((newHistory: StatusHistoryEntry[]) => {
    try {
      // 최대 항목 수 제한
      const limited = newHistory.slice(-maxEntries);
      localStorage.setItem('service-status-history', JSON.stringify(limited));
      setHistory(limited);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error saving status history:', error);
      }
    }
  }, [maxEntries]);

  // 현재 상태를 히스토리에 추가
  const recordStatus = useCallback((services: Service[]) => {
    const now = Date.now();
    const entries: StatusHistoryEntry[] = services.map(service => ({
      timestamp: now,
      status: StatusUtils.calculateServiceStatus(service.components),
      serviceName: service.service_name
    }));

    setHistory(prev => {
      const updated = [...prev, ...entries];
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  // 특정 서비스의 가용성 통계 계산
  const getAvailabilityStats = useCallback((
    serviceName: string,
    periodHours: number = 24
  ): AvailabilityStats => {
    const cutoff = Date.now() - periodHours * 60 * 60 * 1000;
    const serviceHistory = history.filter(
      entry => entry.serviceName === serviceName && entry.timestamp >= cutoff
    );

    if (serviceHistory.length === 0) {
      return { uptime: 100, downtime: 0, incidents: 0 };
    }

    // 시간 간격 계산
    const intervals: { start: number; end: number; status: StatusType }[] = [];
    for (let i = 0; i < serviceHistory.length - 1; i++) {
      intervals.push({
        start: serviceHistory[i].timestamp,
        end: serviceHistory[i + 1].timestamp,
        status: serviceHistory[i].status
      });
    }

    // 마지막 항목부터 현재까지
    if (serviceHistory.length > 0) {
      intervals.push({
        start: serviceHistory[serviceHistory.length - 1].timestamp,
        end: Date.now(),
        status: serviceHistory[serviceHistory.length - 1].status
      });
    }

    // 가동 시간 및 다운 타임 계산
    let operationalTime = 0;
    let downtime = 0;
    let incidents = 0;
    let lastIncident: number | undefined;

    intervals.forEach(interval => {
      const duration = interval.end - interval.start;
      if (interval.status === StatusType.OPERATIONAL) {
        operationalTime += duration;
      } else {
        downtime += duration;
        if (interval.status === StatusType.MAJOR_OUTAGE || interval.status === StatusType.PARTIAL_OUTAGE) {
          incidents++;
          if (!lastIncident || interval.start > lastIncident) {
            lastIncident = interval.start;
          }
        }
      }
    });

    const totalTime = operationalTime + downtime;
    const uptimePercent = totalTime > 0 ? (operationalTime / totalTime) * 100 : 100;
    const downtimePercent = totalTime > 0 ? (downtime / totalTime) * 100 : 0;

    return {
      uptime: Math.round(uptimePercent * 100) / 100,
      downtime: Math.round(downtimePercent * 100) / 100,
      incidents,
      lastIncident
    };
  }, [history]);

  // 모든 서비스의 가용성 통계
  const getAllAvailabilityStats = useCallback((
    periodHours: number = 24
  ): Record<string, AvailabilityStats> => {
    const serviceNames = Array.from(new Set(history.map(entry => entry.serviceName)));
    const stats: Record<string, AvailabilityStats> = {};

    serviceNames.forEach(serviceName => {
      stats[serviceName] = getAvailabilityStats(serviceName, periodHours);
    });

    return stats;
  }, [history, getAvailabilityStats]);

  // 기간별 통계 (24시간, 7일, 30일)
  const getPeriodStats = useCallback((
    serviceName: string
  ): {
    '24h': AvailabilityStats;
    '7d': AvailabilityStats;
    '30d': AvailabilityStats;
  } => {
    return {
      '24h': getAvailabilityStats(serviceName, 24),
      '7d': getAvailabilityStats(serviceName, 24 * 7),
      '30d': getAvailabilityStats(serviceName, 24 * 30)
    };
  }, [getAvailabilityStats]);

  // 히스토리 초기화
  const clearHistory = useCallback(() => {
    localStorage.removeItem('service-status-history');
    setHistory([]);
  }, []);

  return {
    history,
    recordStatus,
    getAvailabilityStats,
    getAllAvailabilityStats,
    getPeriodStats,
    clearHistory
  };
};

