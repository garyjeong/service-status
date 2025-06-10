import { useState, useEffect, useCallback, useRef } from 'react';
import {
  StatusResponse,
  UseStatusResult,
  ServiceStatus,
  StatusSummary,
  UseStatusSummaryResult,
  StatusType,
} from '../types/status';
import { generateStatusSummary } from '../utils/status';

// Mock 데이터 (개발용)
const MOCK_SERVICES: ServiceStatus[] = [
  {
    service_name: 'openai',
    display_name: 'OpenAI ChatGPT',
    overall_status: StatusType.OPERATIONAL,
    components: [
      {
        id: 'chatgpt-web',
        name: 'ChatGPT Web',
        status: StatusType.OPERATIONAL,
        description: 'ChatGPT 웹 인터페이스',
        updated_at: new Date().toISOString(),
      },
      {
        id: 'openai-api',
        name: 'OpenAI API',
        status: StatusType.OPERATIONAL,
        description: 'OpenAI API 서비스',
        updated_at: new Date().toISOString(),
      },
    ],
    description: '모든 시스템이 정상 운영되고 있습니다.',
    page_url: 'https://status.openai.com',
    updated_at: new Date().toISOString(),
    icon_url: 'https://cdn.openai.com/favicon-32x32.png',
  },
  {
    service_name: 'anthropic',
    display_name: 'Anthropic Claude',
    overall_status: StatusType.OPERATIONAL,
    components: [
      {
        id: 'claude-chat',
        name: 'Claude Chat',
        status: StatusType.OPERATIONAL,
        description: 'Claude 채팅 인터페이스',
        updated_at: new Date().toISOString(),
      },
      {
        id: 'anthropic-api',
        name: 'Anthropic API',
        status: StatusType.OPERATIONAL,
        description: 'Anthropic API 서비스',
        updated_at: new Date().toISOString(),
      },
    ],
    description: '모든 시스템이 정상 운영되고 있습니다.',
    page_url: 'https://status.anthropic.com',
    updated_at: new Date().toISOString(),
    icon_url: 'https://www.anthropic.com/favicon.ico',
  },
];

const REFRESH_INTERVAL = 30000; // 30초

/**
 * 상태 데이터를 관리하는 Hook
 */
export function useStatus(): UseStatusResult {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: 실제 API 호출로 교체
      // const services = await fetchAllServicesStatus();

      // 현재는 Mock 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션

      const services = MOCK_SERVICES;
      const response: StatusResponse = {
        services,
        refresh_interval: REFRESH_INTERVAL,
        last_updated: new Date().toISOString(),
      };

      setData(response);
    } catch (err) {
      console.error('상태 조회 실패:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    // 초기 로딩
    fetchStatus();

    // 자동 새로고침 설정
    intervalRef.current = setInterval(fetchStatus, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStatus]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

/**
 * 상태 요약을 제공하는 Hook
 */
export function useStatusSummary(services: ServiceStatus[] = []): UseStatusSummaryResult {
  const [summary, setSummary] = useState<StatusSummary>(() => generateStatusSummary(services));
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    // 상태 요약 계산
    const newSummary = generateStatusSummary(services);
    setSummary(newSummary);

    setLoading(false);
  }, [services]);

  return {
    summary,
    loading,
  };
}

/**
 * 테마 관리 Hook
 */
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'auto';
    }
    return 'auto';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(isDark ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    // 시스템 테마 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  useEffect(() => {
    // HTML 클래스 적용
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);

    // localStorage 저장
    localStorage.setItem('theme', theme);
  }, [theme, resolvedTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'auto';
      return 'light';
    });
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}
