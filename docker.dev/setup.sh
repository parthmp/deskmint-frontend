#!/bin/bash
set -e

echo "🚀 Setting up Vue environment..."

# Setup .env
echo "⚙️  Copying .env file..."
docker compose exec frontend cp src/env.example.ts src/env.ts

# Fix file permissions on host
echo "📁 Setting file permissions..."
ACTUAL_USER=$(logname 2>/dev/null || echo $SUDO_USER)
sudo setfacl -R -m u:${ACTUAL_USER}:rwx .
sudo setfacl -R -d -m u:${ACTUAL_USER}:rwx .

echo ""
echo "✅ Setup complete!"
echo "🌐 App: http://localhost:5173"