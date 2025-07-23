# 🛠️ Service-Status AWS EKS Deployment TODO

> 모든 체크리스트를 완료하면 GitHub Actions → ECR → EKS 까지 완전 자동화된 배포 파이프라인이 구축됩니다.

---

## 1. ECR 준비
- [ ] **ECR 리포지터리 생성**  
  `aws ecr create-repository --repository-name service-status --region ap-northeast-2`
- [ ] **Image Scan on Push 활성화**
- [ ] (선택) **Lifecycle Rule** 로 오래된 태그 정리

## 2. AWS 인증 방식 선택
- [ ] **OIDC + IAM Role** *(권장)*  
  - [ ] AWS IAM OIDC Provider에 `token.actions.githubusercontent.com` 추가  
  - [ ] Role `gha-ecr-push` 생성, `AmazonEC2ContainerRegistryPowerUser` Policy 연결  
  - [ ] Role ARN을 `AWS_ROLE_TO_ASSUME` Secret 로 저장
- [ ] 또는 **AccessKey 방식**  
  - [ ] 사용자 `gha-ecr-user` 생성, 최소 `ECR PowerUser` Policy  
  - [ ] AccessKey/Secret 저장

## 3. GitHub 저장소 Secrets
| Key | 값 |
|-----|----|
| `AWS_ACCOUNT_ID` | 123456789012 |
| `AWS_REGION` | ap-northeast-2 |
| `ECR_REPOSITORY` | service-status |
| `AWS_ROLE_TO_ASSUME` | arn:aws:iam::123456789012:role/gha-ecr-push *(OIDC)* |
| `AWS_ACCESS_KEY_ID` | *(키 방식)* |
| `AWS_SECRET_ACCESS_KEY` | *(키 방식)* |
| `IMAGE_TAG` | latest *(선택)* |

## 4. GitHub Actions 워크플로 작성
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

## 5. Dockerfile 최적화
- [ ] Builder + Runtime 멀티스테이지 적용
- [ ] `HEALTHCHECK` 추가: `curl -f http://localhost/ || exit 1`
- [ ] 이미지 크기 확인 (`docker images`)

## 6. EKS 매니페스트/Helm 차트
- [ ] `namespace.yaml`
- [ ] `deployment.yaml` (이미지 태그 변수화)
- [ ] `service.yaml` (ClusterIP)
- [ ] `ingress.yaml` (ALB Controller annotations)
- [ ] Helm Chart 로 parameterize (`values.yaml`)

## 7. 자동 배포 연동 (선택)
- [ ] ArgoCD / Flux 설치, ECR Image update 자동 sync
- 또는
- [ ] GitHub Actions 단계 추가: `helm upgrade --install ...`

## 8. 도메인 & TLS
- [ ] Route 53 레코드: `status.example.com` → ALB DNS
- [ ] ACM TLS 인증서 발급 & Ingress annotation에 ARN 설정

## 9. 모니터링 & 알림
- [ ] CloudWatch Container Insights 활성화
- [ ] ECR Image Scan 결과 SNS 알림 (선택)
- [ ] ALB Access Log → S3

---
**완료 시점:** 모든 체크박스 완료 후 PR → Merge → main 브랜치 push 시 자동으로
1) Docker 이미지 빌드 & ECR 푸시  
2) (선택) EKS 배포 업데이트  
3) 모니터링 및 알림 동작  
이 전자동화됩니다. 