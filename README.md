# 🌐 외부 서비스 상태 모니터링 대시보드

실시간으로 개발자가 자주 사용하는 외부 서비스들의 상태를 모니터링하는 다크 테마 전용 React 대시보드입니다.

## ⚡ 기술 스택 (2025년 최신)

- **Frontend**: React 19 + TypeScript 5.8
- **Build Tool**: Vite 6.3
- **Package Manager**: pnpm 8.10+
- **Styling**: Tailwind CSS 4.1 + CSS Variables + 모듈화된 CSS 시스템
- **State Management**: Zustand 5.0 + 영속성 미들웨어
- **Testing**: Vitest 3.2 + Testing Library 16.3
- **HTTP Client**: Axios 1.10
- **Icons**: 실제 서비스 로고 이미지 + Lucide React 0.516
- **UI Components**: 모듈화된 컴포넌트 시스템
- **Internationalization**: JSON 기반 다국어 시스템
- **Development**: VS Code Tasks + ESLint + Prettier
- **Infrastructure**: Docker + GitHub Actions + AWS ECR

## 🚀 지원되는 서비스 (총 18개)

### 🤖 AI/ML 서비스 (7개)

- **OpenAI ChatGPT** - ChatGPT 웹 인터페이스 및 OpenAI API
- **Anthropic Claude** - Claude 채팅 인터페이스 및 Anthropic API
- **Cursor Editor** - AI 기반 코드 에디터 및 개발 도구
- **Google AI Studio** - Google Gemini API 및 AI Studio 플랫폼
- **Perplexity AI** - AI 검색 엔진 및 대화형 AI 플랫폼
- **Groq / GroqCloud** - Groq AI 모델 플랫폼 및 추론 서비스
- **DeepSeek** - DeepSeek AI 모델 및 플랫폼 서비스

### ☁️ 클라우드 서비스 (6개)

- **AWS** - 아마존 웹 서비스 클라우드 플랫폼
- **Firebase** - Google 백엔드 서비스 플랫폼
- **Supabase** - 오픈소스 Firebase 대안 백엔드 플랫폼
- **Netlify** - 정적 사이트 호스팅 및 배포 플랫폼
- **Heroku** - 클라우드 애플리케이션 플랫폼 (PaaS)
- **Cloudflare** - CDN, DNS, 보안 및 성능 최적화 서비스

### 🛠️ 개발 도구 (3개)

- **GitHub** - 코드 저장소 및 협업 플랫폼
- **Replit** - 온라인 코딩 환경 및 협업 개발 플랫폼
- **CircleCI** - 지속적 통합 및 배포 (CI/CD) 플랫폼

### 💼 비즈니스 서비스 (2개)

- **Auth0** - 인증 및 권한 관리 플랫폼
- **Datadog** - 모니터링, 로깅, APM 및 보안 플랫폼

모든 서비스는 **전용 상태 페이지**를 통해 실시간 모니터링되며, 각 서비스의 하위 컴포넌트별 상태를 세부적으로 표시합니다.

## 📦 설치 및 실행

### 요구사항

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
# React 앱: http://localhost:8888/ (또는 자동 할당된 포트: 8889, 8890 등)

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

### HTML 데모 실행

정적 HTML 데모도 제공됩니다:

```bash
# 간단한 HTTP 서버로 HTML 데모 실행
python3 -m http.server 8001
# HTML 데모: http://localhost:8001/test.html
```

### 테스트 실행

```bash
# 테스트 실행
pnpm test

# 테스트 UI 모드
pnpm test:ui

# 테스트 커버리지
pnpm test:coverage
```

### 코드 품질

```bash
# ESLint 검사
pnpm lint

# ESLint 자동 수정
pnpm lint:fix

# Prettier 포맷팅
pnpm format

# TypeScript 타입 검사
pnpm type-check
```

### VS Code 디버깅

```bash
# F5 키로 디버그 모드 실행
# .vscode/launch.json 설정 완료

# 사용 가능한 디버그 구성:
# - "Launch Vite Dev Server" - 개발 서버 시작
# - "Launch Chrome Debug" - Chrome 브라우저 디버그
# - "Debug Vite + Chrome" - 서버 + 브라우저 통합 디버그
# - "Run Tests" - 테스트 실행
# - "Run Tests (Watch)" - 테스트 감시 모드
# - "Launch Dev Server + Chrome" - 복합 설정
```

## 🏗️ 프로젝트 구조 (모듈화된 아키텍처)

```
src/
├── assets/                    # 정적 리소스 (18개 서비스 로고)
│   ├── gpt.png               # OpenAI 로고
│   ├── claude.png            # Anthropic 로고
│   ├── cursor.png            # Cursor 로고
│   ├── google-ai-studio.png  # Google AI 로고
│   ├── perplexity.png        # Perplexity 로고
│   ├── grok.png              # Groq 로고
│   ├── github.png            # GitHub 로고
│   ├── netlify.png           # Netlify 로고
│   ├── aws.png               # AWS 로고
│   ├── firebase.png          # Firebase 로고
│   ├── supabase.jpg          # Supabase 로고
│   ├── heroku.png            # Heroku 로고
│   ├── cloudflare.png        # Cloudflare 로고
│   ├── replit.png            # Replit 로고
│   ├── circleci.png          # CircleCI 로고
│   ├── auth0.png             # Auth0 로고
│   ├── datadog.png           # Datadog 로고
│   └── v0.png                # v0 로고
├── components/               # 모듈화된 React 컴포넌트
│   ├── Dashboard/           # 메인 대시보드
│   │   ├── Dashboard.tsx    # 메인 컨테이너
│   │   ├── Header/          # 헤더 컴포넌트들
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── StatusSummary.tsx
│   │   │   └── ControlPanel.tsx
│   │   ├── Content/         # 콘텐츠 컴포넌트들
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceGrid.tsx
│   │   │   ├── CategoryView.tsx
│   │   │   └── FavoriteSection.tsx
│   │   └── Modals/          # 모달 컴포넌트들
│   │       └── FilterModal.tsx
│   ├── Layout/              # 반응형 레이아웃 시스템
│   │   ├── ResponsiveLayout.tsx
│   │   └── ResponsiveWrapper.tsx
│   ├── ui/                  # 재사용 가능한 UI 컴포넌트
│   │   ├── Button.tsx
│   │   └── StatusBadge.tsx
│   └── AdFitBanner.tsx      # 광고 컴포넌트
├── hooks/                   # 커스텀 React 훅
│   ├── useResponsive.ts     # 반응형 관리 훅
│   └── useTranslation.ts    # 다국어 번역 훅
├── store/                   # 상태 관리
│   └── dashboardStore.ts    # Zustand 스토어
├── services/               # API 서비스
│   └── api.ts              # 18개 서비스 API 통신
├── types/                  # TypeScript 타입 정의
│   ├── ui.ts               # UI 관련 타입
│   ├── colors.ts           # 색상 시스템 타입
│   └── categories.ts       # 서비스 카테고리 타입
├── utils/                  # 유틸리티 함수
│   └── tailwind.ts         # Tailwind 유틸리티
├── styles/                 # 모듈화된 CSS 시스템
│   ├── main.css            # 메인 CSS 진입점
│   ├── themes/             # 테마 및 변수
│   │   └── variables.css
│   ├── base/               # 기본 스타일
│   │   ├── reset.css
│   │   └── typography.css
│   ├── components/         # 컴포넌트별 스타일
│   │   ├── cards.css
│   │   ├── buttons.css
│   │   ├── status.css
│   │   ├── modals.css
│   │   ├── filters.css
│   │   └── dropdowns.css
│   ├── layouts/           # 레이아웃 스타일
│   │   └── layout.css
│   └── utilities/         # 유틸리티 스타일
│       └── utilities.css
├── locales/               # 다국어 지원
│   ├── ko/                # 한국어
│   │   ├── dashboard.json
│   │   ├── accessibility.json
│   │   └── services.json
│   └── en/                # 영어
│       ├── dashboard.json
│       ├── accessibility.json
│       └── services.json
├── vite-env.d.ts          # Vite 환경 타입
└── main.tsx               # 앱 진입점

docs/                      # 문서
├── GITHUB_ACTIONS_SETUP.md # GitHub Actions 설정 가이드
├── TAILWIND_INTEGRATION.md # Tailwind 통합 가이드
└── ecr-policy.json        # ECR 정책 템플릿

tests/                     # 테스트 디렉토리
├── components/            # 컴포넌트 테스트
├── services/              # 서비스 테스트
├── utils/                 # 유틸리티 테스트
└── integration/           # 통합 테스트

.github/workflows/         # GitHub Actions
└── deploy.yml             # ECR 자동 배포

public/                    # 정적 파일
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── ads.txt

Dockerfile                 # Docker 컨테이너 설정
nginx.conf                 # Nginx 설정
```

## 🎨 주요 기능

### 실시간 상태 모니터링

- **15초마다 자동 상태 업데이트** (이전 30초에서 개선)
- **수동 새로고침 기능** - 전체 및 개별 서비스 새로고침
- **실시간 상태 변경 알림** - 상태 변화 시 즉시 반영
- **즐겨찾기 보존** - 새로고침 후에도 즐겨찾기 설정 유지

### 🚀 빠른 필터 시스템 (NEW!)

- **🚨 문제 서비스만 보기**: 원클릭으로 degraded/outage 상태만 필터링
- **❤️ 즐겨찾기만 보기**: 즐겨찾기된 서비스만 빠른 확인
- **시각적 피드백**: 활성화 시 색상 변화로 상태 표시
- **반응형 지원**: 데스크톱(아이콘+텍스트), 모바일(아이콘만)

### ⌨️ 키보드 단축키 (NEW!)

- **R키**: 전체 서비스 새로고침 (Ctrl+R과 충돌 방지)
- **F키**: 필터 모달 열기/닫기 토글
- **Esc키**: 모든 모달 및 드롭다운 닫기
- **스마트 비활성화**: 입력 필드에서 단축키 자동 비활성화

### 🎨 현대적 UI/UX 시스템 (2025년 1월 최신)

- **모듈화된 컴포넌트 아키텍처** - 1814줄 단일 컴포넌트 → 15개+ 전문화된 컴포넌트
- **반응형 디자인 시스템** - 모바일/태블릿/데스크톱 최적화 + 통합된 브레이크포인트
- **Zustand 중앙화 상태 관리** - 20개+ useState → 1개 스토어 + 영속성 지원
- **Tailwind CSS 4.1 통합 시스템** - CSS 변수와 완전 통합 + 타입 안전성
- **다국어 JSON 시스템** - 한국어/영어 지원 + 네임스페이스 기반 구조
- **접근성(A11y) 완전 지원** - WCAG 가이드라인 준수 + 다국어 aria-label
- **성능 최적화** - React.memo + useMemo + useCallback 적용
- **CSS 모듈화** - 1488줄 단일 파일 → 8개 카테고리별 파일

### 📱 모바일 최적화 (NEW!)

- **모바일 스크롤 개선**: iOS Safari 네이티브 스크롤 지원
- **스크롤 인디케이터**: 상/하단 그라데이션으로 스크롤 가능 영역 표시
- **터치 최적화**: overscroll-behavior, touch-action으로 제스처 개선
- **반응형 모달**: 모바일에서 하단 슬라이드 업 방식

### ⚡ 성능 최적화 (NEW!)

- **이미지 Lazy Loading**: 뷰포트 진입 시에만 이미지 로드
- **Critical 이미지 Preload**: 주요 서비스 아이콘 우선 로드
- **비동기 디코딩**: decoding="async"로 메인 스레드 블로킹 방지
- **대역폭 절약**: 필요한 순간에만 리소스 로드

### 아이콘 시스템

- **실제 서비스 로고**: 각 서비스에 최적화된 PNG 이미지 내장
- **일관된 크기**: 32px 크기로 최적화 (카드 내), 24px (즐겨찾기)
- **TypeScript 지원**: 완전한 타입 안전성 보장
- **호버 효과**: 부드러운 애니메이션과 그라데이션 효과

### 사용자 인터페이스

- **반응형 디자인** (모바일/데스크톱 지원)
- **다크 테마 전용** (개발자 친화적 인터페이스)
- **전체 시스템 상태 요약** - 헤더에 통합 상태 표시
- **부드러운 애니메이션 및 트랜지션**
- **다국어 지원** - 한국어/영어 전환 가능
- **즐겨찾기 시스템** - 중요한 서비스 컴포넌트 즐겨찾기

### 상태 시각화

- 색상으로 구분된 상태 표시
  - 🟢 정상 운영 (operational)
  - 🟡 성능 저하 (degraded)
  - 🔴 서비스 장애 (outage)
- **서비스별 하위 컴포넌트 상태** 세부 정보
- **전체 시스템 상태 요약** - 로딩/정상/저하/장애 서비스 수 표시
- **실시간 업데이트 시간 표시**
- **스켈레톤 로딩 UI** - 개별 서비스 로딩 중 표시

### 다중 버전 지원

- **React SPA**: 모던 웹앱 버전
- **정적 HTML**: 의존성 없는 단순 버전

## 🧪 테스트

이 프로젝트는 TDD(Test-Driven Development) 방식으로 개발되었습니다.

### 테스트 커버리지

- **유틸리티 함수**: 100% 커버리지
- **React 훅**: 핵심 로직 테스트
- **컴포넌트**: 렌더링 및 상호작용 테스트
- **API 서비스**: 모킹을 통한 API 테스트

### 테스트 종류

- **단위 테스트**: 개별 함수 및 훅
- **통합 테스트**: 컴포넌트 상호작용
- **E2E 테스트**: 전체 사용자 플로우

## 🔧 설정

### 이미지 리소스

프로젝트는 각 AI 서비스의 공식 로고를 `src/assets/` 폴더에 저장합니다:

```typescript
// 이미지 import 예시
import gptIcon from '@/assets/gpt.png';
import claudeIcon from '@/assets/claude.png';
import cursorIcon from '@/assets/cursor.png';
import googleAiIcon from '@/assets/google-ai-studio.png';

// ServiceIcon 컴포넌트에서 사용
<img src={gptIcon} alt="GPT" style={{ width: 32, height: 32 }} />
```

### TypeScript 설정

이미지 파일 import를 위한 타입 선언:

```typescript
// src/vite-env.d.ts
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.png' {
  const content: string;
  export default content;
}
declare module '*.webp' {
  const content: string;
  export default content;
}
```

### 환경 변수

현재 버전은 시뮬레이션 모드로 작동하며, 실제 API 키가 필요하지 않습니다.
실제 API 연동 시에는 CORS 이슈 해결을 위해 Vite 개발 서버의 프록시를 사용할 수 있습니다.

```typescript
// vite.config.ts에서 프록시 설정 (필요시)
proxy: {
  '/api/openai': {
    target: 'https://status.openai.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/openai/, ''),
  },
  // ... 기타 서비스
}
```

### 빌드 최적화

- **코드 분할**: 자동 청크 분리
- **트리 쉐이킹**: 사용하지 않는 코드 제거
- **번들 압축**: esbuild를 통한 최적화
- **이미지 최적화**: Vite의 asset 처리

## 🚀 배포

### AWS ECR 자동 배포 (추천)

GitHub Actions를 통한 AWS ECR 자동 배포를 지원합니다.

#### 설정 방법

1. **GitHub Repository Secrets 설정**:
   - `AWS_ACCESS_KEY_ID`: AWS 액세스 키
   - `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 키

2. **배포 트리거**:
   - `main` 또는 `master` 브랜치에 push 시 자동 배포
   - Pull Request 생성 시 빌드 테스트

3. **생성되는 이미지**:
   ```
   014125597282.dkr.ecr.ap-northeast-2.amazonaws.com/service-status:latest
   014125597282.dkr.ecr.ap-northeast-2.amazonaws.com/service-status:<commit-sha>
   ```

자세한 설정 가이드는 [GitHub Actions 설정 가이드](docs/GITHUB_ACTIONS_SETUP.md)를 참조하세요.

### Netlify 배포

```bash
# 빌드
pnpm build

# dist 폴더를 Netlify에 배포
# _redirects 파일 설정 필요 (SPA routing용)
```

### Vercel 배포

```bash
# vercel CLI 사용
npx vercel --prod
```

### Docker 로컬 배포

프로젝트는 멀티스테이지 빌드를 사용하는 최적화된 Dockerfile을 포함하고 있습니다.

#### Docker 이미지 빌드

```bash
docker build -t ai-dashboard .
```

#### Docker 컨테이너 실행

```bash
# 기본 실행
docker run -d \
  --name ai-dashboard \
  -p 8080:80 \
  ai-dashboard

# 상세 옵션 포함 실행
docker run -d \
  --name ai-dashboard \
  -p 8080:80 \
  --restart unless-stopped \
  -e TZ=Asia/Seoul \
  ai-dashboard
```

#### 헬스체크 확인

```bash
# 헬스체크 상태 확인
docker inspect --format='{{.State.Health.Status}}' ai-dashboard

# 헬스체크 엔드포인트 직접 호출
curl http://localhost:8080/health
```

#### 유용한 Docker 명령어

```bash
# 로그 확인
docker logs -f ai-dashboard

# 컨테이너 재시작
docker restart ai-dashboard

# 컨테이너 중지 및 삭제
docker stop ai-dashboard
docker rm ai-dashboard

# 이미지 삭제
docker rmi ai-dashboard
```

## 🎯 개발 가이드

### 새로운 AI 서비스 추가

1. **로고 이미지 추가**: `src/assets/` 폴더에 서비스 로고 추가
2. **ServiceIcon 컴포넌트 업데이트**: 새 서비스 케이스 추가
3. **API 서비스 업데이트**: `src/services/api.ts`에 새 서비스 fetcher 추가
4. **타입 정의 업데이트**: 필요시 타입 정의 추가

### 아이콘 크기 조정

```typescript
// Dashboard.tsx에서 아이콘 크기 변경
<ServiceIcon iconName={service.icon} size={32} /> // 메인 서비스 카드
<ServiceIcon iconName={service.icon} size={24} /> // 즐겨찾기 카드
```

## 🤝 기여 가이드

1. 프로젝트 포크
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

### 코딩 컨벤션

- TypeScript 사용 필수
- ESLint + Prettier 규칙 준수
- 컴포넌트는 함수형 컴포넌트 사용
- 테스트 코드 작성 필수
- 이미지 리소스는 최적화된 포맷 사용

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🛠️ 이전 버전 (Python FastAPI)

이전 Python FastAPI 버전의 코드는 `backup/` 폴더에서 확인할 수 있습니다.

### 마이그레이션 사유

1. **성능 향상**: 클라이언트 사이드 렌더링으로 더 빠른 응답
2. **확장성**: 정적 호스팅으로 비용 절약 및 확장성 개선
3. **개발 경험**: 현대적인 React + TypeScript 스택
4. **유지보수**: 단일 언어 생태계로 일관성 향상
5. **비주얼 개선**: 실제 AI 서비스 로고와 현대적 UI/UX

## 📞 지원

문제가 발생하거나 제안사항이 있으시면 [Issues](https://github.com/your-repo/issues)에 등록해 주세요.

## 📈 최근 업데이트

### v3.1.0 (2025년 1월 12일 - 최신)

#### 🚀 주요 신기능
- **빠른 필터 시스템**: "문제만" / "즐겨찾기만" 원클릭 필터링
- **키보드 단축키**: R(새로고침), F(필터), Esc(닫기) 지원
- **모바일 스크롤 개선**: iOS Safari 네이티브 스크롤 + 시각적 인디케이터
- **이미지 Lazy Loading**: 성능 최적화 + Critical 이미지 Preload

#### 🎯 사용자 경험 개선
- **장애 대응 효율성**: 문제 서비스 즉시 식별 가능
- **파워 유저 지원**: 키보드 단축키로 빠른 조작
- **모바일 경험**: 터치 스크롤 최적화 + 그라데이션 인디케이터
- **성능 향상**: 초기 로딩 시간 단축 + 대역폭 절약

#### 🛠️ 기술적 개선
- **중복 요청 방지**: 동시 API 호출 제어 시스템
- **에러 처리 강화**: 사용자 친화적 에러 메시지 + 재시도 로직
- **Zustand 상태 확장**: quickFilters 상태 추가
- **CSS 최적화**: 모바일 터치 최적화 + 스크롤바 스타일링

### v3.0.0 (2025년 1월 - 이전)

- 🏗️ **아키텍처 전면 개편**: 모놀리식 → 모듈화된 컴포넌트 시스템
- 🎨 **UI/UX 현대화**: 1814줄 단일 컴포넌트 → 15개+ 전문화된 컴포넌트
- 🏪 **Zustand 상태 관리**: 20개+ useState → 중앙화된 스토어 + 영속성
- 📱 **반응형 시스템 통합**: 통합된 브레이크포인트 + 컴포넌트 기반 조건부 렌더링
- 🎨 **Tailwind CSS 4.1 완전 통합**: CSS 변수 + 타입 안전성 + 유틸리티 함수
- 🌍 **다국어 JSON 시스템**: 네임스페이스 기반 번역 + 템플릿 변수 지원
- ♿ **접근성 완전 지원**: WCAG 가이드라인 + 다국어 aria-label
- ⚡ **성능 최적화**: React.memo + useMemo + useCallback 대폭 적용
- 🗂️ **CSS 모듈화**: 1488줄 단일 파일 → 8개 카테고리별 모듈
- 🔧 **개발자 경험 향상**: TypeScript 타입 안전성 + VS Code Tasks + ESLint
- 🚀 **인프라 자동화**: GitHub Actions + AWS ECR + Docker 멀티스테이지 빌드

### v2.1.0 (2024년 12월)

- ✨ **UI/UX 대폭 개선**: 서비스 아이콘 상단 정렬, 상태 표시 최적화
- 🔄 **개별 서비스 새로고침**: 각 서비스별 독립적인 새로고침 버튼 추가
- 💾 **즐겨찾기 보존**: 새로고침 후에도 즐겨찾기 설정 유지
- ⚡ **성능 개선**: 15초 자동 업데이트 (이전 30초에서 개선)
- 🌍 **다국어 지원**: 한국어/영어 전환 기능
- 📱 **반응형 개선**: 모바일/데스크톱 최적화

### v2.0.0 (초기 버전)

- ✨ **실제 AI 서비스 로고 이미지 적용**: 이모지 대신 공식 로고 사용
- 📱 **하위 컴포넌트 상태 모니터링**: 각 서비스의 세부 컴포넌트별 상태 표시
- 🔧 **TypeScript 완전 지원**: 이미지 import 타입 안전성
- ⚡ **성능 최적화**: 인라인 스타일 및 최적화된 컴포넌트 구조

### 📊 개선 지표 (v2.0 → v3.0)

- **코드 베이스**: 3,302줄 → 모듈화된 구조
- **컴포넌트**: 1개 거대 → 15개+ 전문화
- **CSS**: 1개 거대 파일 → 8개 모듈
- **상태 관리**: 분산된 hooks → 중앙화된 스토어
- **타입 안전성**: 부분적 → 100% TypeScript
- **접근성**: 기본적 → WCAG 완전 준수
- **성능**: 기본적 → 메모이제이션 최적화
- **다국어**: 하드코딩 → JSON 모듈 시스템

## 🔧 주요 개발 도구 및 인프라

### ⚙️ 개발 환경

- **VS Code Tasks**: 개발 서버, 빌드, 테스트 자동화
- **ESLint + Prettier**: 코드 품질 및 포맷팅 자동화
- **TypeScript**: 100% 타입 안전성
- **Vitest**: 테스트 자동화 및 커버리지

### 🚀 배포 인프라

- **GitHub Actions**: CI/CD 자동화
- **AWS ECR**: 컨테이너 이미지 관리
- **Docker**: 멀티스테이지 빌드 최적화
- **Nginx**: 정적 파일 서빙 최적화

### 📚 문서화

- **[Tailwind 통합 가이드](docs/TAILWIND_INTEGRATION.md)**: 색상 시스템 및 유틸리티 사용법
- **[GitHub Actions 설정](docs/GITHUB_ACTIONS_SETUP.md)**: 자동 배포 설정 가이드
- **[ECR 정책 템플릿](docs/ecr-policy.json)**: AWS ECR 권한 설정

### 🎯 코드 품질

- **모듈화된 아키텍처**: 관심사 분리 및 재사용성
- **반응형 컴포넌트 시스템**: 디바이스별 최적화
- **타입 안전한 색상 시스템**: Tailwind + TypeScript 통합
- **성능 최적화**: 메모이제이션 및 코드 분할
