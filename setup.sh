#!/bin/bash

# HireTrack Setup Script
# This script sets up the entire HireTrack development environment

set -e

echo "🚀 HireTrack Setup Script"
echo "=========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${YELLOW}Warning: This script is optimized for macOS${NC}"
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."
echo ""

MISSING_DEPS=()

if ! command_exists node; then
    MISSING_DEPS+=("Node.js")
fi

if ! command_exists docker; then
    MISSING_DEPS+=("Docker")
fi

if ! command_exists git; then
    MISSING_DEPS+=("Git")
fi

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing dependencies:${NC}"
    for dep in "${MISSING_DEPS[@]}"; do
        echo "   - $dep"
    done
    echo ""
    echo "Please install missing dependencies:"
    echo "  Node.js: https://nodejs.org/"
    echo "  Docker: https://www.docker.com/products/docker-desktop"
    echo "  Git: https://git-scm.com/"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites installed${NC}"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Node.js version 18+ recommended (you have: $(node -v))${NC}"
fi

# Setup environment files
echo "🔧 Setting up environment files..."
echo ""

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env with your actual credentials${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping${NC}"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env file${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env file already exists, skipping${NC}"
fi

if [ ! -f web/.env.local ]; then
    cat > web/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
EOF
    echo -e "${GREEN}✅ Created web/.env.local file${NC}"
else
    echo -e "${YELLOW}⚠️  web/.env.local file already exists, skipping${NC}"
fi

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

# Backend
echo "Installing backend dependencies..."
cd backend
npm install
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
cd ..

# Web
echo "Installing web dependencies..."
cd web
npm install
echo -e "${GREEN}✅ Web dependencies installed${NC}"
cd ..

echo ""

# Start Docker services
echo "🐳 Starting Docker services..."
echo ""

if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

docker-compose up -d postgres redis

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

echo -e "${GREEN}✅ Docker services started${NC}"
echo ""

# Setup database
echo "🗄️  Setting up database..."
echo ""

cd backend
npm run prisma:generate
npm run prisma:migrate
echo -e "${GREEN}✅ Database setup complete${NC}"
cd ..

echo ""
echo "======================================"
echo -e "${GREEN}✅ HireTrack setup complete!${NC}"
echo "======================================"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Edit your .env files with actual credentials:"
echo "   - ./env"
echo "   - backend/.env"
echo "   - web/.env.local"
echo ""
echo "2. Start the development servers:"
echo "   Terminal 1: cd backend && npm run start:dev"
echo "   Terminal 2: cd web && npm run dev"
echo ""
echo "3. Access the applications:"
echo "   - Web App: http://localhost:3000"
echo "   - API: http://localhost:3001"
echo "   - API Docs: http://localhost:3001/api/docs"
echo ""
echo "📚 Documentation: See README.md for detailed instructions"
echo ""
