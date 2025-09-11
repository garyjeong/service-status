import React from 'react';
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export type SortType = 'default' | 'name-asc' | 'name-desc';

interface SortDropdownProps {
  sortType: SortType;
  isOpen: boolean;
  onToggle: () => void;
  onSortChange: (sortType: SortType) => void;
  translations: {
    sortDefault: string;
    sortNameAsc: string;
    sortNameDesc: string;
  };
  isMobile?: boolean;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  sortType,
  isOpen,
  onToggle,
  onSortChange,
  translations,
  isMobile = false
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

  const handleSortSelect = (newSortType: SortType) => {
    onSortChange(newSortType);
    onToggle(); // Close dropdown
  };

  return (
    <div className="relative sort-dropdown-container">
      <button
        onClick={onToggle}
        className={`btn-secondary focus-ring flex items-center justify-center gap-1 hover-lift ${
          isMobile ? 'text-xs px-2 py-1' : 'px-3 py-2'
        }`}
        aria-label="정렬 방식 선택"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {getSortIcon()}
        <ChevronDown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="sort-dropdown">
          <button
            onClick={() => handleSortSelect('default')}
            className={`sort-option ${sortType === 'default' ? 'active' : ''}`}
            role="option"
            aria-selected={sortType === 'default'}
          >
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              <span>{translations.sortDefault}</span>
            </div>
          </button>
          <button
            onClick={() => handleSortSelect('name-asc')}
            className={`sort-option ${sortType === 'name-asc' ? 'active' : ''}`}
            role="option"
            aria-selected={sortType === 'name-asc'}
          >
            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4" />
              <span>{translations.sortNameAsc}</span>
            </div>
          </button>
          <button
            onClick={() => handleSortSelect('name-desc')}
            className={`sort-option ${sortType === 'name-desc' ? 'active' : ''}`}
            role="option"
            aria-selected={sortType === 'name-desc'}
          >
            <div className="flex items-center gap-2">
              <ArrowDown className="w-4 h-4" />
              <span>{translations.sortNameDesc}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
