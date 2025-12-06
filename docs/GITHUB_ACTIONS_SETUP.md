# GitHub Actions ECR Push 설정 가이드

> **마지막 업데이트**: 2025-01-30

이 프로젝트는 GitHub Actions를 통해 Docker 이미지를 빌드하고 Amazon ECR에 자동으로 푸시하는 워크플로우를 포함합니다.

## 개요

`main` 브랜치에 푸시할 때마다 자동으로 Docker 이미지를 빌드하고 ECR에 푸시합니다.

## 1. 필수 GitHub Secrets 설정

Add these repository secrets (Settings → Secrets and variables → Actions → New repository secret):

- `AWS_ACCESS_KEY_ID`: IAM access key with ECR permissions
- `AWS_SECRET_ACCESS_KEY`: IAM secret key
- `AWS_ACCOUNT_ID`: Your AWS account id (digits only)
- `AWS_REGION`: Region (e.g. `ap-northeast-2`)
- `ECR_REPOSITORY`: ECR repo name (e.g. `service-status`)

Minimal IAM permissions for the user/role used by Actions:

```
AmazonEC2ContainerRegistryFullAccess
```

or a custom policy allowing:

- `ecr:CreateRepository`
- `ecr:DescribeRepositories`
- `ecr:BatchCheckLayerAvailability`
- `ecr:CompleteLayerUpload`
- `ecr:InitiateLayerUpload`
- `ecr:PutImage`
- `ecr:UploadLayerPart`
- `ecr:GetAuthorizationToken`

## 2. 워크플로우

File: `.github/workflows/ecr-push.yml`

- Triggers on `push` to `main`.
- Builds Docker image using `Dockerfile`.
- Tags and pushes as:
  - `${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}:latest`
  - `${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}:${GITHUB_SHA}`

## 3. 검증

- Check Actions tab → build-and-push-ecr → latest run → ensure `Login to Amazon ECR` and `Build and push Docker image` steps succeed.
- Verify pushed images in ECR Console → Repositories → `${ECR_REPOSITORY}`.

## 4. 이미지 Pull 및 배포

Use the `:latest` (or specific commit SHA) tag from ECR in your runtime environment:

```bash
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest
```

## 📚 관련 문서

- [배포 가이드](./DEPLOYMENT_GUIDE.md) - 전체 배포 프로세스
- [OIDC 설정 가이드](./OIDC_SETUP_GUIDE.md) - OIDC 인증 설정 (권장)
