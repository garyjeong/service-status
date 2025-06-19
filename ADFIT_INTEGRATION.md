# Kakao AdFit 광고 통합 가이드

## 개요

이 프로젝트에 Kakao AdFit 광고를 통합하여 수익 창출을 위한 배너 광고를 표시합니다.

## 통합된 광고 정보

### 광고 단위 정보
- **광고 단위 ID**: `DAN-wiu4St0eJQqPsPgL`
- **광고 크기**: 728x90 (리더보드 배너)
- **광고 타입**: 디스플레이 배너 광고

### 광고 배치 위치

1. **상단 광고**: 헤더 바로 아래, 메인 컨텐츠 시작 전
2. **하단 광고**: 모든 서비스 카드 표시 후, 푸터 바로 위

## 기술적 구현

### AdFitBanner 컴포넌트

```typescript
// src/components/AdFitBanner.tsx
interface AdFitBannerProps {
  adUnit: string;      // 광고 단위 ID
  width: number;       // 광고 가로 크기
  height: number;      // 광고 세로 크기
  className?: string;  // 추가 CSS 클래스
  onNoAd?: () => void; // NO-AD 콜백 함수
}
```

### 주요 기능

1. **스크립트 중복 로드 방지**: 동일한 AdFit 스크립트가 여러 번 로드되지 않도록 체크
2. **NO-AD 콜백 처리**: 광고가 로드되지 않을 때의 대체 처리
3. **로딩 상태 표시**: 광고 로딩 중 플레이스홀더 표시
4. **반응형 디자인**: 모바일과 데스크톱에서 적절한 크기 조정

### CSS 스타일링

```css
/* 광고 배너 기본 스타일 */
.adfit-banner {
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

/* 호버 효과 */
.adfit-banner:hover .kakao_ad_area {
  transform: scale(1.02);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .adfit-banner {
    padding: 0 10px;
  }
  
  .adfit-banner .kakao_ad_area {
    max-width: 100%;
    height: auto;
    min-height: 90px;
  }
}
```

## 사용 방법

### 기본 사용법

```tsx
import AdFitBanner from './components/AdFitBanner';

// 컴포넌트에서 사용
<AdFitBanner 
  adUnit="DAN-wiu4St0eJQqPsPgL"
  width={728}
  height={90}
  className="rounded-lg overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm"
  onNoAd={() => console.log('광고 로드 실패')}
/>
```

### 다른 광고 단위 추가

새로운 광고 단위를 추가하려면:

1. Kakao AdFit에서 새 광고 단위 생성
2. 새로운 `AdFitBanner` 컴포넌트 인스턴스 추가
3. 적절한 위치에 배치

```tsx
<AdFitBanner 
  adUnit="새로운-광고-단위-ID"
  width={320}
  height={100}
  className="mobile-ad"
/>
```

## 성능 최적화

### 스크립트 로딩 최적화

- **비동기 로딩**: 모든 AdFit 스크립트는 비동기로 로드됩니다
- **중복 방지**: 이미 로드된 스크립트는 재로드하지 않습니다
- **에러 처리**: 스크립트 로드 실패 시 적절한 fallback 제공

### 메모리 관리

- **콜백 정리**: 컴포넌트 언마운트 시 등록된 콜백 함수 정리
- **이벤트 리스너 정리**: 메모리 누수 방지를 위한 적절한 cleanup

## 문제 해결

### 광고가 표시되지 않는 경우

1. **네트워크 확인**: AdFit 스크립트 로드 상태 확인
2. **광고 단위 ID 확인**: 올바른 광고 단위 ID 사용 여부 확인
3. **콘솔 로그 확인**: 브라우저 개발자 도구에서 에러 메시지 확인

### 개발 환경에서의 주의사항

- **localhost 제한**: 일부 광고는 localhost에서 표시되지 않을 수 있습니다
- **AdBlock**: 광고 차단 확장 프로그램이 활성화되어 있으면 광고가 표시되지 않습니다

## 모니터링 및 분석

### 광고 성능 추적

```typescript
// NO-AD 이벤트 추적
const handleNoAd = () => {
  console.log('AdFit NO-AD event:', {
    timestamp: new Date().toISOString(),
    adUnit: 'DAN-wiu4St0eJQqPsPgL',
    userAgent: navigator.userAgent
  });
  
  // 분석 도구로 이벤트 전송 (선택사항)
  // analytics.track('ad_load_failed', { adUnit: 'DAN-wiu4St0eJQqPsPgL' });
};
```

### 광고 로드 성공률 모니터링

AdFit 대시보드에서 다음 지표를 모니터링할 수 있습니다:

- **노출 수**: 광고가 실제로 표시된 횟수
- **클릭 수**: 사용자가 광고를 클릭한 횟수  
- **CTR**: 클릭률 (Click Through Rate)
- **수익**: 발생한 광고 수익

## 규정 준수

### Kakao AdFit 정책

1. **코드 수정 금지**: 제공된 광고 코드를 임의로 수정하지 않습니다
2. **적절한 배치**: 사용자 경험을 해치지 않는 위치에 광고 배치
3. **클릭 유도 금지**: 인위적인 클릭 유도 행위 금지

### 개인정보보호

- **쿠키 정책**: AdFit에서 사용하는 쿠키에 대한 정보 제공
- **데이터 수집**: 광고 타겟팅을 위한 데이터 수집 고지

## 향후 개선 계획

1. **다양한 광고 크기**: 모바일용 320x50, 사각형 300x250 광고 추가
2. **A/B 테스트**: 광고 배치 위치별 성능 비교
3. **지연 로딩**: 뷰포트에 진입할 때만 광고 로드하여 성능 최적화
4. **다크 모드 대응**: 다크 테마에 어울리는 광고 스타일링

## 관련 파일

- `src/components/AdFitBanner.tsx` - AdFit 광고 컴포넌트
- `src/components/Dashboard.tsx` - 광고가 통합된 메인 대시보드
- `src/index.css` - 광고 관련 CSS 스타일
- `index.html` - AdFit 사이트 인증 메타 태그

## 참고 자료

- [Kakao AdFit 웹 SDK 가이드](https://github.com/adfit/adfit-web-sdk)
- [AdFit 개발자 문서](https://adfit.kakao.com/)
- [React에서 외부 스크립트 통합 가이드](https://react.dev/reference/react-dom/components/script) 