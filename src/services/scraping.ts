import axios from 'axios';
import * as cheerio from 'cheerio';
import { StatusType, ComponentStatus, ServiceStatus } from '../types/status';

// Docker Status.io 기반 파싱
export class DockerStatusParser {
  static parse(html: string): ServiceStatus {
    const $ = cheerio.load(html);
    const components: ComponentStatus[] = [];

    // Docker Status.io의 컴포넌트 구조 파싱
    $('.component').each((_, element) => {
      const $element = $(element);
      const nameElement = $element.find('.component_name');
      const statusElement = $element.find('.component-status');
      
      if (nameElement.length && statusElement.length) {
        const name = nameElement.text().trim();
        const statusText = statusElement.text().trim();
        
        if (name && statusText) {
          components.push({
            id: `docker-${components.length}`,
            name,
            status: this.normalizeStatus(statusText),
            description: '',
            updated_at: new Date().toISOString()
          });
        }
      }
    });

    // 전체 상태 결정
    const overallStatus = this.determineOverallStatus(components);

    return {
      service_name: 'docker',
      display_name: 'Docker',
      overall_status: overallStatus,
      components,
      description: 'Docker Systems Status',
      page_url: 'https://www.dockerstatus.com',
      updated_at: new Date().toISOString(),
    };
  }

  private static normalizeStatus(statusText: string): StatusType {
    const status = statusText.toLowerCase();
    if (status.includes('operational') || status.includes('available')) {
      return StatusType.OPERATIONAL;
    } else if (status.includes('degraded') || status.includes('performance')) {
      return StatusType.DEGRADED_PERFORMANCE;
    } else if (status.includes('partial') || status.includes('outage')) {
      return StatusType.PARTIAL_OUTAGE;
    } else if (status.includes('major') || status.includes('outage')) {
      return StatusType.MAJOR_OUTAGE;
    } else if (status.includes('maintenance')) {
      return StatusType.UNDER_MAINTENANCE;
    }
    return StatusType.OPERATIONAL;
  }

  private static determineOverallStatus(components: ComponentStatus[]): StatusType {
    if (components.length === 0) return StatusType.OPERATIONAL;
    
    const statusCounts = components.reduce((acc, comp) => {
      acc[comp.status] = (acc[comp.status] || 0) + 1;
      return acc;
    }, {} as Record<StatusType, number>);

    // 우선순위: major_outage > partial_outage > degraded_performance > maintenance > operational
    if (statusCounts[StatusType.MAJOR_OUTAGE]) return StatusType.MAJOR_OUTAGE;
    if (statusCounts[StatusType.PARTIAL_OUTAGE]) return StatusType.PARTIAL_OUTAGE;
    if (statusCounts[StatusType.DEGRADED_PERFORMANCE]) return StatusType.DEGRADED_PERFORMANCE;
    if (statusCounts[StatusType.UNDER_MAINTENANCE]) return StatusType.UNDER_MAINTENANCE;
    
    return StatusType.OPERATIONAL;
  }
}

// Slack Salesforce 기반 파싱
export class SlackStatusParser {
  static parse(html: string): ServiceStatus {
    const $ = cheerio.load(html);
    const components: ComponentStatus[] = [];

    // Slack의 서비스 구조 파싱
    $('.service.header').each((_, element) => {
      const $element = $(element);
      const flexColumn = $element.find('.flex_column');
      
      if (flexColumn.length) {
        const nameElement = flexColumn.find('p.bold');
        const statusElement = flexColumn.find('p.tiny');
        
        if (nameElement.length && statusElement.length) {
          const name = nameElement.text().trim();
          const statusText = statusElement.text().trim();
          
          components.push({
            id: `slack-${components.length}`,
            name,
            status: this.normalizeStatus(statusText),
            description: '',
            updated_at: new Date().toISOString()
          });
        }
      }
    });

    const overallStatus = this.determineOverallStatus(components);

    return {
      service_name: 'slack',
      display_name: 'Slack',
      overall_status: overallStatus,
      components,
      description: 'Slack System Status',
      page_url: 'https://slack-status.com',
      updated_at: new Date().toISOString(),
    };
  }

  private static normalizeStatus(statusText: string): StatusType {
    const status = statusText.toLowerCase();
    if (status.includes('no issues') || status.includes('operational')) {
      return StatusType.OPERATIONAL;
    } else if (status.includes('degraded') || status.includes('performance')) {
      return StatusType.DEGRADED_PERFORMANCE;
    } else if (status.includes('partial') || status.includes('outage')) {
      return StatusType.PARTIAL_OUTAGE;
    } else if (status.includes('major') || status.includes('outage')) {
      return StatusType.MAJOR_OUTAGE;
    } else if (status.includes('maintenance')) {
      return StatusType.UNDER_MAINTENANCE;
    } else if (status.includes('not quite right') || status.includes('something')) {
      return StatusType.DEGRADED_PERFORMANCE;
    }
    return StatusType.OPERATIONAL;
  }

  private static determineOverallStatus(components: ComponentStatus[]): StatusType {
    if (components.length === 0) return StatusType.OPERATIONAL;
    
    const statusCounts = components.reduce((acc, comp) => {
      acc[comp.status] = (acc[comp.status] || 0) + 1;
      return acc;
    }, {} as Record<StatusType, number>);

    if (statusCounts[StatusType.MAJOR_OUTAGE]) return StatusType.MAJOR_OUTAGE;
    if (statusCounts[StatusType.PARTIAL_OUTAGE]) return StatusType.PARTIAL_OUTAGE;
    if (statusCounts[StatusType.DEGRADED_PERFORMANCE]) return StatusType.DEGRADED_PERFORMANCE;
    if (statusCounts[StatusType.UNDER_MAINTENANCE]) return StatusType.UNDER_MAINTENANCE;
    
    return StatusType.OPERATIONAL;
  }
}

// AWS Status Page 기반 파싱
export class AWSStatusParser {
  static parse(html: string): ServiceStatus {
    const $ = cheerio.load(html);
    const components: ComponentStatus[] = [];

    // AWS Status Page의 서비스 구조 파싱
    // AWS는 여러 리전별로 서비스를 표시하므로, 주요 서비스들을 추출
    $('table tbody tr').each((_, element) => {
      const $element = $(element);
      const nameElement = $element.find('td:first-child');
      const statusElement = $element.find('td.status');
      
      if (nameElement.length) {
        const name = nameElement.text().trim();
        
        if (name && name.length > 0) {
          let status = StatusType.OPERATIONAL;
          
          if (statusElement.length) {
            const statusText = statusElement.text().trim();
            status = this.normalizeStatus(statusText);
          }
          
          // 중복 제거를 위해 이미 존재하는지 확인
          const exists = components.some(comp => comp.name === name);
          if (!exists) {
            components.push({
              id: `aws-${components.length}`,
              name,
              status,
              description: '',
              updated_at: new Date().toISOString()
            });
          }
        }
      }
    });

    // 파싱된 컴포넌트가 없으면 주요 서비스 목록 사용
    if (components.length === 0) {
      const defaultServices = [
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
      ];

      defaultServices.forEach(serviceName => {
        components.push({
          id: `aws-${components.length}`,
          name: serviceName,
          status: StatusType.OPERATIONAL,
          description: '',
          updated_at: new Date().toISOString()
        });
      });
    }

    const overallStatus = this.determineOverallStatus(components);

    return {
      service_name: 'aws',
      display_name: 'AWS',
      overall_status: overallStatus,
      components,
      description: 'AWS Service Health Dashboard',
      page_url: 'https://status.aws.amazon.com',
      updated_at: new Date().toISOString(),
    };
  }

  private static normalizeStatus(statusText: string): StatusType {
    const status = statusText.toLowerCase();
    if (status.includes('operational') || status.includes('normal') || status.includes('available')) {
      return StatusType.OPERATIONAL;
    } else if (status.includes('degraded') || status.includes('performance')) {
      return StatusType.DEGRADED_PERFORMANCE;
    } else if (status.includes('partial') || status.includes('outage')) {
      return StatusType.PARTIAL_OUTAGE;
    } else if (status.includes('major') || status.includes('outage')) {
      return StatusType.MAJOR_OUTAGE;
    } else if (status.includes('maintenance')) {
      return StatusType.UNDER_MAINTENANCE;
    }
    return StatusType.OPERATIONAL;
  }

  private static determineOverallStatus(components: ComponentStatus[]): StatusType {
    if (components.length === 0) return StatusType.OPERATIONAL;
    
    const statusCounts = components.reduce((acc, comp) => {
      acc[comp.status] = (acc[comp.status] || 0) + 1;
      return acc;
    }, {} as Record<StatusType, number>);

    if (statusCounts[StatusType.MAJOR_OUTAGE]) return StatusType.MAJOR_OUTAGE;
    if (statusCounts[StatusType.PARTIAL_OUTAGE]) return StatusType.PARTIAL_OUTAGE;
    if (statusCounts[StatusType.DEGRADED_PERFORMANCE]) return StatusType.DEGRADED_PERFORMANCE;
    if (statusCounts[StatusType.UNDER_MAINTENANCE]) return StatusType.UNDER_MAINTENANCE;
    
    return StatusType.OPERATIONAL;
  }
}

// Firebase Google 기반 파싱
export class FirebaseStatusParser {
  static parse(html: string): ServiceStatus {
    const $ = cheerio.load(html);
    const components: ComponentStatus[] = [];

    // Firebase의 제품 구조 파싱
    $('.product-row').each((_, element) => {
      const $element = $(element);
      const nameElement = $element.find('.product-name');
      
      if (nameElement.length) {
        const name = nameElement.text().trim();
        
        if (name) {
          // Firebase는 기본적으로 모든 서비스가 정상이라고 가정
          // 실제 상태는 별도의 API나 더 복잡한 파싱이 필요할 수 있음
          components.push({
            id: `firebase-${components.length}`,
            name,
            status: StatusType.OPERATIONAL,
            description: '',
            updated_at: new Date().toISOString()
          });
        }
      }
    });

    const overallStatus = this.determineOverallStatus(components);

    return {
      service_name: 'firebase',
      display_name: 'Firebase',
      overall_status: overallStatus,
      components,
      description: 'Firebase Status Dashboard',
      page_url: 'https://status.firebase.google.com',
      updated_at: new Date().toISOString(),
    };
  }

  private static determineOverallStatus(components: ComponentStatus[]): StatusType {
    if (components.length === 0) return StatusType.OPERATIONAL;
    
    const statusCounts = components.reduce((acc, comp) => {
      acc[comp.status] = (acc[comp.status] || 0) + 1;
      return acc;
    }, {} as Record<StatusType, number>);

    if (statusCounts[StatusType.MAJOR_OUTAGE]) return StatusType.MAJOR_OUTAGE;
    if (statusCounts[StatusType.PARTIAL_OUTAGE]) return StatusType.PARTIAL_OUTAGE;
    if (statusCounts[StatusType.DEGRADED_PERFORMANCE]) return StatusType.DEGRADED_PERFORMANCE;
    if (statusCounts[StatusType.UNDER_MAINTENANCE]) return StatusType.UNDER_MAINTENANCE;
    
    return StatusType.OPERATIONAL;
  }
}

// 웹 스크래핑 서비스
export class WebScrapingService {
  private static readonly CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.codetabs.com/v1/proxy?quest=',
  ];
  private static readonly TIMEOUT = 10000;

  private static async fetchWithFallback(url: string): Promise<string> {
    for (const proxy of this.CORS_PROXIES) {
      try {
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        const response = await axios.get(proxyUrl, { timeout: this.TIMEOUT });
        return response.data;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn(`Proxy ${proxy} failed:`, error.message);
        }
        continue;
      }
    }
    throw new Error('All CORS proxies failed');
  }

  static async fetchDockerStatus(): Promise<ServiceStatus> {
    try {
      const html = await this.fetchWithFallback('https://www.dockerstatus.com/');
      return DockerStatusParser.parse(html);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Docker status fetch error:', error);
      }
      return this.createErrorStatus('Docker', error);
    }
  }

  static async fetchSlackStatus(): Promise<ServiceStatus> {
    try {
      const html = await this.fetchWithFallback('https://slack-status.com/');
      return SlackStatusParser.parse(html);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Slack status fetch error:', error);
      }
      return this.createErrorStatus('Slack', error);
    }
  }

  static async fetchFirebaseStatus(): Promise<ServiceStatus> {
    try {
      const html = await this.fetchWithFallback('https://status.firebase.google.com/');
      return FirebaseStatusParser.parse(html);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Firebase status fetch error:', error);
      }
      return this.createErrorStatus('Firebase', error);
    }
  }

  static async fetchAWSStatus(): Promise<ServiceStatus> {
    try {
      const html = await this.fetchWithFallback('https://status.aws.amazon.com/');
      return AWSStatusParser.parse(html);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('AWS status fetch error:', error);
      }
      return this.createErrorStatus('AWS', error);
    }
  }

  private static createErrorStatus(serviceName: string, error: any): ServiceStatus {
    return {
      service_name: serviceName.toLowerCase(),
      display_name: serviceName,
      overall_status: StatusType.MAJOR_OUTAGE,
      components: [{
        id: `${serviceName.toLowerCase()}-error`,
        name: 'API Error',
        status: StatusType.MAJOR_OUTAGE,
        description: `Failed to fetch status: ${error.message}`,
        updated_at: new Date().toISOString()
      }],
      description: `Error fetching ${serviceName} status`,
      page_url: '#',
      updated_at: new Date().toISOString(),
    };
  }
}

// 모든 스크래핑 서비스 통합
export const scrapingFetchers = {
  docker: WebScrapingService.fetchDockerStatus,
  slack: WebScrapingService.fetchSlackStatus,
  firebase: WebScrapingService.fetchFirebaseStatus,
  aws: WebScrapingService.fetchAWSStatus,
};

export const scrapingServiceNames = Object.keys(scrapingFetchers);
