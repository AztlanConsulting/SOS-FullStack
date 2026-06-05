#!/bin/bash

ENV_FILE=".env.k6"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE not found"
  return 1 2>/dev/null || exit 1
fi

set -a
source "$ENV_FILE"
set +a

echo "✅ Loaded $ENV_FILE into current shell"
echo "👉 Now run: k6 run test.js"