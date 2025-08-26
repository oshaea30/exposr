const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

class SecurityManager {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.encryptionKey = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') : this.generateKey();
    this.jwtSecret = process.env.JWT_SECRET || this.generateSecret();
  }

  // Generate secure encryption key
  generateKey() {
    console.warn('⚠️ SECURITY WARNING: Generating temporary encryption key. Set ENCRYPTION_KEY in production!');
    return crypto.randomBytes(32);
  }

  // Generate secure JWT secret
  generateSecret() {
    console.warn('⚠️ SECURITY WARNING: Generating temporary JWT secret. Set JWT_SECRET in production!');
    return crypto.randomBytes(64).toString('hex');
  }

  // Enhanced rate limiting
  createRateLimiter(windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests') {
    return rateLimit({
      windowMs,
      max,
      message: { error: message },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        console.warn(`🚨 Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ error: message });
      }
    });
  }

  // Authentication rate limiter
  createAuthLimiter() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs
      message: { error: 'Too many authentication attempts, please try again later.' },
      skipSuccessfulRequests: true,
      handler: (req, res) => {
        console.warn(`🚨 Auth rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ error: 'Too many authentication attempts, please try again later.' });
      }
    });
  }

  // Security headers middleware
  setupSecurityHeaders(app) {
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", process.env.FRONTEND_URL || "http://localhost:3000"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: 'same-origin' }
    }));

    app.use(cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    return app;
  }

  // Input sanitization
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potential XSS vectors
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/[<>]/g, '')
      .trim()
      .substring(0, 1000); // Limit length
  }

  // File validation
  validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // 10MB

    if (!file) {
      throw new Error('No file provided');
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
    }

    // Validate file signature
    const buffer = file.buffer;
    const signatures = {
      'image/jpeg': [0xFF, 0xD8, 0xFF],
      'image/png': [0x89, 0x50, 0x4E, 0x47],
      'image/webp': [0x52, 0x49, 0x46, 0x46]
    };

    const signature = signatures[file.mimetype];
    if (signature && !signature.every((byte, index) => buffer[index] === byte)) {
      throw new Error('File signature does not match declared type');
    }

    return true;
  }

  // Data encryption
  encrypt(data) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Data encryption failed');
    }
  }

  // Data decryption
  decrypt(encryptedData) {
    try {
      const decipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Data decryption failed');
    }
  }

  // Password hashing
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Password verification
  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // JWT token generation
  generateToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, this.jwtSecret, { expiresIn });
  }

  // JWT token verification
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Generate secure random string
  generateSecureId(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Hash sensitive identifiers
  hashIdentifier(identifier) {
    return crypto.createHash('sha256').update(identifier).digest('hex');
  }

  // Middleware for authentication
  authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    try {
      const decoded = this.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  }

  // Security logging
  logSecurityEvent(event, details = {}, level = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      level
    };

    if (level === 'warn' || level === 'error') {
      console.warn('🔒 Security Event:', JSON.stringify(logEntry));
    } else {
      console.log('🔒 Security Event:', JSON.stringify(logEntry));
    }

    // In production, send to centralized logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement centralized logging (e.g., Winston, DataDog, etc.)
    }
  }

  // Validate environment variables
  validateEnvironment() {
    const required = [
      'HIVE_API_KEY',
      'AIRTABLE_API_KEY',
      'AIRTABLE_BASE_ID'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Warn about insecure configurations
    if (!process.env.JWT_SECRET) {
      console.warn('⚠️ WARNING: JWT_SECRET not set. Using generated secret (not suitable for production)');
    }

    if (!process.env.ENCRYPTION_KEY) {
      console.warn('⚠️ WARNING: ENCRYPTION_KEY not set. Using generated key (not suitable for production)');
    }

    if (process.env.NODE_ENV === 'production') {
      if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL.includes('localhost')) {
        console.warn('⚠️ WARNING: FRONTEND_URL not properly configured for production');
      }
    }
  }

  // Security middleware stack
  setupSecurityMiddleware(app) {
    // Validate environment
    this.validateEnvironment();

    // Security headers
    this.setupSecurityHeaders(app);

    // Global rate limiting
    app.use(this.createRateLimiter());

    // Request logging
    app.use((req, res, next) => {
      this.logSecurityEvent('request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      next();
    });

    // Body size limiting
    app.use(require('express').json({ limit: '1mb' }));
    app.use(require('express').urlencoded({ extended: true, limit: '1mb' }));

    return app;
  }
}

module.exports = new SecurityManager();