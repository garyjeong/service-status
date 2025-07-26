# 🛠️ Service-Status TODO

이 문서는 서비스 상태 대시보드의 개발 및 배포 작업을 추적하는 마스터 플랜입니다.

---

## 1. 애플리케이션 및 코드베이스 개선

이 섹션은 코드 품질, 유지보수성, 확장성을 높이기 위한 작업 목록입니다.

### 1.1. 리팩토링 (Refactoring)
- [ ] **`Dashboard.tsx` 컴포넌트 분리**
  - [ ] `Header` 컴포넌트: 상단 헤더 및 컨트롤 버튼 분리
  - [ ] `ServiceCard` 컴포넌트: 개별 서비스 카드 UI 및 로직 분리
  - [ ] `ServiceGrid` 컴포넌트: 서비스 카드 목록 렌더링 로직 분리
  - [ ] `FilterModal` 컴포넌트: 필터 설정 모달 UI 및 로직 분리
  - [ ] `Favorites` 섹션 컴포넌트: 즐겨찾기 영역 분리
- [ ] **Custom Hooks 활용**
  - [ ] `useServices` Hook: `api.ts`의 함수를 호출하고 서비스 데이터, 로딩, 에러 상태를 관리하는 로직 분리
  - [ ] `useLocalStorage` Hook: 필터, 즐겨찾기, 언어 설정을 LocalStorage에 저장하고 불러오는 로직 추상화
- [ ] **`api.ts` 코드 추상화**
  - [ ] `fetchServiceStatus` 헬퍼 함수를 만들어 중복되는 `try-catch` 및 상태 정규화 로직 통합

### 1.2. 아키텍처 개선
- [ ] **CORS 프록시 대체**
  - [ ] Vercel/Netlify Functions 또는 Cloudflare Workers 같은 서버리스 함수를 이용해 자체 백엔드 프록시 구현
  - [ ] `api.ts`가 공개 프록시 대신 자체 백엔드 프록시를 호출하도록 수정
- [ ] **전역 상태 관리 도입**
  - [ ] React Context API와 `useReducer`를 사용하여 필터, 즐겨찾기, 언어, 정렬 상태를 전역으로 관리
  - [ ] `Dashboard.tsx`에서 상태 관련 로직을 Context Provider로 이전
- [ ] **설정 중앙화**
  - [ ] `src/config/services.ts` 파일을 생성하여 서비스 목록, 순서, 아이콘 정보 등을 중앙에서 관리
  - [ ] `Dashboard.tsx`와 `api.ts`가 이 설정 파일을 참조하도록 수정

### 1.3. 테스트 커버리지 확대
- [ ] **API 서비스 테스트**
  - [ ] `msw` (Mock Service Worker)를 사용하여 각 `fetch...Status` 함수에 대한 단위 테스트 작성
- [ ] **컴포넌트 테스트**
  - [ ] `ServiceCard`, `FilterModal` 등 주요 컴포넌트에 대한 렌더링 및 상호작용 테스트 작성
- [ ] **유틸리티 함수 테스트**
  - [ ] `utils/status.ts`의 `generateStatusSummary` 같은 핵심 로직에 대한 테스트 추가

### 1.4. 기능 개선
- [ ] **상세 이력 페이지 추가**
  - [ ] 각 서비스 카드 클릭 시 지난 장애 이력을 볼 수 있는 모달 또는 별도 페이지 구현
- [ ] **알림 기능**
  - [ ] 특정 서비스 장애 발생 시 브라우저 푸시 알림 기능 추가 (사용자 동의 기반)
- [ ] **접근성(a11y) 개선**
  - [ ] 키보드 네비게이션, ARIA 속성 등 웹 접근성 표준 준수 검토 및 개선

---

## 2. AWS EKS 배포 자동화

이 섹션은 GitHub Actions를 통해 ECR, EKS로 자동화된 배포 파이프라인을 구축하는 작업 목록입니다.

### 2.1. ECR 준비
- [ ] **ECR 리포지터리 생성**  
  `aws ecr create-repository --repository-name service-status --region ap-northeast-2`
- [ ] **Image Scan on Push 활성화**
- [ ] (선택) **Lifecycle Rule** 로 오래된 태그 정리

### 2.2. AWS 인증 방식 선택
- [ ] **OIDC + IAM Role** *(권장)*  
  - [ ] AWS IAM OIDC Provider에 `token.actions.githubusercontent.com` 추가  
  - [ ] Role `gha-ecr-push` 생성, `AmazonEC2ContainerRegistryPowerUser` Policy 연결  
  - [ ] Role ARN을 `AWS_ROLE_TO_ASSUME` Secret 로 저장
- [ ] 또는 **AccessKey 방식**  
  - [ ] 사용자 `gha-ecr-user` 생성, 최소 `ECR PowerUser` Policy  
  - [ ] AccessKey/Secret 저장

### 2.3. GitHub 저장소 Secrets
| Key | 값 |
|-----|----|
| `AWS_ACCOUNT_ID` | 123456789012 |
| `AWS_REGION` | ap-northeast-2 |
| `ECR_REPOSITORY` | service-status |
| `AWS_ROLE_TO_ASSUME` | arn:aws:iam::123456789012:role/gha-ecr-push *(OIDC)* |
| `AWS_ACCESS_KEY_ID` | *(키 방식)* |
| `AWS_SECRET_ACCESS_KEY` | *(키 방식)* |
| `IMAGE_TAG` | latest *(선택)* |

### 2.4. GitHub Actions 워크플로 작성
- [ ] `.github/workflows/ecr-push.yml` 추가
  ```yaml
  name: Build & Push Docker → ECR
  on:
    push:
      branches: [ "main" ]
    pull_request:
      branches: [ "main" ]
  permissions:
    id-token: write  # OIDC
    contents: read
  env:
    AWS_REGION: ${{ secrets.AWS_REGION }}
    ECR_REPOSITORY: ${{ secrets.ECR_REPOSITORY }}
    IMAGE_TAG: ${{ secrets.IMAGE_TAG || github.sha }}
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: 'pnpm'
        - run: corepack enable
        - run: pnpm install
        - run: pnpm run build
        # AWS creds (OIDC or AccessKey)
        - uses: aws-actions/configure-aws-credentials@v4
          with:
            role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}
            aws-region: ${{ env.AWS_REGION }}
        # ECR 로그인
        - uses: aws-actions/amazon-ecr-login@v2
        - uses: docker/setup-buildx-action@v3
        - uses: docker/build-push-action@v5
          with:
            context: .
            file: Dockerfile
            push: true
            tags: |
              ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.${{ env.AWS_REGION }}.amazonaws.com/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }}
              ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.${{ env.AWS_REGION }}.amazonaws.com/${{ env.ECR_REPOSITORY }}:latest
            cache-from: type=gha
            cache-to: type=gha,mode=max
  ```
- [ ] 필요 시 **테스트 단계**(`pnpm run test`) 포함
- [ ] 필요 시 **Multi-Arch build**: `platforms: linux/amd64,linux/arm64`

### 2.5. Dockerfile 최적화
- [ ] Builder + Runtime 멀티스테이지 적용
- [ ] `HEALTHCHECK` 추가: `curl -f http://localhost/ || exit 1`
- [ ] 이미지 크기 확인 (`docker images`)

### 2.6. EKS 매니페스트/Helm 차트
- [ ] `namespace.yaml`
- [ ] `deployment.yaml` (이미지 태그 변수화)
- [ ] `service.yaml` (ClusterIP)
- [ ] `ingress.yaml` (ALB Controller annotations)
- [ ] Helm Chart 로 parameterize (`values.yaml`)

### 2.7. 자동 배포 연동 (선택)
- [ ] ArgoCD / Flux 설치, ECR Image update 자동 sync
- 또는
- [ ] GitHub Actions 단계 추가: `helm upgrade --install ...`

### 2.8. 도메인 & TLS
- [ ] Route 53 레코드: `status.example.com` → ALB DNS
- [ ] ACM TLS 인증서 발급 & Ingress annotation에 ARN 설정

### 2.9. 모니터링 & 알림
- [ ] CloudWatch Container Insights 활성화
- [ ] ECR Image Scan 결과 SNS 알림 (선택)
- [ ] ALB Access Log → S3

---
**완료 시점:** 모든 체크박스 완료 후 PR → Merge → main 브랜치 push 시 자동으로
1) Docker 이미지 빌드 & ECR 푸시  
2) (선택) EKS 배포 업데이트  
3) 모니터링 및 알림 동작  
이 전자동화됩니다.