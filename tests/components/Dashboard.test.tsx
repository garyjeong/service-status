import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../../src/components/Dashboard';
import type { Service } from '../../src/types/status';
import { StatusType } from '../../src/types/status';

// Mock the API module
vi.mock('../../src/services/api', () => ({
  fetchAllServicesStatus: vi.fn()
}));

// Mock TanStack Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  QueryClient: vi.fn(() => ({
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn()
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  useQueryClient: vi.fn(() => ({
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn()
  }))
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Dashboard Component', () => {
  const mockServices: Service[] = [
    {
      service_name: 'openai',
      display_name: 'OpenAI',
      description: 'AI language models and API',
      status: StatusType.OPERATIONAL,
      page_url: 'https://status.openai.com',
      icon: 'gpt',
      components: [
        { name: 'API', status: StatusType.OPERATIONAL },
        { name: 'ChatGPT', status: StatusType.OPERATIONAL }
      ]
    },
    {
      service_name: 'github',
      display_name: 'GitHub',
      description: 'Code repository hosting',
      status: StatusType.DEGRADED_PERFORMANCE,
      page_url: 'https://www.githubstatus.com',
      icon: 'github',
      components: [
        { name: 'Git Operations', status: StatusType.OPERATIONAL },
        { name: 'API', status: StatusType.DEGRADED_PERFORMANCE }
      ]
    },
    {
      service_name: 'aws',
      display_name: 'AWS',
      description: 'Cloud computing platform',
      status: StatusType.MAJOR_OUTAGE,
      page_url: 'https://health.aws.amazon.com',
      icon: 'aws',
      components: [
        { name: 'EC2', status: StatusType.MAJOR_OUTAGE },
        { name: 'S3', status: StatusType.OPERATIONAL }
      ]
    }
  ];

  beforeEach(async () => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    
    // Mock successful query
    const { useQuery } = await import('@tanstack/react-query');
    vi.mocked(useQuery).mockReturnValue({
      data: mockServices,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn()
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the dashboard title', () => {
      render(<Dashboard />);
      
      expect(screen.getByRole('heading', { name: /외부 서비스 상태 모니터링/i })).toBeInTheDocument();
    });

    it('should render service cards', async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('OpenAI')).toBeInTheDocument();
        expect(screen.getByText('GitHub')).toBeInTheDocument();
        expect(screen.getByText('AWS')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      const { useQuery } = require('@tanstack/react-query');
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn()
      } as any);

      render(<Dashboard />);
      
      expect(screen.getAllByText('로딩 중...')).toHaveLength(1);
    });

    it('should show error state when API fails', () => {
      const { useQuery } = require('@tanstack/react-query');
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('API Error'),
        refetch: vi.fn()
      } as any);

      render(<Dashboard />);
      
      expect(screen.getByText(/데이터를 불러오는 중 오류가 발생했습니다/i)).toBeInTheDocument();
    });
  });

  describe('Status Display', () => {
    it('should display correct status colors and text', async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        // OpenAI (Operational) - green
        const openaiCard = screen.getByText('OpenAI').closest('.bg-gray-800');
        expect(openaiCard).toHaveTextContent('정상 운영');

        // GitHub (Degraded) - yellow  
        const githubCard = screen.getByText('GitHub').closest('.bg-gray-800');
        expect(githubCard).toHaveTextContent('성능 저하');

        // AWS (Major Outage) - red
        const awsCard = screen.getByText('AWS').closest('.bg-gray-800');
        expect(awsCard).toHaveTextContent('주요 장애');
      });
    });

    it('should show component details', async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('API')).toBeInTheDocument();
        expect(screen.getByText('ChatGPT')).toBeInTheDocument();
        expect(screen.getByText('Git Operations')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering and Search', () => {
    it('should filter services by status', async () => {
      render(<Dashboard />);
      
      // Open filter modal
      const filterButton = screen.getByRole('button', { name: /필터/i });
      await userEvent.click(filterButton);
      
      // Select "정상 운영" filter
      const operationalFilter = screen.getByLabelText('정상 운영');
      await userEvent.click(operationalFilter);
      
      // Apply filter
      const applyButton = screen.getByRole('button', { name: /적용/i });
      await userEvent.click(applyButton);
      
      await waitFor(() => {
        expect(screen.getByText('OpenAI')).toBeInTheDocument();
        expect(screen.queryByText('GitHub')).not.toBeInTheDocument();
        expect(screen.queryByText('AWS')).not.toBeInTheDocument();
      });
    });

    it('should search services by name', async () => {
      render(<Dashboard />);
      
      const searchInput = screen.getByPlaceholderText(/서비스 검색/i);
      await userEvent.type(searchInput, 'OpenAI');
      
      await waitFor(() => {
        expect(screen.getByText('OpenAI')).toBeInTheDocument();
        expect(screen.queryByText('GitHub')).not.toBeInTheDocument();
        expect(screen.queryByText('AWS')).not.toBeInTheDocument();
      });
    });
  });

  describe('Language Toggle', () => {
    it('should toggle between Korean and English', async () => {
      render(<Dashboard />);
      
      // Initially in Korean
      expect(screen.getByText('외부 서비스 상태 모니터링')).toBeInTheDocument();
      
      // Switch to English
      const langToggle = screen.getByRole('button', { name: /EN/i });
      await userEvent.click(langToggle);
      
      await waitFor(() => {
        expect(screen.getByText('External Service Status Monitoring')).toBeInTheDocument();
      });
    });
  });

  describe('Favorites Functionality', () => {
    it('should allow adding services to favorites', async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        const favoriteButtons = screen.getAllByRole('button', { name: /즐겨찾기/i });
        expect(favoriteButtons).toHaveLength(3);
      });
      
      // Click favorite button for OpenAI
      const openaiCard = screen.getByText('OpenAI').closest('.bg-gray-800');
      const favoriteButton = openaiCard?.querySelector('button[title*="즐겨찾기"]');
      
      if (favoriteButton) {
        await userEvent.click(favoriteButton);
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'favorites',
          expect.stringContaining('openai')
        );
      }
    });

    it('should persist favorites in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('["openai","github"]');
      
      render(<Dashboard />);
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('favorites');
    });
  });

  describe('Refresh Functionality', () => {
    it('should allow manual refresh of all services', async () => {
      const mockRefetch = vi.fn();
      const { useQuery } = require('@tanstack/react-query');
      vi.mocked(useQuery).mockReturnValue({
        data: mockServices,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch
      } as any);

      render(<Dashboard />);
      
      const refreshButton = screen.getByRole('button', { name: /새로고침/i });
      await userEvent.click(refreshButton);
      
      expect(mockRefetch).toHaveBeenCalled();
    });

    it('should show last updated time', async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/마지막 업데이트/i)).toBeInTheDocument();
      });
    });
  });

  describe('Theme and UI', () => {
    it('should render in dark theme', () => {
      render(<Dashboard />);
      
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toHaveClass('bg-gray-900');
    });

    it('should be responsive', () => {
      render(<Dashboard />);
      
      const serviceGrid = document.querySelector('.grid');
      expect(serviceGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Dashboard />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /새로고침/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /필터/i })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<Dashboard />);
      
      const refreshButton = screen.getByRole('button', { name: /새로고침/i });
      refreshButton.focus();
      
      expect(refreshButton).toHaveFocus();
      
      // Tab to next element
      await userEvent.tab();
      
      const filterButton = screen.getByRole('button', { name: /필터/i });
      expect(filterButton).toHaveFocus();
    });
  });

  describe('Overall Status Summary', () => {
    it('should display correct overall status', async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        // With major outage present, overall status should reflect that
        expect(screen.getByText(/전체 시스템 상태/i)).toBeInTheDocument();
      });
    });

    it('should show service count statistics', async () => {
      render(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/총 3개 서비스/i)).toBeInTheDocument();
      });
    });
  });
});
