#!/usr/bin/env bash
# create-secret.sh — Create or update the Secrets Manager secret for FemCare.AI
#
# Run this ONCE before the first deploy, and again whenever a secret value changes.
# The secret is never stored in CloudFormation templates or source control.
#
# Usage:
#   ./infra/create-secret.sh [environment] [path-to-env-file]
#
# Example:
#   ./infra/create-secret.sh prod ./backend/.env

set -euo pipefail

ENVIRONMENT="${1:-prod}"
ENV_FILE="${2:-./backend/.env}"
SECRET_NAME="femcare/${ENVIRONMENT}/backend"
AWS_REGION="${AWS_REGION:-us-east-1}"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Error: env file not found at ${ENV_FILE}"
  exit 1
fi

echo "==> Building secret JSON from ${ENV_FILE}..."

# Read the .env file and build a JSON object.
# Skips blank lines and comment lines (starting with #).
SECRET_JSON=$(python3 - <<'PYEOF'
import sys, json, os

env_file = sys.argv[1] if len(sys.argv) > 1 else "./backend/.env"
result = {}

with open(env_file) as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, _, value = line.partition("=")
        # Strip surrounding quotes if present
        value = value.strip().strip('"').strip("'")
        result[key.strip()] = value

print(json.dumps(result))
PYEOF
"${ENV_FILE}")

# Check whether the secret already exists
if aws secretsmanager describe-secret \
    --secret-id "${SECRET_NAME}" \
    --region "${AWS_REGION}" \
    --output text \
    --query "Name" 2>/dev/null | grep -q "${SECRET_NAME}"; then

  echo "==> Updating existing secret: ${SECRET_NAME}"
  aws secretsmanager update-secret \
    --secret-id "${SECRET_NAME}" \
    --secret-string "${SECRET_JSON}" \
    --region "${AWS_REGION}"
else
  echo "==> Creating new secret: ${SECRET_NAME}"
  aws secretsmanager create-secret \
    --name "${SECRET_NAME}" \
    --description "FemCare.AI backend environment variables (${ENVIRONMENT})" \
    --secret-string "${SECRET_JSON}" \
    --region "${AWS_REGION}"
fi

echo ""
echo "==> Secret stored at: ${SECRET_NAME}"
echo "    The ECS task execution role will resolve each key as an"
echo "    individual environment variable at container startup."
echo ""
echo "    IMPORTANT: Delete your local .env file or ensure it is in .gitignore."
