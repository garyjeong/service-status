// src/design-system/theme.ts
import { ServiceStatus } from '../types/status';

// -----------------
// STATUS COLORS
// -----------------
// A centralized system for status colors to ensure consistency.
// Each status has a main color for text/icons and a softer glow color for effects.

type StatusColor = {
  main: string;
  glow: string;
  background: string;
};

export const statusColors: Record<ServiceStatus, StatusColor> = {
  operational: {
    main: 'hsl(145, 63%, 42%)', // Green
    glow: 'hsla(145, 63%, 42%, 0.4)',
    background: 'hsla(145, 63%, 42%, 0.1)',
  },
  degraded_performance: {
    main: 'hsl(38, 92%, 50%)', // Amber
    glow: 'hsla(38, 92%, 50%, 0.4)',
    background: 'hsla(38, 92%, 50%, 0.1)',
  },
  partial_outage: {
    main: 'hsl(28, 80%, 52%)', // Orange
    glow: 'hsla(28, 80%, 52%, 0.4)',
    background: 'hsla(28, 80%, 52%, 0.1)',
  },
  major_outage: {
    main: 'hsl(354, 70%, 54%)', // Red
    glow: 'hsla(354, 70%, 54%, 0.5)',
    background: 'hsla(354, 70%, 54%, 0.15)',
  },
  under_maintenance: {
    main: 'hsl(210, 90%, 50%)', // Blue
    glow: 'hsla(210, 90%, 50%, 0.4)',
    background: 'hsla(210, 90%, 50%, 0.1)',
  },
  unknown: {
    main: 'hsl(220, 10%, 55%)', // Gray
    glow: 'hsla(220, 10%, 55%, 0.3)',
    background: 'hsla(220, 10%, 55%, 0.1)',
  },
};

// -----------------
// THEME PALETTES
// -----------------
// Defines color palettes for different themes (light, dark, etc.)

export type Theme = {
  name: 'light' | 'dark';
  colors: {
    background: string;
    card: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentForeground: string;
  };
};

export const themes = {
  light: {
    name: 'light',
    colors: {
      background: 'hsl(220, 20%, 97%)',
      card: 'hsla(220, 25%, 100%, 0.5)',
      cardBorder: 'hsla(220, 20%, 85%, 0.5)',
      textPrimary: 'hsl(220, 20%, 15%)',
      textSecondary: 'hsl(220, 15%, 45%)',
      accent: 'hsl(220, 90%, 55%)',
      accentForeground: 'hsl(0, 0%, 100%)',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      background: 'hsl(220, 20%, 5%)',
      card: 'hsla(220, 15%, 15%, 0.5)',
      cardBorder: 'hsla(220, 10%, 30%, 0.5)',
      textPrimary: 'hsl(220, 20%, 95%)',
      textSecondary: 'hsl(220, 15%, 65%)',
      accent: 'hsl(220, 90%, 65%)',
      accentForeground: 'hsl(220, 20%, 10%)',
    },
  },
};

// Utility function to get a specific theme by name
export const getTheme = (name: 'light' | 'dark'): Theme => themes[name];
