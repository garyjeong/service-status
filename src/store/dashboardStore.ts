import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Service, serviceFetchers } from '../services/api';
import {
  Language,
  ViewMode,
  SortType,
  ComponentFilter,
  Favorites,
  ServiceExpansion,
} from '../types/ui';

interface ServiceLoadingState {
  [serviceName: string]: boolean;
}

interface DashboardState {
  // 전역 설정
  language: Language;
  viewMode: ViewMode;
  sortType: SortType;

  // 필터 및 즐겨찾기
  filters: ComponentFilter;
  favorites: Favorites;

  // 빠른 필터
  quickFilters: {
    showOnlyProblematic: boolean;
    showOnlyFavorites: boolean;
  };

  // 가상화 설정
  virtualization: {
    enabled: boolean;
    threshold: number;
    itemHeight: number;
    maxHeight: number;
  };

  // 서비스 데이터
  services: Service[];
  serviceLoadingStates: ServiceLoadingState;
  expandedServices: ServiceExpansion;
  expandedCategories: Set<string>;

  // UI 상태
  isFilterOpen: boolean;
  filterExpandedServices: { [key: string]: boolean };
  isLanguageDropdownOpen: boolean;
  isSortDropdownOpen: boolean;
  isAnimating: boolean;
  error: string | null;
  serviceErrors: { [serviceName: string]: string | null };
  lastUpdate: Date;

  // 모바일 상태
  isScrollingDown: boolean;
  isFooterExpanded: boolean;

  // 액션들
  setLanguage: (language: Language) => void;
  setViewMode: (viewMode: ViewMode) => void;
  setSortType: (sortType: SortType) => void;

  // 필터 관련
  toggleComponentFilter: (serviceName: string, componentName: string) => void;
  toggleAllComponentsForService: (serviceName: string) => void;
  toggleAllServices: () => void;
  setFilterOpen: (isOpen: boolean) => void;
  toggleFilterServiceExpansion: (serviceName: string) => void;

  // 즐겨찾기 관련
  toggleFavorite: (serviceName: string, componentName: string) => void;

  // 빠른 필터 관련
  toggleQuickFilter: (filterType: 'showOnlyProblematic' | 'showOnlyFavorites') => void;

  // 서비스 관련
  setServices: (services: Service[]) => void;
  setServiceLoading: (serviceName: string, isLoading: boolean) => void;
  setServiceError: (serviceName: string, error: string | null) => void;
  toggleServiceExpansion: (serviceName: string) => void;
  toggleCategoryExpansion: (categoryName: string) => void;

  // UI 상태
  setLanguageDropdownOpen: (isOpen: boolean) => void;
  setSortDropdownOpen: (isOpen: boolean) => void;
  setAnimating: (isAnimating: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdate: (date: Date) => void;

  // 모바일 상태
  setScrollingDown: (isScrollingDown: boolean) => void;
  setFooterExpanded: (isExpanded: boolean) => void;

  // 유틸리티 함수들
  getFilteredServices: () => Service[];
  getServiceSelectionState: (serviceName: string) => 'all' | 'none' | 'some';
  getMasterSelectionState: () => 'all' | 'none' | 'some';
  getFavoriteComponents: () => Array<{
    serviceName: string;
    serviceDisplayName: string;
    componentName: string;
    status: string;
    icon: string;
  }>;
  getOverallStats: () => {
    totalServices: number;
    operational: number;
    degraded: number;
    outage: number;
  };
}

// 서비스 상태 계산 유틸리티
const calculateServiceStatus = (components: any[]) => {
  if (!components || components.length === 0) return 'unknown';
  const statuses = components.map(comp => comp.status);
  if (statuses.some(status => status === 'outage' || status === 'major_outage')) return 'outage';
  if (statuses.some(status => status === 'degraded' || status === 'degraded_performance'))
    return 'degraded';
  if (statuses.every(status => status === 'operational')) return 'operational';
  return 'unknown';
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      language: 'ko',
      viewMode: 'category',
      sortType: 'default',

      filters: {},
      favorites: {},

      quickFilters: {
        showOnlyProblematic: false,
        showOnlyFavorites: false,
      },

      virtualization: {
        enabled: true, // 기본적으로 활성화
        threshold: 20, // 20개 이상일 때 가상화
        itemHeight: 200, // 서비스 카드 높이
        maxHeight: 800, // 최대 컨테이너 높이
      },

      services: [],
      serviceLoadingStates: {},
      expandedServices: {},
      expandedCategories: new Set(),

      isFilterOpen: false,
      filterExpandedServices: {},
      isLanguageDropdownOpen: false,
      isSortDropdownOpen: false,
      isAnimating: false,
      error: null,
      serviceErrors: {},
      lastUpdate: new Date(),

      isScrollingDown: false,
      isFooterExpanded: false,

      // 액션 구현
      setLanguage: language => set({ language }),
      setViewMode: viewMode => set({ viewMode }),
      setSortType: sortType => set({ sortType }),

      // 필터 관련
      toggleComponentFilter: (serviceName, componentName) =>
        set(state => ({
          filters: {
            ...state.filters,
            [serviceName]: {
              ...state.filters[serviceName],
              [componentName]: !state.filters[serviceName]?.[componentName],
            },
          },
        })),

      toggleAllComponentsForService: serviceName =>
        set(state => {
          const service = state.services.find(s => s.service_name === serviceName);
          if (!service) return state;

          const currentState = get().getServiceSelectionState(serviceName);
          const newValue = currentState !== 'all';

          const updatedServiceFilters: { [key: string]: boolean } = {};
          service.components.forEach(component => {
            updatedServiceFilters[component.name] = newValue;
          });

          return {
            filters: {
              ...state.filters,
              [serviceName]: updatedServiceFilters,
            },
          };
        }),

      toggleAllServices: () =>
        set(state => {
          const masterState = get().getMasterSelectionState();
          const newValue = masterState !== 'all';

          const newFilters: ComponentFilter = {};
          state.services.forEach(service => {
            newFilters[service.service_name] = {};
            service.components.forEach(component => {
              newFilters[service.service_name][component.name] = newValue;
            });
          });

          return { filters: newFilters };
        }),

      setFilterOpen: isFilterOpen => set({ isFilterOpen }),

      toggleFilterServiceExpansion: serviceName =>
        set(state => ({
          filterExpandedServices: {
            ...state.filterExpandedServices,
            [serviceName]: !state.filterExpandedServices[serviceName],
          },
        })),

      // 즐겨찾기 관련
      toggleFavorite: (serviceName, componentName) =>
        set(state => ({
          favorites: {
            ...state.favorites,
            [serviceName]: {
              ...state.favorites[serviceName],
              [componentName]: !state.favorites[serviceName]?.[componentName],
            },
          },
        })),

      // 빠른 필터 관련
      toggleQuickFilter: filterType =>
        set(state => ({
          quickFilters: {
            ...state.quickFilters,
            [filterType]: !state.quickFilters[filterType],
          },
        })),

      // 서비스 관련
      setServices: services => set({ services }),

      setServiceLoading: (serviceName, isLoading) =>
        set(state => ({
          serviceLoadingStates: {
            ...state.serviceLoadingStates,
            [serviceName]: isLoading,
          },
        })),

      setServiceError: (serviceName, error) =>
        set(state => ({
          serviceErrors: {
            ...state.serviceErrors,
            [serviceName]: error,
          },
        })),

      toggleServiceExpansion: serviceName =>
        set(state => ({
          expandedServices: {
            ...state.expandedServices,
            [serviceName]: !state.expandedServices[serviceName],
          },
        })),

      toggleCategoryExpansion: categoryName =>
        set(state => {
          const newSet = new Set(state.expandedCategories);
          if (newSet.has(categoryName)) {
            newSet.delete(categoryName);
          } else {
            newSet.add(categoryName);
          }
          return { expandedCategories: newSet };
        }),

      // UI 상태
      setLanguageDropdownOpen: isLanguageDropdownOpen => set({ isLanguageDropdownOpen }),
      setSortDropdownOpen: isSortDropdownOpen => set({ isSortDropdownOpen }),
      setAnimating: isAnimating => set({ isAnimating }),
      setError: error => set({ error }),
      setLastUpdate: lastUpdate => set({ lastUpdate }),

      // 모바일 상태
      setScrollingDown: isScrollingDown => set({ isScrollingDown }),
      setFooterExpanded: isFooterExpanded => set({ isFooterExpanded }),

      // 유틸리티 함수들
      getFilteredServices: () => {
        const state = get();
        let filteredServices = state.services.filter(service => {
          const hasSelectedComponent = service.components.some(
            component => state.filters[service.service_name]?.[component.name]
          );
          return hasSelectedComponent;
        });

        // 빠른 필터 적용
        if (state.quickFilters.showOnlyProblematic) {
          filteredServices = filteredServices.filter(
            service =>
              service.status === 'degraded' ||
              service.status === 'outage' ||
              service.status === 'major_outage'
          );
        }

        if (state.quickFilters.showOnlyFavorites) {
          filteredServices = filteredServices.filter(service => {
            // 해당 서비스에 즐겨찾기된 컴포넌트가 있는지 확인
            return service.components.some(
              component => state.favorites[service.service_name]?.[component.name]
            );
          });
        }

        return filteredServices;
      },

      getServiceSelectionState: serviceName => {
        const state = get();
        const service = state.services.find(s => s.service_name === serviceName);
        if (!service || !service.components.length) return 'none';

        const selectedCount = service.components.filter(
          component => state.filters[serviceName]?.[component.name]
        ).length;

        if (selectedCount === 0) return 'none';
        if (selectedCount === service.components.length) return 'all';
        return 'some';
      },

      getMasterSelectionState: () => {
        const state = get();
        if (!state.services.length) return 'none';

        const allStates = state.services.map(service =>
          get().getServiceSelectionState(service.service_name)
        );
        const allSelected = allStates.every(state => state === 'all');
        const noneSelected = allStates.every(state => state === 'none');

        if (allSelected) return 'all';
        if (noneSelected) return 'none';
        return 'some';
      },

      getFavoriteComponents: () => {
        const state = get();
        const favoriteItems: Array<{
          serviceName: string;
          serviceDisplayName: string;
          componentName: string;
          status: string;
          icon: string;
        }> = [];

        const filteredServices = state.getFilteredServices();
        filteredServices.forEach(service => {
          service.components.forEach(component => {
            if (
              state.favorites[service.service_name]?.[component.name] &&
              state.filters[service.service_name]?.[component.name]
            ) {
              favoriteItems.push({
                serviceName: service.service_name,
                serviceDisplayName: service.display_name,
                componentName: component.name,
                status: component.status,
                icon: service.icon,
              });
            }
          });
        });

        return favoriteItems;
      },

      getOverallStats: () => {
        const state = get();
        const filteredServices = state.getFilteredServices();
        const servicesWithStatus = filteredServices.map(service => ({
          ...service,
          status: calculateServiceStatus(service.components),
        }));

        const totalServices = servicesWithStatus.length;
        const operational = servicesWithStatus.filter(s => s.status === 'operational').length;
        const degraded = servicesWithStatus.filter(s => s.status === 'degraded').length;
        const outage = servicesWithStatus.filter(s => s.status === 'outage').length;

        return { totalServices, operational, degraded, outage };
      },
    }),
    {
      name: 'dashboard-storage',
      partialize: state => ({
        // 오직 사용자 설정만 persist
        language: state.language,
        viewMode: state.viewMode,
        filters: state.filters,
        favorites: state.favorites,
      }),
    }
  )
);
