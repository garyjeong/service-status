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
        {language === 'ko' ? (
          <span className="text-sm">🇰🇷</span>
        ) : (
          <span className="text-sm">🇺🇸</span>
        )}
        <ChevronDown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 min-w-32">
          <div className="py-1" role="listbox">
            <button
              onClick={() => handleLanguageSelect('ko')}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2 ${
                language === 'ko' ? 'bg-accent' : ''
              }`}
              role="option"
              aria-selected={language === 'ko'}
            >
              <span>🇰🇷</span>
              <span>한국어</span>
            </button>
            <button
              onClick={() => handleLanguageSelect('en')}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2 ${
                language === 'en' ? 'bg-accent' : ''
              }`}
              role="option"
              aria-selected={language === 'en'}
            >
              <span>🇺🇸</span>
              <span>English</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
