import React from 'react';
import { ChevronDown } from 'lucide-react';
import ServiceGrid from './ServiceGrid';
import { Service } from '../../../services/api';
import { Language, ServiceExpansion } from '../../../types/ui';
import { SERVICE_CATEGORIES } from '../../../types/categories';

interface CategoryViewProps {
  categorizedServices: { [categoryName: string]: Service[] };
  expandedCategories: Set<string>;
  expandedServices: ServiceExpansion;
  serviceLoadingStates: { [serviceName: string]: boolean };
  language: Language;
  isAnimating: boolean;
  
  translations: {
    statusPage: string;
    refreshService: string;
  };
  
  onToggleCategoryExpansion: (categoryName: string) => void;
  onToggleServiceExpansion: (serviceName: string) => void;
  onRefreshService: (serviceName: string) => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({
  categorizedServices,
  expandedCategories,
  expandedServices,
  serviceLoadingStates,
  language,
  isAnimating,
  translations,
  onToggleCategoryExpansion,
  onToggleServiceExpansion,
  onRefreshService,
}) => {
  return (
    <div className="space-y-6">
      {Object.entries(categorizedServices).map(([categoryName, categoryServices]) => (
        <div key={categoryName} className="category-section">
          {/* 카테고리 헤더 */}
          <div 
            className="category-header cursor-pointer"
            onClick={() => onToggleCategoryExpansion(categoryName)}
          >
            <div className="flex items-center gap-3">
              <div className="category-icon">
                {SERVICE_CATEGORIES.find(cat => cat.id === categoryName)?.icon || '📁'}
              </div>
              <h3 className="category-title">
                {SERVICE_CATEGORIES.find(cat => cat.id === categoryName)?.name || categoryName}
              </h3>
              <div className="category-count">
                {categoryServices.length}개
              </div>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transition-transform duration-300 ${
                expandedCategories.has(categoryName) ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* 카테고리 서비스 목록 */}
          {expandedCategories.has(categoryName) && (
            <div className="mt-4">
              <ServiceGrid
                services={categoryServices}
                expandedServices={expandedServices}
                serviceLoadingStates={serviceLoadingStates}
                language={language}
                isAnimating={isAnimating}
                translations={translations}
                onToggleExpansion={onToggleServiceExpansion}
                onRefreshService={onRefreshService}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryView;
