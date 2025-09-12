/**
 * API 응답 캐싱 시스템
 *
 * 기능:
 * - 시간 기반 캐싱 (TTL: Time To Live)
 * - 메모리 효율적인 LRU 캐시
 * - 자동 만료 및 정리
 * - 타입 안전성
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  /**
   * 캐시 유지 시간 (밀리초)
   * @default 30000 (30초)
   */
  ttl?: number;

  /**
   * 최대 캐시 항목 수 (LRU)
   * @default 100
   */
  maxSize?: number;
}

export class APICache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder = new Map<string, number>();
  private accessCounter = 0;
  private readonly defaultTTL: number;
  private readonly maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl ?? 30000; // 30초 기본값
    this.maxSize = options.maxSize ?? 100;
  }

  /**
   * 캐시에서 데이터 조회
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // TTL 체크
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      return null;
    }

    // LRU 업데이트
    this.accessOrder.set(key, ++this.accessCounter);

    return entry.data;
  }

  /**
   * 캐시에 데이터 저장
   */
  set(key: string, data: T, customTTL?: number): void {
    const ttl = customTTL ?? this.defaultTTL;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // 크기 제한 체크 (LRU 제거)
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLeastRecentlyUsed();
    }

    this.cache.set(key, entry);
    this.accessOrder.set(key, ++this.accessCounter);
  }

  /**
   * 특정 키의 캐시 삭제
   */
  delete(key: string): boolean {
    this.accessOrder.delete(key);
    return this.cache.delete(key);
  }

  /**
   * 패턴에 맞는 캐시 항목들 삭제
   */
  deletePattern(pattern: string | RegExp): number {
    const regex = typeof pattern === 'string' ? new RegExp(pattern.replace(/\*/g, '.*')) : pattern;

    let deletedCount = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.delete(key);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * 만료된 항목들 정리
   */
  cleanup(): number {
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * 전체 캐시 초기화
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.accessCounter = 0;
  }

  /**
   * 캐시 통계 정보
   */
  getStats() {
    const now = Date.now();
    let expiredCount = 0;

    for (const entry of this.cache.values()) {
      if (this.isExpired(entry)) {
        expiredCount++;
      }
    }

    return {
      totalItems: this.cache.size,
      expiredItems: expiredCount,
      validItems: this.cache.size - expiredCount,
      maxSize: this.maxSize,
      defaultTTL: this.defaultTTL,
    };
  }

  /**
   * 캐시된 키 목록 반환
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * 특정 키가 캐시에 있고 유효한지 확인
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 캐시 항목이 만료되었는지 확인
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * LRU 정책에 따라 가장 오래된 항목 제거
   */
  private evictLeastRecentlyUsed(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;

    for (const [key, accessTime] of this.accessOrder.entries()) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }
}

// 전역 캐시 인스턴스들
export const serviceStatusCache = new APICache({
  ttl: 30000, // 30초 - 서비스 상태는 자주 변경될 수 있음
  maxSize: 50,
});

export const serviceComponentsCache = new APICache({
  ttl: 60000, // 1분 - 컴포넌트 구조는 상대적으로 안정적
  maxSize: 50,
});

// 캐시 키 생성 유틸리티
export const createCacheKey = (
  serviceName: string,
  type: 'status' | 'components' = 'status'
): string => {
  return `${type}:${serviceName}`;
};

// 주기적 정리 (5분마다)
if (typeof window !== 'undefined') {
  setInterval(
    () => {
      const statusCleaned = serviceStatusCache.cleanup();
      const componentsCleaned = serviceComponentsCache.cleanup();

      if (statusCleaned > 0 || componentsCleaned > 0) {
        console.debug(
          `API Cache cleanup: ${statusCleaned + componentsCleaned} expired entries removed`
        );
      }
    },
    5 * 60 * 1000
  ); // 5분
}
