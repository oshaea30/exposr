require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const Airtable = require('airtable');
const { v2: cloudinary } = require('cloudinary');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Airtable
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID);

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`), false);
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Image analysis endpoint (Mock analysis for MVP)
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Generate unique IDs
    const analysisId = crypto.randomBytes(8).toString('hex');
    const deleteCode = crypto.randomBytes(6).toString('hex');

    // Mock AI analysis result
    // In production, you would call your actual AI service here
    const mockResult = {
      analysisId,
      filename: req.file.originalname,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      verdict: Math.random() > 0.5 ? 'Likely AI-generated' : 'Likely authentic',
      isAI: Math.random() > 0.5,
      timestamp: new Date().toISOString(),
      fileFormat: req.file.mimetype,
      imageWidth: 1024,
      imageHeight: 1024,
      fileSizeKB: Math.round(req.file.size / 1024),
      deleteCode,
      explanation: 'Analysis completed successfully.'
    };

    // Upload to Cloudinary
    let imageUrl = null;
    let cloudinaryId = null;
    
    try {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        {
          public_id: `exposr/${analysisId}`,
          folder: 'exposr',
          resource_type: 'image',
          transformation: [
            { width: 1024, height: 1024, crop: 'limit' },
            { quality: 'auto' }
          ]
        }
      );
      
      cloudinaryId = uploadResult.public_id;
      imageUrl = uploadResult.secure_url;
      console.log('✅ Image uploaded to Cloudinary');
      
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError.message);
      // Continue without image URL if upload fails
    }

    // Save to Airtable
    try {
      const record = await base('Analyses').create({
        Analysis_ID: analysisId,
        Filename: mockResult.filename,
        Confidence: mockResult.confidence,
        Verdict: mockResult.verdict,
        AI_Detected: mockResult.isAI,
        Timestamp: mockResult.timestamp,
        File_Format: mockResult.fileFormat,
        Image_Width: mockResult.imageWidth,
        Image_Height: mockResult.imageHeight,
        File_Size_KB: mockResult.fileSizeKB,
        Delete_Code: deleteCode,
        Cloudinary_Image_ID: cloudinaryId,
        Image_URL: imageUrl,
        Country: 'US',
        Region: 'Georgia',
        Research_Consent: true
      });
      
      console.log('✅ Analysis saved to Airtable');
      
    } catch (airtableError) {
      console.error('Airtable save error:', airtableError.message);
      
      // Clean up Cloudinary if Airtable fails
      if (cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(cloudinaryId);
        } catch (cleanupError) {
          console.error('Cloudinary cleanup error:', cleanupError.message);
        }
      }
    }

    res.json({
      success: true,
      data: mockResult
    });

  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Analysis failed - please try again'
    });
  }
});

// Get analysis by ID (for sharing)
app.get('/api/analysis/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    
    const records = await base('Analyses').select({
      filterByFormula: `{Analysis_ID} = '${analysisId}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    const fields = records[0].fields;

    // Generate explanation
    let explanation;
    if (fields.AI_Detected) {
      if (fields.Confidence >= 90) {
        explanation = 'Strong indicators of AI generation detected.';
      } else if (fields.Confidence >= 70) {
        explanation = 'Moderate indicators of AI generation detected.';
      } else {
        explanation = 'Some indicators of AI generation detected.';
      }
    } else {
      if (fields.Confidence >= 90) {
        explanation = 'Strong indicators of authentic content.';
      } else if (fields.Confidence >= 70) {
        explanation = 'Moderate indicators of authentic content.';
      } else {
        explanation = 'Content appears more likely to be authentic.';
      }
    }

    res.json({
      success: true,
      data: {
        analysisId: fields.Analysis_ID,
        filename: fields.Filename,
        confidence: fields.Confidence,
        verdict: fields.Verdict,
        isAI: fields.AI_Detected,
        timestamp: fields.Timestamp,
        fileFormat: fields.File_Format,
        imageWidth: fields.Image_Width,
        imageHeight: fields.Image_Height,
        fileSizeKB: fields.File_Size_KB,
        explanation,
        imageUrl: fields.Image_URL
      }
    });

  } catch (error) {
    console.error('Fetch analysis error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File too large - maximum size is 10MB'
      });
    }
  }

  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Exposr backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  
  // Check critical environment variables
  const requiredVars = ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID'];
  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
  } else {
    console.log('✅ All required environment variables are set');
  }
});

module.exports = app;
