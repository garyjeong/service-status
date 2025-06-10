import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  StatusType,
  ServiceStatus,
  ComponentStatus,
  OpenAIStatusAPI,
  AnthropicStatusAPI,
} from '../types/status';
import { mapStatusToType, calculateServiceStatus } from '../utils/status';

// API 클라이언트 설정
const createApiClient = (baseURL: string): AxiosInstance => {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

// 서비스별 API 클라이언트
const clients = {
  openai: createApiClient('/api/openai'),
  anthropic: createApiClient('/api/anthropic'),
  cursor: createApiClient('/api/cursor'),
  googleai: axios.create({
    baseURL: 'https://cloud.google.com',
    timeout: 10000,
  }),
};

/**
 * OpenAI 상태 조회
 */
export async function fetchOpenAIStatus(): Promise<ServiceStatus> {
  try {
    const response: AxiosResponse<OpenAIStatusAPI> =
      await clients.openai.get('/api/v2/status.json');
    const data = response.data;

    const components: ComponentStatus[] = data.components
      .filter(comp => comp.showcase && !comp.group)
      .map(comp => ({
        id: comp.id,
        name: comp.name,
        status: mapStatusToType(comp.status),
        description: comp.description,
        updated_at: comp.updated_at,
      }));

    const overall_status = calculateServiceStatus(components);

    return {
      service_name: 'openai',
      display_name: 'OpenAI ChatGPT',
      overall_status,
      components,
      description: data.status.description,
      page_url: data.page.url,
      updated_at: data.page.updated_at,
      icon_url: 'https://cdn.openai.com/favicon-32x32.png',
    };
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    throw new StatusError({
      service_name: 'openai',
      error_message: 'OpenAI 상태 정보를 가져올 수 없습니다.',
      error_code: axios.isAxiosError(error) ? error.code : 'UNKNOWN',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Anthropic 상태 조회
 */
export async function fetchAnthropicStatus(): Promise<ServiceStatus> {
  try {
    const response: AxiosResponse<AnthropicStatusAPI> =
      await clients.anthropic.get('/api/v2/status.json');
    const data = response.data;

    const components: ComponentStatus[] = data.components
      .filter(comp => comp.showcase && !comp.group)
      .map(comp => ({
        id: comp.id,
        name: comp.name,
        status: mapStatusToType(comp.status),
        description: comp.description,
        updated_at: comp.updated_at,
      }));

    const overall_status = calculateServiceStatus(components);

    return {
      service_name: 'anthropic',
      display_name: 'Anthropic Claude',
      overall_status,
      components,
      description: data.status.description,
      page_url: data.page.url,
      updated_at: data.page.updated_at,
      icon_url: 'https://www.anthropic.com/favicon.ico',
    };
  } catch (error) {
    console.error('Anthropic API 오류:', error);
    throw new StatusError({
      service_name: 'anthropic',
      error_message: 'Anthropic 상태 정보를 가져올 수 없습니다.',
      error_code: axios.isAxiosError(error) ? error.code : 'UNKNOWN',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Cursor 상태 조회
 */
export async function fetchCursorStatus(): Promise<ServiceStatus> {
  try {
    const response = await clients.cursor.get('/api/v2/status.json');
    const data = response.data;

    const components: ComponentStatus[] = data.components
      .filter((comp: any) => comp.showcase && !comp.group)
      .map((comp: any) => ({
        id: comp.id,
        name: comp.name,
        status: mapStatusToType(comp.status),
        description: comp.description,
        updated_at: comp.updated_at,
      }));

    const overall_status = calculateServiceStatus(components);

    return {
      service_name: 'cursor',
      display_name: 'Cursor Editor',
      overall_status,
      components,
      description: data.status.description,
      page_url: data.page.url,
      updated_at: data.page.updated_at,
      icon_url: 'https://cursor.sh/favicon.ico',
    };
  } catch (error) {
    console.error('Cursor API 오류:', error);
    throw new StatusError({
      service_name: 'cursor',
      error_message: 'Cursor 상태 정보를 가져올 수 없습니다.',
      error_code: axios.isAxiosError(error) ? error.code : 'UNKNOWN',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Google AI Studio 상태 조회
 */
export async function fetchGoogleAIStatus(): Promise<ServiceStatus> {
  try {
    // Google AI Studio는 공개 상태 페이지가 없으므로 간단한 Health Check 구현
    const response = await clients.googleai.get('/status', { timeout: 5000 });

    // 응답이 성공하면 정상으로 간주
    const components: ComponentStatus[] = [
      {
        id: 'gemini-api',
        name: 'Gemini API',
        status: StatusType.OPERATIONAL,
        description: 'Google Gemini API 서비스',
        updated_at: new Date().toISOString(),
      },
      {
        id: 'ai-studio',
        name: 'AI Studio',
        status: StatusType.OPERATIONAL,
        description: 'Google AI Studio 웹 인터페이스',
        updated_at: new Date().toISOString(),
      },
    ];

    return {
      service_name: 'googleai',
      display_name: 'Google AI Studio',
      overall_status: StatusType.OPERATIONAL,
      components,
      description: 'Google AI 서비스가 정상 운영 중입니다.',
      page_url: 'https://aistudio.google.com',
      updated_at: new Date().toISOString(),
      icon_url: 'https://www.google.com/favicon.ico',
    };
  } catch (error) {
    console.error('Google AI API 오류:', error);

    // 오류 발생 시 알 수 없는 상태로 처리
    const components: ComponentStatus[] = [
      {
        id: 'gemini-api',
        name: 'Gemini API',
        status: StatusType.UNKNOWN,
        description: '상태 확인 실패',
        updated_at: new Date().toISOString(),
      },
      {
        id: 'ai-studio',
        name: 'AI Studio',
        status: StatusType.UNKNOWN,
        description: '상태 확인 실패',
        updated_at: new Date().toISOString(),
      },
    ];

    return {
      service_name: 'googleai',
      display_name: 'Google AI Studio',
      overall_status: StatusType.UNKNOWN,
      components,
      description: '상태 확인에 실패했습니다.',
      page_url: 'https://aistudio.google.com',
      updated_at: new Date().toISOString(),
      icon_url: 'https://www.google.com/favicon.ico',
    };
  }
}

/**
 * 모든 서비스 상태를 병렬로 조회
 */
export async function fetchAllServicesStatus(): Promise<ServiceStatus[]> {
  const statusPromises = [
    fetchOpenAIStatus(),
    fetchAnthropicStatus(),
    fetchCursorStatus(),
    fetchGoogleAIStatus(),
  ];

  const results = await Promise.allSettled(statusPromises);

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`서비스 ${index} 상태 조회 실패:`, result.reason);

      // 기본 실패 상태 반환
      const serviceNames = ['openai', 'anthropic', 'cursor', 'googleai'];
      const displayNames = [
        'OpenAI ChatGPT',
        'Anthropic Claude',
        'Cursor Editor',
        'Google AI Studio',
      ];

      return {
        service_name: serviceNames[index],
        display_name: displayNames[index],
        overall_status: StatusType.UNKNOWN,
        components: [],
        description: '상태 조회에 실패했습니다.',
        page_url: '',
        updated_at: new Date().toISOString(),
      };
    }
  });
}

// StatusError 클래스 정의
class StatusError extends Error {
  service_name: string;
  error_message: string;
  error_code?: string;
  timestamp: string;

  constructor(errorData: {
    service_name: string;
    error_message: string;
    error_code?: string;
    timestamp: string;
  }) {
    super(errorData.error_message);
    this.name = 'StatusError';
    this.service_name = errorData.service_name;
    this.error_message = errorData.error_message;
    this.error_code = errorData.error_code;
    this.timestamp = errorData.timestamp;
  }
}
