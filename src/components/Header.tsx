import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Settings, Sun, Moon, Bell, BellOff } from 'lucide-react';
import StatusBadge from './StatusBadge';
import LanguageSelector from './LanguageSelector';
import SortDropdown from './SortDropdown';
import type { Language, SortType } from '../types/ui';

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
  title,
  language,
  isAnyLoading,
  loadingCount,
  stats,
  sortType,
  isSortDropdownOpen,
  isLanguageDropdownOpen,
  statusFilter,
  theme,
  onRefresh,
  onFilterOpen,
  onSortChange,
  onSortDropdownToggle,
  onLanguageChange,
  onLanguageDropdownToggle,
  onTitleClick,
  onStatusFilter,
  onThemeToggle,
  notificationsEnabled = false,
  onToggleNotifications,
  translations
}) => {
  // 🔥 빌게이츠 요청: 진행률 계산 제거 (더 이상 사용하지 않음)

  return (
    <header className="header-premium header-section sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* 데스크톱 헤더 레이아웃 - 2단계 GNB */}
        <div className="hidden md:block">
          {/* 1단계 최상위 GNB: 타이틀과 상태 통계 */}
          <div className="gnb-primary flex justify-between items-center py-3 border-b border-border/50">
            {/* 좌측: 서비스 제목 */}
            <h1 
              className="desktop-title"
            >
              {title}
            </h1>
            
            {/* 우측: 상태 통계 */}
            <div className="flex items-center gap-3 text-sm">
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
                onClick={() => onStatusFilter('degraded_performance')}
                isSelected={statusFilter === 'degraded_performance'}
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
                onClick={() => onStatusFilter('major_outage')}
                isSelected={statusFilter === 'major_outage'}
                translations={{
                  operational: translations.operational,
                  degraded: translations.degradedPerformance,
                  outage: translations.majorOutage,
                  loading: translations.loading
                }}
              />
            </div>
          </div>
          
          {/* 2단계 기능 영역: 필터, 정렬, 언어, 알림, 테마, 새로고침 */}
          <div className="gnb-secondary flex justify-end items-center gap-3 py-2">
            {/* 필터 버튼 */}
            <button
              onClick={onFilterOpen}
              className="btn-secondary focus-ring flex items-center justify-center gap-2 hover-lift"
            >
              <Settings className="w-4 h-4" />
              <span>{translations.filter}</span>
            </button>
            
            {/* 정렬 버튼 */}
            <SortDropdown
              sortType={sortType}
              isOpen={isSortDropdownOpen}
              onToggle={onSortDropdownToggle}
              onSortChange={onSortChange}
              translations={{
                sortDefault: translations.sortDefault,
                sortNameAsc: translations.sortNameAsc,
                sortNameDesc: translations.sortNameDesc
              }}
            />

            {/* 언어 선택 드롭다운 */}
            <LanguageSelector
              language={language}
              isOpen={isLanguageDropdownOpen}
              onToggle={onLanguageDropdownToggle}
              onLanguageChange={onLanguageChange}
            />

            {/* 알림 토글 버튼 */}
            {onToggleNotifications && (
              <motion.button
                onClick={onToggleNotifications}
                className={`btn-icon focus-ring hover-lift ${notificationsEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
                title={notificationsEnabled ? (language === 'ko' ? '알림 끄기' : 'Disable notifications') : (language === 'ko' ? '알림 켜기' : 'Enable notifications')}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
              >
                {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </motion.button>
            )}

            {/* 테마 토글 버튼 */}
            <motion.button
              onClick={onThemeToggle}
              className="btn-icon focus-ring hover-lift"
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.button>

            {/* 새로고침 버튼 */}
            <motion.button
              onClick={onRefresh}
              className="btn-icon focus-ring hover-lift"
              aria-label={translations.refresh}
              disabled={isAnyLoading}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
              animate={isAnyLoading ? {
                rotate: [0, 10, -10, 0],
                transition: {
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              } : {}}
            >
              <motion.div
                animate={isAnyLoading ? {
                  rotate: 360,
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }
                } : {}}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>
        </div>
        
        {/* 모바일 헤더 레이아웃 - 2단계 GNB */}
        <div className="md:hidden">
          {/* 1단계 최상위 GNB: 타이틀과 상태 통계 */}
          <div className="gnb-primary flex justify-between items-center py-3 border-b border-border/50">
            <h1 
              className="desktop-title text-base"
            >
              {title}
            </h1>
            
            {/* 상태 요약 카드 - 모바일 컴팩트 버전 */}
            <div className="flex items-center gap-1 text-sm">
              {loadingCount > 0 && (
                <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                  <span className="text-blue-400 font-medium text-xs">{loadingCount}</span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium text-xs">{stats.operational}</span>
              </div>
              {stats.degraded > 0 && (
                <button 
                  className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20 cursor-pointer hover:scale-105 hover:bg-yellow-500/20 transition-all duration-200 active:scale-95"
                  onClick={() => onStatusFilter('degraded_performance')}
                  style={{
                    backgroundColor: statusFilter === 'degraded_performance' ? 'rgba(234, 179, 8, 0.3)' : undefined,
                    borderColor: statusFilter === 'degraded_performance' ? 'rgba(234, 179, 8, 0.5)' : undefined
                  }}
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 font-medium text-xs">{stats.degraded}</span>
                </button>
              )}
              {stats.outage > 0 && (
                <button 
                  className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20 cursor-pointer hover:scale-105 hover:bg-red-500/20 transition-all duration-200 active:scale-95"
                  onClick={() => onStatusFilter('major_outage')}
                  style={{
                    backgroundColor: statusFilter === 'major_outage' ? 'rgba(239, 68, 68, 0.3)' : undefined,
                    borderColor: statusFilter === 'major_outage' ? 'rgba(239, 68, 68, 0.5)' : undefined
                  }}
                >
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-medium text-xs">{stats.outage}</span>
                </button>
              )}
            </div>
          </div>
          
          {/* 2단계 기능 영역: 필터, 정렬, 언어, 알림, 테마, 새로고침 */}
          <div className="gnb-secondary flex justify-center items-center gap-2 py-2">
            <button
              onClick={onFilterOpen}
              className="btn-secondary focus-ring flex items-center justify-center gap-1 hover-lift text-xs px-2 py-1"
            >
              <Settings className="w-3 h-3" />
              <span>{translations.filter}</span>
            </button>
            
            {/* 정렬 버튼 - 모바일 */}
            <SortDropdown
              sortType={sortType}
              isOpen={isSortDropdownOpen}
              onToggle={onSortDropdownToggle}
              onSortChange={onSortChange}
              translations={{
                sortDefault: translations.sortDefault,
                sortNameAsc: translations.sortNameAsc,
                sortNameDesc: translations.sortNameDesc
              }}
              isMobile={true}
            />
            
            {/* 언어변경 버튼 */}
            <LanguageSelector
              language={language}
              isOpen={isLanguageDropdownOpen}
              onToggle={onLanguageDropdownToggle}
              onLanguageChange={onLanguageChange}
              isMobile={true}
            />
            
            {/* 알림 토글 버튼 - 모바일 */}
            {onToggleNotifications && (
              <button
                onClick={onToggleNotifications}
                className={`btn-icon focus-ring hover-lift ${notificationsEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
                title={notificationsEnabled ? (language === 'ko' ? '알림 끄기' : 'Disable notifications') : (language === 'ko' ? '알림 켜기' : 'Enable notifications')}
              >
                {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </button>
            )}

            {/* 테마 토글 버튼 - 모바일 */}
            <button
              onClick={onThemeToggle}
              className="btn-icon focus-ring hover-lift"
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* 새로고침 버튼 */}
            <button
              onClick={onRefresh}
              className="btn-icon focus-ring hover-lift"
              aria-label={translations.refresh}
              disabled={isAnyLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isAnyLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
