import React from 'react';
import { RefreshCw, Settings } from 'lucide-react';
import StatusSummary from './StatusSummary';
import ControlPanel from './ControlPanel';
import { DesktopOnly, MobileOnly } from '../../Layout/ResponsiveWrapper';
import ResponsiveLayout from '../../Layout/ResponsiveLayout';
import { Service } from '../../../services/api';
import { Language, ViewMode, SortType } from '../../../types/ui';
import { useTranslation } from '../../../hooks/useTranslation';

interface DashboardHeaderProps {
  // 데이터
  services: Service[];
  isLoading: boolean;
  loadingCount: number;
  
  // 언어 및 뷰 모드
  language: Language;
  viewMode: ViewMode;
  
  // 정렬
  sortType: SortType;
  isSortDropdownOpen: boolean;
  
  // 언어 드롭다운
  isLanguageDropdownOpen: boolean;
  
  // 빠른 필터
  quickFilters: {
    showOnlyProblematic: boolean;
    showOnlyFavorites: boolean;
  };
  
  // 번역
  translations: {
    title: string;
    refresh: string;
    filter: string;
    operational: string;
    degradedPerformance: string;
    majorOutage: string;
    loading: string;
    categoryView: string;
    listView: string;
    sortDefault: string;
    sortNameAsc: string;
    sortNameDesc: string;
    showOnlyProblematic: string;
    showOnlyFavorites: string;
  };
  
  // 이벤트 핸들러
  onRefresh: () => void;
  onFilterOpen: () => void;
  onLanguageChange: (lang: Language) => void;
  onLanguageToggle: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (sort: SortType) => void;
  onSortToggle: () => void;
  onQuickFilterToggle: (filterType: 'showOnlyProblematic' | 'showOnlyFavorites') => void;
  onTitleClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  services,
  isLoading,
  loadingCount,
  language,
  viewMode,
  sortType,
  isSortDropdownOpen,
  isLanguageDropdownOpen,
  quickFilters,
  translations,
  onRefresh,
  onFilterOpen,
  onLanguageChange,
  onLanguageToggle,
  onViewModeChange,
  onSortChange,
  onSortToggle,
  onQuickFilterToggle,
  onTitleClick,
}) => {
  // 번역 훅 사용
  const { t: tA } = useTranslation('accessibility');

  // 전체 상태 통계 계산
  const getOverallStats = () => {
    const servicesWithStatus = services.map(service => ({
      ...service,
      status: calculateServiceStatus(service.components)
    }));
    
    const totalServices = servicesWithStatus.length;
    const operational = servicesWithStatus.filter(s => s.status === 'operational').length;
    const degraded = servicesWithStatus.filter(s => s.status === 'degraded').length;
    const outage = servicesWithStatus.filter(s => s.status === 'outage').length;
    
    return { totalServices, operational, degraded, outage };
  };

  // 임시 상태 계산 함수 (나중에 utils로 이동)
  const calculateServiceStatus = (components: any[]) => {
    if (!components || components.length === 0) return 'unknown';
    const statuses = components.map(comp => comp.status);
    if (statuses.some(status => status === 'outage' || status === 'major_outage')) return 'outage';
    if (statuses.some(status => status === 'degraded' || status === 'degraded_performance')) return 'degraded';
    if (statuses.every(status => status === 'operational')) return 'operational';
    return 'unknown';
  };

  const stats = getOverallStats();

  return (
    <header className="header-section">
      <ResponsiveLayout>
        {/* 데스크톱 헤더 레이아웃 */}
        <DesktopOnly>
          <div className="flex justify-between items-center py-4">
            {/* 좌측: 서비스 제목 */}
            <h1 
              className="desktop-title font-bold text-gradient cursor-pointer"
              onClick={onTitleClick}
              data-text={translations.title}
              title={tA('clickEffect')}
            >
              {translations.title}
            </h1>
            
            {/* 우측: 상태 표시 + 버튼들 */}
            <div className="flex items-center gap-4">
              <StatusSummary
                stats={stats}
                loadingCount={loadingCount}
                translations={translations}
              />
              
              <ControlPanel
                viewMode={viewMode}
                sortType={sortType}
                language={language}
                isSortDropdownOpen={isSortDropdownOpen}
                isLanguageDropdownOpen={isLanguageDropdownOpen}
                isLoading={isLoading}
                quickFilters={quickFilters}
                translations={translations}
                onRefresh={onRefresh}
                onFilterOpen={onFilterOpen}
                onLanguageChange={onLanguageChange}
                onLanguageToggle={onLanguageToggle}
                onViewModeChange={onViewModeChange}
                onSortChange={onSortChange}
                onSortToggle={onSortToggle}
                onQuickFilterToggle={onQuickFilterToggle}
              />
            </div>
          </div>
        </DesktopOnly>
        
        {/* 모바일 헤더 레이아웃 */}
        <MobileOnly>
          <div className="py-4">
            {/* 첫 번째 줄: 서비스 제목 | 모든 상태 통합 표시 */}
            <div className="flex justify-between items-center mb-3">
            <h1 
              className="text-2xl font-bold text-gradient cursor-pointer"
              onClick={onTitleClick}
              data-text={translations.title}
              title={tA('clickEffect')}
            >
              {translations.title}
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
          
          {/* 두 번째 줄: 뷰 모드 토글 | 필터 | 정렬 | 언어 | 새로고침 */}
          <div className="flex justify-between items-center">
            {/* 좌측: 뷰 모드 토글 */}
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('category')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'category' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                카테고리
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                목록
              </button>
            </div>
            
            {/* 우측: 버튼들 */}
            <div className="flex items-center gap-2">
              <button
                onClick={onFilterOpen}
                className="btn-secondary focus-ring flex items-center justify-center gap-1 hover-lift text-xs px-2 py-1"
                aria-label={tA('filterButton')}
              >
                <Settings className="w-3 h-3" />
                <span>{translations.filter}</span>
              </button>
              
              <ControlPanel
                viewMode={viewMode}
                sortType={sortType}
                language={language}
                isSortDropdownOpen={isSortDropdownOpen}
                isLanguageDropdownOpen={isLanguageDropdownOpen}
                isLoading={isLoading}
                quickFilters={quickFilters}
                translations={translations}
                onRefresh={onRefresh}
                onFilterOpen={onFilterOpen}
                onLanguageChange={onLanguageChange}
                onLanguageToggle={onLanguageToggle}
                onViewModeChange={onViewModeChange}
                onSortChange={onSortChange}
                onSortToggle={onSortToggle}
                onQuickFilterToggle={onQuickFilterToggle}
                isMobile={true}
              />
            </div>
          </div>
          </div>
        </MobileOnly>
      </ResponsiveLayout>
    </header>
  );
};

export default DashboardHeader;
