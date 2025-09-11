import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { serviceFetchers, serviceNames } from '../../services/api';
import { groupServicesByCategory } from '../../types/categories';
import { useTranslation } from '../../hooks/useTranslation';
import DashboardHeader from './Header/DashboardHeader';
import FavoriteSection from './Content/FavoriteSection';
import CategoryView from './Content/CategoryView';
import ServiceGrid from './Content/ServiceGrid';
import FilterModal from './Modals/FilterModal';
import AdFitBanner from '../AdFitBanner';


const Dashboard: React.FC = () => {
  // 번역 훅 사용
  const { t } = useTranslation('dashboard');
  const { t: tA } = useTranslation('accessibility');

  // Zustand 스토어에서 상태와 액션들 가져오기
  const {
    // 전역 설정
    language,
    viewMode,
    sortType,
    
    // 필터 및 즐겨찾기
    filters,
    favorites,
    
    // 서비스 데이터
    services,
    serviceLoadingStates,
    expandedServices,
    expandedCategories,
    
    // UI 상태
    isFilterOpen,
    filterExpandedServices,
    isLanguageDropdownOpen,
    isSortDropdownOpen,
    isAnimating,
    error,
    lastUpdate,
    
    // 액션들
    setLanguage,
    setViewMode,
    setSortType,
    
    // 필터 관련
    toggleComponentFilter,
    toggleAllComponentsForService,
    toggleAllServices,
    setFilterOpen,
    toggleFilterServiceExpansion,
    
    // 즐겨찾기 관련
    toggleFavorite,
    
    // 서비스 관련
    setServices,
    setServiceLoading,
    toggleServiceExpansion,
    toggleCategoryExpansion,
    
    // UI 상태
    setLanguageDropdownOpen,
    setSortDropdownOpen,
    setAnimating,
    setError,
    setLastUpdate,
    
    // 유틸리티 함수들
    getFilteredServices,
    getServiceSelectionState,
    getMasterSelectionState,
    getFavoriteComponents,
    getOverallStats,
  } = useDashboardStore();

  // 로컬 상태
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);


  // 개별 서비스 로딩 함수
  const loadServiceData = async (serviceName: keyof typeof serviceFetchers, isInitialLoad = false) => {
    try {
      setServiceLoading(serviceName as string, true);
      
      const serviceData = await serviceFetchers[serviceName]();
      
      // 서비스 데이터 업데이트
      const currentServices = useDashboardStore.getState().services;
      const newServices = [...currentServices];
      const existingIndex = newServices.findIndex(s => s.service_name === serviceName);
      
      if (existingIndex >= 0) {
        newServices[existingIndex] = serviceData;
      } else {
        newServices.push(serviceData);
      }
      
      // 정렬
      const sortedServices = newServices.sort((a, b) => {
        const order = ['openai', 'anthropic', 'cursor', 'googleai', 'github', 'netlify', 'dockerhub', 'aws', 'slack', 'firebase', 'supabase', 'perplexity', 'v0', 'replit', 'xai', 'heroku', 'atlassian', 'circleci', 'auth0', 'sendgrid', 'cloudflare', 'datadog', 'groq', 'deepseek'];
        return order.indexOf(a.service_name) - order.indexOf(b.service_name);
      });
      
      setServices(sortedServices);
      
      // 초기 로드일 때 필터와 즐겨찾기 초기화
      if (isInitialLoad) {
        initializeServiceFiltersAndFavorites(serviceData);
      }
      
    } catch (err) {
      console.error(`${String(serviceName)} 상태 데이터 로드 실패:`, err);
      setError(`${String(serviceName)} 서비스 로드 실패`);
    } finally {
      setServiceLoading(serviceName as string, false);
    }
  };

  // 서비스 필터와 즐겨찾기 초기화
  const initializeServiceFiltersAndFavorites = (serviceData: any) => {
    const currentFilters = useDashboardStore.getState().filters;
    const currentFavorites = useDashboardStore.getState().favorites;
    
    // 필터 초기화
    if (!currentFilters[serviceData.service_name]) {
      const newServiceFilter: { [key: string]: boolean } = {};
      serviceData.components.forEach((component: any) => {
        newServiceFilter[component.name] = true;
      });
      
      useDashboardStore.setState(state => ({
        filters: {
          ...state.filters,
          [serviceData.service_name]: newServiceFilter
        }
      }));
    }
    
    // 즐겨찾기 초기화
    if (!currentFavorites[serviceData.service_name]) {
      const newServiceFavorites: { [key: string]: boolean } = {};
      serviceData.components.forEach((component: any) => {
        newServiceFavorites[component.name] = false;
      });
      
      useDashboardStore.setState(state => ({
        favorites: {
          ...state.favorites,
          [serviceData.service_name]: newServiceFavorites
        }
      }));
    }
  };

  // 모든 서비스 로딩 함수
  const loadAllServicesData = async (isInitialLoad = false) => {
    setLastUpdate(new Date());
    
    const loadPromises = serviceNames.map((serviceName: keyof typeof serviceFetchers) => 
      loadServiceData(serviceName, isInitialLoad)
    );
    await Promise.allSettled(loadPromises);
  };

  // 필터링된 서비스만 새로고침
  const refreshFilteredServices = async () => {
    const filteredServices = getFilteredServices();
    const serviceNamesToRefresh = filteredServices.map(s => s.service_name as keyof typeof serviceFetchers);
    
    setLastUpdate(new Date());
    
    const loadPromises = serviceNamesToRefresh.map((serviceName) => 
      loadServiceData(serviceName, false)
    );
    await Promise.allSettled(loadPromises);
  };

  // 정렬된 서비스 가져오기 (메모이제이션)
  const sortedServices = useMemo(() => {
    const filteredServices = getFilteredServices();
    const servicesWithStatus = filteredServices.map(service => ({
      ...service,
      status: calculateServiceStatus(service.components)
    }));
    
    switch (sortType) {
      case 'name-asc':
        return [...servicesWithStatus].sort((a, b) => a.display_name.localeCompare(b.display_name));
      case 'name-desc':
        return [...servicesWithStatus].sort((a, b) => b.display_name.localeCompare(a.display_name));
      case 'default':
      default:
        return servicesWithStatus.sort((a, b) => {
          const aIndex = serviceNames.indexOf(a.service_name as keyof typeof serviceFetchers);
          const bIndex = serviceNames.indexOf(b.service_name as keyof typeof serviceFetchers);
          return aIndex - bIndex;
        });
    }
  }, [getFilteredServices, sortType]);

  // 서비스 상태 계산 (메모이제이션)
  const calculateServiceStatus = useCallback((components: any[]) => {
    if (!components || components.length === 0) return 'unknown';
    const statuses = components.map(comp => comp.status);
    if (statuses.some(status => status === 'outage' || status === 'major_outage')) return 'outage';
    if (statuses.some(status => status === 'degraded' || status === 'degraded_performance')) return 'degraded';
    if (statuses.every(status => status === 'operational')) return 'operational';
    return 'unknown';
  }, []);

  // 카테고리별로 그룹화된 서비스 가져오기 (메모이제이션)
  const categorizedServices = useMemo(() => {
    return groupServicesByCategory(sortedServices);
  }, [sortedServices]);

  // 정렬 변경 핸들러 (메모이제이션)
  const handleSortChange = useCallback(async (newSortType: typeof sortType) => {
    if (newSortType === sortType) return;
    
    setAnimating(true);
    setSortType(newSortType);
    setSortDropdownOpen(false);
    
    setTimeout(() => {
      setAnimating(false);
    }, 600);
  }, [sortType, setAnimating, setSortType, setSortDropdownOpen]);

  // 타이틀 클릭 이벤트 핸들러 (메모이제이션)
  const handleTitleClick = useCallback(() => {
    const titleElement = document.querySelector('.desktop-title, .text-gradient');
    if (titleElement) {
      titleElement.classList.add('clicked');
      setTimeout(() => {
        titleElement.classList.remove('clicked');
      }, 600);
    }
  }, []);

  // 모달 닫기 함수 (메모이제이션)
  const closeModal = useCallback(() => {
    setFilterOpen(false);
    document.body.classList.remove('body-scroll-lock');
  }, [setFilterOpen]);

  // 로딩 중인 서비스 수 계산 (메모이제이션)
  const loadingServicesCount = useMemo(() => {
    return Object.values(serviceLoadingStates).filter(Boolean).length;
  }, [serviceLoadingStates]);

  // 초기 데이터 로드
  useEffect(() => {
    // 초기 모든 서비스 로딩 상태 설정
    const initialLoadingState: { [serviceName: string]: boolean } = {};
    serviceNames.forEach((name: string) => {
      initialLoadingState[name] = true;
    });
    
    useDashboardStore.setState(state => ({
      serviceLoadingStates: {
        ...state.serviceLoadingStates,
        ...initialLoadingState
      }
    }));

    // 초기 상태 데이터 로드
    loadAllServicesData(true);
  }, []);

  // 30초마다 자동 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      refreshFilteredServices();
    }, 30000);

    return () => clearInterval(interval);
  }, [filters, services]);

  // 윈도우 리사이즈 이벤트 리스너
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setWindowWidth(width);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFilterOpen) {
        closeModal();
      }
    };

    if (isFilterOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.classList.add('body-scroll-lock');
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      if (isFilterOpen) {
        document.body.classList.remove('body-scroll-lock');
      }
    };
  }, [isFilterOpen]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-dropdown')) {
        setLanguageDropdownOpen(false);
      }
      if (!target.closest('.sort-dropdown-container')) {
        setSortDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen || isSortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isSortDropdownOpen]);

  const stats = getOverallStats();
  const isAnyLoading = loadingServicesCount > 0;

  // 로딩 중일 때 표시
  if (services.length === 0 && isAnyLoading) {
    return (
      <div className="bg-background text-foreground layout-sticky-both min-h-dvh">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin w-6 h-6 mr-2 text-primary">⟳</div>
          <span className="text-muted-foreground">{t('loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground layout-sticky-both min-h-dvh">
      {/* 헤더 섹션 */}
      <DashboardHeader
        services={services}
        isLoading={isAnyLoading}
        loadingCount={loadingServicesCount}
        language={language}
        viewMode={viewMode}
        sortType={sortType}
        isSortDropdownOpen={isSortDropdownOpen}
        isLanguageDropdownOpen={isLanguageDropdownOpen}
        translations={{
          title: t('title'),
          refresh: t('refresh'),
          filter: t('filter'),
          operational: t('operational'),
          degradedPerformance: t('degradedPerformance'),
          majorOutage: t('majorOutage'),
          loading: t('loading'),
          categoryView: t('categoryView'),
          listView: t('listView'),
          sortDefault: t('sortDefault'),
          sortNameAsc: t('sortNameAsc'),
          sortNameDesc: t('sortNameDesc'),
        }}
        onRefresh={refreshFilteredServices}
        onFilterOpen={() => setFilterOpen(true)}
        onLanguageChange={setLanguage}
        onLanguageToggle={() => setLanguageDropdownOpen(!isLanguageDropdownOpen)}
        onViewModeChange={setViewMode}
        onSortChange={handleSortChange}
        onSortToggle={() => setSortDropdownOpen(!isSortDropdownOpen)}
        onTitleClick={handleTitleClick}
      />

      {/* 메인 컨텐츠 */}
      <main className="main-content">
        <div className="container mx-auto px-4 py-6">
          {/* 상단 광고 배너 */}
          <div className="mb-6 flex justify-center">
            <AdFitBanner />
          </div>

          {/* 필터 모달 */}
          <FilterModal
            isOpen={isFilterOpen}
            services={services}
            filters={filters}
            filterExpandedServices={filterExpandedServices}
            translations={{
              filterTitle: t('filterTitle'),
              filterDescription: t('filterDescription'),
              close: t('close')
            }}
            onClose={closeModal}
            onToggleComponentFilter={toggleComponentFilter}
            onToggleFilterServiceExpansion={toggleFilterServiceExpansion}
            onToggleAllComponentsForService={toggleAllComponentsForService}
            onToggleAllServices={toggleAllServices}
            getMasterSelectionState={getMasterSelectionState}
            getServiceSelectionState={getServiceSelectionState}
          />

          {/* 즐겨찾기 섹션 */}
          <FavoriteSection
            services={services}
            favorites={favorites}
            filters={filters}
            language={language}
            translations={{
              favorites: t('favorites'),
              allServices: t('allServices')
            }}
            onToggleFavorite={toggleFavorite}
          />

          {/* 서비스 표시 영역 */}
          {viewMode === 'category' ? (
            /* 카테고리 뷰 */
            <CategoryView
              categorizedServices={categorizedServices}
              expandedCategories={expandedCategories}
              expandedServices={expandedServices}
              serviceLoadingStates={serviceLoadingStates}
              language={language}
              isAnimating={isAnimating}
              translations={{
                statusPage: t('statusPage'),
                refreshService: t('refreshService')
              }}
              onToggleCategoryExpansion={toggleCategoryExpansion}
              onToggleServiceExpansion={toggleServiceExpansion}
              onRefreshService={(serviceName) => loadServiceData(serviceName as keyof typeof serviceFetchers, false)}
            />
          ) : (
            /* 목록 뷰 */
            <ServiceGrid
              services={sortedServices}
              expandedServices={expandedServices}
              serviceLoadingStates={serviceLoadingStates}
              language={language}
              isAnimating={isAnimating}
              translations={{
                statusPage: t('statusPage'),
                refreshService: t('refreshService')
              }}
              onToggleExpansion={toggleServiceExpansion}
              onRefreshService={(serviceName) => loadServiceData(serviceName as keyof typeof serviceFetchers, false)}
            />
          )}

          {/* 하단 광고 배너 */}
          <div className="mt-4 mb-3 md:mt-8 md:mb-6 flex justify-center">
            <AdFitBanner 
              onNoAd={() => console.log('하단 광고 로드 실패')}
            />
          </div>
        </div>
      </main>

      {/* 푸터 섹션 - 간단한 버전으로 임시 구현 */}
      <footer className="footer-section">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground py-4">
            <p className="flex items-center justify-center gap-2">
              <span>📊</span>
              <span>{t('monitoring')}: {getFilteredServices().length}{t('services')}</span>
              <span>•</span>
              <span>🔄 {t('autoUpdate')}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
