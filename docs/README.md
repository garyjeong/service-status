# 📚 문서 목록

이 폴더에는 Service Status Dashboard 프로젝트의 상세 문서들이 포함되어 있습니다.

## 📋 문서 목록

### 🎯 핵심 문서

- **[SERVICES.md](./SERVICES.md)** - 모니터링 서비스 정의서
  - 모든 모니터링 서비스의 상세 정의
  - API endpoint 및 모니터링 방식
  - 하위 컴포넌트 목록
  - 서비스 추가 가이드

### 🚀 배포 관련

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - 배포 가이드
  - AWS ECR 배포 방법
  - Docker 배포 방법
  - 문제 해결 가이드

- **[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)** - GitHub Actions 설정
  - ECR 자동 배포 설정
  - 필수 Secrets 설정
  - 워크플로우 설명

- **[OIDC_SETUP_GUIDE.md](./OIDC_SETUP_GUIDE.md)** - OIDC 설정 가이드
  - GitHub OIDC Provider 설정
  - IAM Role 설정
  - 안전한 인증 방법

### 🔧 기술 문서

- **[PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md)** - 프로젝트 분석 보고서
  - 프로젝트 구조 및 아키텍처 분석
  - 코드 품질 및 성능 분석
  - 개선 사항 및 권장사항

- **[TODO.md](./TODO.md)** - 최적화 계획서
  - 현재 구현된 기능 목록
  - 개선 우선순위 및 계획
  - 성능 최적화 방안

- **[ENDPOINT_FIX_SUMMARY.md](./ENDPOINT_FIX_SUMMARY.md)** - Endpoint 개선 요약
  - 모니터링 endpoint 개선 사항
  - 다중 CORS 프록시 지원
  - 재시도 로직 구현

- **[SERVICES_API_VERIFICATION.md](./SERVICES_API_VERIFICATION.md)** - API 검증 보고서
  - 모든 서비스의 상세 API 단계
  - 실제 사용 URL 검증
  - 하위 API 구조 문서화

---

## 📖 빠른 시작

### 새로운 서비스 추가
1. [SERVICES.md](./SERVICES.md)에서 서비스 추가 가이드 참조
2. `src/services/api.ts`에 fetcher 함수 추가
3. `src/types/categories.ts`에 카테고리 추가

### 배포하기
1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 참조
2. [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)로 CI/CD 설정
3. [OIDC_SETUP_GUIDE.md](./OIDC_SETUP_GUIDE.md)로 안전한 인증 설정 (권장)

---

**최종 업데이트**: 2025-01-30

