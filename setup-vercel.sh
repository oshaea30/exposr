#!/bin/bash

# Exposr - Vercel Environment Variables Setup Helper
# This script helps you prepare and verify your environment variables for Vercel

echo "🚀 EXPOSR - VERCEL DEPLOYMENT HELPER"
echo "===================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in the Exposr project directory${NC}"
    echo "Please run this from /Users/oshaealexis/Projects/exposrmvp"
    exit 1
fi

echo "📋 STEP 1: Checking your current environment variables..."
echo ""

# Check frontend .env
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Found frontend .env file${NC}"
    echo "   Variables found:"
    grep -E "^REACT_APP_" .env | cut -d'=' -f1 | while read var; do
        echo "   - $var"
    done
else
    echo -e "${YELLOW}⚠️  No frontend .env file found${NC}"
fi

echo ""

# Check backend .env
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ Found backend .env file${NC}"
    echo "   Variables found:"
    grep -E "^[A-Z]" backend/.env | cut -d'=' -f1 | while read var; do
        echo "   - $var"
    done
else
    echo -e "${YELLOW}⚠️  No backend .env file found${NC}"
fi

echo ""
echo "===================================="
echo "📝 STEP 2: Variables needed for Vercel"
echo ""

echo "FRONTEND (exposr-frontend.vercel.app):"
echo "  - REACT_APP_API_URL (your backend URL)"
echo "  - REACT_APP_ADMIN_PASSWORD"
echo ""

echo "BACKEND (exposr-backend.vercel.app):"
echo "  - NODE_ENV=production"
echo "  - AIRTABLE_API_KEY"
echo "  - AIRTABLE_BASE_ID"
echo "  - CLOUDINARY_CLOUD_NAME"
echo "  - CLOUDINARY_API_KEY"
echo "  - CLOUDINARY_API_SECRET"
echo "  - FRONTEND_URL (your frontend URL)"
echo "  - JWT_SECRET (optional for admin)"
echo "  - ENCRYPTION_KEY (optional for security)"
echo ""

echo "===================================="
echo "🔐 STEP 3: Generate secure values"
echo ""

# Generate a secure password
ADMIN_PASSWORD=$(openssl rand -base64 16)
echo "Generated Admin Password: ${GREEN}$ADMIN_PASSWORD${NC}"
echo "(Save this in your password manager!)"
echo ""

# Generate JWT secret
JWT_SECRET=$(openssl rand -hex 32)
echo "Generated JWT Secret: ${GREEN}$JWT_SECRET${NC}"
echo ""

# Generate encryption key
ENCRYPTION_KEY=$(openssl rand -hex 32)
echo "Generated Encryption Key: ${GREEN}$ENCRYPTION_KEY${NC}"
echo ""

echo "===================================="
echo "📋 STEP 4: Create .env.example files"
echo ""

# Create frontend .env.example
cat > .env.example << EOF
# Frontend Environment Variables
# Copy this to .env and fill in your values

# Backend API URL
REACT_APP_API_URL=http://localhost:3001  # For local development
# REACT_APP_API_URL=https://exposr-backend.vercel.app  # For production

# Admin Authentication
REACT_APP_ADMIN_PASSWORD=$ADMIN_PASSWORD
EOF

echo -e "${GREEN}✅ Created .env.example${NC}"

# Create backend .env.example
cat > backend/.env.example << EOF
# Backend Environment Variables
# Copy this to .env and fill in your values

# Server Configuration
NODE_ENV=development
PORT=3001

# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_token_here
AIRTABLE_BASE_ID=app3ynZIldAZVAjaq

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dnem1o6px
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Security Configuration
JWT_SECRET=$JWT_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY

# CORS Settings
FRONTEND_URL=http://localhost:3000  # For local development
# FRONTEND_URL=https://exposr-frontend.vercel.app  # For production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

echo -e "${GREEN}✅ Created backend/.env.example${NC}"

echo ""
echo "===================================="
echo "✅ NEXT STEPS:"
echo ""
echo "1. ${YELLOW}ROTATE YOUR API KEYS${NC} (if they were exposed):"
echo "   - Airtable: https://airtable.com/create/tokens"
echo "   - Cloudinary: Dashboard → Settings → Security"
echo ""
echo "2. ${YELLOW}INSTALL VERCEL CLI${NC}:"
echo "   npm i -g vercel"
echo ""
echo "3. ${YELLOW}DEPLOY TO VERCEL${NC}:"
echo "   vercel  # For frontend"
echo "   cd backend && vercel  # For backend"
echo ""
echo "4. ${YELLOW}ADD ENVIRONMENT VARIABLES IN VERCEL${NC}:"
echo "   Go to your project → Settings → Environment Variables"
echo "   Add each variable from the .env files"
echo ""
echo "5. ${YELLOW}UPDATE YOUR API URLS${NC}:"
echo "   Frontend: Set REACT_APP_API_URL to your backend URL"
echo "   Backend: Set FRONTEND_URL to your frontend URL"
echo ""
echo "===================================="
echo ""
echo "📚 Full guide available in: VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
