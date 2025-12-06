// src/design-system/Icon.tsx
import React, { useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  LucideProps,
  Wrench,
  XCircle,
  icons,
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { ServiceStatus } from '../types/status';

// -----------------
// ICON COMPONENT
// -----------------
// A centralized wrapper for lucide-react icons.
// It can render a status-specific icon or any other lucide icon by name.

// Map service statuses to specific icons
const statusIconMap: Record<ServiceStatus, React.FC<LucideProps>> = {
  operational: CheckCircle2,
  degraded_performance: AlertTriangle,
  partial_outage: AlertTriangle,
  major_outage: XCircle,
  under_maintenance: Wrench,
  unknown: HelpCircle,
};

type IconProps = Omit<LucideProps, 'color'> & {
  // Either a service status or a string name of a lucide icon
  name: ServiceStatus | keyof typeof icons;
  color?: string;
};

export const Icon: React.FC<IconProps> = ({ name, size = 16, color, className, ...props }) => {
  const { theme } = useTheme();

  // Determine which icon component to render
  const IconComponent = useMemo(() => {
    if (name in statusIconMap) {
      return statusIconMap[name as ServiceStatus];
    }
    if (name in icons) {
      // Dynamically select icon from lucide library
      const LucideIcon = icons[name as keyof typeof icons] as React.FC<LucideProps>;
      return LucideIcon;
    }
    // Fallback icon
    return HelpCircle;
  }, [name]);

  // Use color from props if provided, otherwise default to theme's text color
  const iconColor = color || theme.colors.textSecondary;

  return <IconComponent color={iconColor} size={size} className={className} {...props} />;
};
