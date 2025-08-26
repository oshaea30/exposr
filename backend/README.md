# Exposr Backend Setup

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
The `.env` file is already configured with your Hive AI key. For production, you'll want to set these as environment variables.

### 3. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```

### Image Analysis
```
POST /api/analyze
Content-Type: multipart/form-data
Body: image file (max 10MB)
```

## Frontend Integration

### Add Environment Variable
Create `.env.local` in your main project root:
```bash
REACT_APP_API_URL=http://localhost:3001/api
```

### Start Both Services
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd .. # back to main project
npm start
```

## Testing the Integration

1. Start both backend and frontend
2. Upload an image in the UI
3. Check the browser network tab to see API calls
4. Check backend console for analysis logs

## Production Deployment

### Backend (Railway/Render)
- Set environment variables in deployment platform
- Ensure FRONTEND_URL points to your deployed frontend
- Set NODE_ENV=production

### Frontend (Vercel/Netlify)
- Set REACT_APP_API_URL to your deployed backend URL

## Security Notes

- API key is stored in environment variables
- Rate limiting is enabled (100 requests per 15 minutes per IP)
- File upload validation and size limits
- CORS protection
- Helmet security headers

## Troubleshooting

- **Connection refused**: Make sure backend is running on port 3001
- **CORS errors**: Check FRONTEND_URL in backend .env
- **File upload fails**: Check file size (max 10MB) and type (JPG/PNG/WEBP)
- **Analysis fails**: Check Hive AI API key and internet connection
