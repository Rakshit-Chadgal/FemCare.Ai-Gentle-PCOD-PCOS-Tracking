#!/usr/bin/env bash
# deploy.sh — Build, push, and deploy FemCare.AI backend to ECS
#
# Usage:
#   ./infra/deploy.sh [environment] [image-tag]
#
# Examples:
#   ./infra/deploy.sh prod v1.2.3
#   ./infra/deploy.sh dev latest
#
# Prerequisites:
#   - AWS CLI v2 configured with a profile that has ECR, ECS, CloudFormation,
#     IAM, EC2, and ELB permissions
#   - Docker running locally
#   - jq installed (for JSON parsing)

set -euo pipefail

ENVIRONMENT="${1:-prod}"
IMAGE_TAG="${2:-$(git rev-parse --short HEAD 2>/dev/null || echo latest)}"
PROJECT_NAME="femcare"
AWS_REGION="${AWS_REGION:-us-east-1}"
INFRA_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Deploying FemCare.AI backend"
echo "    Environment : ${ENVIRONMENT}"
echo "    Image tag   : ${IMAGE_TAG}"
echo "    Region      : ${AWS_REGION}"
echo ""

# ── Step 1: Deploy foundation stack (idempotent - skips if already exists) ────
echo "==> [1/4] Deploying foundation stack..."
aws cloudformation deploy \
  --template-file "${INFRA_DIR}/01-foundation.yml" \
  --stack-name "${PROJECT_NAME}-foundation" \
  --parameter-overrides ProjectName="${PROJECT_NAME}" \
  --capabilities CAPABILITY_NAMED_IAM \
  --region "${AWS_REGION}" \
  --no-fail-on-empty-changeset

# ── Step 2: Deploy networking stack ───────────────────────────────────────────
echo "==> [2/4] Deploying networking stack..."
aws cloudformation deploy \
  --template-file "${INFRA_DIR}/02-networking.yml" \
  --stack-name "${PROJECT_NAME}-${ENVIRONMENT}-networking" \
  --parameter-overrides \
      ProjectName="${PROJECT_NAME}" \
      Environment="${ENVIRONMENT}" \
  --capabilities CAPABILITY_NAMED_IAM \
  --region "${AWS_REGION}" \
  --no-fail-on-empty-changeset

# ── Step 3: Build and push Docker image to ECR ────────────────────────────────
echo "==> [3/4] Building and pushing Docker image..."

ECR_URI=$(aws cloudformation list-exports \
  --region "${AWS_REGION}" \
  --query "Exports[?Name=='${PROJECT_NAME}-ecr-uri'].Value" \
  --output text)

aws ecr get-login-password --region "${AWS_REGION}" \
  | docker login --username AWS --password-stdin "${ECR_URI}"

docker build \
  --platform linux/amd64 \
  -t "${ECR_URI}:${IMAGE_TAG}" \
  -t "${ECR_URI}:latest" \
  "$(dirname "${INFRA_DIR}")/backend"

docker push "${ECR_URI}:${IMAGE_TAG}"
docker push "${ECR_URI}:latest"

# ── Step 4: Deploy ECS service and Auto Scaling stack ─────────────────────────
echo "==> [4/4] Deploying ECS service and Auto Scaling stack..."
aws cloudformation deploy \
  --template-file "${INFRA_DIR}/03-ecs-autoscaling.yml" \
  --stack-name "${PROJECT_NAME}-${ENVIRONMENT}-ecs" \
  --parameter-overrides \
      ProjectName="${PROJECT_NAME}" \
      Environment="${ENVIRONMENT}" \
      ImageTag="${IMAGE_TAG}" \
  --capabilities CAPABILITY_NAMED_IAM \
  --region "${AWS_REGION}" \
  --no-fail-on-empty-changeset

echo ""
echo "==> Deployment complete."

ALB_DNS=$(aws cloudformation list-exports \
  --region "${AWS_REGION}" \
  --query "Exports[?Name=='${PROJECT_NAME}-${ENVIRONMENT}-alb-dns'].Value" \
  --output text)

echo "    API endpoint: http://${ALB_DNS}/api"
echo ""
echo "    Monitor scaling activity:"
echo "    aws application-autoscaling describe-scaling-activities \\"
echo "      --service-namespace ecs --region ${AWS_REGION}"
