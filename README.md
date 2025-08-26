# Exposr - AI-Powered Image Analysis Platform

**Criterra Labs** | **Privacy-First AI Detection**

Exposr is a cutting-edge platform that uses artificial intelligence to detect and analyze manipulated images, deepfakes, and AI-generated content. Built with privacy and security as core principles.

## 🚀 Features

- **AI-Powered Analysis**: Advanced machine learning models to detect image manipulation
- **Real-time Processing**: Fast, accurate analysis with detailed confidence scores
- **Privacy-First**: Images are processed securely and deleted after analysis
- **Share & Collaborate**: Share analysis results with secure, time-limited links
- **Admin Dashboard**: Comprehensive data management and analytics
- **Responsive Design**: Works seamlessly across all devices

## 🏗️ Architecture

### Frontend (React)
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context and local state
- **Deployment**: Vercel with automatic deployments

### Backend (Node.js)
- **Runtime**: Node.js with Express.js
- **Security**: Helmet.js, CORS, rate limiting
- **File Processing**: Multer for image uploads
- **AI Integration**: Cloudinary for image analysis
- **Data Storage**: Airtable for structured data
- **Deployment**: Vercel serverless functions

## 🔧 Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router
- Axios/Fetch API
- React Icons

### Backend
- Node.js
- Express.js
- Multer (file uploads)
- Helmet.js (security)
- CORS middleware
- Rate limiting

### Services
- **Cloudinary**: Image storage and AI analysis
- **Airtable**: Data management and analytics
- **Vercel**: Hosting and deployment

## 📁 Project Structure

```
exposr/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── utils/          # Utility functions
│   │   └── constants/      # App constants
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js API
│   ├── server.js           # Main server file
│   ├── services/           # Service modules
│   └── package.json
├── docs/                   # Documentation
│   ├── PRIVACY_POLICY.md
│   ├── SECURITY.md
│   └── README.md
├── .gitignore              # Git ignore rules
└── vercel.json             # Vercel configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel CLI (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/exposr.git
   cd exposr
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Frontend (.env)
   REACT_APP_API_URL=http://localhost:3001
   
   # Backend (backend/.env)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   AIRTABLE_API_KEY=your_airtable_key
   AIRTABLE_BASE_ID=your_base_id
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   npm start
   ```

## 🔒 Security Features

- **Environment Variables**: All secrets stored securely
- **CORS Protection**: Configured for specific origins only
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Sanitizes all user inputs
- **File Validation**: Validates uploaded images
- **Secure Headers**: Helmet.js for security headers
- **Data Encryption**: All data encrypted in transit and at rest

## 📊 Data Privacy

- **Image Retention**: Images deleted within 24 hours
- **Analysis Results**: Retained for 30 days maximum
- **User Rights**: Full access, deletion, and portability
- **GDPR Compliant**: European privacy regulation compliance
- **CCPA Compliant**: California privacy regulation compliance

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   vercel --prod
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   vercel --prod
   ```

### Environment Variables (Production)

Set these in your Vercel dashboard:

**Frontend:**
- `REACT_APP_API_URL`: Your backend URL

**Backend:**
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `AIRTABLE_API_KEY`: Airtable personal access token
- `AIRTABLE_BASE_ID`: Airtable base ID

## 📈 Monitoring & Analytics

- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: Response time tracking
- **Usage Analytics**: User interaction tracking
- **Security Monitoring**: Failed request tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by Criterra Labs. All rights reserved.

## 📞 Support

For support, email Criterralabs@gmail.com or create an issue in the repository.

## 🔗 Links

- **Live Demo**: [https://www.exposrai.com](https://www.exposrai.com)
- **Documentation**: [Privacy Policy](./PRIVACY_POLICY.md)
- **Security**: [Security Policy](./SECURITY.md)

---

**Built with ❤️ by Criterra Labs**