import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll } from 'vitest';

// 테스트 환경에서 필요한 전역 설정들

// window.matchMedia 모킹 (테마 관련 테스트용)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// localStorage 모킹
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// sessionStorage 모킹
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// IntersectionObserver 모킹 - 타입 호환성 개선
(global as any).IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    // Mock implementation
  }

  observe(target: Element): void {
    // Mock implementation
  }

  disconnect(): void {
    // Mock implementation
  }

  unobserve(target: Element): void {
    // Mock implementation
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// ResizeObserver 모킹
(global as any).ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    // Mock implementation
  }

  observe(target: Element, options?: ResizeObserverOptions): void {
    // Mock implementation
  }

  disconnect(): void {
    // Mock implementation
  }

  unobserve(target: Element): void {
    // Mock implementation
  }
};

// fetch 모킹 (API 테스트용)
(global as any).fetch = vi.fn();

// console.error 억제 (테스트 중 불필요한 로그 방지)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
