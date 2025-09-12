import React from 'react';
import { RefreshCw, Settings, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle, Heart } from 'lucide-react';
import ViewModeToggle from '../../ViewModeToggle';
import LanguageSelector from '../../LanguageSelector';
import SortDropdown from '../../SortDropdown';
import { Language, ViewMode, SortType } from '../../../types/ui';

interface ControlPanelProps {
  viewMode: ViewMode;
  sortType: SortType;
  language: Language;
  isSortDropdownOpen: boolean;
  isLanguageDropdownOpen: boolean;
  isLoading: boolean;
  isMobile?: boolean;
  
  // 빠른 필터 상태
  quickFilters: {
    showOnlyProblematic: boolean;
    showOnlyFavorites: boolean;
  };
  
  translations: {
    refresh: string;
    filter: string;
    categoryView: string;
    listView: string;
    sortDefault: string;
    sortNameAsc: string;
    sortNameDesc: string;
    showOnlyProblematic: string;
    showOnlyFavorites: string;
  };
  
  onRefresh: () => void;
  onFilterOpen: () => void;
  onLanguageChange: (lang: Language) => void;
  onLanguageToggle: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (sort: SortType) => void;
  onSortToggle: () => void;
  onQuickFilterToggle: (filterType: 'showOnlyProblematic' | 'showOnlyFavorites') => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  viewMode,
  sortType,
  language,
  isSortDropdownOpen,
  isLanguageDropdownOpen,
  isLoading,
  isMobile = false,
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
}) => {
  const getSortIcon = () => {
    switch (sortType) {
      case 'name-asc':
        return <ArrowUp className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />;
      case 'name-desc':
        return <ArrowDown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />;
      default:
        return <ArrowUpDown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />;
    }
  };

  if (isMobile) {
    return (
      <>
        {/* 정렬 버튼 - 모바일 */}
        <div className="relative sort-dropdown-container">
          <button
            onClick={onSortToggle}
            className="btn-secondary focus-ring flex items-center justify-center gap-1 hover-lift text-xs px-2 py-1"
          >
            {getSortIcon()}
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {isSortDropdownOpen && (
            <div className="sort-dropdown">
              <button
                onClick={() => onSortChange('default')}
                className={`sort-option ${sortType === 'default' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  <span>{translations.sortDefault}</span>
                </div>
              </button>
              <button
                onClick={() => onSortChange('name-asc')}
                className={`sort-option ${sortType === 'name-asc' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4" />
                  <span>{translations.sortNameAsc}</span>
                </div>
              </button>
              <button
                onClick={() => onSortChange('name-desc')}
                className={`sort-option ${sortType === 'name-desc' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-4 h-4" />
                  <span>{translations.sortNameDesc}</span>
                </div>
              </button>
            </div>
          )}
        </div>
        
        {/* 언어변경 버튼 */}
        <div className="relative language-dropdown">
          <button
            onClick={onLanguageToggle}
            className="btn-secondary focus-ring flex items-center justify-center gap-1 hover-lift text-xs px-2 py-1"
          >
            {language === 'ko' ? (
              <span className="text-sm">🇰🇷</span>
            ) : (
              <span className="text-sm">🇺🇸</span>
            )}
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {isLanguageDropdownOpen && (
            <div className="sort-dropdown">
              <button
                onClick={() => {
                  onLanguageChange('ko');
                  onLanguageToggle();
                }}
                className={`sort-option ${language === 'ko' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇰🇷</span>
                  <span>한국어</span>
                </div>
              </button>
              <button
                onClick={() => {
                  onLanguageChange('en');
                  onLanguageToggle();
                }}
                className={`sort-option ${language === 'en' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  <span>English</span>
                </div>
              </button>
            </div>
          )}
        </div>
        
        {/* 빠른 필터 버튼들 - 모바일 */}
        <button
          onClick={() => onQuickFilterToggle('showOnlyProblematic')}
          className={`btn-icon focus-ring hover-lift ${
            quickFilters.showOnlyProblematic ? 'bg-red-500/20 border-red-500/40 text-red-300' : ''
          }`}
          title={translations.showOnlyProblematic}
        >
          <AlertTriangle className="w-4 h-4" />
        </button>

        <button
          onClick={() => onQuickFilterToggle('showOnlyFavorites')}
          className={`btn-icon focus-ring hover-lift ${
            quickFilters.showOnlyFavorites ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' : ''
          }`}
          title={translations.showOnlyFavorites}
        >
          <Heart className="w-4 h-4" />
        </button>
        
        {/* 새로고침 버튼 */}
        <button
          onClick={onRefresh}
          className="btn-icon focus-ring hover-lift"
          aria-label={translations.refresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </>
    );
  }

  return (
    <>
      {/* 뷰 모드 토글 버튼 */}
      <ViewModeToggle
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        translations={{
          category: translations.categoryView,
          list: translations.listView
        }}
      />
      
      {/* 새로고침 버튼 */}
      <button
        onClick={onRefresh}
        className="btn-icon focus-ring hover-lift"
        aria-label={translations.refresh}
        disabled={isLoading}
      >
        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
      </button>

      {/* 빠른 필터 버튼들 */}
      <button
        onClick={() => onQuickFilterToggle('showOnlyProblematic')}
        className={`btn-secondary focus-ring flex items-center justify-center gap-2 hover-lift ${
          quickFilters.showOnlyProblematic ? 'bg-red-500/20 border-red-500/40 text-red-300' : ''
        }`}
        title={translations.showOnlyProblematic}
      >
        <AlertTriangle className="w-4 h-4" />
        <span className="hidden xl:inline">{translations.showOnlyProblematic}</span>
      </button>

      <button
        onClick={() => onQuickFilterToggle('showOnlyFavorites')}
        className={`btn-secondary focus-ring flex items-center justify-center gap-2 hover-lift ${
          quickFilters.showOnlyFavorites ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' : ''
        }`}
        title={translations.showOnlyFavorites}
      >
        <Heart className="w-4 h-4" />
        <span className="hidden xl:inline">{translations.showOnlyFavorites}</span>
      </button>

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
        onToggle={onSortToggle}
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
        onToggle={onLanguageToggle}
        onLanguageChange={onLanguageChange}
      />
    </>
  );
};

export default ControlPanel;
