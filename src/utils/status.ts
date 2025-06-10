import { StatusType, ComponentStatus, ServiceStatus, StatusSummary } from '../types/status';

/**
 * 외부 API의 상태 문자열을 내부 StatusType으로 변환
 */
export function mapStatusToType(status: string): StatusType {
  const statusMap: Record<string, StatusType> = {
    operational: StatusType.OPERATIONAL,
    degraded_performance: StatusType.DEGRADED_PERFORMANCE,
    partial_outage: StatusType.PARTIAL_OUTAGE,
    major_outage: StatusType.MAJOR_OUTAGE,
    under_maintenance: StatusType.UNDER_MAINTENANCE,
    // Anthropic API variations
    minor_outage: StatusType.PARTIAL_OUTAGE,
    critical: StatusType.MAJOR_OUTAGE,
    // OpenAI API variations
    none: StatusType.OPERATIONAL,
    minor: StatusType.DEGRADED_PERFORMANCE,
    maintenance: StatusType.UNDER_MAINTENANCE,
  };

  return statusMap[status.toLowerCase()] || StatusType.UNKNOWN;
}

/**
 * 상태 타입을 한글 텍스트로 변환
 */
export function getStatusText(status: StatusType): string {
  const statusTexts: Record<StatusType, string> = {
    [StatusType.OPERATIONAL]: '정상 운영',
    [StatusType.DEGRADED_PERFORMANCE]: '성능 저하',
    [StatusType.PARTIAL_OUTAGE]: '부분 장애',
    [StatusType.MAJOR_OUTAGE]: '주요 장애',
    [StatusType.UNDER_MAINTENANCE]: '점검 중',
    [StatusType.UNKNOWN]: '상태 불명',
  };

  return statusTexts[status];
}

/**
 * 상태 타입에 따른 CSS 클래스명 반환
 */
export function getStatusClass(status: StatusType): string {
  const statusClasses: Record<StatusType, string> = {
    [StatusType.OPERATIONAL]: 'status-operational',
    [StatusType.DEGRADED_PERFORMANCE]: 'status-degraded',
    [StatusType.PARTIAL_OUTAGE]: 'status-partial-outage',
    [StatusType.MAJOR_OUTAGE]: 'status-major-outage',
    [StatusType.UNDER_MAINTENANCE]: 'status-maintenance',
    [StatusType.UNKNOWN]: 'status-unknown',
  };

  return statusClasses[status];
}

/**
 * 상태 타입에 따른 색상 코드 반환
 */
export function getStatusColor(status: StatusType): string {
  const statusColors: Record<StatusType, string> = {
    [StatusType.OPERATIONAL]: '#22c55e', // green-500
    [StatusType.DEGRADED_PERFORMANCE]: '#f59e0b', // amber-500
    [StatusType.PARTIAL_OUTAGE]: '#ef4444', // red-500
    [StatusType.MAJOR_OUTAGE]: '#dc2626', // red-600
    [StatusType.UNDER_MAINTENANCE]: '#6366f1', // indigo-500
    [StatusType.UNKNOWN]: '#6b7280', // gray-500
  };

  return statusColors[status];
}

/**
 * 여러 서비스의 전체 상태를 계산
 */
export function calculateOverallStatus(services: ServiceStatus[]): StatusType {
  if (services.length === 0) return StatusType.UNKNOWN;

  const statuses = services.map(service => service.overall_status);

  // 우선순위: MAJOR_OUTAGE > PARTIAL_OUTAGE > DEGRADED_PERFORMANCE > UNDER_MAINTENANCE > OPERATIONAL
  if (statuses.includes(StatusType.MAJOR_OUTAGE)) return StatusType.MAJOR_OUTAGE;
  if (statuses.includes(StatusType.PARTIAL_OUTAGE)) return StatusType.PARTIAL_OUTAGE;
  if (statuses.includes(StatusType.DEGRADED_PERFORMANCE)) return StatusType.DEGRADED_PERFORMANCE;
  if (statuses.includes(StatusType.UNDER_MAINTENANCE)) return StatusType.UNDER_MAINTENANCE;
  if (statuses.every(status => status === StatusType.OPERATIONAL)) return StatusType.OPERATIONAL;

  return StatusType.UNKNOWN;
}

/**
 * 서비스들의 상태 요약 생성
 */
export function generateStatusSummary(services: ServiceStatus[]): StatusSummary {
  const total_services = services.length;
  const operational_count = services.filter(
    service => service.overall_status === StatusType.OPERATIONAL
  ).length;
  const issue_count = total_services - operational_count;
  const overall_status = calculateOverallStatus(services);

  let status_text = '';
  let status_description = '';

  switch (overall_status) {
    case StatusType.OPERATIONAL:
      status_text = '모든 시스템 정상';
      status_description = '모든 AI 서비스가 정상적으로 운영되고 있습니다.';
      break;
    case StatusType.DEGRADED_PERFORMANCE:
      status_text = '일부 성능 저하';
      status_description = `${issue_count}개 서비스에서 성능 저하가 발생했습니다.`;
      break;
    case StatusType.PARTIAL_OUTAGE:
      status_text = '일부 서비스 장애';
      status_description = `${issue_count}개 서비스에서 부분적인 장애가 발생했습니다.`;
      break;
    case StatusType.MAJOR_OUTAGE:
      status_text = '주요 서비스 장애';
      status_description = `${issue_count}개 서비스에서 주요 장애가 발생했습니다.`;
      break;
    case StatusType.UNDER_MAINTENANCE:
      status_text = '점검 중';
      status_description = `${issue_count}개 서비스가 점검 중입니다.`;
      break;
    default:
      status_text = '상태 확인 중';
      status_description = '서비스 상태를 확인하고 있습니다.';
  }

  return {
    total_services,
    operational_count,
    issue_count,
    overall_status,
    status_text,
    status_description,
  };
}

/**
 * 컴포넌트들의 전체 상태를 계산
 */
export function calculateServiceStatus(components: ComponentStatus[]): StatusType {
  if (components.length === 0) return StatusType.UNKNOWN;

  const statuses = components.map(component => component.status);

  // 우선순위: MAJOR_OUTAGE > PARTIAL_OUTAGE > DEGRADED_PERFORMANCE > UNDER_MAINTENANCE > OPERATIONAL
  if (statuses.includes(StatusType.MAJOR_OUTAGE)) return StatusType.MAJOR_OUTAGE;
  if (statuses.includes(StatusType.PARTIAL_OUTAGE)) return StatusType.PARTIAL_OUTAGE;
  if (statuses.includes(StatusType.DEGRADED_PERFORMANCE)) return StatusType.DEGRADED_PERFORMANCE;
  if (statuses.includes(StatusType.UNDER_MAINTENANCE)) return StatusType.UNDER_MAINTENANCE;
  if (statuses.every(status => status === StatusType.OPERATIONAL)) return StatusType.OPERATIONAL;

  return StatusType.UNKNOWN;
}

/**
 * 날짜 문자열을 포맷팅
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Seoul',
    }).format(date);
  } catch {
    return '날짜 불명';
  }
}

/**
 * 상대 시간 표시 (예: "2분 전")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return formatDateTime(dateString);
  } catch {
    return '시간 불명';
  }
}
