# AI 서비스 상태 모니터링 대시보드

실시간으로 주요 AI 서비스들의 상태를 모니터링하는 React 대시보드입니다.

## ⚡ 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Testing**: Vitest + Testing Library
- **Styling**: CSS Variables + Tailwind-like Utilities
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Hooks + Context API

## 🚀 지원되는 서비스

- **OpenAI ChatGPT** - ChatGPT 웹 인터페이스 및 API
- **Anthropic Claude** - Claude 채팅 및 API 서비스
- **Cursor Editor** - AI 코드 에디터 서비스
- **Google AI Studio** - Gemini API 및 AI Studio

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

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
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

## 🏗️ 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Dashboard.tsx    # 메인 대시보드
│   ├── StatusSummary.tsx # 상태 요약 카드
│   ├── ServiceCard.tsx  # 개별 서비스 카드
│   └── LoadingSpinner.tsx # 로딩 스피너
├── hooks/              # Custom React Hooks
│   └── useStatus.ts    # 상태 관리 훅
├── services/           # API 서비스
│   └── api.ts         # 외부 API 통신
├── types/             # TypeScript 타입 정의
│   └── status.ts      # 상태 관련 타입
├── utils/             # 유틸리티 함수
│   └── status.ts      # 상태 변환 및 계산
└── test/              # 테스트 설정
    └── setup.ts       # 테스트 환경 설정

tests/                 # 테스트 파일
├── components/        # 컴포넌트 테스트
├── hooks/            # 훅 테스트
├── services/         # 서비스 테스트
└── utils/            # 유틸리티 테스트
```

## 🎨 주요 기능

### 실시간 상태 모니터링
- 30초마다 자동 상태 업데이트
- 수동 새로고침 기능
- 실시간 상태 변경 알림

### 사용자 인터페이스
- 반응형 디자인 (모바일/데스크톱 지원)
- 다크/라이트 모드 전환
- Sticky 상태 요약 바
- 부드러운 애니메이션

### 상태 시각화
- 색상으로 구분된 상태 표시
- 서비스별 컴포넌트 상태 세부 정보
- 전체 시스템 상태 요약
- 히스토리 및 업데이트 시간

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

### 환경 변수

프로젝트는 클라이언트 사이드에서 직접 외부 API를 호출합니다. 
CORS 이슈 해결을 위해 Vite 개발 서버의 프록시를 사용합니다.

```typescript
// vite.config.ts에서 프록시 설정
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

- **코드 분할**: vendor와 utils 청크 분리
- **트리 쉐이킹**: 사용하지 않는 코드 제거
- **번들 압축**: esbuild를 통한 최적화
- **소스맵**: 디버깅을 위한 소스맵 생성

## 🚀 배포

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

### Docker 배포

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
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

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🛠️ 이전 버전 (Python FastAPI)

이전 Python FastAPI 버전의 코드는 `backup/` 폴더에서 확인할 수 있습니다.

### 마이그레이션 사유

1. **성능 향상**: 클라이언트 사이드 렌더링으로 더 빠른 응답
2. **확장성**: 정적 호스팅으로 비용 절약 및 확장성 개선
3. **개발 경험**: 현대적인 React + TypeScript 스택
4. **유지보수**: 단일 언어 생태계로 일관성 향상

## 📞 지원

문제가 발생하거나 제안사항이 있으시면 [Issues](https://github.com/your-repo/issues)에 등록해 주세요.
