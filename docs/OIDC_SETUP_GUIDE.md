# GitHub OIDC 설정 가이드

> **마지막 업데이트**: 2025-01-30

GitHub Actions에서 AWS ECR에 접근하기 위한 OIDC(OpenID Connect) 인증 설정 가이드입니다.

OIDC를 사용하면 AWS 액세스 키를 GitHub Secrets에 저장할 필요 없이 안전하게 인증할 수 있습니다.

## 개요

OIDC를 사용하면:
- ✅ AWS 액세스 키를 GitHub Secrets에 저장할 필요 없음
- ✅ 더 안전한 인증 방식
- ✅ 역할 기반 접근 제어

## 1. AWS에서 GitHub OIDC Provider 생성

### AWS CLI로 설정:
```bash
# 1. GitHub OIDC Provider 생성
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

# 2. Trust Policy 파일 생성
cat > github-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::014125597282:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:garyjeong/service-status:*"
        }
      }
    }
  ]
}
EOF

# 3. IAM Role 생성
aws iam create-role \
  --role-name GitHubActionsECRPush \
  --assume-role-policy-document file://github-trust-policy.json

# 4. ECR 권한 정책 연결
aws iam attach-role-policy \
  --role-name GitHubActionsECRPush \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess
```

### AWS Console에서 설정:

1. **IAM → Identity providers → Add provider**
   - Provider type: OpenID Connect
   - Provider URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`

2. **IAM → Roles → Create role**
   - Trusted entity: Web identity
   - Identity provider: token.actions.githubusercontent.com
   - Audience: sts.amazonaws.com
   - Condition: `token.actions.githubusercontent.com:sub` = `repo:garyjeong/service-status:*`

3. **권한 정책 연결**:
   - `AmazonEC2ContainerRegistryFullAccess`

## 2. 현재 설정 확인

```bash
# OIDC Provider 확인
aws iam list-open-id-connect-providers

# Role 확인
aws iam get-role --role-name GitHubActionsECRPush
```

## 3. 테스트

OIDC 설정 완료 후 GitHub Actions를 다시 실행하면 OIDC 인증이 성공적으로 작동합니다.

## 📚 관련 문서

- [GitHub Actions 설정 가이드](./GITHUB_ACTIONS_SETUP.md) - 전체 CI/CD 설정
- [배포 가이드](./DEPLOYMENT_GUIDE.md) - 배포 프로세스
