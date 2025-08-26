#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

console.log('🔒 Exposr Security Setup');
console.log('========================\n');

// Generate secure secrets
function generateSecrets() {
  const secrets = {
    jwtSecret: crypto.randomBytes(64).toString('hex'),
    encryptionKey: crypto.randomBytes(32).toString('hex'),
    adminPassword: generateStrongPassword()
  };
  
  return secrets;
}

// Generate strong password
function generateStrongPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 24; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Create secure .env file
async function createSecureEnv() {
  const secrets = generateSecrets();
  const adminPasswordHash = await bcrypt.hash(secrets.adminPassword, 12);
  
  const envContent = `# Exposr Backend Environment Variables
# DO NOT COMMIT THIS FILE TO VERSION CONTROL

# Server Configuration
NODE_ENV=development
PORT=3001

# Hive AI API Configuration
HIVE_API_KEY=YOUR_HIVE_API_KEY_HERE
HIVE_API_URL=https://api.thehive.ai/api/v2

# Airtable Configuration  
AIRTABLE_API_KEY=YOUR_AIRTABLE_TOKEN_HERE
AIRTABLE_BASE_ID=YOUR_BASE_ID_HERE

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME_HERE
CLOUDINARY_API_KEY=YOUR_API_KEY_HERE
CLOUDINARY_API_SECRET=YOUR_API_SECRET_HERE

# Security Configuration (Generated - DO NOT CHANGE)
JWT_SECRET=${secrets.jwtSecret}
ENCRYPTION_KEY=${secrets.encryptionKey}
ADMIN_PASSWORD_HASH=${adminPasswordHash}

# CORS Settings
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Settings  
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp
`;

  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Secure .env file created');
  console.log(`📝 Admin Password (SAVE THIS): ${secrets.adminPassword}`);
  console.log('📝 Admin Password Hash saved to .env file');
  console.log('');
  console.log('⚠️  IMPORTANT: Update the following in your .env file:');
  console.log('   - HIVE_API_KEY');
  console.log('   - AIRTABLE_API_KEY');
  console.log('   - AIRTABLE_BASE_ID');
  console.log('   - CLOUDINARY_* settings');
  console.log('');
  
  return secrets;
}

// Update frontend environment
function updateFrontendEnv(adminPassword) {
  const frontendEnvPath = path.join(__dirname, '..', '.env');
  
  let frontendEnvContent = '';
  if (fs.existsSync(frontendEnvPath)) {
    frontendEnvContent = fs.readFileSync(frontendEnvPath, 'utf8');
  }
  
  // Update admin password
  const lines = frontendEnvContent.split('\n');
  let updated = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('REACT_APP_ADMIN_PASSWORD=')) {
      lines[i] = `REACT_APP_ADMIN_PASSWORD=${adminPassword}`;
      updated = true;
      break;
    }
  }
  
  if (!updated) {
    lines.push(`REACT_APP_ADMIN_PASSWORD=${adminPassword}`);
  }
  
  fs.writeFileSync(frontendEnvPath, lines.join('\n'));
  console.log('✅ Frontend .env updated with new admin password');
}

// Security checklist
function showSecurityChecklist() {
  console.log('🛡️  SECURITY CHECKLIST:');
  console.log('=====================');
  console.log('');
  console.log('✅ Strong secrets generated');
  console.log('⚠️  Update API keys in backend/.env');
  console.log('⚠️  Change FRONTEND_URL for production');
  console.log('⚠️  Enable HTTPS in production');
  console.log('⚠️  Set up monitoring and logging');
  console.log('⚠️  Rotate secrets regularly');
  console.log('');
  console.log('📚 Read CRITICAL_SECURITY_AUDIT.md for complete security guide');
}

// Git security check
function checkGitSecurity() {
  const gitignorePath = path.join(__dirname, '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    console.log('⚠️  No .gitignore found - creating one');
    const gitignoreContent = `# Environment variables\n.env\n.env.*\n\n# Logs\nlogs\n*.log\n\n# Dependencies\nnode_modules/\n\n# OS files\n.DS_Store\nThumbs.db`;
    fs.writeFileSync(gitignorePath, gitignoreContent);
  }
  
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (!gitignoreContent.includes('.env')) {
    console.log('⚠️  Adding .env to .gitignore');
    fs.appendFileSync(gitignorePath, '\n# Environment variables\n.env\n.env.*\n');
  }
  
  console.log('✅ Git security configured');
}

// Main setup function
async function setupSecurity() {
  try {
    console.log('🔄 Setting up security...');
    
    // Check git security first
    checkGitSecurity();
    
    // Create secure environment
    const secrets = await createSecureEnv();
    
    // Update frontend
    updateFrontendEnv(secrets.adminPassword);
    
    // Show checklist
    showSecurityChecklist();
    
    console.log('');
    console.log('🎉 Security setup complete!');
    console.log('');
    console.log('🚨 SAVE YOUR ADMIN PASSWORD: ' + secrets.adminPassword);
    console.log('🚨 NEVER COMMIT .env FILES TO GIT');
    
  } catch (error) {
    console.error('❌ Security setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupSecurity();
}

module.exports = { setupSecurity, generateSecrets, generateStrongPassword };