#!/bin/bash

# 🚀 SECURE VERCEL DEPLOYMENT SCRIPT FOR EXPOSR
# 
# This script ensures your app is deployed securely to Vercel
# Run this after setting up your environment variables

set -e  # Exit on any error

echo "🔒 SECURITY CHECK BEFORE DEPLOYMENT"
echo "=================================="

# Check if .env files exist and warn
if [ -f ".env" ]; then
    echo "⚠️  WARNING: .env file found in root directory"
    echo "   Make sure it's not committed to git!"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled. Secure your .env files first."
        exit 1
    fi
fi

if [ -f "backend/.env" ]; then
    echo "⚠️  WARNING: backend/.env file found"
    echo "   Make sure it's not committed to git!"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled. Secure your .env files first."
        exit 1
    fi
fi

# Check if secrets are properly set
echo "🔍 Checking environment setup..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged into Vercel. Please login first:"
    vercel login
fi

echo "✅ Environment checks passed"
echo ""

echo "🚀 STARTING SECURE DEPLOYMENT"
echo "============================="

# Build the frontend
echo "📦 Building frontend..."
npm run build

if [ ! -d "build" ]; then
    echo "❌ Build failed. Check for errors above."
    exit 1
fi

echo "✅ Frontend built successfully"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Add environment variables in Vercel dashboard"
echo "2. Test your deployed application"
echo "3. Set up custom domain if needed"
echo "4. Monitor for security issues"
echo ""
echo "🔒 SECURITY REMINDERS:"
echo "- Never commit .env files to git"
echo "- Use strong, unique passwords"
echo "- Rotate API keys regularly"
echo "- Monitor access logs"
echo "- Keep dependencies updated"
echo ""
echo "📚 Documentation: https://vercel.com/docs"
echo "🆘 Support: https://vercel.com/support"
