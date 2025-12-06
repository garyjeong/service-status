import React from 'react';
import { StatusType } from '../types/status';
import { useTheme } from '../design-system/ThemeContext';
import { Icon } from '../design-system/Icon';
import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: StatusType;
  count: number;
  isLoading?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  showLabel?: boolean; // New prop to control text visibility
}

const statusLabels: Record<StatusType, string> = {
  [StatusType.OPERATIONAL]: 'Operational',
  [StatusType.DEGRADED_PERFORMANCE]: 'Degraded',
  [StatusType.PARTIAL_OUTAGE]: 'Partial Outage',
  [StatusType.MAJOR_OUTAGE]: 'Major Outage',
  [StatusType.UNDER_MAINTENANCE]: 'Maintenance',
  [StatusType.UNKNOWN]: 'Unknown',
};

import { statusColors } from '../design-system/theme';

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  count,
  isLoading = false,
  onClick,
  isSelected = false,
  showLabel = false,
}) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 bg-gray-500/10 px-2 py-1 rounded-full border border-gray-500/20">
        <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
        <span className="text-gray-400 font-medium text-xs">Loading...</span>
      </div>
    );
  }

  if (count === 0 && !showLabel) return null;

  const config = statusColors[status];
  const isClickable = !!onClick;

  const Component = isClickable ? 'button' : 'div';
  const label = statusLabels[status];

  const badgeStyle = {
    backgroundColor: isSelected ? config.glow : config.background,
    borderColor: isSelected ? config.main : config.glow,
    color: config.main,
    '--glow-color': config.glow,
  } as React.CSSProperties;

  return (
    <Component
      style={badgeStyle}
      className={cn(
        'group flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all duration-200',
        isClickable &&
          'cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95',
        isSelected && 'shadow-md',
        status === StatusType.MAJOR_OUTAGE &&
          isSelected &&
          'animate-pulse shadow-[0_0_12px_var(--glow-color)]'
      )}
      onClick={onClick}
      title={isClickable ? `Filter by status: ${label}` : `${count} services are ${label}`}
    >
      <Icon name={status} size={14} color={config.main} />
      {showLabel ? label : count}
    </Component>
  );
};

export default StatusBadge;

