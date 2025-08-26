require('dotenv').config();
const express = require('express');
const multer = require('multer');
const Airtable = require('airtable');
const { v2: cloudinary } = require('cloudinary');

// Import security module
const security = require('./security');

const app = express();
const PORT = process.env.PORT || 3001;

// Apply security middleware FIRST
security.setupSecurityMiddleware(app);

// Initialize Airtable
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID);

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add API logging middleware
app.use('/api/*', (req, res, next) => {
  security.logSecurityEvent('api_request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  next();
});

// File upload configuration with security validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    try {
      // Use security module's file validation
      security.validateFile({
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer
      });
      cb(null, true);
    } catch (error) {
      cb(error, false);
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    security: 'enabled'
  });
});

// Admin authentication endpoint
app.post('/api/admin/login', security.createAuthLimiter(), async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      security.logSecurityEvent('admin_login_failed', { reason: 'No password provided' }, 'warn');
      return res.status(400).json({ error: 'Password required' });
    }

    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminPasswordHash) {
      security.logSecurityEvent('admin_login_failed', { reason: 'No admin password configured' }, 'error');
      return res.status(500).json({ error: 'Admin authentication not configured' });
    }

    const isValid = await security.verifyPassword(password, adminPasswordHash);
    
    if (isValid) {
      const token = security.generateToken({ role: 'admin' }, '1h');
      security.logSecurityEvent('admin_login_success', { ip: req.ip });
      
      res.json({
        success: true,
        token,
        expiresIn: 3600
      });
    } else {
      security.logSecurityEvent('admin_login_failed', { ip: req.ip }, 'warn');
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    security.logSecurityEvent('admin_login_error', { error: error.message }, 'error');
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Protected admin endpoint example
app.get('/api/admin/dashboard', (req, res, next) => security.authenticateToken(req, res, next), async (req, res) => {
  try {
    // Admin dashboard data
    res.json({
      success: true,
      data: {
        totalAnalyses: 0, // Fetch from Airtable
        recentAnalyses: []
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Image analysis endpoint with security
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  const timeout = setTimeout(() => {
    res.status(408).json({
      success: false,
      error: 'Request timeout - analysis took too long'
    });
  }, 30000); // 30 second timeout
  
  try {
    // Validate file upload
    if (!req.file) {
      clearTimeout(timeout);
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Additional security validation
    try {
      security.validateFile({
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer
      });
    } catch (validationError) {
      clearTimeout(timeout);
      security.logSecurityEvent('file_validation_failed', { 
        error: validationError.message,
        filename: req.file.originalname 
      }, 'warn');
      return res.status(400).json({
        success: false,
        error: validationError.message
      });
    }

    // Generate secure IDs
    const analysisId = security.generateSecureId(16);
    const deleteCode = security.generateSecureId(12);

    // Mock analysis result (replace with actual AI analysis)
    const mockResult = {
      analysisId,
      filename: security.sanitizeInput(req.file.originalname),
      confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
      verdict: Math.random() > 0.5 ? 'Likely AI-generated' : 'Likely authentic',
      isAI: Math.random() > 0.5,
      timestamp: new Date().toISOString(),
      fileFormat: req.file.mimetype,
      imageWidth: 1024, // Mock values
      imageHeight: 1024,
      fileSizeKB: Math.round(req.file.size / 1024),
      deleteCode: security.hashIdentifier(deleteCode), // Store hashed version
      deleteCodePlain: deleteCode, // Return plain version to user once
      explanation: 'Analysis detected patterns in the image content.'
    };

    // Upload to Cloudinary with security
    let cloudinaryImageId = null;
    let imageUrl = null;
    
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
          ],
          access_mode: 'public',
          overwrite: false
        }
      );
      
      cloudinaryImageId = uploadResult.public_id;
      imageUrl = uploadResult.secure_url;
      
      security.logSecurityEvent('image_uploaded', { 
        analysisId,
        cloudinaryId: cloudinaryImageId 
      });
      
    } catch (uploadError) {
      security.logSecurityEvent('cloudinary_upload_failed', { 
        error: uploadError.message 
      }, 'error');
      // Continue without image URL if upload fails
    }

    // Save to Airtable with encrypted sensitive data
    try {
      const encryptedData = security.encrypt({
        deleteCode: mockResult.deleteCode,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

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
        Cloudinary_Image_ID: cloudinaryImageId,
        Image_URL: imageUrl,
        Encrypted_Data: JSON.stringify(encryptedData),
        Country: 'US',
        Region: 'Georgia',
        Research_Consent: true
      });
      
      security.logSecurityEvent('analysis_saved', { 
        analysisId,
        recordId: record.id 
      });
      
    } catch (dbError) {
      security.logSecurityEvent('airtable_save_failed', { 
        error: dbError.message,
        analysisId 
      }, 'error');
      
      // Clean up Cloudinary if database save fails
      if (cloudinaryImageId) {
        try {
          await cloudinary.uploader.destroy(cloudinaryImageId);
        } catch (cleanupError) {
          security.logSecurityEvent('cloudinary_cleanup_failed', { 
            error: cleanupError.message 
          }, 'error');
        }
      }
    }

    // Return result without sensitive data
    const response = {
      success: true,
      data: {
        analysisId: mockResult.analysisId,
        filename: mockResult.filename,
        confidence: mockResult.confidence,
        verdict: mockResult.verdict,
        isAI: mockResult.isAI,
        timestamp: mockResult.timestamp,
        deleteCode: mockResult.deleteCodePlain, // Only returned once
        explanation: mockResult.explanation
      }
    };

    res.json(response);
    clearTimeout(timeout);

  } catch (error) {
    clearTimeout(timeout);
    security.logSecurityEvent('analysis_error', { 
      error: error.message 
    }, 'error');
    
    res.status(500).json({
      success: false,
      error: 'Analysis failed - please try again later'
    });
  }
});

// Shared analysis endpoint - retrieve analysis by ID (public)
app.get('/api/analysis/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    
    // Sanitize input
    const sanitizedId = security.sanitizeInput(analysisId);
    
    if (!sanitizedId || sanitizedId.length > 64) {
      return res.status(400).json({
        success: false,
        error: 'Invalid analysis ID'
      });
    }

    const records = await base('Analyses').select({
      filterByFormula: `{Analysis_ID} = '${sanitizedId}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length === 0) {
      security.logSecurityEvent('analysis_not_found', { analysisId: sanitizedId });
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    const record = records[0];
    const fields = record.fields;

    // Generate explanation
    let explanation;
    if (fields.AI_Detected) {
      if (fields.Confidence >= 90) {
        explanation = 'Analysis detected strong patterns characteristic of AI-generated content.';
      } else if (fields.Confidence >= 70) {
        explanation = 'Analysis detected inconsistencies characteristic of AI-generated content.';
      } else {
        explanation = 'Some signs of potential AI generation detected.';
      }
    } else {
      if (fields.Confidence >= 90) {
        explanation = 'Analysis shows natural patterns consistent with authentic photography.';
      } else if (fields.Confidence >= 70) {
        explanation = 'Content appears authentic with natural photographic characteristics.';
      } else {
        explanation = 'Content appears more likely to be authentic.';
      }
    }

    // Return public data only
    const analysisData = {
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
      explanation: explanation,
      imageUrl: fields.Image_URL || null
    };

    security.logSecurityEvent('analysis_retrieved', { analysisId: sanitizedId });

    res.json({
      success: true,
      data: analysisData
    });

  } catch (error) {
    security.logSecurityEvent('analysis_retrieval_error', { 
      error: error.message 
    }, 'error');
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis'
    });
  }
});

// Delete analysis endpoint (requires delete code)
app.delete('/api/analysis/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    const { deleteCode } = req.body;
    
    if (!deleteCode) {
      return res.status(400).json({
        success: false,
        error: 'Delete code required'
      });
    }

    // Sanitize inputs
    const sanitizedId = security.sanitizeInput(analysisId);
    const hashedDeleteCode = security.hashIdentifier(deleteCode);

    // Fetch record
    const records = await base('Analyses').select({
      filterByFormula: `{Analysis_ID} = '${sanitizedId}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    const record = records[0];
    
    // Verify delete code
    if (record.fields.Encrypted_Data) {
      try {
        const decryptedData = security.decrypt(JSON.parse(record.fields.Encrypted_Data));
        
        if (decryptedData.deleteCode !== hashedDeleteCode) {
          security.logSecurityEvent('delete_code_invalid', { 
            analysisId: sanitizedId 
          }, 'warn');
          return res.status(401).json({
            success: false,
            error: 'Invalid delete code'
          });
        }
      } catch (decryptError) {
        return res.status(401).json({
          success: false,
          error: 'Invalid delete code'
        });
      }
    }

    // Delete from Cloudinary
    if (record.fields.Cloudinary_Image_ID) {
      try {
        await cloudinary.uploader.destroy(record.fields.Cloudinary_Image_ID);
      } catch (cloudinaryError) {
        security.logSecurityEvent('cloudinary_delete_failed', { 
          error: cloudinaryError.message 
        }, 'error');
      }
    }

    // Delete from Airtable
    await base('Analyses').destroy(record.id);
    
    security.logSecurityEvent('analysis_deleted', { analysisId: sanitizedId });

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });

  } catch (error) {
    security.logSecurityEvent('delete_error', { 
      error: error.message 
    }, 'error');
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete analysis'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  security.logSecurityEvent('unhandled_error', { 
    error: error.message,
    stack: error.stack 
  }, 'error');

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File too large - maximum size is 10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files - please upload one image at a time'
      });
    }
  }

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
  console.log(`🔒 Security: ENABLED`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  
  // Security status check
  try {
    security.validateEnvironment();
    console.log(`✅ Security validation: PASSED`);
  } catch (error) {
    console.error(`❌ Security validation: FAILED - ${error.message}`);
  }
});

module.exports = app;
