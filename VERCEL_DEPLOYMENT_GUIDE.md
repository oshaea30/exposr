# 🚀 VERCEL DEPLOYMENT GUIDE FOR EXPOSR

## **IMPORTANT: Environment Variables Security**

### **How Vercel Handles Environment Variables**

1. **Local Development** (your computer):
   - Variables stored in `.env` files
   - NEVER commit these to GitHub
   - Used only for local testing

2. **Production** (Vercel):
   - Variables stored in Vercel's secure dashboard
   - Encrypted at rest
   - Only accessible to your deployment
   - Never visible in your code or GitHub

## **STEP 1: PREPARE YOUR PROJECT**

### **Clean Up Your Environment Variables**

Since you're not using Hive AI, let's create clean environment variable files:

#### **Frontend Variables** (`.env.example`)
```bash
# This file is an EXAMPLE - copy to .env and fill in your values
# NEVER commit the actual .env file

# Backend API URL
REACT_APP_API_URL=http://localhost:3001  # Local development
# REACT_APP_API_URL=https://your-backend.vercel.app  # Production

# Admin Authentication (generate a strong password)
REACT_APP_ADMIN_PASSWORD=your_secure_password_here

# Optional: Google Sheets Integration
# REACT_APP_GOOGLE_SHEETS_ID=your-spreadsheet-id
# REACT_APP_GOOGLE_SHEETS_API_KEY=your-api-key
```

#### **Backend Variables** (`backend/.env.example`)
```bash
# This file is an EXAMPLE - copy to .env and fill in your values
# NEVER commit the actual .env file

# Server Configuration
NODE_ENV=development
PORT=3001

# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_personal_access_token
AIRTABLE_BASE_ID=your_base_id

# Cloudinary Configuration (for image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security Configuration
JWT_SECRET=generate_random_64_char_string
ENCRYPTION_KEY=generate_random_32_byte_hex
ADMIN_PASSWORD_HASH=bcrypt_hash_of_admin_password

# CORS Settings
FRONTEND_URL=http://localhost:3000  # Local
# FRONTEND_URL=https://your-app.vercel.app  # Production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## **STEP 2: DEPLOY TO VERCEL**

### **Option A: Using Vercel CLI (Recommended)**

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy Frontend**:
```bash
cd /Users/oshaealexis/Projects/exposrmvp
vercel
```

4. **Deploy Backend** (as a separate deployment):
```bash
cd backend
vercel
```

### **Option B: Using GitHub Integration**

1. Push your code to GitHub (make sure .env is in .gitignore!)
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure as shown below

## **STEP 3: ADD ENVIRONMENT VARIABLES IN VERCEL**

### **WHERE TO ADD THEM**

1. Go to your project in Vercel Dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in sidebar
4. Add each variable

### **FRONTEND ENVIRONMENT VARIABLES**

Add these in Vercel for your FRONTEND deployment:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend.vercel.app` | Production |
| `REACT_APP_ADMIN_PASSWORD` | `[generate strong password]` | Production |
| `REACT_APP_ENABLE_SECURITY_LOGGING` | `true` | Production |

### **BACKEND ENVIRONMENT VARIABLES**

Add these in Vercel for your BACKEND deployment:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `AIRTABLE_API_KEY` | `[your token from airtable.com/create/tokens]` | Production |
| `AIRTABLE_BASE_ID` | `app3ynZIldAZVAjaq` | Production |
| `CLOUDINARY_CLOUD_NAME` | `dnem1o6px` | Production |
| `CLOUDINARY_API_KEY` | `[your new key]` | Production |
| `CLOUDINARY_API_SECRET` | `[your new secret]` | Production |
| `JWT_SECRET` | `[generate 64 char random string]` | Production |
| `ENCRYPTION_KEY` | `[generate 32 byte hex]` | Production |
| `ADMIN_PASSWORD_HASH` | `[bcrypt hash of admin password]` | Production |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Production |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Production |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Production |

## **STEP 4: GENERATE SECURE VALUES**

### **Generate Secure Passwords and Keys**

Run this Node.js script to generate secure values:

```javascript
// save as generate-secrets.js
const crypto = require('crypto');
const bcrypt = require('bcrypt');

async function generateSecrets() {
  // Generate admin password
  const adminPassword = crypto.randomBytes(12).toString('base64');
  console.log('ADMIN PASSWORD (save this!):', adminPassword);
  
  // Generate password hash for backend
  const adminHash = await bcrypt.hash(adminPassword, 12);
  console.log('ADMIN_PASSWORD_HASH:', adminHash);
  
  // Generate JWT secret
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  console.log('JWT_SECRET:', jwtSecret);
  
  // Generate encryption key
  const encryptionKey = crypto.randomBytes(32).toString('hex');
  console.log('ENCRYPTION_KEY:', encryptionKey);
}

generateSecrets();
```

Run it:
```bash
cd backend
npm install bcrypt
node generate-secrets.js
```

## **STEP 5: VERCEL PROJECT STRUCTURE**

### **For Monorepo (Frontend + Backend)**

Create `vercel.json` in root:
```json
{
  "projects": [
    {
      "name": "exposr-frontend",
      "root": "./",
      "framework": "create-react-app"
    },
    {
      "name": "exposr-backend",
      "root": "./backend",
      "framework": null,
      "buildCommand": "npm install",
      "outputDirectory": ".",
      "functions": {
        "backend/server.js": {
          "runtime": "@vercel/node@3.0.0"
        }
      }
    }
  ]
}
```

### **For Backend API Routes**

Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

## **STEP 6: UPDATE YOUR CODE FOR PRODUCTION**

### **Update Frontend API URL**

In `src/config.js` or where you make API calls:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Use this for all API calls
fetch(`${API_URL}/api/analyze`, {...})
```

### **Update Backend CORS**

In `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## **STEP 7: DEPLOY COMMAND SEQUENCE**

```bash
# 1. Test locally first
cd /Users/oshaealexis/Projects/exposrmvp
npm start  # Test frontend

cd backend
npm run dev  # Test backend

# 2. Build and test production build
cd ..
npm run build
npx serve -s build  # Test production build

# 3. Deploy to Vercel
vercel --prod  # Deploy frontend
cd backend
vercel --prod  # Deploy backend
```

## **SECURITY CHECKLIST FOR VERCEL**

### **Before Deployment**
- [ ] All `.env` files are in `.gitignore`
- [ ] No API keys in code
- [ ] Generated strong passwords
- [ ] Rotated all API keys from exposed ones

### **In Vercel Dashboard**
- [ ] Added all environment variables
- [ ] Set correct environments (Production/Preview/Development)
- [ ] Verified FRONTEND_URL and API_URL match your domains
- [ ] Enabled HTTPS (automatic in Vercel)

### **After Deployment**
- [ ] Test image upload
- [ ] Test admin login
- [ ] Check Airtable is receiving data
- [ ] Verify Cloudinary is storing images
- [ ] Test rate limiting

## **COMMON VERCEL ISSUES & SOLUTIONS**

### **Issue: "Module not found"**
**Solution**: Add missing dependencies to package.json

### **Issue: "CORS error"**
**Solution**: Update FRONTEND_URL in backend environment variables

### **Issue: "API calls failing"**
**Solution**: Update REACT_APP_API_URL to your backend URL

### **Issue: "Environment variables not working"**
**Solution**: 
- Frontend variables must start with `REACT_APP_`
- Redeploy after adding variables
- Check variable names match exactly

## **MONITORING YOUR DEPLOYMENT**

### **Vercel Dashboard**
- Function logs: See API requests and errors
- Analytics: Monitor usage and performance
- Domains: Manage custom domains

### **Set Up Alerts**
1. Airtable: Set API usage alerts
2. Cloudinary: Set bandwidth alerts
3. Vercel: Set function execution alerts

## **NEXT STEPS**

1. **Test Deployment**:
   - Upload test image
   - Check it saves to Airtable
   - Verify Cloudinary storage

2. **Custom Domain**:
   - Add custom domain in Vercel
   - Update environment variables with new domain

3. **Enable Analytics**:
   - Vercel Analytics
   - Google Analytics
   - Error tracking (Sentry)

## **SUPPORT RESOURCES**

- [Vercel Documentation](https://vercel.com/docs)
- [Environment Variables Guide](https://vercel.com/docs/environment-variables)
- [Vercel Support](https://vercel.com/support)

---

**Remember**: NEVER commit `.env` files. Always use Vercel's dashboard for production secrets!
