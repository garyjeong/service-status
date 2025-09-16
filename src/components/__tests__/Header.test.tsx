import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

const defaultProps = {
  title: 'Test Dashboard',
  language: 'ko' as const,
  isAnyLoading: false,
  loadingCount: 0,
  stats: {
    operational: 5,
    degraded: 1,
    outage: 0
  },
  sortType: 'default' as const,
  isSortDropdownOpen: false,
  isLanguageDropdownOpen: false,
  onRefresh: vi.fn(),
  onFilterOpen: vi.fn(),
  onSortChange: vi.fn(),
  onSortDropdownToggle: vi.fn(),
  onLanguageChange: vi.fn(),
  onLanguageDropdownToggle: vi.fn(),
  onTitleClick: vi.fn(),
  translations: {
    refresh: '새로고침',
    filter: '필터',
    operational: '정상',
    degradedPerformance: '성능 저하',
    majorOutage: '장애',
    loading: '로딩 중',
    sortDefault: '기본',
    sortNameAsc: '이름 오름차순',
    sortNameDesc: '이름 내림차순'
  }
};

describe('Header', () => {
  it('renders title correctly', () => {
    render(<Header {...defaultProps} />);
    
    // 데스크톱과 모바일 둘 다 렌더링되므로 getAllByText 사용
    const titles = screen.getAllByText('Test Dashboard');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const onRefresh = vi.fn();
    render(<Header {...defaultProps} onRefresh={onRefresh} />);
    
    // 새로고침 버튼들 찾기 (데스크톱, 모바일)
    const refreshButtons = screen.getAllByLabelText('새로고침');
    expect(refreshButtons.length).toBeGreaterThan(0);
    
    // 첫 번째 버튼 클릭
    fireEvent.click(refreshButtons[0]);
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('calls onFilterOpen when filter button is clicked', () => {
    const onFilterOpen = vi.fn();
    render(<Header {...defaultProps} onFilterOpen={onFilterOpen} />);
    
    // 필터 버튼들 찾기
    const filterButtons = screen.getAllByText('필터');
    expect(filterButtons.length).toBeGreaterThan(0);
    
    // 첫 번째 버튼 클릭
    fireEvent.click(filterButtons[0]);
    expect(onFilterOpen).toHaveBeenCalledTimes(1);
  });

  it('calls onTitleClick when title is clicked', () => {
    const onTitleClick = vi.fn();
    render(<Header {...defaultProps} onTitleClick={onTitleClick} />);
    
    const titles = screen.getAllByText('Test Dashboard');
    fireEvent.click(titles[0]);
    expect(onTitleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<Header {...defaultProps} isAnyLoading={true} loadingCount={3} />);
    
    // 로딩 카운트가 표시되는지 확인
    const loadingElements = screen.getAllByText('3');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('displays stats correctly', () => {
    render(<Header {...defaultProps} />);
    
    // 통계 숫자들이 표시되는지 확인
    const operationalElements = screen.getAllByText('5');
    const degradedElements = screen.getAllByText('1');
    
    expect(operationalElements.length).toBeGreaterThan(0);
    expect(degradedElements.length).toBeGreaterThan(0);
  });

  it('handles disabled refresh button when loading', () => {
    render(<Header {...defaultProps} isAnyLoading={true} />);
    
    const refreshButtons = screen.getAllByLabelText('새로고침');
    // 최소 하나의 버튼이 비활성화되어 있어야 함
    const disabledButtons = refreshButtons.filter(button => button.hasAttribute('disabled'));
    expect(disabledButtons.length).toBeGreaterThan(0);
  });
});
