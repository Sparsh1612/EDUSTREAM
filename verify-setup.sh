#!/bin/bash
# EduStream Setup & Verification Script
# Run this to verify the entire setup is correct

set -e

echo "🔍 EduStream Project Verification"
echo "=================================="
echo ""

# Check Docker
echo "✓ Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "✗ Docker not installed. Please install Docker."
    exit 1
fi
echo "  Docker version: $(docker --version)"

# Check Docker Compose
echo "✓ Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "✗ Docker Compose not installed. Please install Docker Compose."
    exit 1
fi
echo "  Docker Compose version: $(docker-compose --version)"

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js not installed. Please install Node.js 18+."
    exit 1
fi
echo "  Node version: $(node --version)"
echo "  npm version: $(npm --version)"

# Check project structure
echo ""
echo "✓ Verifying project structure..."

dirs=(
    "apps/backend"
    "apps/frontend"
    "infra/kubernetes"
    "infra/terraform"
    "infra/cicd"
)

for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✓ $dir"
    else
        echo "  ✗ $dir NOT FOUND"
    fi
done

# Check key files
echo ""
echo "✓ Checking key configuration files..."

files=(
    "docker-compose.yml"
    "package.json"
    ".env"
    ".env.example"
    ".gitignore"
    "README.md"
    "apps/backend/package.json"
    "apps/backend/src/main.ts"
    "apps/frontend/package.json"
    "infra/kubernetes/k8s-manifest.yaml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file NOT FOUND"
    fi
done

echo ""
echo "✅ Project structure verified!"
echo ""
echo "📝 Next steps:"
echo "1. cd edustream"
echo "2. npm run docker:up"
echo "3. npm run dev"
echo ""
echo "🌐 Access points:"
echo "  - Backend: http://localhost:3000"
echo "  - Frontend: http://localhost:3001"
echo "  - RabbitMQ: http://localhost:15672 (guest/guest)"
echo "  - Grafana: http://localhost:3003 (admin/admin)"
echo "  - Jaeger: http://localhost:16686"
echo ""
