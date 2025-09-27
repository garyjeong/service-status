# GitHub Actions ECR Push Setup

This project ships a workflow that builds the Docker image and pushes it to Amazon ECR on every push to `main`.

## 1) Required GitHub Secrets

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

## 2) Workflow

File: `.github/workflows/ecr-push.yml`

- Triggers on `push` to `main`.
- Builds Docker image using `Dockerfile`.
- Tags and pushes as:
  - `${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}:latest`
  - `${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}:${GITHUB_SHA}`

## 3) Validate

- Check Actions tab → build-and-push-ecr → latest run → ensure `Login to Amazon ECR` and `Build and push Docker image` steps succeed.
- Verify pushed images in ECR Console → Repositories → `${ECR_REPOSITORY}`.

## 4) Pulling/Deploying

Use the `:latest` (or specific commit SHA) tag from ECR in your runtime environment:

```bash
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest
```
