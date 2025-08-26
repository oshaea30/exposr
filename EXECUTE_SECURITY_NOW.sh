#!/bin/bash

# Exposr Emergency Security Implementation Script
# Run this to secure your application immediately

echo "🚨 EXPOSR EMERGENCY SECURITY IMPLEMENTATION"
echo "==========================================="
echo ""
echo "This script will:"
echo "1. Backup current .env files"
echo "2. Generate secure passwords and secrets"
echo "3. Create new secure environment files"
echo "4. Remove sensitive files from git"
echo ""
echo "Press ENTER to continue or Ctrl+C to cancel..."
read

# Navigate to project root
cd /Users/oshaealexis/Projects/exposrmvp

# Step 1: Backup current .env files (just in case)
echo "📦 Backing up current .env files..."
if [ -f "backend/.env" ]; then
    cp backend/.env backend/.env.backup.$(date +%Y%m%d%H%M%S)
    echo "✅ Backend .env backed up"
fi

if [ -f ".env" ]; then
    cp .env .env.backup.$(date +%Y%m%d%H%M%S)
    echo "✅ Frontend .env backed up"
fi

# Step 2: Remove .env from git tracking (if tracked)
echo ""
echo "🔒 Removing sensitive files from git..."
git rm --cached backend/.env 2>/dev/null || true
git rm --cached .env 2>/dev/null || true
echo "✅ Sensitive files removed from git tracking"

# Step 3: Install security dependencies
echo ""
echo "📦 Installing security dependencies..."
cd backend
npm install bcrypt jsonwebtoken express-rate-limit helmet cors dotenv

# Step 4: Run security setup
echo ""
echo "🔐 Running security setup..."
node setup-security.js

# Step 5: Show next steps
echo ""
echo "==========================================="
echo "🎉 SECURITY SETUP COMPLETE!"
echo "==========================================="
echo ""
echo "⚠️  CRITICAL NEXT STEPS:"
echo ""
echo "1. 🔑 UPDATE YOUR API KEYS:"
echo "   Edit backend/.env and replace:"
echo "   - HIVE_API_KEY with your NEW Hive AI key"
echo "   - AIRTABLE_API_KEY with your NEW Airtable token"
echo "   - AIRTABLE_BASE_ID (keep the same)"
echo "   - CLOUDINARY_* with your NEW Cloudinary credentials"
echo ""
echo "2. 📝 SAVE YOUR ADMIN PASSWORD:"
echo "   The script generated a new secure admin password."
echo "   Save it in your password manager!"
echo ""
echo "3. 🚀 TEST THE IMPLEMENTATION:"
echo "   cd backend && npm run dev"
echo "   Then test your app to ensure everything works"
echo ""
echo "4. 📤 COMMIT SECURITY CHANGES:"
echo "   git add ."
echo "   git commit -m 'Security: Remove sensitive files and implement security measures'"
echo "   git push"
echo ""
echo "==========================================="
echo "⚠️  REMEMBER: NEVER commit .env files to git!"
echo "==========================================="
