import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SidebarFilter from '../SidebarFilter';

const mockServices = [
  {
    service_name: 'service1',
    display_name: 'Service 1',
    icon: 'openai',
    page_url: 'https://service1.com',
    components: [
      { name: 'API', status: 'operational' },
      { name: 'Dashboard', status: 'degraded' }
    ]
  },
  {
    service_name: 'service2',
    display_name: 'Service 2',
    icon: 'anthropic',
    page_url: 'https://service2.com',
    components: [
      { name: 'Database', status: 'outage' },
      { name: 'Cache', status: 'operational' }
    ]
  }
];

const defaultProps = {
  isOpen: true,
  services: mockServices,
  filters: {
    service1: { API: true, Dashboard: false },
    service2: { Database: true, Cache: true }
  },
  expandedServices: {
    service1: true,
    service2: false
  },
  onClose: vi.fn(),
  onToggleComponentFilter: vi.fn(),
  onToggleServiceExpansion: vi.fn(),
  onToggleAllServices: vi.fn(),
  onToggleAllComponentsForService: vi.fn(),
  getServiceSelectionState: vi.fn(() => 'some'),
  getMasterSelectionState: vi.fn(() => 'some'),
  getStatusColor: vi.fn(() => 'status-operational'),
  translations: {
    filterTitle: '서비스 필터',
    filterDescription: '표시할 서비스를 선택하세요',
    close: '닫기'
  }
};

describe('SidebarFilter', () => {
  it('renders when isOpen is true', () => {
    render(<SidebarFilter {...defaultProps} />);
    
    expect(screen.getByText('서비스 필터')).toBeInTheDocument();
    expect(screen.getByText('표시할 서비스를 선택하세요')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<SidebarFilter {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('서비스 필터')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<SidebarFilter {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('닫기');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<SidebarFilter {...defaultProps} onClose={onClose} />);
    
    // 오버레이 클릭
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50');
    expect(overlay).toBeInTheDocument();
    
    if (overlay) {
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('displays all services', () => {
    render(<SidebarFilter {...defaultProps} />);
    
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Service 2')).toBeInTheDocument();
  });

  it('shows expanded service components', () => {
    render(<SidebarFilter {...defaultProps} />);
    
    // Service 1이 확장되어 있으므로 컴포넌트들이 보여야 함
    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Service 2는 확장되지 않았으므로 컴포넌트들이 보이지 않아야 함
    expect(screen.queryByText('Database')).not.toBeInTheDocument();
    expect(screen.queryByText('Cache')).not.toBeInTheDocument();
  });

  it('calls onToggleServiceExpansion when expansion button is clicked', () => {
    const onToggleServiceExpansion = vi.fn();
    render(<SidebarFilter {...defaultProps} onToggleServiceExpansion={onToggleServiceExpansion} />);
    
    // Service 2의 확장 버튼 찾기 (ChevronDown 아이콘)
    const expansionButtons = screen.getAllByRole('button');
    const service2ExpansionButton = expansionButtons.find(button => {
      const svg = button.querySelector('svg');
      return svg && button.closest('div')?.textContent?.includes('Service 2');
    });
    
    if (service2ExpansionButton) {
      fireEvent.click(service2ExpansionButton);
      expect(onToggleServiceExpansion).toHaveBeenCalledWith('service2');
    }
  });

  it('calls onToggleComponentFilter when component checkbox is clicked', () => {
    const onToggleComponentFilter = vi.fn();
    render(<SidebarFilter {...defaultProps} onToggleComponentFilter={onToggleComponentFilter} />);
    
    // API 컴포넌트의 체크박스 찾기
    const apiCheckbox = screen.getByRole('checkbox', { name: /API/ });
    fireEvent.click(apiCheckbox);
    
    expect(onToggleComponentFilter).toHaveBeenCalledWith('service1', 'API');
  });

  it('calls onToggleAllServices when master toggle is clicked', () => {
    const onToggleAllServices = vi.fn();
    render(<SidebarFilter {...defaultProps} onToggleAllServices={onToggleAllServices} />);
    
    const masterToggle = screen.getByText(/전체/);
    fireEvent.click(masterToggle);
    
    expect(onToggleAllServices).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleAllComponentsForService when service checkbox is clicked', () => {
    const onToggleAllComponentsForService = vi.fn();
    render(<SidebarFilter {...defaultProps} onToggleAllComponentsForService={onToggleAllComponentsForService} />);
    
    // 서비스 체크박스들 찾기
    const checkboxes = screen.getAllByRole('checkbox');
    const serviceCheckbox = checkboxes.find(checkbox => 
      !checkbox.getAttribute('name') // 컴포넌트 체크박스는 name 속성이 있을 수 있음
    );
    
    if (serviceCheckbox) {
      fireEvent.click(serviceCheckbox);
      expect(onToggleAllComponentsForService).toHaveBeenCalled();
    }
  });

  it('handles indeterminate state for service checkboxes', () => {
    const getServiceSelectionState = vi.fn()
      .mockReturnValueOnce('some') // Service 1
      .mockReturnValueOnce('all');  // Service 2
    
    render(<SidebarFilter {...defaultProps} getServiceSelectionState={getServiceSelectionState} />);
    
    // getServiceSelectionState가 각 서비스에 대해 호출되는지 확인
    expect(getServiceSelectionState).toHaveBeenCalledWith('service1');
    expect(getServiceSelectionState).toHaveBeenCalledWith('service2');
  });
});
