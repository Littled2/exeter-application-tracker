#!/bin/bash
set -ex  # -e = exit on error, -x = print each command before executing

# Load runtime secrets
if [ -f /run/secrets/backend_build_secrets ]; then
  echo "🔑 Loading runtime secrets from /run/secrets/backend_build_secrets..."
  set -a
  source /run/secrets/backend_build_secrets
  set +a
else
  echo "⚠️ No secrets file found at /run/secrets/backend_build_secrets"
fi

echo "📦 Running PocketBase setup..."

# Show secret values (be careful in prod logs!)
echo "✅ DEFAULT_SUPERUSER_EMAIL: $DEFAULT_SUPERUSER_EMAIL"
echo "✅ DEFAULT_SUPERUSER_PASSWORD: ${DEFAULT_SUPERUSER_PASSWORD:0:2}********"  # mask password
echo "✅ GOOGLE_OAUTH_CLIENT_ID: ${GOOGLE_OAUTH_CLIENT_ID:0:4}..."
echo "✅ GOOGLE_OAUTH_CLIENT_SECRET: ${GOOGLE_OAUTH_CLIENT_SECRET:0:4}..."

# Run one-off setup with secrets
echo "➡️ Creating / updating superuser..."
/pb/pocketbase superuser upsert "$DEFAULT_SUPERUSER_EMAIL" "$DEFAULT_SUPERUSER_PASSWORD"

echo "➡️ Configuring Google OAuth..."
/pb/pocketbase set-oauth google "$GOOGLE_OAUTH_CLIENT_ID" "$GOOGLE_OAUTH_CLIENT_SECRET"

echo "➡️ Loading default locations..."
/pb/pocketbase load-default-locations

echo "➡️ Loading default organisations..."
/pb/pocketbase load-default-organisations

# Start PocketBase
echo "🚀 Starting PocketBase server..."
exec /pb/pocketbase serve --http=0.0.0.0:8090
