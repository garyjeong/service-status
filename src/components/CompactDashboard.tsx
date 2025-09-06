import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, ChevronRight, Grid, List, BarChart3 } from 'lucide-react';
import { fetchAllServicesStatus, StatusUtils } from '../services/api';
import type { Service } from '../services/api';
import { SERVICE_CATEGORIES, groupServicesByCategory } from '../types/categories';

type ViewMode = 'compact' | 'table' | 'list';

interface CompactDashboardProps {
  className?: string;
}

const CompactDashboard: React.FC<CompactDashboardProps> = ({ className = '' }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('compact');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showOnlyProblems, setShowOnlyProblems] = useState(false);

  // 서비스 상태 로딩
  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await fetchAllServicesStatus();
        setServices(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('서비스 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
    const interval = setInterval(loadServices, 30000); // 30초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  // 전체 상태 계산
  const getOverallStats = () => {
    const operational = services.filter(s => s.status === 'operational').length;
    const degraded = services.filter(s => s.status === 'degraded').length;
    const outage = services.filter(s => s.status === 'outage').length;
    const maintenance = services.filter(s => s.status === 'maintenance').length;
    
    return { operational, degraded, outage, maintenance, total: services.length };
  };

  // 카테고리별 그룹핑
  const groupedServices = groupServicesByCategory(services);

  // 카테고리 상태 계산
  const getCategoryStats = (categoryServices: Service[]) => {
    const operational = categoryServices.filter(s => s.status === 'operational').length;
    const degraded = categoryServices.filter(s => s.status === 'degraded').length;
    const outage = categoryServices.filter(s => s.status === 'outage').length;
    return { operational, degraded, outage, total: categoryServices.length };
  };

  // 카테고리 토글
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // 상태 아이콘
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return '🟢';
      case 'degraded': return '🟡';
      case 'outage': return '🔴';
      case 'maintenance': return '🔵';
      default: return '⚪';
    }
  };

  // 문제가 있는 서비스만 필터링
  const getProblematicServices = () => {
    return services.filter(s => s.status !== 'operational');
  };

  const stats = getOverallStats();
  const problematicServices = getProblematicServices();

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <RefreshCw className="animate-spin w-6 h-6 mr-2" />
        <span>서비스 상태 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* 헤더 */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">Service Status</h1>
            <div className="flex items-center space-x-2 text-sm">
              <span className="flex items-center">
                🟢 {stats.operational}
              </span>
              {stats.degraded > 0 && (
                <span className="flex items-center">
                  🟡 {stats.degraded}
                </span>
              )}
              {stats.outage > 0 && (
                <span className="flex items-center">
                  🔴 {stats.outage}
                </span>
              )}
              <span className="text-gray-500">
                [{stats.total}개 서비스]
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 뷰 모드 선택 */}
            <div className="flex border rounded-md">
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1 ${viewMode === 'compact' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                title="컴팩트 뷰"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1 ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                title="테이블 뷰"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                title="리스트 뷰"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* 문제만 보기 토글 */}
            <button
              onClick={() => setShowOnlyProblems(!showOnlyProblems)}
              className={`px-3 py-1 text-xs rounded-md ${
                showOnlyProblems 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              문제만 보기 ({problematicServices.length})
            </button>

            <span className="text-xs text-gray-500">
              ↻ {Math.floor((Date.now() - lastUpdated.getTime()) / 1000)}초 전
            </span>
          </div>
        </div>
      </div>

      {/* 문제 서비스 우선 표시 */}
      {problematicServices.length > 0 && !showOnlyProblems && (
        <div className="border-b bg-red-50 p-3">
          <div className="text-sm font-medium text-red-800 mb-2">
            ⚠️ 문제 발생 중 ({problematicServices.length}개)
          </div>
          <div className="flex flex-wrap gap-2">
            {problematicServices.map(service => (
              <div
                key={service.service_name}
                className="flex items-center space-x-1 bg-white px-2 py-1 rounded text-xs"
              >
                <span>{getStatusIcon(service.status)}</span>
                <span>{service.display_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="p-4">
        {showOnlyProblems ? (
          // 문제 서비스만 표시
          <div className="space-y-2">
            {problematicServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                🎉 모든 서비스가 정상 운영 중입니다!
              </div>
            ) : (
              problematicServices.map(service => (
                <div
                  key={service.service_name}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getStatusIcon(service.status)}</span>
                    <span className="font-medium">{service.display_name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {service.components.filter(c => c.status !== 'operational').length > 0 && (
                      <span>
                        {service.components.filter(c => c.status !== 'operational').length}개 컴포넌트 영향
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // 카테고리별 표시
          <div className="space-y-3">
            {SERVICE_CATEGORIES.map(category => {
              const categoryServices = groupedServices[category.id] || [];
              const categoryStats = getCategoryStats(categoryServices);
              const isExpanded = expandedCategories.has(category.id);
              const hasProblems = categoryStats.degraded > 0 || categoryStats.outage > 0;

              return (
                <div key={category.id} className="border rounded-md">
                  {/* 카테고리 헤더 */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-500">({categoryStats.total}개)</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* 카테고리 상태 도트 */}
                      <div className="flex space-x-1">
                        {Array.from({ length: categoryStats.operational }).map((_, i) => (
                          <div key={`op-${i}`} className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ))}
                        {Array.from({ length: categoryStats.degraded }).map((_, i) => (
                          <div key={`deg-${i}`} className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        ))}
                        {Array.from({ length: categoryStats.outage }).map((_, i) => (
                          <div key={`out-${i}`} className="w-2 h-2 bg-red-500 rounded-full"></div>
                        ))}
                      </div>
                      
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* 카테고리 서비스 목록 */}
                  {isExpanded && (
                    <div className="border-t p-3">
                      {viewMode === 'compact' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {categoryServices.map(service => (
                            <div
                              key={service.service_name}
                              className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50"
                            >
                              <span>{getStatusIcon(service.status)}</span>
                              <span className="text-sm truncate">{service.display_name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {viewMode === 'table' && (
                        <div className="grid grid-cols-3 gap-1 text-xs">
                          {categoryServices.map(service => (
                            <div
                              key={service.service_name}
                              className="flex items-center justify-between p-1 border-r last:border-r-0"
                            >
                              <span className="truncate">{service.display_name}</span>
                              <span>{getStatusIcon(service.status)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {viewMode === 'list' && (
                        <div className="space-y-1">
                          {categoryServices.map(service => (
                            <div
                              key={service.service_name}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                            >
                              <div className="flex items-center space-x-2">
                                <span>{getStatusIcon(service.status)}</span>
                                <span className="text-sm">{service.display_name}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {service.components.length}개 컴포넌트
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactDashboard;
