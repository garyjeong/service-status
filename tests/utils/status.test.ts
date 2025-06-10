import { describe, it, expect } from 'vitest';
import {
  mapStatusToType,
  getStatusText,
  getStatusColor,
  calculateOverallStatus,
  generateStatusSummary,
  calculateServiceStatus,
  formatDateTime,
  formatRelativeTime,
} from '../../src/utils/status';
import { StatusType, ComponentStatus, ServiceStatus } from '../../src/types/status';

describe('Status Utils', () => {
  describe('mapStatusToType', () => {
    it('should map operational status correctly', () => {
      expect(mapStatusToType('operational')).toBe(StatusType.OPERATIONAL);
      expect(mapStatusToType('none')).toBe(StatusType.OPERATIONAL);
    });

    it('should map degraded performance status correctly', () => {
      expect(mapStatusToType('degraded_performance')).toBe(StatusType.DEGRADED_PERFORMANCE);
      expect(mapStatusToType('minor')).toBe(StatusType.DEGRADED_PERFORMANCE);
    });

    it('should map outage status correctly', () => {
      expect(mapStatusToType('partial_outage')).toBe(StatusType.PARTIAL_OUTAGE);
      expect(mapStatusToType('minor_outage')).toBe(StatusType.PARTIAL_OUTAGE);
      expect(mapStatusToType('major_outage')).toBe(StatusType.MAJOR_OUTAGE);
    });

    it('should map maintenance status correctly', () => {
      expect(mapStatusToType('under_maintenance')).toBe(StatusType.UNDER_MAINTENANCE);
      expect(mapStatusToType('maintenance')).toBe(StatusType.UNDER_MAINTENANCE);
    });

    it('should return unknown for unrecognized status', () => {
      expect(mapStatusToType('invalid_status')).toBe(StatusType.UNKNOWN);
      expect(mapStatusToType('')).toBe(StatusType.UNKNOWN);
    });

    it('should be case insensitive', () => {
      expect(mapStatusToType('OPERATIONAL')).toBe(StatusType.OPERATIONAL);
      expect(mapStatusToType('Operational')).toBe(StatusType.OPERATIONAL);
    });
  });

  describe('getStatusText', () => {
    it('should return correct Korean text for each status', () => {
      expect(getStatusText(StatusType.OPERATIONAL)).toBe('정상 운영');
      expect(getStatusText(StatusType.DEGRADED_PERFORMANCE)).toBe('성능 저하');
      expect(getStatusText(StatusType.PARTIAL_OUTAGE)).toBe('부분 장애');
      expect(getStatusText(StatusType.MAJOR_OUTAGE)).toBe('주요 장애');
      expect(getStatusText(StatusType.UNDER_MAINTENANCE)).toBe('점검 중');
      expect(getStatusText(StatusType.UNKNOWN)).toBe('상태 불명');
    });
  });

  describe('getStatusColor', () => {
    it('should return correct color codes for each status', () => {
      expect(getStatusColor(StatusType.OPERATIONAL)).toBe('#22c55e');
      expect(getStatusColor(StatusType.DEGRADED_PERFORMANCE)).toBe('#f59e0b');
      expect(getStatusColor(StatusType.PARTIAL_OUTAGE)).toBe('#ef4444');
      expect(getStatusColor(StatusType.MAJOR_OUTAGE)).toBe('#dc2626');
      expect(getStatusColor(StatusType.UNDER_MAINTENANCE)).toBe('#6366f1');
      expect(getStatusColor(StatusType.UNKNOWN)).toBe('#6b7280');
    });
  });

  describe('calculateOverallStatus', () => {
    const createMockService = (status: StatusType): ServiceStatus => ({
      service_name: 'test',
      display_name: 'Test Service',
      overall_status: status,
      components: [],
      description: 'Test description',
      page_url: 'https://test.com',
      updated_at: new Date().toISOString(),
    });

    it('should return UNKNOWN for empty services', () => {
      expect(calculateOverallStatus([])).toBe(StatusType.UNKNOWN);
    });

    it('should return OPERATIONAL when all services are operational', () => {
      const services = [
        createMockService(StatusType.OPERATIONAL),
        createMockService(StatusType.OPERATIONAL),
      ];
      expect(calculateOverallStatus(services)).toBe(StatusType.OPERATIONAL);
    });

    it('should prioritize MAJOR_OUTAGE', () => {
      const services = [
        createMockService(StatusType.OPERATIONAL),
        createMockService(StatusType.MAJOR_OUTAGE),
        createMockService(StatusType.DEGRADED_PERFORMANCE),
      ];
      expect(calculateOverallStatus(services)).toBe(StatusType.MAJOR_OUTAGE);
    });

    it('should prioritize PARTIAL_OUTAGE over DEGRADED_PERFORMANCE', () => {
      const services = [
        createMockService(StatusType.OPERATIONAL),
        createMockService(StatusType.PARTIAL_OUTAGE),
        createMockService(StatusType.DEGRADED_PERFORMANCE),
      ];
      expect(calculateOverallStatus(services)).toBe(StatusType.PARTIAL_OUTAGE);
    });

    it('should prioritize DEGRADED_PERFORMANCE over MAINTENANCE', () => {
      const services = [
        createMockService(StatusType.OPERATIONAL),
        createMockService(StatusType.UNDER_MAINTENANCE),
        createMockService(StatusType.DEGRADED_PERFORMANCE),
      ];
      expect(calculateOverallStatus(services)).toBe(StatusType.DEGRADED_PERFORMANCE);
    });
  });

  describe('calculateServiceStatus', () => {
    const createMockComponent = (status: StatusType): ComponentStatus => ({
      id: 'test-component',
      name: 'Test Component',
      status,
    });

    it('should return UNKNOWN for empty components', () => {
      expect(calculateServiceStatus([])).toBe(StatusType.UNKNOWN);
    });

    it('should return OPERATIONAL when all components are operational', () => {
      const components = [
        createMockComponent(StatusType.OPERATIONAL),
        createMockComponent(StatusType.OPERATIONAL),
      ];
      expect(calculateServiceStatus(components)).toBe(StatusType.OPERATIONAL);
    });

    it('should follow priority rules similar to overall status', () => {
      const components = [
        createMockComponent(StatusType.OPERATIONAL),
        createMockComponent(StatusType.MAJOR_OUTAGE),
      ];
      expect(calculateServiceStatus(components)).toBe(StatusType.MAJOR_OUTAGE);
    });
  });

  describe('generateStatusSummary', () => {
    const createMockService = (status: StatusType): ServiceStatus => ({
      service_name: 'test',
      display_name: 'Test Service',
      overall_status: status,
      components: [],
      description: 'Test description',
      page_url: 'https://test.com',
      updated_at: new Date().toISOString(),
    });

    it('should generate correct summary for all operational services', () => {
      const services = [
        createMockService(StatusType.OPERATIONAL),
        createMockService(StatusType.OPERATIONAL),
      ];
      
      const summary = generateStatusSummary(services);
      
      expect(summary.total_services).toBe(2);
      expect(summary.operational_count).toBe(2);
      expect(summary.issue_count).toBe(0);
      expect(summary.overall_status).toBe(StatusType.OPERATIONAL);
      expect(summary.status_text).toBe('모든 시스템 정상');
      expect(summary.status_description).toBe('모든 AI 서비스가 정상적으로 운영되고 있습니다.');
    });

    it('should generate correct summary for mixed service states', () => {
      const services = [
        createMockService(StatusType.OPERATIONAL),
        createMockService(StatusType.DEGRADED_PERFORMANCE),
        createMockService(StatusType.MAJOR_OUTAGE),
      ];
      
      const summary = generateStatusSummary(services);
      
      expect(summary.total_services).toBe(3);
      expect(summary.operational_count).toBe(1);
      expect(summary.issue_count).toBe(2);
      expect(summary.overall_status).toBe(StatusType.MAJOR_OUTAGE);
      expect(summary.status_text).toBe('주요 서비스 장애');
      expect(summary.status_description).toBe('2개 서비스에서 주요 장애가 발생했습니다.');
    });

    it('should handle empty services array', () => {
      const summary = generateStatusSummary([]);
      
      expect(summary.total_services).toBe(0);
      expect(summary.operational_count).toBe(0);
      expect(summary.issue_count).toBe(0);
      expect(summary.overall_status).toBe(StatusType.UNKNOWN);
      expect(summary.status_text).toBe('상태 확인 중');
    });
  });

  describe('formatDateTime', () => {
    it('should format valid date string correctly', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const formatted = formatDateTime(dateString);
      
      // 한국 시간대 형식으로 포맷되는지 확인
      expect(formatted).toMatch(/2024/);
      expect(formatted).toMatch(/1월|Jan/);
    });

    it('should handle invalid date string', () => {
      expect(formatDateTime('invalid-date')).toBe('날짜 불명');
      expect(formatDateTime('')).toBe('날짜 불명');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock Date.now() to a fixed time for consistent testing
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "방금 전" for very recent time', () => {
      const now = new Date();
      const result = formatRelativeTime(now.toISOString());
      expect(result).toBe('방금 전');
    });

    it('should return minutes ago for recent time', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatRelativeTime(fiveMinutesAgo.toISOString());
      expect(result).toBe('5분 전');
    });

    it('should return hours ago for time within a day', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoHoursAgo.toISOString());
      expect(result).toBe('2시간 전');
    });

    it('should return days ago for recent days', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(threeDaysAgo.toISOString());
      expect(result).toBe('3일 전');
    });

    it('should return formatted date for old dates', () => {
      const oneWeekAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(oneWeekAgo.toISOString());
      expect(result).toMatch(/2024/);
    });

    it('should handle invalid date string', () => {
      expect(formatRelativeTime('invalid-date')).toBe('시간 불명');
    });
  });
}); 