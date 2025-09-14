# GitHub OIDC 설정 가이드

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
