import React from 'react';
import StatusBadge from '../../StatusBadge';

interface StatusSummaryProps {
  stats: {
    totalServices: number;
    operational: number;
    degraded: number;
    outage: number;
  };
  loadingCount: number;
  translations: {
    operational: string;
    degradedPerformance: string;
    majorOutage: string;
    loading: string;
  };
}

const StatusSummary: React.FC<StatusSummaryProps> = ({
  stats,
  loadingCount,
  translations,
}) => {
  return (
    <div className="flex items-center gap-4 text-sm">
      <StatusBadge
        status="unknown"
        count={loadingCount}
        isLoading={loadingCount > 0}
        translations={{
          operational: translations.operational,
          degraded: translations.degradedPerformance,
          outage: translations.majorOutage,
          loading: translations.loading
        }}
      />
      <StatusBadge
        status="operational"
        count={stats.operational}
        translations={{
          operational: translations.operational,
          degraded: translations.degradedPerformance,
          outage: translations.majorOutage,
          loading: translations.loading
        }}
      />
      <StatusBadge
        status="degraded_performance"
        count={stats.degraded}
        translations={{
          operational: translations.operational,
          degraded: translations.degradedPerformance,
          outage: translations.majorOutage,
          loading: translations.loading
        }}
      />
      <StatusBadge
        status="major_outage"
        count={stats.outage}
        translations={{
          operational: translations.operational,
          degraded: translations.degradedPerformance,
          outage: translations.majorOutage,
          loading: translations.loading
        }}
      />
    </div>
  );
};

export default StatusSummary;
