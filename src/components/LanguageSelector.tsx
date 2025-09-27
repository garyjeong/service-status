import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  language: 'ko' | 'en';
  isOpen: boolean;
  onToggle: () => void;
  onLanguageChange: (lang: 'ko' | 'en') => void;
  isMobile?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  isOpen,
  onToggle,
  onLanguageChange,
  isMobile = false
}) => {
  const handleLanguageSelect = (lang: 'ko' | 'en') => {
    onLanguageChange(lang);
    onToggle(); // Close dropdown
  };

  return (
    <div className="relative language-dropdown">
      <button
        onClick={onToggle}
        className={`btn-secondary focus-ring flex items-center justify-center gap-1 hover-lift ${
          isMobile ? 'text-xs px-2 py-1' : 'px-3 py-2'
        }`}
        aria-label="언어 선택"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {!isMobile && <Globe className="w-4 h-4" />}
        <ChevronDown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="sort-dropdown">
          <button
            onClick={() => handleLanguageSelect('ko')}
            className={`sort-option ${language === 'ko' ? 'active' : ''}`}
            role="option"
            aria-selected={language === 'ko'}
          >
            <div className="flex items-center gap-2">
              <span>한국어</span>
            </div>
          </button>
          <button
            onClick={() => handleLanguageSelect('en')}
            className={`sort-option ${language === 'en' ? 'active' : ''}`}
            role="option"
            aria-selected={language === 'en'}
          >
            <div className="flex items-center gap-2">
              <span>English</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
