export enum StatusType {
  OPERATIONAL = 'operational',
  DEGRADED_PERFORMANCE = 'degraded_performance', 
  PARTIAL_OUTAGE = 'partial_outage',
  MAJOR_OUTAGE = 'major_outage',
  UNDER_MAINTENANCE = 'under_maintenance',
  UNKNOWN = 'unknown'
}

export interface ComponentStatus {
  id: string;
  name: string;
  status: StatusType;
  description?: string;
  updated_at?: string;
}

export interface ServiceStatus {
  service_name: string;
  display_name: string;
  overall_status: StatusType;
  components: ComponentStatus[];
  description: string;
  page_url: string;
  updated_at: string;
  icon_url?: string;
}

export interface StatusResponse {
  services: ServiceStatus[];
  refresh_interval: number;
  last_updated: string;
}

export interface StatusSummary {
  total_services: number;
  operational_count: number;
  issue_count: number;
  overall_status: StatusType;
  status_text: string;
  status_description: string;
}

// API Response Types (외부 API 응답 형태)
export interface OpenAIStatusAPI {
  page: {
    id: string;
    name: string;
    url: string;
    updated_at: string;
  };
  status: {
    indicator: string;
    description: string;
  };
  components: Array<{
    id: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
    position: number;
    description?: string;
    showcase: boolean;
    start_date?: string;
    group_id?: string;
    page_id: string;
    group: boolean;
    only_show_if_degraded: boolean;
  }>;
}

export interface AnthropicStatusAPI {
  page: {
    id: string;
    name: string;
    url: string;
    updated_at: string;
  };
  status: {
    indicator: string;
    description: string;
  };
  components: Array<{
    id: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
    position: number;
    description?: string;
    showcase: boolean;
    start_date?: string;
    group_id?: string;
    page_id: string;
    group: boolean;
    only_show_if_degraded: boolean;
  }>;
}

// 설정 관련 타입
export interface DashboardConfig {
  refresh_interval: number;
  theme: 'light' | 'dark' | 'auto';
  services_enabled: string[];
}

// 에러 타입
export interface StatusError {
  service_name: string;
  error_message: string;
  error_code?: string;
  timestamp: string;
}

// Hook 반환 타입
export interface UseStatusResult {
  data: StatusResponse | null;
  loading: boolean;
  error: StatusError | null;
  refetch: () => Promise<void>;
}

export interface UseStatusSummaryResult {
  summary: StatusSummary;
  loading: boolean;
} 