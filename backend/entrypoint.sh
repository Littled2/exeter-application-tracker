#!/bin/bash
set -e

# Load runtime secrets
if [ -f /run/secrets/backend_build_secrets ]; then
  set -a
  source /run/secrets/backend_build_secrets
  set +a
fi

echo "📦 Running PocketBase setup..."

echo "Secrets: $BACKEND_BUILD_SECRET"

# Run one-off setup with secrets
/pb/pocketbase superuser upsert "$DEFAULT_SUPERUSER_EMAIL" "$DEFAULT_SUPERUSER_PASSWORD"
/pb/pocketbase set-oauth google "$GOOGLE_OAUTH_CLIENT_ID" "$GOOGLE_OAUTH_CLIENT_SECRET"
/pb/pocketbase load-default-locations
/pb/pocketbase load-default-organisations

# Start PocketBase
echo "🚀 Starting PocketBase server..."
exec /pb/pocketbase serve --http=0.0.0.0:8090
