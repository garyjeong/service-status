import React from 'react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import LanguageSelector from './LanguageSelector';
import SortDropdown from './SortDropdown';
import type { Language, SortType } from '../types/ui';
import { Button } from '../design-system/Button';
import { Icon } from '../design-system/Icon';
import { StatusType } from '../types/status';

interface HeaderProps {
  title: string;
  language: Language;
  isAnyLoading: boolean;
  loadingCount: number;
  stats: {
    operational: number;
    degraded: number;
    outage: number;
  };
  sortType: SortType;
  isSortDropdownOpen: boolean;
  isLanguageDropdownOpen: boolean;
  statusFilter: 'degraded_performance' | 'major_outage' | null;
  theme: 'light' | 'dark';
  onRefresh: () => void;
  onFilterOpen: () => void;
  onSortChange: (sortType: SortType) => void;
  onSortDropdownToggle: () => void;
  onLanguageChange: (language: Language) => void;
  onLanguageDropdownToggle: () => void;
  onTitleClick: () => void;
  onStatusFilter: (status: 'degraded_performance' | 'major_outage') => void;
  onThemeToggle: () => void;
  notificationsEnabled?: boolean;
  onToggleNotifications?: () => void;
  translations: {
    refresh: string;
    filter: string;
    operational: string;
    degradedPerformance: string;
    majorOutage: string;
    loading: string;
    sortDefault: string;
    sortNameAsc: string;
    sortNameDesc: string;
  };
}

const Header: React.FC<HeaderProps> = ({
  title, language, isAnyLoading, loadingCount, stats, sortType, isSortDropdownOpen,
  isLanguageDropdownOpen, statusFilter, theme, onRefresh, onFilterOpen, onSortChange,
  onSortDropdownToggle, onLanguageChange, onLanguageDropdownToggle, onTitleClick,
  onStatusFilter, onThemeToggle, notificationsEnabled = false, onToggleNotifications, translations
}) => {
  return (
    <header className="header-premium header-section sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center py-4">
          <h1 className="desktop-title">{title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <StatusBadge status={StatusType.UNKNOWN} count={loadingCount} isLoading={loadingCount > 0} />
              <StatusBadge status={StatusType.OPERATIONAL} count={stats.operational} />
              <StatusBadge
                status={StatusType.DEGRADED_PERFORMANCE}
                count={stats.degraded}
                onClick={() => onStatusFilter('degraded_performance')}
                isSelected={statusFilter === 'degraded_performance'}
              />
              <StatusBadge
                status={StatusType.MAJOR_OUTAGE}
                count={stats.outage}
                onClick={() => onStatusFilter('major_outage')}
                isSelected={statusFilter === 'major_outage'}
              />
            </div>
            
            <Button variant="secondary" onClick={onFilterOpen}>
              <Icon name="Settings" size={16} className="mr-2" />
              <span>{translations.filter}</span>
            </Button>
            
            <SortDropdown
              sortType={sortType} isOpen={isSortDropdownOpen} onToggle={onSortDropdownToggle}
              onSortChange={onSortChange} translations={{ sortDefault: translations.sortDefault, sortNameAsc: translations.sortNameAsc, sortNameDesc: translations.sortNameDesc }}
            />
            <LanguageSelector
              language={language} isOpen={isLanguageDropdownOpen} onToggle={onLanguageDropdownToggle}
              onLanguageChange={onLanguageChange}
            />

            {onToggleNotifications && (
              <Button
                variant="ghost" size="icon" onClick={onToggleNotifications}
                aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
                title={notificationsEnabled ? (language === 'ko' ? '알림 끄기' : 'Disable notifications') : (language === 'ko' ? '알림 켜기' : 'Enable notifications')}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              >
                <Icon name={notificationsEnabled ? 'Bell' : 'BellOff'} size={20} />
              </Button>
            )}

            <Button
              variant="ghost" size="icon" onClick={onThemeToggle}
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            >
              <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={20} />
            </Button>

            <Button
              variant="ghost" size="icon" onClick={onRefresh} aria-label={translations.refresh}
              isLoading={isAnyLoading} disabled={isAnyLoading}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            >
              {!isAnyLoading && <Icon name="RefreshCw" size={20} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="md:hidden py-4">
          <div className="flex justify-between items-center mb-3">
            <h1 className="desktop-title">{title}</h1>
            <div className="flex items-center gap-1 text-sm">
              {loadingCount > 0 && <StatusBadge status={StatusType.UNKNOWN} count={loadingCount} isLoading={true} />}
              <StatusBadge status={StatusType.OPERATIONAL} count={stats.operational} />
              {stats.degraded > 0 && <StatusBadge status={StatusType.DEGRADED_PERFORMANCE} count={stats.degraded} onClick={() => onStatusFilter('degraded_performance')} isSelected={statusFilter === 'degraded_performance'} />}
              {stats.outage > 0 && <StatusBadge status={StatusType.MAJOR_OUTAGE} count={stats.outage} onClick={() => onStatusFilter('major_outage')} isSelected={statusFilter === 'major_outage'} />}
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={onFilterOpen}>
                <Icon name="Settings" size={12} className="mr-1" />
                <span>{translations.filter}</span>
              </Button>
              <SortDropdown sortType={sortType} isOpen={isSortDropdownOpen} onToggle={onSortDropdownToggle} onSortChange={onSortChange} translations={{ sortDefault: translations.sortDefault, sortNameAsc: translations.sortNameAsc, sortNameDesc: translations.sortNameDesc }} isMobile={true} />
              <LanguageSelector language={language} isOpen={isLanguageDropdownOpen} onToggle={onLanguageDropdownToggle} onLanguageChange={onLanguageChange} isMobile={true} />
              {onToggleNotifications && (
                <Button variant="ghost" size="icon" onClick={onToggleNotifications}>
                  <Icon name={notificationsEnabled ? 'Bell' : 'BellOff'} size={16} />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onThemeToggle}>
                <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={onRefresh} isLoading={isAnyLoading} disabled={isAnyLoading}>
                {!isAnyLoading && <Icon name="RefreshCw" size={16} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
