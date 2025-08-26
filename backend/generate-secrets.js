#!/usr/bin/env node

/**
 * SECURE SECRET GENERATOR FOR EXPOSR
 *
 * This script generates cryptographically secure values for:
 * - Admin password
 * - JWT secret
 * - Encryption key
 * - Password hash for backend
 *
 * RUN THIS BEFORE DEPLOYMENT AND SAVE THE VALUES SECURELY!
 */

const crypto = require("crypto");
const bcrypt = require("bcrypt");

async function generateSecrets() {
  console.log("🔐 GENERATING SECURE SECRETS FOR EXPOSR\n");

  try {
    // Generate admin password (12 bytes = 16 base64 chars)
    const adminPassword = crypto.randomBytes(12).toString("base64");
    console.log("✅ ADMIN PASSWORD (SAVE THIS SECURELY!):");
    console.log(`   ${adminPassword}\n`);

    // Generate password hash for backend
    const adminHash = await bcrypt.hash(adminPassword, 12);
    console.log("✅ ADMIN_PASSWORD_HASH (for backend .env):");
    console.log(`   ${adminHash}\n`);

    // Generate JWT secret (64 bytes = 128 hex chars)
    const jwtSecret = crypto.randomBytes(64).toString("hex");
    console.log("✅ JWT_SECRET (for backend .env):");
    console.log(`   ${jwtSecret}\n`);

    // Generate encryption key (32 bytes = 64 hex chars)
    const encryptionKey = crypto.randomBytes(32).toString("hex");
    console.log("✅ ENCRYPTION_KEY (for backend .env):");
    console.log(`   ${encryptionKey}\n`);

    console.log("📋 DEPLOYMENT CHECKLIST:");
    console.log("   1. Save the admin password securely");
    console.log("   2. Copy admin hash to backend .env");
    console.log("   3. Copy JWT secret to backend .env");
    console.log("   4. Copy encryption key to backend .env");
    console.log("   5. Copy admin password to frontend .env");
    console.log("   6. Add all variables to Vercel dashboard");
    console.log("   7. NEVER commit .env files to git!\n");

    console.log("⚠️  SECURITY REMINDERS:");
    console.log("   - Store admin password in a password manager");
    console.log("   - Rotate these secrets regularly");
    console.log("   - Use different secrets for each environment");
    console.log("   - Monitor for unauthorized access");
  } catch (error) {
    console.error("❌ Error generating secrets:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateSecrets();
}

module.exports = { generateSecrets };
