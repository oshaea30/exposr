# 🚀 SECURE VERCEL DEPLOYMENT CHECKLIST FOR EXPOSR

## 🔐 **CRITICAL: Generate and Save Your Secrets**

### **Generated Secrets (SAVE THESE SECURELY!)**

```
ADMIN PASSWORD: r6VTNnsk/eizqb8z
ADMIN_PASSWORD_HASH: $2b$12$XCiUelYcQd8Kz0Bg7dLl2usVhKi6QQibqfJ5k2VjMYIhTS6K7CYLu
JWT_SECRET: c0a1f8332153e796b208f09448c71dc96e5d729bafb9666b5bb3090e1608322d95941cdab2ca2132227a5d53ac8a7dca5d6c0832657e36d8770a02ce72889322
ENCRYPTION_KEY: 5fef45954e0daec8a2187d2d807973be6638a153db30488ac8bb80e52673dc20
```

**⚠️ WARNING**: Store these in a password manager immediately!

## 📁 **Step 1: Create Environment Files**

### **Frontend (.env) - Create in root directory**

```bash
# FRONTEND ENVIRONMENT VARIABLES
# ⚠️  SECURITY: NEVER commit this file to git!

# Backend API URL (update this to your Vercel backend URL after deployment)
REACT_APP_API_URL=http://localhost:3001

# Admin Authentication (generated securely)
REACT_APP_ADMIN_PASSWORD=r6VTNnsk/eizqb8z

# Security Features
REACT_APP_ENABLE_SECURITY_LOGGING=true
REACT_APP_SESSION_TIMEOUT_HOURS=8
```

### **Backend (.env) - Create in backend/ directory**

```bash
# BACKEND ENVIRONMENT VARIABLES
# ⚠️  SECURITY: NEVER commit this file to git!

# Server Configuration
NODE_ENV=development
PORT=3001

# Airtable Configuration (get from airtable.com/create/tokens)
AIRTABLE_API_KEY=your_airtable_personal_access_token
AIRTABLE_BASE_ID=your_base_id

# Cloudinary Configuration (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security Configuration (use generated values above)
JWT_SECRET=c0a1f8332153e796b208f09448c71dc96e5d729bafb9666b5bb3090e1608322d95941cdab2ca2132227a5d53ac8a7dca5d6c0832657e36d8770a02ce72889322
ENCRYPTION_KEY=5fef45954e0daec8a2187d2d807973be6638a153db30488ac8bb80e52673dc20
ADMIN_PASSWORD_HASH=$2b$12$XCiUelYcQd8Kz0Bg7dLl2usVhKi6QQibqfJ5k2VjMYIhTS6K7CYLu

# CORS Settings
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🌐 **Step 2: Get Your API Keys**

### **Airtable Setup**

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Create a new Personal Access Token
3. Give it a name like "Exposr Production"
4. Set scopes: `data.records:read`, `data.records:write`
5. Copy the token to your backend .env file

### **Cloudinary Setup**

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up or sign in
3. Go to Dashboard → API Keys
4. Copy your Cloud Name, API Key, and API Secret
5. Add them to your backend .env file

## 🚀 **Step 3: Deploy to Vercel**

### **Install Vercel CLI**

```bash
npm install -g vercel
```

### **Login to Vercel**

```bash
vercel login
```

### **Deploy Using the Secure Script**

```bash
./deploy-secure.sh
```

### **Or Deploy Manually**

```bash
# Build frontend
npm run build

# Deploy to Vercel
vercel --prod
```

## ⚙️ **Step 4: Configure Vercel Environment Variables**

### **Frontend Project Variables**

Go to your frontend project in Vercel Dashboard → Settings → Environment Variables:

| Variable                            | Value                                 | Environment |
| ----------------------------------- | ------------------------------------- | ----------- |
| `REACT_APP_API_URL`                 | `https://your-backend-url.vercel.app` | Production  |
| `REACT_APP_ADMIN_PASSWORD`          | `r6VTNnsk/eizqb8z`                    | Production  |
| `REACT_APP_ENABLE_SECURITY_LOGGING` | `true`                                | Production  |

### **Backend Project Variables**

Go to your backend project in Vercel Dashboard → Settings → Environment Variables:

| Variable                  | Value                                                                                                                              | Environment |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `NODE_ENV`                | `production`                                                                                                                       | Production  |
| `AIRTABLE_API_KEY`        | `[your airtable token]`                                                                                                            | Production  |
| `AIRTABLE_BASE_ID`        | `[your base id]`                                                                                                                   | Production  |
| `CLOUDINARY_CLOUD_NAME`   | `[your cloud name]`                                                                                                                | Production  |
| `CLOUDINARY_API_KEY`      | `[your api key]`                                                                                                                   | Production  |
| `CLOUDINARY_API_SECRET`   | `[your api secret]`                                                                                                                | Production  |
| `JWT_SECRET`              | `c0a1f8332153e796b208f09448c71dc96e5d729bafb9666b5bb3090e1608322d95941cdab2ca2132227a5d53ac8a7dca5d6c0832657e36d8770a02ce72889322` | Production  |
| `ENCRYPTION_KEY`          | `5fef45954e0daec8a2187d2d807973be6638a153db30488ac8bb80e52673dc20`                                                                 | Production  |
| `ADMIN_PASSWORD_HASH`     | `$2b$12$XCiUelYcQd8Kz0Bg7dLl2usVhKi6QQibqfJ5k2VjMYIhTS6K7CYLu`                                                                     | Production  |
| `FRONTEND_URL`            | `https://your-frontend-url.vercel.app`                                                                                             | Production  |
| `RATE_LIMIT_WINDOW_MS`    | `900000`                                                                                                                           | Production  |
| `RATE_LIMIT_MAX_REQUESTS` | `100`                                                                                                                              | Production  |

## ✅ **Step 5: Security Verification**

### **Test Your Deployment**

1. **Admin Access**: Try logging into admin dashboard with the generated password
2. **Image Upload**: Test file upload functionality
3. **Data Storage**: Verify data is being saved to Airtable
4. **Image Storage**: Check if images are being stored in Cloudinary
5. **Rate Limiting**: Test that rate limiting is working

### **Security Checks**

- [ ] No .env files in git repository
- [ ] Strong admin password working
- [ ] API keys not visible in browser dev tools
- [ ] HTTPS enabled (automatic in Vercel)
- [ ] CORS properly configured
- [ ] Rate limiting active

## 🔒 **Security Best Practices**

### **Ongoing Security**

1. **Rotate Secrets**: Change passwords and API keys every 90 days
2. **Monitor Access**: Check Vercel function logs regularly
3. **Update Dependencies**: Run `npm audit` and update packages
4. **Backup Data**: Ensure Airtable data is backed up
5. **Access Logs**: Monitor admin login attempts

### **Emergency Procedures**

1. **If API keys are compromised**: Rotate immediately
2. **If admin password is leaked**: Generate new password and hash
3. **If suspicious activity detected**: Check Vercel logs and consider redeployment

## 📞 **Support Resources**

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Security Issues**: Check Vercel function logs and error tracking

---

## 🎯 **Quick Deploy Command**

Once you've set up your environment files:

```bash
# Make sure you're in the project root
cd /Users/oshaealexis/Projects/exposrmvp

# Run the secure deployment script
./deploy-secure.sh
```

**Remember**: Security first! Never commit .env files to git, and always use strong, unique passwords.
