import React from 'react';
import { Activity, Zap, TrendingUp, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'operational' | 'degraded_performance' | 'major_outage' | 'unknown';
  count: number;
  isLoading?: boolean;
  translations: {
    operational: string;
    degraded: string;
    outage: string;
    loading: string;
  };
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, count, isLoading = false, translations }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-1 bg-gray-500/10 px-2 py-1 rounded-full border border-gray-500/20">
        <Clock className="w-3 h-3 text-gray-400 animate-spin" />
        <span className="text-gray-400 font-medium text-xs">{translations.loading}</span>
      </div>
    );
  }

  if (count === 0) return null;

  const statusConfig = {
    operational: {
      icon: Activity,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-400',
      dotColor: 'bg-green-400',
      label: translations.operational
    },
    degraded_performance: {
      icon: TrendingUp,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      textColor: 'text-yellow-400',
      dotColor: 'bg-yellow-400',
      label: translations.degraded
    },
    major_outage: {
      icon: Zap,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      textColor: 'text-red-400',
      dotColor: 'bg-red-400',
      label: translations.outage
    },
    unknown: {
      icon: Clock,
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20',
      textColor: 'text-gray-400',
      dotColor: 'bg-gray-400',
      label: translations.loading
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-1 ${config.bgColor} px-2 py-1 rounded-full border ${config.borderColor}`}>
      <div className={`w-2 h-2 ${config.dotColor} rounded-full ${status === 'major_outage' ? 'animate-pulse' : ''}`}></div>
      <span className={`${config.textColor} font-medium text-xs`}>{count}</span>
    </div>
  );
};

export default StatusBadge;
