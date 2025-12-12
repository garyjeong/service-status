import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import type { Language } from '../types/ui';

interface StatusSummaryPanelProps {
  stats: {
    operational: number;
    degraded: number;
    outage: number;
  };
  totalServices: number;
  language: Language;
  theme: 'light' | 'dark';
  onStatusFilter?: (status: 'degraded_performance' | 'major_outage' | null) => void;
  statusFilter: 'degraded_performance' | 'major_outage' | null;
}

const StatusSummaryPanel: React.FC<StatusSummaryPanelProps> = ({
  stats,
  totalServices,
  language,
  theme,
  onStatusFilter,
  statusFilter
}) => {
  const t = {
    ko: {
      statusSummary: '상태 요약',
      operational: '정상 운영',
      degraded: '성능 저하',
      outage: '장애 발생',
      allSystemsOperational: '모든 시스템 정상',
      issuesDetected: '문제 감지됨',
      clickToFilter: '클릭하여 필터링',
      totalServices: '전체 서비스'
    },
    en: {
      statusSummary: 'Status Summary',
      operational: 'Operational',
      degraded: 'Degraded Performance',
      outage: 'Major Outage',
      allSystemsOperational: 'All Systems Operational',
      issuesDetected: 'Issues Detected',
      clickToFilter: 'Click to filter',
      totalServices: 'Total Services'
    }
  }[language];

  const hasIssues = stats.degraded > 0 || stats.outage > 0;
  const operationalPercentage = totalServices > 0 ? Math.round((stats.operational / totalServices) * 100) : 100;

  // 전체 시스템 건강도 계산 (0-100)
  const healthScore = totalServices > 0 
    ? Math.round(((stats.operational * 100 + stats.degraded * 50 + stats.outage * 0) / totalServices) / 100 * 100)
    : 100;

  return (
    <motion.div
      className="status-summary-panel mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="status-summary-container">
        {/* 헤더 */}
        <div className="status-summary-header">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="status-summary-title">{t.statusSummary}</h2>
          </div>
          {hasIssues && (
            <motion.div
              className="status-summary-alert"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">{t.issuesDetected}</span>
            </motion.div>
          )}
        </div>

        {/* 통계 카드들 - 동적 그리드 레이아웃 */}
        <div className="status-summary-stats">
          {/* 전체 시스템 건강도 */}
          <motion.div
            className="status-summary-card status-summary-health"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="status-summary-card-header">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium opacity-80">
                {language === 'ko' ? '시스템 건강도' : 'System Health'}
              </span>
            </div>
            <div className="status-summary-health-score">
              <span className="status-summary-health-value">{healthScore}</span>
              <span className="status-summary-health-unit">%</span>
            </div>
            <div className="status-summary-health-bar">
              <motion.div
                className="status-summary-health-fill"
                initial={{ width: 0 }}
                animate={{ width: `${healthScore}%` }}
                transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </motion.div>

          {/* 정상 운영 */}
          <motion.div
            className="status-summary-card status-summary-operational"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="status-summary-card-header">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              <span className="text-xs md:text-sm font-medium">{t.operational}</span>
            </div>
            <div className="status-summary-card-value">
              <span className="status-summary-count">{stats.operational}</span>
              <span className="status-summary-total">/{totalServices}</span>
            </div>
            <div className="status-summary-card-percentage">
              {operationalPercentage}%
            </div>
          </motion.div>

          {/* 성능 저하 */}
          <motion.div
            className={`status-summary-card status-summary-degraded ${statusFilter === 'degraded_performance' ? 'selected' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => onStatusFilter && onStatusFilter(statusFilter === 'degraded_performance' ? null : 'degraded_performance')}
            style={{ cursor: onStatusFilter ? 'pointer' : 'default' }}
            role={onStatusFilter ? 'button' : undefined}
            tabIndex={onStatusFilter ? 0 : undefined}
            onKeyDown={(e) => {
              if (onStatusFilter && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onStatusFilter(statusFilter === 'degraded_performance' ? null : 'degraded_performance');
              }
            }}
          >
            <div className="status-summary-card-header">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
              <span className="text-xs md:text-sm font-medium">{t.degraded}</span>
            </div>
            <div className="status-summary-card-value">
              <span className="status-summary-count">{stats.degraded}</span>
              <span className="status-summary-total">/{totalServices}</span>
            </div>
            {onStatusFilter && (
              <div className="status-summary-card-hint">
                {t.clickToFilter}
              </div>
            )}
          </motion.div>

          {/* 장애 발생 */}
          <motion.div
            className={`status-summary-card status-summary-outage ${statusFilter === 'major_outage' ? 'selected' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => onStatusFilter && onStatusFilter(statusFilter === 'major_outage' ? null : 'major_outage')}
            style={{ cursor: onStatusFilter ? 'pointer' : 'default' }}
            role={onStatusFilter ? 'button' : undefined}
            tabIndex={onStatusFilter ? 0 : undefined}
            onKeyDown={(e) => {
              if (onStatusFilter && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onStatusFilter(statusFilter === 'major_outage' ? null : 'major_outage');
              }
            }}
          >
            <div className="status-summary-card-header">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              <span className="text-xs md:text-sm font-medium">{t.outage}</span>
            </div>
            <div className="status-summary-card-value">
              <span className="status-summary-count">{stats.outage}</span>
              <span className="status-summary-total">/{totalServices}</span>
            </div>
            {onStatusFilter && (
              <div className="status-summary-card-hint">
                {t.clickToFilter}
              </div>
            )}
          </motion.div>
        </div>

        {/* 전체 시스템 상태 메시지 */}
        {!hasIssues && (
          <motion.div
            className="status-summary-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">{t.allSystemsOperational}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StatusSummaryPanel;

