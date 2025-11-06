import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'page-load' | 'api-response' | 'render' | 'custom';
}

interface PerformanceStats {
  pageLoadTime: number;
  apiResponseTime: number;
  renderTime: number;
  metrics: PerformanceMetric[];
}

interface UsePerformanceMonitorOptions {
  enabled?: boolean;
  maxMetrics?: number;
  onMetricRecorded?: (metric: PerformanceMetric) => void;
}

export const usePerformanceMonitor = (options: UsePerformanceMonitorOptions = {}) => {
  const { enabled = true, maxMetrics = 100, onMetricRecorded } = options;
  const metricsRef = useRef<PerformanceMetric[]>([]);
  const pageLoadStartRef = useRef<number>(0);
  const apiTimingsRef = useRef<Map<string, number>>(new Map());

  // 페이지 로딩 시간 측정
  useEffect(() => {
    if (!enabled) return;

    pageLoadStartRef.current = performance.now();

    const measurePageLoad = () => {
      if (document.readyState === 'complete') {
        const loadTime = performance.now() - pageLoadStartRef.current;
        recordMetric({
          name: 'page-load',
          value: loadTime,
          timestamp: Date.now(),
          type: 'page-load'
        });
      }
    };

    if (document.readyState === 'complete') {
      measurePageLoad();
    } else {
      window.addEventListener('load', measurePageLoad);
      return () => window.removeEventListener('load', measurePageLoad);
    }
  }, [enabled]);

  // 메트릭 기록
  const recordMetric = useCallback((metric: PerformanceMetric) => {
    if (!enabled) return;

    metricsRef.current.push(metric);
    
    // 최대 메트릭 수 제한
    if (metricsRef.current.length > maxMetrics) {
      metricsRef.current.shift();
    }

    onMetricRecorded?.(metric);

    // 개발 환경에서만 콘솔 출력
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${metric.name}: ${metric.value.toFixed(2)}ms`);
    }
  }, [enabled, maxMetrics, onMetricRecorded]);

  // API 응답 시간 측정 시작
  const startApiTiming = useCallback((apiName: string) => {
    if (!enabled) return;
    apiTimingsRef.current.set(apiName, performance.now());
  }, [enabled]);

  // API 응답 시간 측정 종료
  const endApiTiming = useCallback((apiName: string) => {
    if (!enabled) return;

    const startTime = apiTimingsRef.current.get(apiName);
    if (startTime) {
      const responseTime = performance.now() - startTime;
      recordMetric({
        name: `api-${apiName}`,
        value: responseTime,
        timestamp: Date.now(),
        type: 'api-response'
      });
      apiTimingsRef.current.delete(apiName);
    }
  }, [enabled, recordMetric]);

  // 렌더링 시간 측정
  const measureRender = useCallback((componentName: string, renderFn: () => void) => {
    if (!enabled) {
      renderFn();
      return;
    }

    const startTime = performance.now();
    renderFn();
    const renderTime = performance.now() - startTime;

    recordMetric({
      name: `render-${componentName}`,
      value: renderTime,
      timestamp: Date.now(),
      type: 'render'
    });
  }, [enabled, recordMetric]);

  // 커스텀 메트릭 기록
  const recordCustomMetric = useCallback((name: string, value: number) => {
    recordMetric({
      name,
      value,
      timestamp: Date.now(),
      type: 'custom'
    });
  }, [recordMetric]);

  // 통계 계산
  const getStats = useCallback((): PerformanceStats => {
    const metrics = metricsRef.current;
    const pageLoadMetrics = metrics.filter(m => m.type === 'page-load');
    const apiMetrics = metrics.filter(m => m.type === 'api-response');
    const renderMetrics = metrics.filter(m => m.type === 'render');

    const avg = (arr: PerformanceMetric[]) => {
      if (arr.length === 0) return 0;
      return arr.reduce((sum, m) => sum + m.value, 0) / arr.length;
    };

    return {
      pageLoadTime: pageLoadMetrics.length > 0 
        ? avg(pageLoadMetrics) 
        : 0,
      apiResponseTime: apiMetrics.length > 0 
        ? avg(apiMetrics) 
        : 0,
      renderTime: renderMetrics.length > 0 
        ? avg(renderMetrics) 
        : 0,
      metrics: [...metrics]
    };
  }, []);

  // 메트릭 초기화
  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
    apiTimingsRef.current.clear();
  }, []);

  return {
    recordMetric,
    startApiTiming,
    endApiTiming,
    measureRender,
    recordCustomMetric,
    getStats,
    clearMetrics
  };
};

