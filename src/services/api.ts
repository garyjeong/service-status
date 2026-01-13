import axios, { AxiosInstance } from 'axios';
import { WebScrapingService } from './scraping';
import { StatusType, ComponentStatus } from '../types/status';

export interface ServiceComponent {
  name: string;
  status: StatusType;
}

export interface Service {
  service_name: string;
  display_name: string;
  description: string;
  status: StatusType;
  page_url: string;
  icon: string;
  components: ServiceComponent[];
}

// 서비스 구성 인터페이스
interface ServiceConfig {
  service_name: string;
  display_name: string;
  description: string;
  page_url: string;
  icon: string;
  kind: 'statuspage' | 'website';
  api_url?: string;
  components?: string[];
  componentUrls?: { [componentName: string]: string };
}

// CORS 프록시 설정 (개발 환경용)
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// 서비스별 우선순위 및 타임아웃 설정
const SERVICE_PRIORITY: Record<string, { timeout: number; maxRetries: number }> = {
  openai: { timeout: 8000, maxRetries: 3 },
  anthropic: { timeout: 8000, maxRetries: 3 },
  cursor: { timeout: 8000, maxRetries: 3 },
  github: { timeout: 10000, maxRetries: 2 },
  googleai: { timeout: 10000, maxRetries: 2 },
  netlify: { timeout: 10000, maxRetries: 2 },
  aws: { timeout: 12000, maxRetries: 2 },
  default: { timeout: 10000, maxRetries: 2 },
};

// 지수 백오프 재시도 함수
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // 마지막 시도가 아니면 재시도
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt); // 지수 백오프
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // 모든 재시도 실패
      throw lastError;
    }
  }
  
  throw lastError;
}

// API 클라이언트 설정
const createApiClient = (timeout = 10000): AxiosInstance => {
  return axios.create({
    timeout,
    headers: {
      Accept: 'application/json',
    },
  });
};

const apiClient = createApiClient();

// 공통 유틸리티 함수들
export class StatusUtils {
  /**
   * 상태 문자열을 표준화
   */
  static normalizeStatus(status: string): StatusType {
    const normalizedStatus = status.toLowerCase();

    if (
      normalizedStatus.includes('operational') ||
      normalizedStatus.includes('none') ||
      normalizedStatus === 'good'
    ) {
      return StatusType.OPERATIONAL;
    }
    if (
      normalizedStatus.includes('degraded') ||
      normalizedStatus.includes('minor') ||
      normalizedStatus.includes('partial')
    ) {
      return StatusType.DEGRADED_PERFORMANCE;
    }
    if (
      normalizedStatus.includes('outage') ||
      normalizedStatus.includes('major') ||
      normalizedStatus.includes('critical')
    ) {
      return StatusType.MAJOR_OUTAGE;
    }
    if (normalizedStatus.includes('maintenance') || normalizedStatus.includes('scheduled')) {
      return StatusType.UNDER_MAINTENANCE;
    }

    return StatusType.OPERATIONAL; // 기본값
  }

  /**
   * 하위 컴포넌트들의 상태에 따라 상위 서비스 상태를 계산
   */
  static calculateServiceStatus(components: ServiceComponent[]): StatusType {
    if (components.some(c => c.status === StatusType.MAJOR_OUTAGE)) {
      const outageCount = components.filter(c => c.status === StatusType.MAJOR_OUTAGE).length;
      const totalCount = components.length;

      if (outageCount === totalCount) {
        return StatusType.MAJOR_OUTAGE;
      }
      return StatusType.DEGRADED_PERFORMANCE;
    }
    if (components.some(c => c.status === StatusType.DEGRADED_PERFORMANCE)) {
      return StatusType.DEGRADED_PERFORMANCE;
    }
    if (components.some(c => c.status === StatusType.UNDER_MAINTENANCE)) {
      return StatusType.UNDER_MAINTENANCE;
    }
    return StatusType.OPERATIONAL;
  }
}

// 단순 웹사이트 가용성 체크 유틸리티 (2xx/3xx → operational, 그 외/에러 → outage)
async function websiteComponentsFromUrls(
  urlEntries: Array<[string, string]>
): Promise<ServiceComponent[]> {
  const results = await Promise.allSettled(
    urlEntries.map(([, url]) => apiClient.get(`${CORS_PROXY}${url}`, { timeout: 8000 }))
  );

  return results.map((result, idx) => {
    const [name] = urlEntries[idx];
    if (result.status === 'fulfilled') {
      const code = result.value.status;
      const ok = code >= 200 && code < 400;
      return { name, status: ok ? 'operational' : 'outage' };
    }
    return { name, status: 'outage' };
  });
}

// 서비스 설정 중앙화
const SERVICES_CONFIG: Record<string, ServiceConfig> = {
  openai: {
    service_name: 'openai',
    display_name: 'OpenAI ChatGPT',
    description: 'ChatGPT 웹 인터페이스 및 OpenAI API',
    page_url: 'https://status.openai.com',
    icon: 'openai',
    kind: 'statuspage',
    api_url: 'https://status.openai.com/api/v2/status.json',
    components: ['ChatGPT Web', 'OpenAI API', 'DALL-E', 'Whisper API', 'GPT-4 API', 'GPT-3.5 API'],
  },
  anthropic: {
    service_name: 'anthropic',
    display_name: 'Anthropic Claude',
    description: 'Claude 채팅 인터페이스 및 Anthropic API',
    page_url: 'https://status.claude.com',
    icon: 'anthropic',
    kind: 'statuspage',
    api_url: 'https://status.claude.com/api/v2/status.json',
    components: [
      'claude.ai',
      'platform.claude.com',
      'Claude API',
      'Claude Code',
    ],
  },
  github: {
    service_name: 'github',
    display_name: 'GitHub',
    description: '코드 저장소 및 협업 플랫폼',
    page_url: 'https://www.githubstatus.com',
    icon: 'github',
    kind: 'statuspage',
    api_url: 'https://www.githubstatus.com/api/v2/status.json',
    components: [
      'Git Operations',
      'API Requests',
      'Issues & PRs',
      'Actions',
      'Pages',
      'Packages',
      'Codespaces',
      'Copilot',
    ],
  },
  netlify: {
    service_name: 'netlify',
    display_name: 'Netlify',
    description: '정적 사이트 호스팅 및 배포 플랫폼',
    page_url: 'https://www.netlifystatus.com',
    icon: 'netlify',
    kind: 'statuspage',
    api_url: 'https://www.netlifystatus.com/api/v2/status.json',
    components: ['CDN', 'Builds', 'Edge Functions', 'Forms', 'DNS', 'Identity', 'Analytics'],
  },
  groq: {
    service_name: 'groq',
    display_name: 'Groq / GroqCloud',
    description: 'Groq AI 모델 플랫폼 및 추론 서비스',
    page_url: 'https://groqstatus.com',
    icon: 'groq',
    kind: 'statuspage',
    api_url: 'https://groqstatus.com/api/v2/status.json',
    components: ['API', 'Console', 'Playground', 'Dashboard'],
  },
  deepseek: {
    service_name: 'deepseek',
    display_name: 'DeepSeek',
    description: 'DeepSeek AI 모델 및 플랫폼 서비스',
    page_url: 'https://status.deepseek.com',
    icon: 'deepseek',
    kind: 'statuspage',
    api_url: 'https://status.deepseek.com/api/v2/status.json',
    components: ['API', 'Chat', 'Coder', 'Reasoning'],
  },
};

// 공통 API 처리 클래스
class ServiceStatusFetcher {
  static async fetchServiceStatus(serviceName: string): Promise<Service> {
    const config = SERVICES_CONFIG[serviceName];
    if (!config) {
      throw new Error(`Unknown service: ${serviceName}`);
    }

    // 서비스별 설정 가져오기
    const serviceConfig = SERVICE_PRIORITY[serviceName] || SERVICE_PRIORITY.default;
    const serviceClient = createApiClient(serviceConfig.timeout);

    // statuspage 기반
    if (config.kind === 'statuspage') {
      try {
        // StatusPage API v2를 통해 실제 컴포넌트 상태 조회 (재시도 로직 포함)
        const response = await retryWithBackoff(
          () => serviceClient.get(`${CORS_PROXY}${config.api_url}`),
          serviceConfig.maxRetries
        );
        const data = response.data;
        const baseStatus = StatusUtils.normalizeStatus(data.status?.indicator || 'operational');

        // 컴포넌트별 실제 상태를 가져오기 위해 components API도 호출
        let componentsData;
        try {
          // api_url에서 /status.json을 /components.json으로 교체
          const componentsUrl = config.api_url?.replace('/status.json', '/components.json');
          if (componentsUrl) {
            const componentsResponse = await retryWithBackoff(
              () => serviceClient.get(`${CORS_PROXY}${componentsUrl}`),
              serviceConfig.maxRetries
            );
            componentsData = componentsResponse.data.components;
          }
        } catch (error) {
          // components API 호출 실패 시 status.json의 components 사용 또는 기본 상태 사용
          if (import.meta.env.DEV) {
            console.warn(`${config.service_name} components API 호출 실패, status.json의 components 사용:`, error);
          }
          componentsData = data.components || [];
        }

        // 실제 컴포넌트 데이터 매핑
        const components: ServiceComponent[] = [];

        if (componentsData && componentsData.length > 0) {
          // 그룹이 아닌 실제 컴포넌트만 필터링하고 상태 매핑
          const actualComponents = componentsData
            .filter((component: any) => !component.group && component.name)
            .map((component: any) => ({
              name: component.name,
              status: StatusUtils.normalizeStatus(component.status || data.status?.indicator || 'operational'),
            }));

          if (actualComponents.length > 0) {
            components.push(...actualComponents);
          }
        }

        // 컴포넌트가 없으면 기본 컴포넌트 목록 사용 (fallback)
        if (components.length === 0 && config.components) {
          components.push(
            ...config.components.map(componentName => ({
              name: componentName,
              status: baseStatus,
            }))
          );
        }

        return {
          service_name: config.service_name,
          display_name: config.display_name,
          description: config.description,
          status: StatusUtils.calculateServiceStatus(components),
          page_url: config.page_url,
          icon: config.icon,
          components,
        };
      } catch (error) {
        if (import.meta.env.DEV) {
        console.error(`${config.service_name} API 오류:`, error);
        }
        const components: ServiceComponent[] = (config.components || []).map(componentName => ({
          name: componentName,
          status: StatusType.OPERATIONAL,
        }));
        return {
          service_name: config.service_name,
          display_name: config.display_name,
          description: config.description,
          status: StatusUtils.calculateServiceStatus(components),
          page_url: config.page_url,
          icon: config.icon,
          components,
        };
      }
    }

    // website 기반
    if (config.kind === 'website') {
      const entries = Object.entries(config.componentUrls || {});
      const components = await websiteComponentsFromUrls(entries);
      return {
        service_name: config.service_name,
        display_name: config.display_name,
        description: config.description,
        status: StatusUtils.calculateServiceStatus(components),
        page_url: config.page_url,
        icon: config.icon,
        components,
      };
    }

    throw new Error(`Unsupported service kind: ${config.kind}`);
  }
}

/**
 * OpenAI 상태 조회
 */
export async function fetchOpenAIStatus(): Promise<Service> {
  return ServiceStatusFetcher.fetchServiceStatus('openai');
}

/**
 * Anthropic 상태 조회
 */
export async function fetchAnthropicStatus(): Promise<Service> {
  return ServiceStatusFetcher.fetchServiceStatus('anthropic');
}

/**
 * GitHub 상태 조회
 */
export async function fetchGitHubStatus(): Promise<Service> {
  return ServiceStatusFetcher.fetchServiceStatus('github');
}

/**
 * Netlify 상태 조회
 */
export async function fetchNetlifyStatus(): Promise<Service> {
  return ServiceStatusFetcher.fetchServiceStatus('netlify');
}

/**
 * Docker Hub 상태 조회 (Status.io API 사용)
 */
export async function fetchDockerHubStatus(): Promise<Service> {
  try {
    // Status.io API를 통해 Docker 상태 정보 가져오기
    const response = await apiClient.get(
      `${CORS_PROXY}https://api.status.io/1.0/status/533c6539221ae15e3f000031`
    );
    const data = response.data;

    // Status.io API 응답에서 컴포넌트 정보 추출
    const components: ServiceComponent[] = [];

    if (data.result && data.result.status) {
      data.result.status.forEach((container: any) => {
        if (container.containers) {
          container.containers.forEach((comp: any) => {
            components.push({
              name: comp.name,
              status: StatusUtils.normalizeStatus(
                comp.status === 'Operational' ? 'operational' :
                comp.status === 'Degraded Performance' ? 'degraded' :
                comp.status === 'Partial Service Disruption' ? 'partial_outage' :
                comp.status === 'Service Disruption' ? 'major_outage' :
                comp.status === 'Maintenance' ? 'maintenance' : 'operational'
              ),
            });
          });
        }
      });
    }

    // 컴포넌트가 없으면 기본 컴포넌트 사용
    if (components.length === 0) {
      const defaultComponents = [
        'Docker Hub Registry', 'Docker Authentication', 'Docker Hub Web Services',
        'Docker Desktop', 'Docker Billing', 'Docker Scout', 'Docker Build Cloud',
      ];
      defaultComponents.forEach(name => {
        components.push({ name, status: StatusType.OPERATIONAL });
      });
    }

    return {
      service_name: 'dockerhub',
      display_name: 'Docker Hub',
      description: '컨테이너 이미지 레지스트리 및 저장소',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://www.dockerstatus.com',
      icon: 'docker',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Docker Hub API 오류:', error);
    }

    // API 실패 시 기본 컴포넌트 반환
    const components: ServiceComponent[] = [
      { name: 'Docker Hub Registry', status: StatusType.OPERATIONAL },
      { name: 'Docker Authentication', status: StatusType.OPERATIONAL },
      { name: 'Docker Hub Web Services', status: StatusType.OPERATIONAL },
      { name: 'Docker Desktop', status: StatusType.OPERATIONAL },
      { name: 'Docker Scout', status: StatusType.OPERATIONAL },
      { name: 'Docker Build Cloud', status: StatusType.OPERATIONAL },
    ];

    return {
      service_name: 'dockerhub',
      display_name: 'Docker Hub',
      description: '컨테이너 이미지 레지스트리 및 저장소',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://www.dockerstatus.com',
      icon: 'docker',
      components,
    };
  }
}

/**
 * AWS 상태 조회 (StatusPage API v2 또는 스크래핑 기반)
 */
export async function fetchAWSStatus(): Promise<Service> {
  const serviceConfig = SERVICE_PRIORITY.aws || SERVICE_PRIORITY.default;
  const serviceClient = createApiClient(serviceConfig.timeout);
  
  try {
    // 먼저 StatusPage API v2를 시도 (재시도 로직 포함)
    try {
      const response = await retryWithBackoff(
        () => serviceClient.get(`${CORS_PROXY}https://status.aws.amazon.com/api/v2/status.json`),
        serviceConfig.maxRetries
      );
      const data = response.data;
      const baseStatus = StatusUtils.normalizeStatus(data.status?.indicator || 'operational');

      // 컴포넌트별 실제 상태를 가져오기 위해 components API도 호출
      let componentsData;
      try {
        const componentsResponse = await retryWithBackoff(
          () => serviceClient.get(`${CORS_PROXY}https://status.aws.amazon.com/api/v2/components.json`),
          serviceConfig.maxRetries
        );
        componentsData = componentsResponse.data.components;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('AWS components API 호출 실패, status.json의 components 사용:', error);
        }
        componentsData = data.components || [];
      }

      // 실제 컴포넌트 데이터 매핑
      const components: ServiceComponent[] = [];

      if (componentsData && componentsData.length > 0) {
        // 그룹이 아닌 실제 컴포넌트만 필터링하고 상태 매핑
        const actualComponents = componentsData
          .filter((component: any) => !component.group && component.name)
          .map((component: any) => ({
            name: component.name,
            status: StatusUtils.normalizeStatus(component.status || data.status?.indicator || 'operational'),
          }));

        if (actualComponents.length > 0) {
          components.push(...actualComponents);
        }
      }

      // 컴포넌트가 없으면 주요 서비스 목록 사용 (fallback)
      if (components.length === 0) {
        const defaultComponents = [
          'Amazon EC2',
          'Amazon S3',
          'Amazon RDS',
          'AWS Lambda',
          'Amazon CloudFront',
          'Amazon Route 53',
          'Amazon CloudWatch',
          'AWS Identity and Access Management',
          'Amazon ECS',
          'Amazon EKS',
          'Amazon VPC',
          'Amazon API Gateway',
          'Amazon DynamoDB',
          'Amazon ElastiCache',
          'Amazon Elasticsearch Service',
        ];

        components.push(
          ...defaultComponents.map(componentName => ({
            name: componentName,
            status: baseStatus,
          }))
        );
      }

      return {
        service_name: 'aws',
        display_name: 'AWS',
        description: '아마존 웹 서비스 클라우드 플랫폼',
        status: StatusUtils.calculateServiceStatus(components),
        page_url: 'https://status.aws.amazon.com',
        icon: 'aws',
        components,
      };
    } catch (apiError) {
      // StatusPage API 실패 시 웹 스크래핑 시도
      if (import.meta.env.DEV) {
        console.warn('AWS StatusPage API 실패, 웹 스크래핑 시도:', apiError);
      }
      
      // 웹 스크래핑을 통해 AWS 상태 정보 가져오기
      const scrapedStatus = await WebScrapingService.fetchAWSStatus();
      
      // ServiceStatus를 Service 인터페이스로 변환
      const components: ServiceComponent[] = scrapedStatus.components.map(comp => ({
        name: comp.name,
        status: comp.status,
      }));

      return {
        service_name: 'aws',
        display_name: 'AWS',
        description: '아마존 웹 서비스 클라우드 플랫폼',
        status: scrapedStatus.overall_status,
        page_url: 'https://status.aws.amazon.com',
        icon: 'aws',
        components,
      };
    }
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('AWS 상태 조회 오류:', error);
    }
    
    // 모든 방법 실패 시 기본 컴포넌트 반환
    const components: ServiceComponent[] = [
      { name: 'Amazon EC2', status: StatusType.OPERATIONAL },
      { name: 'Amazon S3', status: StatusType.OPERATIONAL },
      { name: 'Amazon RDS', status: StatusType.OPERATIONAL },
      { name: 'AWS Lambda', status: StatusType.OPERATIONAL },
      { name: 'Amazon CloudFront', status: StatusType.OPERATIONAL },
      { name: 'Amazon Route 53', status: StatusType.OPERATIONAL },
      { name: 'Amazon CloudWatch', status: StatusType.OPERATIONAL },
      { name: 'AWS Identity and Access Management', status: StatusType.OPERATIONAL },
      { name: 'Amazon ECS', status: StatusType.OPERATIONAL },
      { name: 'Amazon EKS', status: StatusType.OPERATIONAL },
    ];

    return {
      service_name: 'aws',
      display_name: 'AWS',
      description: '아마존 웹 서비스 클라우드 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.aws.amazon.com',
      icon: 'aws',
      components,
    };
  }
}

/**
 * Slack 상태 조회 (Slack Status API 사용)
 */
export async function fetchSlackStatus(): Promise<Service> {
  // Slack의 기본 서비스 컴포넌트 목록
  const slackComponents = [
    'Login/SSO', 'Connectivity', 'Messaging', 'Files', 'Notifications',
    'Huddles', 'Search', 'Apps/Integrations/APIs', 'Workspace/Org Administration',
    'Workflows', 'Canvases',
  ];

  try {
    // Slack Status API를 통해 전체 상태 정보 가져오기
    const response = await apiClient.get(
      `${CORS_PROXY}https://slack-status.com/api/v2.0.0/current`
    );
    const data = response.data;

    // 전체 상태 확인 (ok = operational, otherwise check active_incidents)
    const hasActiveIncidents = data.active_incidents && data.active_incidents.length > 0;
    const baseStatus = data.status === 'ok' && !hasActiveIncidents
      ? StatusType.OPERATIONAL
      : StatusType.DEGRADED_PERFORMANCE;

    // 활성 장애가 있으면 영향받는 서비스 파악
    const affectedServices = new Set<string>();
    if (hasActiveIncidents) {
      data.active_incidents.forEach((incident: any) => {
        if (incident.services) {
          incident.services.forEach((service: string) => affectedServices.add(service));
        }
      });
    }

    // 컴포넌트 상태 매핑
    const components: ServiceComponent[] = slackComponents.map(name => ({
      name,
      status: affectedServices.has(name) ? StatusType.DEGRADED_PERFORMANCE : baseStatus,
    }));

    return {
      service_name: 'slack',
      display_name: 'Slack',
      description: '팀 커뮤니케이션 및 협업 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://slack-status.com',
      icon: 'slack',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Slack API 오류:', error);
    }

    // API 실패 시 기본 컴포넌트 반환
    const components: ServiceComponent[] = slackComponents.map(name => ({
      name,
      status: StatusType.OPERATIONAL,
    }));

    return {
      service_name: 'slack',
      display_name: 'Slack',
      description: '팀 커뮤니케이션 및 협업 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://slack-status.com',
      icon: 'slack',
      components,
    };
  }
}

/**
 * Firebase 상태 조회 (incidents.json API 사용)
 */
export async function fetchFirebaseStatus(): Promise<Service> {
  // Firebase의 주요 서비스 목록
  const firebaseServices = [
    'Authentication', 'Realtime Database', 'Cloud Firestore', 'Cloud Storage',
    'Hosting', 'Cloud Functions', 'Cloud Messaging', 'Crashlytics',
    'Analytics', 'Remote Config', 'App Check', 'Performance Monitoring',
    'App Distribution', 'Test Lab', 'App Hosting', 'Firebase Studio',
    'Console', 'Extensions', 'Dynamic Links',
  ];

  try {
    // incidents.json API를 통해 현재 장애 정보 가져오기
    const response = await apiClient.get(
      `${CORS_PROXY}https://status.firebase.google.com/incidents.json`
    );
    const incidents = response.data || [];

    // 현재 진행 중인 장애 (end가 없는 장애)
    const activeIncidents = incidents.filter((incident: any) => !incident.end);

    // 영향받는 서비스 목록 추출
    const affectedServices = new Map<string, StatusType>();
    activeIncidents.forEach((incident: any) => {
      const serviceName = incident.service_name || '';
      const impact = incident.status_impact || '';

      // 상태 결정
      let status = StatusType.DEGRADED_PERFORMANCE;
      if (impact === 'SERVICE_OUTAGE' || impact === 'SERVICE_DISRUPTION') {
        status = StatusType.MAJOR_OUTAGE;
      } else if (impact === 'SERVICE_INFORMATION') {
        status = StatusType.DEGRADED_PERFORMANCE;
      }

      // 서비스 이름 매핑 (Firebase 서비스 이름 정규화)
      const normalizedName = firebaseServices.find(s =>
        serviceName.toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes(serviceName.toLowerCase())
      );

      if (normalizedName) {
        // 더 심각한 상태로 업데이트
        const existing = affectedServices.get(normalizedName);
        if (!existing || status === StatusType.MAJOR_OUTAGE) {
          affectedServices.set(normalizedName, status);
        }
      }
    });

    // 컴포넌트 상태 매핑
    const components: ServiceComponent[] = firebaseServices.map(name => ({
      name,
      status: affectedServices.get(name) || StatusType.OPERATIONAL,
    }));

    return {
      service_name: 'firebase',
      display_name: 'Firebase',
      description: 'Google 백엔드 서비스 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.firebase.google.com',
      icon: 'firebase',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Firebase API 오류:', error);
    }

    // API 실패 시 기본 컴포넌트 반환
    const components: ServiceComponent[] = firebaseServices.map(name => ({
      name,
      status: StatusType.OPERATIONAL,
    }));

    return {
      service_name: 'firebase',
      display_name: 'Firebase',
      description: 'Google 백엔드 서비스 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.firebase.google.com',
      icon: 'firebase',
      components,
    };
  }
}

/**
 * Cursor 상태 조회 (StatusPage API v2 사용)
 */
export async function fetchCursorStatus(): Promise<Service> {
  const serviceConfig = SERVICE_PRIORITY.cursor || SERVICE_PRIORITY.default;
  const serviceClient = createApiClient(serviceConfig.timeout);
  
  try {
    // StatusPage API v2를 통해 실제 컴포넌트 상태 조회 (재시도 로직 포함)
    const response = await retryWithBackoff(
      () => serviceClient.get(`${CORS_PROXY}https://status.cursor.com/api/v2/status.json`),
      serviceConfig.maxRetries
    );
    const data = response.data;

    // 컴포넌트별 실제 상태를 가져오기 위해 components API도 호출
    let componentsData;
    try {
      const componentsResponse = await retryWithBackoff(
        () => serviceClient.get(`${CORS_PROXY}https://status.cursor.com/api/v2/components.json`),
        serviceConfig.maxRetries
      );
      componentsData = componentsResponse.data.components;
    } catch (error) {
      if (import.meta.env.DEV) {
      console.warn('Cursor components API 호출 실패, status.json의 components 사용:', error);
      }
      // status.json에서 컴포넌트 정보가 있으면 사용
      componentsData = data.components || [];
    }

    // 실제 컴포넌트 데이터 매핑
    const components: ServiceComponent[] = [];

    if (componentsData && componentsData.length > 0) {
      // 그룹이 아닌 실제 컴포넌트만 필터링하고 상태 매핑
      components.push(
        ...componentsData
          .filter((component: any) => !component.group && component.name)
          .map((component: any) => ({
            name: component.name,
            status: StatusUtils.normalizeStatus(component.status || data.status?.indicator || 'operational'),
          }))
      );
    }

    // 컴포넌트가 없으면 기본 컴포넌트 목록 사용
    if (components.length === 0) {
      const baseStatus = StatusUtils.normalizeStatus(data.status?.indicator || 'operational');
      components.push(
        { name: 'Cursor App', status: baseStatus },
        { name: 'Chat - Agent & Custom Modes', status: baseStatus },
        { name: 'Tab', status: baseStatus },
        { name: 'Codebase Indexing', status: baseStatus },
        { name: 'Extension Marketplace', status: baseStatus },
        { name: 'Background Agent', status: baseStatus },
        { name: 'Infrastructure', status: baseStatus },
        { name: 'Slack Integration', status: baseStatus },
        { name: 'GitHub Integrations', status: baseStatus },
        { name: 'PR Indexing', status: baseStatus },
        { name: 'BugBot', status: baseStatus },
        { name: 'Website', status: baseStatus },
        { name: 'User Dashboard (cursor.com)', status: baseStatus },
        { name: 'Cursor Forum (forum.cursor.com)', status: baseStatus },
      );
    }

    return {
      service_name: 'cursor',
      display_name: 'Cursor Editor',
      description: 'AI 기반 코드 에디터 및 개발 도구',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.cursor.com',
      icon: 'cursor',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('Cursor API 오류:', error);
    }
    // 폴백: 기본 컴포넌트 목록 (실제 상태 페이지의 컴포넌트 목록 기반)
    const components: ServiceComponent[] = [
      { name: 'Cursor App', status: 'operational' },
      { name: 'Chat - Agent & Custom Modes', status: 'operational' },
      { name: 'Tab', status: 'operational' },
      { name: 'Codebase Indexing', status: 'operational' },
      { name: 'Extension Marketplace', status: 'operational' },
      { name: 'Background Agent', status: 'operational' },
      { name: 'Infrastructure', status: 'operational' },
      { name: 'Slack Integration', status: 'operational' },
      { name: 'GitHub Integrations', status: 'operational' },
      { name: 'PR Indexing', status: 'operational' },
      { name: 'BugBot', status: 'operational' },
      { name: 'Website', status: 'operational' },
      { name: 'User Dashboard (cursor.com)', status: 'operational' },
      { name: 'Cursor Forum (forum.cursor.com)', status: 'operational' },
    ];

    return {
      service_name: 'cursor',
      display_name: 'Cursor Editor',
      description: 'AI 기반 코드 에디터 및 개발 도구',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.cursor.com',
      icon: 'cursor',
      components,
    };
  }
}

/**
 * Google AI Studio 상태 조회 (Google Cloud incidents API 사용)
 */
export async function fetchGoogleAIStatus(): Promise<Service> {
  // Gemini/Vertex AI 관련 서비스 목록
  const geminiServices = [
    'Gemini API', 'AI Studio', 'Vertex AI', 'Gemini Pro',
    'Gemini Flash', 'Model Garden', 'Gemini Vision',
  ];

  try {
    // Google Cloud incidents API를 통해 장애 정보 가져오기
    const response = await apiClient.get(
      `${CORS_PROXY}https://status.cloud.google.com/incidents.json`
    );
    const incidents = response.data || [];

    // 현재 진행 중인 Gemini/Vertex AI 관련 장애 필터링
    const activeIncidents = incidents.filter((incident: any) => {
      if (incident.end) return false; // 종료된 장애 제외

      const affectedProducts = (incident.affected_products || []).map((p: any) =>
        (p.title || '').toLowerCase()
      );
      const description = (incident.external_desc || '').toLowerCase();

      // Gemini, Vertex AI 관련 장애만 필터링
      return affectedProducts.some((p: string) =>
        p.includes('vertex') || p.includes('gemini') || p.includes('ai platform')
      ) || description.includes('gemini') || description.includes('vertex');
    });

    // 영향받는 서비스 추출
    const affectedServices = new Map<string, StatusType>();
    activeIncidents.forEach((incident: any) => {
      const severity = (incident.severity || '').toLowerCase();
      const status = severity === 'high' ? StatusType.MAJOR_OUTAGE :
                     severity === 'medium' ? StatusType.PARTIAL_OUTAGE :
                     StatusType.DEGRADED_PERFORMANCE;

      // 관련 서비스 상태 업데이트
      geminiServices.forEach(service => {
        const desc = (incident.external_desc || '').toLowerCase();
        const serviceLower = service.toLowerCase();
        if (desc.includes(serviceLower) || desc.includes('gemini') || desc.includes('vertex')) {
          const existing = affectedServices.get(service);
          if (!existing || status === StatusType.MAJOR_OUTAGE) {
            affectedServices.set(service, status);
          }
        }
      });
    });

    // 컴포넌트 상태 매핑
    const components: ServiceComponent[] = geminiServices.map(name => ({
      name,
      status: affectedServices.get(name) || StatusType.OPERATIONAL,
    }));

    return {
      service_name: 'googleai',
      display_name: 'Google AI Studio',
      description: 'Google Gemini API 및 AI Studio 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.cloud.google.com',
      icon: 'googleai',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Google AI API 오류:', error);
    }
    const components: ServiceComponent[] = geminiServices.map(name => ({
      name,
      status: StatusType.OPERATIONAL,
    }));

    return {
      service_name: 'googleai',
      display_name: 'Google AI Studio',
      description: 'Google Gemini API 및 AI Studio 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.cloud.google.com',
      icon: 'googleai',
      components,
    };
  }
}

/**
 * Perplexity 상태 조회
 */
export async function fetchPerplexityStatus(): Promise<Service> {
  try {
    // components API를 통해 실제 컴포넌트 상태 조회
    const componentsResponse = await apiClient.get(
      `${CORS_PROXY}https://status.perplexity.com/api/v2/components.json`
    );
    const componentsData = componentsResponse.data.components || [];

    // 실제 컴포넌트 데이터 매핑
    const components: ServiceComponent[] = componentsData
      .filter((component: any) => !component.group && component.name)
      .map((component: any) => ({
        name: component.name,
        status: StatusUtils.normalizeStatus(component.status || 'operational'),
      }));

    // 컴포넌트가 없으면 기본 컴포넌트 사용
    if (components.length === 0) {
      components.push(
        { name: 'Website', status: StatusType.OPERATIONAL },
        { name: 'API', status: StatusType.OPERATIONAL }
      );
    }

    return {
      service_name: 'perplexity',
      display_name: 'Perplexity AI',
      description: 'AI 검색 엔진 및 대화형 AI 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.perplexity.com',
      icon: 'perplexity',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('Perplexity API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'Website', status: 'operational' },
      { name: 'API', status: 'operational' },
    ];

    return {
      service_name: 'perplexity',
      display_name: 'Perplexity AI',
      description: 'AI 검색 엔진 및 대화형 AI 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.perplexity.com',
      icon: 'perplexity',
      components,
    };
  }
}

/**
 * v0 상태 조회 (Vercel components API 사용)
 */
export async function fetchV0Status(): Promise<Service> {
  try {
    // Vercel components API를 통해 실제 컴포넌트 상태 조회
    const componentsResponse = await apiClient.get(
      `${CORS_PROXY}https://www.vercel-status.com/api/v2/components.json`
    );
    const componentsData = componentsResponse.data.components || [];

    // v0 관련 컴포넌트 필터링 (v0 Platform, AI 관련)
    const v0RelatedNames = ['v0', 'ai', 'generation', 'serverless', 'edge'];
    const v0Components = componentsData
      .filter((component: any) => {
        if (component.group) return false;
        const nameLower = (component.name || '').toLowerCase();
        return v0RelatedNames.some(term => nameLower.includes(term)) ||
               nameLower.includes('api') || nameLower.includes('dashboard');
      })
      .slice(0, 8)
      .map((component: any) => ({
        name: component.name,
        status: StatusUtils.normalizeStatus(component.status || 'operational'),
      }));

    // 컴포넌트가 없으면 기본 컴포넌트 사용
    const components: ServiceComponent[] = v0Components.length > 0
      ? v0Components
      : [
          { name: 'v0 Platform', status: StatusType.OPERATIONAL },
          { name: 'AI Generation', status: StatusType.OPERATIONAL },
          { name: 'Code Export', status: StatusType.OPERATIONAL },
        ];

    return {
      service_name: 'v0',
      display_name: 'v0 by Vercel',
      description: 'AI 기반 UI 생성 및 프로토타이핑 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://www.vercel-status.com',
      icon: 'v0',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('v0 API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'v0 Platform', status: StatusType.OPERATIONAL },
      { name: 'AI Generation', status: StatusType.OPERATIONAL },
      { name: 'Code Export', status: StatusType.OPERATIONAL },
    ];

    return {
      service_name: 'v0',
      display_name: 'v0 by Vercel',
      description: 'AI 기반 UI 생성 및 프로토타이핑 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://www.vercel-status.com',
      icon: 'v0',
      components,
    };
  }
}

/**
 * Replit 상태 조회 (instatus.com API 사용)
 */
export async function fetchReplitStatus(): Promise<Service> {
  // Replit의 서비스 컴포넌트 목록
  const replitComponents = [
    'Website', 'App', 'Repls', 'AI', 'Hosting',
    'Auth', 'Deployments', 'Database', 'Package Manager',
  ];

  try {
    // instatus.com components API를 통해 상태 조회
    const componentsResponse = await apiClient.get(
      `${CORS_PROXY}https://replit.instatus.com/v2/components.json`
    );
    const componentsData = componentsResponse.data.components || [];

    // API에서 가져온 컴포넌트 상태 매핑
    const apiComponents = new Map<string, StatusType>();
    componentsData.forEach((comp: any) => {
      const status = comp.status === 'OPERATIONAL' ? StatusType.OPERATIONAL :
                     comp.status === 'DEGRADEDPERFORMANCE' ? StatusType.DEGRADED_PERFORMANCE :
                     comp.status === 'PARTIALOUTAGE' ? StatusType.PARTIAL_OUTAGE :
                     comp.status === 'MAJOROUTAGE' ? StatusType.MAJOR_OUTAGE :
                     comp.status === 'UNDERMAINTENANCE' ? StatusType.UNDER_MAINTENANCE :
                     StatusType.OPERATIONAL;
      apiComponents.set(comp.name, status);
    });

    // 전체 상태도 확인
    let baseStatus = StatusType.OPERATIONAL;
    try {
      const summaryResponse = await apiClient.get(
        `${CORS_PROXY}https://replit.instatus.com/summary.json`
      );
      if (summaryResponse.data.page?.status !== 'UP') {
        baseStatus = StatusType.DEGRADED_PERFORMANCE;
      }
    } catch {
      // summary 실패 시 무시
    }

    // 컴포넌트 상태 결정
    const components: ServiceComponent[] = replitComponents.map(name => ({
      name,
      status: apiComponents.get(name) || baseStatus,
    }));

    return {
      service_name: 'replit',
      display_name: 'Replit',
      description: '온라인 코딩 환경 및 협업 개발 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://replit.instatus.com',
      icon: 'replit',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Replit API 오류:', error);
    }
    const components: ServiceComponent[] = replitComponents.map(name => ({
      name,
      status: StatusType.OPERATIONAL,
    }));

    return {
      service_name: 'replit',
      display_name: 'Replit',
      description: '온라인 코딩 환경 및 협업 개발 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://replit.instatus.com',
      icon: 'replit',
      components,
    };
  }
}

/**
 * xAI 상태 조회 (RSS 피드 기반)
 */
export async function fetchXAIStatus(): Promise<Service> {
  try {
    // RSS 피드를 통한 상태 정보 조회 시도
    const response = await apiClient.get(`${CORS_PROXY}https://status.x.ai/feed.xml`);

    // RSS에서 최신 상태 정보 파싱 (간단한 구현)
    const isOperational = !response.data.includes('outage') && !response.data.includes('degraded');
    const baseStatus = isOperational ? 'operational' : 'degraded';

    // xAI의 복잡한 10개 컴포넌트 구조 (HTML에서 확인된 구조)
    const components: ServiceComponent[] = [
      { name: 'Grok (iOS)', status: baseStatus },
      { name: 'Grok (Android)', status: baseStatus },
      { name: 'Grok (Web)', status: baseStatus },
      { name: 'Single Sign-On', status: baseStatus },
      { name: 'API (US East)', status: baseStatus },
      { name: 'API (US West)', status: baseStatus },
      { name: 'API Console', status: baseStatus },
      { name: 'Docs', status: baseStatus },
      { name: 'xAI Website', status: baseStatus },
      { name: 'Grok in X', status: baseStatus },
    ];

    return {
      service_name: 'xai',
      display_name: 'xAI',
      description: 'Grok AI 모델 및 플랫폼 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.x.ai',
      icon: 'grok',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('xAI API 오류:', error);
    }
    // 기본 상태로 폴백
    const components: ServiceComponent[] = [
      { name: 'Grok (iOS)', status: 'operational' },
      { name: 'Grok (Android)', status: 'operational' },
      { name: 'Grok (Web)', status: 'operational' },
      { name: 'Single Sign-On', status: 'operational' },
      { name: 'API (US East)', status: 'operational' },
      { name: 'API (US West)', status: 'operational' },
      { name: 'API Console', status: 'operational' },
      { name: 'Docs', status: 'operational' },
      { name: 'xAI Website', status: 'operational' },
      { name: 'Grok in X', status: 'operational' },
    ];

    return {
      service_name: 'xai',
      display_name: 'xAI',
      description: 'Grok AI 모델 및 플랫폼 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.x.ai',
      icon: 'grok',
      components,
    };
  }
}

/**
 * Supabase 상태 조회
 */
export async function fetchSupabaseStatus(): Promise<Service> {
  const serviceConfig = SERVICE_PRIORITY.default;
  const serviceClient = createApiClient(serviceConfig.timeout);
  
  try {
    const response = await retryWithBackoff(
      () => serviceClient.get(`${CORS_PROXY}https://status.supabase.com/api/v2/status.json`),
      serviceConfig.maxRetries
    );
    const data = response.data;

    // Supabase 컴포넌트들의 실제 상태를 가져오기 위해 components API도 호출
    let componentsData;
    try {
      const componentsResponse = await retryWithBackoff(
        () => serviceClient.get(`${CORS_PROXY}https://status.supabase.com/api/v2/components.json`),
        serviceConfig.maxRetries
      );
      componentsData = componentsResponse.data.components;
    } catch (error) {
      if (import.meta.env.DEV) {
      console.warn('Supabase components API 호출 실패, 기본 상태 사용:', error);
      }
      componentsData = [];
    }

    // 실제 컴포넌트 데이터가 있으면 사용하고, 없으면 기본 컴포넌트 목록 사용
    const components: ServiceComponent[] = [];

    if (componentsData && componentsData.length > 0) {
      // API에서 가져온 실제 컴포넌트 상태 사용
      const componentNames = [
        'Analytics',
        'API Gateway',
        'Auth',
        'Connection Pooler',
        'Dashboard',
        'Database',
        'Edge Functions',
        'Management API',
        'Realtime',
        'Storage',
      ];

      componentNames.forEach(name => {
        const component = componentsData.find(
          (c: any) => c.name && c.name.toLowerCase().includes(name.toLowerCase())
        );
        if (component) {
          components.push({
            name,
            status: StatusUtils.normalizeStatus(component.status || 'operational'),
          });
        } else {
          // 컴포넌트를 찾지 못한 경우 전체 상태 사용
          components.push({
            name,
            status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
          });
        }
      });
    } else {
      // 기본 컴포넌트 목록 (API 호출 실패 시)
      const defaultComponents = [
        'Analytics',
        'API Gateway',
        'Auth',
        'Connection Pooler',
        'Dashboard',
        'Database',
        'Edge Functions',
        'Management API',
        'Realtime',
        'Storage',
      ];

      defaultComponents.forEach(name => {
        components.push({
          name,
          status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
        });
      });
    }

    return {
      service_name: 'supabase',
      display_name: 'Supabase',
      description: '오픈소스 Firebase 대안 백엔드 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.supabase.com',
      icon: 'supabase',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('Supabase API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'Analytics', status: 'operational' },
      { name: 'API Gateway', status: 'operational' },
      { name: 'Auth', status: 'operational' },
      { name: 'Connection Pooler', status: 'operational' },
      { name: 'Dashboard', status: 'operational' },
      { name: 'Database', status: 'operational' },
      { name: 'Edge Functions', status: 'operational' },
      { name: 'Management API', status: 'operational' },
      { name: 'Realtime', status: 'operational' },
      { name: 'Storage', status: 'operational' },
    ];

    return {
      service_name: 'supabase',
      display_name: 'Supabase',
      description: '오픈소스 Firebase 대안 백엔드 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.supabase.com',
      icon: 'supabase',
      components,
    };
  }
}

/**
 * Heroku 상태 조회
 */
export async function fetchHerokuStatus(): Promise<Service> {
  try {
    const response = await apiClient.get(
      `${CORS_PROXY}https://status.heroku.com/api/v4/current-status`
    );
    const data = response.data;

    // Heroku는 특별한 API 구조를 사용 (status 배열)
    const components: ServiceComponent[] = (data.status || []).map((system: any) => ({
      name: system.system,
      status: StatusUtils.normalizeStatus(
        system.status === 'green'
          ? 'operational'
          : system.status === 'yellow'
            ? 'degraded'
            : system.status === 'red'
              ? 'outage'
              : 'operational'
      ),
    }));

    return {
      service_name: 'heroku',
      display_name: 'Heroku',
      description: '클라우드 애플리케이션 플랫폼 (PaaS)',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.heroku.com',
      icon: 'heroku',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('Heroku API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'Apps', status: 'operational' },
      { name: 'Data', status: 'operational' },
      { name: 'Tools', status: 'operational' },
    ];

    return {
      service_name: 'heroku',
      display_name: 'Heroku',
      description: '클라우드 애플리케이션 플랫폼 (PaaS)',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.heroku.com',
      icon: 'heroku',
      components,
    };
  }
}

/**
 * Atlassian 상태 조회
 */
export async function fetchAtlassianStatus(): Promise<Service> {
  try {
    // 컴포넌트 정보를 별도 엔드포인트에서 가져옴
    const response = await apiClient.get(
      `${CORS_PROXY}https://developer.status.atlassian.com/api/v2/components.json`
    );
    const data = response.data;

    const components: ServiceComponent[] = (data.components || [])
      .filter((component: any) => !component.group_id && component.name !== 'Operational')
      .map((component: any) => ({
        name: component.name,
        status: StatusUtils.normalizeStatus(component.status),
      }));

    return {
      service_name: 'atlassian',
      display_name: 'Atlassian',
      description: 'Jira, Confluence, Bitbucket 등 개발 협업 도구',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://developer.status.atlassian.com',
      icon: 'atlassian',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('Atlassian API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'APIs', status: 'operational' },
      { name: 'Webhooks', status: 'operational' },
      { name: 'App Marketplace', status: 'operational' },
    ];

    return {
      service_name: 'atlassian',
      display_name: 'Atlassian',
      description: 'Jira, Confluence, Bitbucket 등 개발 협업 도구',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://developer.status.atlassian.com',
      icon: 'atlassian',
      components,
    };
  }
}

/**
 * CircleCI 상태 조회
 */
export async function fetchCircleCIStatus(): Promise<Service> {
  try {
    // 컴포넌트 정보를 별도 엔드포인트에서 가져옴
    const response = await apiClient.get(
      `${CORS_PROXY}https://status.circleci.com/api/v2/components.json`
    );
    const data = response.data;

    const components: ServiceComponent[] = (data.components || [])
      .filter((component: any) => !component.group_id && component.name !== 'Operational')
      .map((component: any) => ({
        name: component.name,
        status: StatusUtils.normalizeStatus(component.status),
      }));

    return {
      service_name: 'circleci',
      display_name: 'CircleCI',
      description: '지속적 통합 및 배포 (CI/CD) 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.circleci.com',
      icon: 'circleci',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('CircleCI API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'AWS', status: 'operational' },
      { name: 'Docker Jobs', status: 'operational' },
      { name: 'Frontend', status: 'operational' },
      { name: 'API', status: 'operational' },
    ];

    return {
      service_name: 'circleci',
      display_name: 'CircleCI',
      description: '지속적 통합 및 배포 (CI/CD) 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.circleci.com',
      icon: 'circleci',
      components,
    };
  }
}

/**
 * Auth0 상태 조회
 */
export async function fetchAuth0Status(): Promise<Service> {
  try {
    // 컴포넌트 정보를 별도 엔드포인트에서 가져옴
    const response = await apiClient.get(
      `${CORS_PROXY}https://auth0.statuspage.io/api/v2/components.json`
    );
    const data = response.data;

    const components: ServiceComponent[] = (data.components || [])
      .filter((component: any) => !component.group_id && component.name !== 'Operational')
      .map((component: any) => ({
        name: component.name,
        status: StatusUtils.normalizeStatus(component.status),
      }));

    return {
      service_name: 'auth0',
      display_name: 'Auth0',
      description: '인증 및 권한 관리 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://auth0.statuspage.io',
      icon: 'auth0',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('Auth0 API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'User Authentication', status: 'operational' },
      { name: 'Management API', status: 'operational' },
      { name: 'Dashboard', status: 'operational' },
      { name: 'Tenant Logs', status: 'operational' },
    ];

    return {
      service_name: 'auth0',
      display_name: 'Auth0',
      description: '인증 및 권한 관리 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://auth0.statuspage.io',
      icon: 'auth0',
      components,
    };
  }
}

/**
 * SendGrid 상태 조회
 */
export async function fetchSendGridStatus(): Promise<Service> {
  try {
    // 컴포넌트 정보를 별도 엔드포인트에서 가져옴
    const response = await apiClient.get(
      `${CORS_PROXY}https://status.sendgrid.com/api/v2/components.json`
    );
    const data = response.data;

    const components: ServiceComponent[] = (data.components || [])
      .filter((component: any) => !component.group_id && component.name !== 'Operational')
      .map((component: any) => ({
        name: component.name,
        status: StatusUtils.normalizeStatus(component.status),
      }));

    return {
      service_name: 'sendgrid',
      display_name: 'SendGrid',
      description: '이메일 전송 및 마케팅 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.sendgrid.com',
      icon: 'sendgrid',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('SendGrid API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'Web API', status: 'operational' },
      { name: 'SMTP', status: 'operational' },
      { name: 'Marketing Campaigns', status: 'operational' },
      { name: 'Event Webhook', status: 'operational' },
    ];

    return {
      service_name: 'sendgrid',
      display_name: 'SendGrid',
      description: '이메일 전송 및 마케팅 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.sendgrid.com',
      icon: 'sendgrid',
      components,
    };
  }
}

/**
 * Cloudflare 상태 조회
 */
export async function fetchCloudflareStatus(): Promise<Service> {
  try {
    // 컴포넌트 정보를 별도 엔드포인트에서 가져옴
    const response = await apiClient.get(
      `${CORS_PROXY}https://www.cloudflarestatus.com/api/v2/components.json`
    );
    const data = response.data;

    const components: ServiceComponent[] = (data.components || [])
      .filter((component: any) => !component.group_id && component.name !== 'Operational')
      .map((component: any) => ({
        name: component.name,
        status: StatusUtils.normalizeStatus(component.status),
      }));

    return {
      service_name: 'cloudflare',
      display_name: 'Cloudflare',
      description: 'CDN, DNS, 보안 및 성능 최적화 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://www.cloudflarestatus.com',
      icon: 'cloudflare',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('Cloudflare API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'CDN', status: 'operational' },
      { name: 'DNS', status: 'operational' },
      { name: 'SSL/TLS', status: 'operational' },
      { name: 'Workers', status: 'operational' },
    ];

    return {
      service_name: 'cloudflare',
      display_name: 'Cloudflare',
      description: 'CDN, DNS, 보안 및 성능 최적화 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://www.cloudflarestatus.com',
      icon: 'cloudflare',
      components,
    };
  }
}

/**
 * Datadog 상태 조회
 */
export async function fetchDatadogStatus(): Promise<Service> {
  try {
    // 컴포넌트 정보를 별도 엔드포인트에서 가져옴
    const response = await apiClient.get(
      `${CORS_PROXY}https://status.datadoghq.com/api/v2/components.json`
    );
    const data = response.data;

    const components: ServiceComponent[] = (data.components || [])
      .filter((component: any) => !component.group_id && component.name !== 'Operational')
      .map((component: any) => ({
        name: component.name,
        status: StatusUtils.normalizeStatus(component.status),
      }));

    return {
      service_name: 'datadog',
      display_name: 'Datadog',
      description: '모니터링, 로깅, APM 및 보안 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.datadoghq.com',
      icon: 'datadog',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('Datadog API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'Infrastructure Monitoring', status: 'operational' },
      { name: 'APM', status: 'operational' },
      { name: 'Logs', status: 'operational' },
      { name: 'Synthetics', status: 'operational' },
    ];

    return {
      service_name: 'datadog',
      display_name: 'Datadog',
      description: '모니터링, 로깅, APM 및 보안 플랫폼',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.datadoghq.com',
      icon: 'datadog',
      components,
    };
  }
}

/**
 * Zeta Global 상태 조회
 */
export async function fetchZetaGlobalStatus(): Promise<Service> {
  try {
    const response = await apiClient.get(
      `${CORS_PROXY}https://status.zetaglobal.net/api/v2/status.json`
    );
    const data = response.data;

    const components: ServiceComponent[] = [
      {
        name: 'Web Application',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'Platform',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'Platform Access',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'Data Import',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'Audience Segmentation',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'Campaigns',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'Reports',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'End-to-End Sending Infrastructure',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      { name: 'API', status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational') },
      {
        name: 'Auth API',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'People API',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'Events API',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'Customers API',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'Recommendations',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
      {
        name: 'Resources API',
        status: StatusUtils.normalizeStatus(data.status?.indicator || 'operational'),
      },
    ];

    return {
      service_name: 'zetaglobal',
      display_name: 'Zeta Global',
      description: '마케팅 플랫폼 및 데이터 분석 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.zetaglobal.net',
      icon: 'zetaglobal',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('Zeta Global API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'Web Application', status: 'operational' },
      { name: 'Platform', status: 'operational' },
      { name: 'Platform Access', status: 'operational' },
      { name: 'Data Import', status: 'operational' },
      { name: 'Audience Segmentation', status: 'operational' },
      { name: 'Campaigns', status: 'operational' },
      { name: 'Reports', status: 'operational' },
      { name: 'End-to-End Sending Infrastructure', status: 'operational' },
      { name: 'API', status: 'operational' },
      { name: 'Auth API', status: 'operational' },
      { name: 'People API', status: 'operational' },
      { name: 'Events API', status: 'operational' },
      { name: 'Customers API', status: 'operational' },
      { name: 'Recommendations', status: 'operational' },
      { name: 'Resources API', status: 'operational' },
    ];

    return {
      service_name: 'zetaglobal',
      display_name: 'Zeta Global',
      description: '마케팅 플랫폼 및 데이터 분석 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.zetaglobal.net',
      icon: 'zetaglobal',
      components,
    };
  }
}

/**
 * Vercel 플랫폼 상태 조회 (components API 사용)
 */
export async function fetchVercelStatus(): Promise<Service> {
  try {
    // components API를 통해 실제 컴포넌트 상태 조회
    const componentsResponse = await apiClient.get(
      `${CORS_PROXY}https://www.vercel-status.com/api/v2/components.json`
    );
    const componentsData = componentsResponse.data.components || [];

    // 실제 컴포넌트 데이터 매핑 (그룹이 아닌 실제 컴포넌트만)
    const components: ServiceComponent[] = componentsData
      .filter((component: any) => !component.group && component.name)
      .map((component: any) => ({
        name: component.name,
        status: StatusUtils.normalizeStatus(component.status || 'operational'),
      }));

    // 컴포넌트가 없으면 기본 컴포넌트 사용
    if (components.length === 0) {
      const defaultComponents = [
        'Dashboard', 'Builds', 'Serverless Functions', 'Edge Functions',
        'API', 'DNS', 'SSL Certificates', 'Web Analytics',
      ];
      defaultComponents.forEach(name => {
        components.push({ name, status: StatusType.OPERATIONAL });
      });
    }

    return {
      service_name: 'vercel',
      display_name: 'Vercel',
      description: '프론트엔드 클라우드 플랫폼 및 서버리스 배포 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://www.vercel-status.com',
      icon: 'vercel',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Vercel API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'Dashboard', status: StatusType.OPERATIONAL },
      { name: 'Builds', status: StatusType.OPERATIONAL },
      { name: 'Serverless Functions', status: StatusType.OPERATIONAL },
      { name: 'Edge Functions', status: StatusType.OPERATIONAL },
      { name: 'API', status: StatusType.OPERATIONAL },
      { name: 'DNS', status: StatusType.OPERATIONAL },
    ];

    return {
      service_name: 'vercel',
      display_name: 'Vercel',
      description: '프론트엔드 클라우드 플랫폼 및 서버리스 배포 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://www.vercel-status.com',
      icon: 'vercel',
      components,
    };
  }
}

/**
 * MongoDB Atlas 상태 조회 (components API 사용)
 */
export async function fetchMongoDBStatus(): Promise<Service> {
  try {
    // components API를 통해 실제 컴포넌트 상태 조회
    const componentsResponse = await apiClient.get(
      `${CORS_PROXY}https://status.mongodb.com/api/v2/components.json`
    );
    const componentsData = componentsResponse.data.components || [];

    // 실제 컴포넌트 데이터 매핑 (그룹이 아닌 실제 컴포넌트만)
    const components: ServiceComponent[] = componentsData
      .filter((component: any) => !component.group && component.name)
      .map((component: any) => ({
        name: component.name,
        status: StatusUtils.normalizeStatus(component.status || 'operational'),
      }));

    // 컴포넌트가 없으면 기본 컴포넌트 사용
    if (components.length === 0) {
      const defaultComponents = [
        'MongoDB Cloud', 'MongoDB Atlas App Services', 'MongoDB Atlas Search',
        'MongoDB Charts', 'MongoDB Support Portal',
      ];
      defaultComponents.forEach(name => {
        components.push({ name, status: StatusType.OPERATIONAL });
      });
    }

    return {
      service_name: 'mongodb',
      display_name: 'MongoDB Atlas',
      description: '클라우드 NoSQL 데이터베이스 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.mongodb.com',
      icon: 'mongodb',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('MongoDB API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'MongoDB Cloud', status: StatusType.OPERATIONAL },
      { name: 'MongoDB Atlas App Services', status: StatusType.OPERATIONAL },
      { name: 'MongoDB Atlas Search', status: StatusType.OPERATIONAL },
      { name: 'MongoDB Charts', status: StatusType.OPERATIONAL },
      { name: 'MongoDB Support Portal', status: StatusType.OPERATIONAL },
    ];

    return {
      service_name: 'mongodb',
      display_name: 'MongoDB Atlas',
      description: '클라우드 NoSQL 데이터베이스 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.mongodb.com',
      icon: 'mongodb',
      components,
    };
  }
}

/**
 * GitLab 상태 조회 (Status.io API 사용)
 */
export async function fetchGitLabStatus(): Promise<Service> {
  try {
    // Status.io API를 통해 GitLab 상태 정보 가져오기
    const response = await apiClient.get(
      `${CORS_PROXY}https://api.status.io/1.0/status/5b36dc6502d06804c08349f7`
    );
    const data = response.data;

    // Status.io API 응답에서 컴포넌트 정보 추출
    const components: ServiceComponent[] = [];

    if (data.result && data.result.status) {
      data.result.status.forEach((container: any) => {
        if (container.containers) {
          container.containers.forEach((comp: any) => {
            components.push({
              name: comp.name,
              status: StatusUtils.normalizeStatus(
                comp.status === 'Operational' ? 'operational' :
                comp.status === 'Degraded Performance' ? 'degraded' :
                comp.status === 'Partial Service Disruption' ? 'partial_outage' :
                comp.status === 'Service Disruption' ? 'major_outage' :
                comp.status === 'Maintenance' ? 'maintenance' : 'operational'
              ),
            });
          });
        }
      });
    }

    // 컴포넌트가 없으면 기본 컴포넌트 사용
    if (components.length === 0) {
      const defaultComponents = [
        'Website', 'API', 'Git Operations', 'CI/CD', 'GitLab Pages',
        'Container Registry', 'GitLab Duo', 'SAML SSO',
      ];
      defaultComponents.forEach(name => {
        components.push({ name, status: StatusType.OPERATIONAL });
      });
    }

    return {
      service_name: 'gitlab',
      display_name: 'GitLab',
      description: 'DevOps 플랫폼 및 Git 저장소 호스팅 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.gitlab.com',
      icon: 'gitlab',
      components,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('GitLab API 오류:', error);
    }
    const components: ServiceComponent[] = [
      { name: 'Website', status: StatusType.OPERATIONAL },
      { name: 'API', status: StatusType.OPERATIONAL },
      { name: 'Git Operations', status: StatusType.OPERATIONAL },
      { name: 'CI/CD', status: StatusType.OPERATIONAL },
      { name: 'GitLab Pages', status: StatusType.OPERATIONAL },
      { name: 'Container Registry', status: StatusType.OPERATIONAL },
    ];

    return {
      service_name: 'gitlab',
      display_name: 'GitLab',
      description: 'DevOps 플랫폼 및 Git 저장소 호스팅 서비스',
      status: StatusUtils.calculateServiceStatus(components),
      page_url: 'https://status.gitlab.com',
      icon: 'gitlab',
      components,
    };
  }
}

/**
 * 모든 서비스 상태를 병렬로 조회
 */
export async function fetchAllServicesStatus(): Promise<Service[]> {
  const serviceFetchers = [
    fetchOpenAIStatus,
    fetchAnthropicStatus,
    fetchCursorStatus,
    fetchGoogleAIStatus,
    fetchGitHubStatus,
    fetchNetlifyStatus,
    fetchDockerHubStatus,
    fetchAWSStatus,
    fetchSlackStatus,
    fetchFirebaseStatus,
    fetchSupabaseStatus,
    fetchPerplexityStatus,
    fetchV0Status,
    fetchReplitStatus,
    fetchXAIStatus,
    fetchHerokuStatus,
    fetchAtlassianStatus,
    fetchCircleCIStatus,
    fetchAuth0Status,
    fetchSendGridStatus,
    fetchCloudflareStatus,
    fetchDatadogStatus,
    fetchZetaGlobalStatus,
    fetchVercelStatus,
    fetchMongoDBStatus,
    fetchGitLabStatus,
    // statuspage 기반 추가 서비스들
    () => ServiceStatusFetcher.fetchServiceStatus('groq'),
    () => ServiceStatusFetcher.fetchServiceStatus('deepseek'),
  ];

  try {
    const results = await Promise.allSettled(serviceFetchers.map(fetcher => fetcher()));

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        if (import.meta.env.DEV) {
        console.error(`서비스 ${index} 로딩 실패:`, result.reason);
        }
        // 기본 서비스 반환 (에러 처리)
        return {
          service_name: `service_${index}`,
          display_name: 'Unknown Service',
          description: 'Service status unavailable',
          status: 'operational' as const,
          page_url: '#',
          icon: 'unknown',
          components: [],
        };
      }
    });
  } catch (error) {
    if (import.meta.env.DEV) {
    console.error('전체 서비스 상태 조회 실패:', error);
    }
    return [];
  }
}

// 개별 서비스 fetcher 매핑
export const serviceFetchers = {
  openai: fetchOpenAIStatus,
  anthropic: fetchAnthropicStatus,
  cursor: fetchCursorStatus,
  googleai: fetchGoogleAIStatus,
  github: fetchGitHubStatus,
  netlify: fetchNetlifyStatus,
  dockerhub: fetchDockerHubStatus,
  aws: fetchAWSStatus,
  slack: fetchSlackStatus,
  firebase: fetchFirebaseStatus,
  supabase: fetchSupabaseStatus,
  perplexity: fetchPerplexityStatus,
  v0: fetchV0Status,
  replit: fetchReplitStatus,
  xai: fetchXAIStatus,
  heroku: fetchHerokuStatus,
  atlassian: fetchAtlassianStatus,
  circleci: fetchCircleCIStatus,
  auth0: fetchAuth0Status,
  sendgrid: fetchSendGridStatus,
  cloudflare: fetchCloudflareStatus,
  datadog: fetchDatadogStatus,
  zetaglobal: fetchZetaGlobalStatus,
  vercel: fetchVercelStatus,
  mongodb: fetchMongoDBStatus,
  gitlab: fetchGitLabStatus,
  groq: () => ServiceStatusFetcher.fetchServiceStatus('groq'),
  deepseek: () => ServiceStatusFetcher.fetchServiceStatus('deepseek'),
};

// 서비스 이름 목록
export const serviceNames = Object.keys(serviceFetchers) as (keyof typeof serviceFetchers)[];
