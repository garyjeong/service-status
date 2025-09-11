import React from 'react';

export type ViewMode = 'category' | 'list';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  translations: {
    category: string;
    list: string;
  };
  isMobile?: boolean;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  translations,
  isMobile = false
}) => {
  return (
    <div className={`flex items-center gap-1 bg-card border border-border rounded-lg p-1 ${
      isMobile ? 'text-xs' : ''
    }`}>
      <button
        onClick={() => onViewModeChange('category')}
        className={`px-2 py-1 rounded ${isMobile ? 'text-xs' : 'text-sm'} font-medium transition-colors ${
          viewMode === 'category' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-pressed={viewMode === 'category'}
        aria-label="카테고리 뷰로 전환"
      >
        {translations.category}
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`px-2 py-1 rounded ${isMobile ? 'text-xs' : 'text-sm'} font-medium transition-colors ${
          viewMode === 'list' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-pressed={viewMode === 'list'}
        aria-label="목록 뷰로 전환"
      >
        {translations.list}
      </button>
    </div>
  );
};

export default ViewModeToggle;
