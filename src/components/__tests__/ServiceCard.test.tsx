import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ServiceCard from '../ServiceCard';

const mockService = {
  service_name: 'test-service',
  display_name: 'Test Service',
  icon: 'openai',
  page_url: 'https://test.example.com',
  components: [
    { name: 'API', status: 'operational' },
    { name: 'Dashboard', status: 'degraded' },
    { name: 'Database', status: 'outage' }
  ],
  status: 'operational'
};

const defaultProps = {
  service: mockService,
  isExpanded: false,
  isLoading: false,
  language: 'ko' as const,
  onToggleExpansion: vi.fn(),
  onRefresh: vi.fn(),
  getServiceDescription: vi.fn(() => 'Test service description'),
  getStatusText: vi.fn((status: string) => {
    const statusMap: { [key: string]: string } = {
      operational: '정상',
      degraded: '성능 저하',
      outage: '장애'
    };
    return statusMap[status] || status;
  }),
  getStatusColorClass: vi.fn(() => 'text-green-400'),
  getStatusColor: vi.fn(() => 'status-operational'),
  translations: {
    refreshService: '서비스 새로고침',
    statusPage: '상태 페이지'
  }
};

describe('ServiceCard', () => {
  it('renders service information correctly', () => {
    render(<ServiceCard {...defaultProps} />);
    
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('Test service description')).toBeInTheDocument();
    expect(screen.getByText('상태 페이지')).toBeInTheDocument();
  });

  it('calls onToggleExpansion when card is clicked', () => {
    const onToggleExpansion = vi.fn();
    render(<ServiceCard {...defaultProps} onToggleExpansion={onToggleExpansion} />);
    
    // 카드 클릭
    const card = screen.getByRole('button', { name: /Test Service 서비스 상세 정보 보기/ });
    fireEvent.click(card);
    
    expect(onToggleExpansion).toHaveBeenCalledTimes(1);
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const onRefresh = vi.fn();
    render(<ServiceCard {...defaultProps} onRefresh={onRefresh} />);
    
    const refreshButton = screen.getByLabelText('서비스 새로고침');
    fireEvent.click(refreshButton);
    
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<ServiceCard {...defaultProps} isLoading={true} />);
    
    const refreshButton = screen.getByLabelText('서비스 새로고침');
    expect(refreshButton).toBeDisabled();
  });

  it('shows expanded content when isExpanded is true', () => {
    render(<ServiceCard {...defaultProps} isExpanded={true} />);
    
    // 확장된 상태에서는 컴포넌트 목록이 보여야 함
    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
  });

  it('shows component statuses in expanded view', () => {
    render(<ServiceCard {...defaultProps} isExpanded={true} />);
    
    // 각 컴포넌트의 상태가 표시되는지 확인
    const statusTexts = screen.getAllByText('정상');
    const degradedTexts = screen.getAllByText('성능 저하');
    const outageTexts = screen.getAllByText('장애');
    
    expect(statusTexts.length).toBeGreaterThan(0);
    expect(degradedTexts.length).toBeGreaterThan(0);
    expect(outageTexts.length).toBeGreaterThan(0);
  });

  it('handles keyboard navigation', () => {
    const onToggleExpansion = vi.fn();
    render(<ServiceCard {...defaultProps} onToggleExpansion={onToggleExpansion} />);
    
    const card = screen.getByRole('button', { name: /Test Service 서비스 상세 정보 보기/ });
    
    // Enter 키 테스트
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onToggleExpansion).toHaveBeenCalledTimes(1);
    
    // Space 키 테스트
    fireEvent.keyDown(card, { key: ' ' });
    expect(onToggleExpansion).toHaveBeenCalledTimes(2);
  });

  it('opens status page link in new tab', () => {
    render(<ServiceCard {...defaultProps} />);
    
    const statusPageLink = screen.getByRole('link', { name: /상태 페이지/ });
    expect(statusPageLink).toHaveAttribute('href', 'https://test.example.com');
    expect(statusPageLink).toHaveAttribute('target', '_blank');
    expect(statusPageLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('stops propagation when refresh button is clicked', () => {
    const onToggleExpansion = vi.fn();
    const onRefresh = vi.fn();
    
    render(
      <ServiceCard 
        {...defaultProps} 
        onToggleExpansion={onToggleExpansion}
        onRefresh={onRefresh}
      />
    );
    
    const refreshButton = screen.getByLabelText('서비스 새로고침');
    fireEvent.click(refreshButton);
    
    // 새로고침 버튼 클릭 시 카드 확장이 되지 않아야 함
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(onToggleExpansion).not.toHaveBeenCalled();
  });
});
