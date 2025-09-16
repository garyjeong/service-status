import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Settings } from 'lucide-react';
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
  onRefresh: () => void;
  onFilterOpen: () => void;
  onSortChange: (sortType: SortType) => void;
  onSortDropdownToggle: () => void;
  onLanguageChange: (language: Language) => void;
  onLanguageDropdownToggle: () => void;
  onTitleClick: () => void;
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
  onRefresh,
  onFilterOpen,
  onSortChange,
  onSortDropdownToggle,
  onLanguageChange,
  onLanguageDropdownToggle,
  onTitleClick,
  translations
}) => {
  // 진행률 계산
  const totalServices = stats.operational + stats.degraded + stats.outage;
  const operationalPercentage = totalServices > 0 ? (stats.operational / totalServices) * 100 : 100;

  return (
    <header className="header-premium sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* 데스크톱 헤더 레이아웃 */}
        <div className="hidden md:flex justify-between items-center py-4">
          {/* 좌측: 서비스 제목 */}
          <h1 
            className="desktop-title font-bold text-gradient cursor-pointer"
            onClick={onTitleClick}
            data-text={title}
            title="클릭하여 특별한 효과 보기!"
          >
            {title}
          </h1>
          
          {/* 우측: 상태 표시 + 버튼들 */}
          <div className="flex items-center gap-4">
            {/* 프리미엄 상태 인디케이터 */}
            <div className="flex items-center gap-4">
              {/* 진행률 링 차트 */}
              <motion.div 
                className="progress-ring-container" 
                title={`${operationalPercentage.toFixed(1)}% 정상 운영`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: {
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.svg 
                  className="progress-ring" 
                  width="48" 
                  height="48"
                  animate={isAnyLoading ? {
                    rotate: 360,
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  } : {}}
                >
                  <circle
                    className="progress-ring-background"
                    cx="24"
                    cy="24"
                    r="20"
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="4"
                  />
                  <motion.circle
                    className="progress-ring-progress"
                    cx="24"
                    cy="24"
                    r="20"
                    fill="transparent"
                    stroke="var(--mint-primary)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 20}`,
                      transform: 'rotate(-90deg)',
                      transformOrigin: '24px 24px'
                    }}
                    initial={{
                      strokeDashoffset: `${2 * Math.PI * 20}`
                    }}
                    animate={{
                      strokeDashoffset: `${2 * Math.PI * 20 * (1 - operationalPercentage / 100)}`,
                      transition: {
                        duration: 1.2,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: 0.3
                      }
                    }}
                  />
                  <motion.text
                    x="24"
                    y="28"
                    textAnchor="middle"
                    className="progress-ring-text"
                    fill="var(--mint-primary)"
                    fontSize="10"
                    fontWeight="600"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: {
                        duration: 0.6,
                        delay: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }
                    }}
                  >
                    {Math.round(operationalPercentage)}%
                  </motion.text>
                </motion.svg>
                <AnimatePresence>
                  {isAnyLoading && (
                    <motion.div 
                      className="progress-ring-pulse"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.2, 1], 
                        opacity: [0.6, 0.2, 0.6],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* 상태 배지들 */}
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
            </div>
            
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
          </div>
        </div>
        
        {/* 모바일 헤더 레이아웃 */}
        <div className="md:hidden py-4">
          {/* 첫 번째 줄: 서비스 제목 | 모든 상태 통합 표시 */}
          <div className="flex justify-between items-center mb-3">
            <h1 
              className="text-2xl font-bold text-gradient cursor-pointer"
              onClick={onTitleClick}
              data-text={title}
              title="클릭하여 특별한 효과 보기!"
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
                <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 font-medium text-xs">{stats.degraded}</span>
                </div>
              )}
              {stats.outage > 0 && (
                <div className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-medium text-xs">{stats.outage}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* 두 번째 줄: 필터 | 정렬 | 언어 | 새로고침 */}
          <div className="flex justify-center items-center">
            {/* 컨트롤 버튼들 */}
            <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
};

export default Header;
