require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const Airtable = require("airtable");
const { v2: cloudinary } = require("cloudinary");
const { HfInference } = require("@huggingface/inference");

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Airtable
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID);

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Hugging Face
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Security middleware
app.use(helmet());

// CORS middleware - Bulletproof implementation with Vercel preview support
function isAllowedOrigin(origin) {
  if (!origin) return false;

  // Development - allow localhost
  if (origin === "http://localhost:3000" && process.env.NODE_ENV === "development") {
    return true;
  }

  // Production domains
  const prod = new Set([
    "https://exposrmvp.vercel.app",
    "https://www.exposrai.com",
  ]);
  if (prod.has(origin)) return true;

  // Allow Vercel preview deployments for this frontend project - tighter security
  const isPreview =
    origin.startsWith("https://exposrmvp-") &&
    origin.includes(".oshaea30s-projects.vercel.app");

  return isPreview;
}

function parseAllowedOrigins(envVal) {
  // Split on commas or whitespace, trim, and drop empties
  return (envVal || "")
    .split(/[, \n\r\t]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildCorsHeaders(originHeader) {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };

  if (isAllowedOrigin(originHeader)) {
    headers["Access-Control-Allow-Origin"] = originHeader; // echo exact origin
    headers["Vary"] = "Origin";
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  const headers = buildCorsHeaders(origin);

  // Apply all CORS headers
  for (const [k, v] of Object.entries(headers)) {
    res.setHeader(k, v);
  }
}

// CORS middleware for all routes
app.use((req, res, next) => {
  applyCors(req, res);

  // Always set Vary: Origin for cache correctness (even on OPTIONS)
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    // Preflight
    return res.status(204).end();
  }

  next();
});

// Rate limiting - TEMPORARILY DISABLED FOR DEBUGGING
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
//   message: {
//     error: 'Too many requests from this IP, please try again later.',
//     retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Add a general API logging middleware (BEFORE routes)
app.use("/api/*", (req, res, next) => {
  console.log(`📝 API Request: ${req.method} ${req.originalUrl}`);
  next();
});

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (
      process.env.ALLOWED_FILE_TYPES ||
      "image/jpeg,image/jpg,image/png,image/webp"
    ).split(",");

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
        ),
        false
      );
    }
  },
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// CORS diagnostics route (temporary)
app.get("/api/cors-diagnostics", (req, res) => {
  res.json({
    origin: req.headers.origin || null,
    allowOriginHeader: res.getHeader("Access-Control-Allow-Origin") || null,
    vary: res.getHeader("Vary") || null,
    credentials: res.getHeader("Access-Control-Allow-Credentials") || null,
  });
});

// Temporary debug route to check environment variables
app.get("/api/debug-env", (req, res) => {
  res.json({
    origin: req.headers.origin || null,
    isAllowedOrigin: isAllowedOrigin(req.headers.origin),
    allowOriginHeader: res.getHeader("Access-Control-Allow-Origin") || null,
    vary: res.getHeader("Vary") || null,
    credentials: res.getHeader("Access-Control-Allow-Credentials") || null,
    corsHeaders: buildCorsHeaders(req.headers.origin),
    productionDomains: [
      "https://exposrmvp.vercel.app",
      "https://www.exposrai.com",
    ],
    previewPattern: "https://exposrmvp-*.vercel.app",
  });
});

// Image analysis endpoint - DISABLED (HiveAI service removed)
// app.post('/api/analyze', upload.single('image'), async (req, res) => {
//   // HiveAI analysis code was here
// });

// Temporary endpoint for testing (you can remove this later)
app.post("/api/analyze", upload.single("image"), async (req, res) => {
  // Set a timeout for the entire request
  const timeout = setTimeout(() => {
    res.status(408).json({
      success: false,
      error: "Request timeout - analysis took too long",
    });
  }, 60000); // 60 second timeout for AI analysis

  try {
    // Validate file upload
    if (!req.file) {
      clearTimeout(timeout);
      return res.status(400).json({
        success: false,
        error: "No image file provided",
      });
    }

    console.log("🤖 Analyzing image with Hugging Face SMOGY detector...");

    // Call Hugging Face API for AI detection
    const aiDetectionResult = await hf.imageClassification({
      data: req.file.buffer,
      model: "Smogy/SMOGY-Ai-images-detector"
    });

    // Parse results (returns array like [{label: "ai", score: 0.95}, {label: "real", score: 0.05}])
    const isAI = aiDetectionResult[0].label.toLowerCase() === "ai";
    const confidence = Math.round(aiDetectionResult[0].score * 100);

    const analysisId = Math.random().toString(36).substring(2, 15);
    
    const analysisResult = {
      analysisId: analysisId,
      filename: req.file.originalname,
      confidence: confidence,
      verdict: isAI ? "AI-generated" : "Likely authentic",
      isAI: isAI,
      timestamp: new Date().toISOString(),
      fileFormat: req.file.mimetype,
      imageWidth: 1024, // Would need image-size package for actual dimensions
      imageHeight: 1024,
      fileSizeKB: Math.round(req.file.size / 1024),
      deleteCode: Math.random().toString(36).substring(2, 15),
      explanation: `SMOGY AI detector analyzed this image with ${confidence}% confidence.`,
      detectionDetails: aiDetectionResult // Include full detection results
    };

    // Save analysis to Airtable with Cloudinary image upload
    let cloudinaryImageId = null;
    let imageUrl = null;

    try {
      console.log("📋 Attempting to save analysis to Airtable...");
      console.log("📁 File info:", {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
      });
      console.log("🏷️ Using Analysis_ID for Airtable:", analysisResult.analysisId);

      // Upload image to Cloudinary first
      console.log("☁️ Uploading image to Cloudinary...");

      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        {
          public_id: `exposr/${analysisResult.analysisId}`,
          folder: "exposr",
          resource_type: "image",
          transformation: [
            { width: 1024, height: 1024, crop: "limit" }, // Limit size for better performance
            { quality: "auto" }, // Optimize quality
          ],
        }
      );

      cloudinaryImageId = uploadResult.public_id;
      imageUrl = uploadResult.secure_url;
      console.log("✅ Image uploaded to Cloudinary:", cloudinaryImageId);

      // Now save to Airtable with Cloudinary image URL
      const record = await base("Analyses").create({
        Analysis_ID: analysisResult.analysisId,
        Filename: analysisResult.filename,
        Confidence: analysisResult.confidence,
        Verdict: analysisResult.verdict,
        AI_Detected: analysisResult.isAI,
        Timestamp: analysisResult.timestamp,
        File_Format: analysisResult.fileFormat,
        Image_Width: analysisResult.imageWidth,
        Image_Height: analysisResult.imageHeight,
        File_Size_KB: analysisResult.fileSizeKB,
        // Store Cloudinary info for deletion
        Cloudinary_Image_ID: cloudinaryImageId,
        Image_URL: imageUrl,
      });

      console.log(
        "✅ Analysis with Cloudinary image saved to Airtable:",
        record.id
      );
      console.log("🔗 Image URL:", imageUrl);
    } catch (error) {
      console.error(
        "❌ Failed to save to Airtable or upload to Cloudinary:",
        error.message
      );

      // If Airtable failed but Cloudinary succeeded, clean up Cloudinary
      if (cloudinaryImageId) {
        try {
          await cloudinary.uploader.destroy(cloudinaryImageId);
          console.log("🧹 Cleaned up Cloudinary image after Airtable failure");
        } catch (cleanupError) {
          console.error(
            "❌ Failed to cleanup Cloudinary image:",
            cleanupError.message
          );
        }
      }
    }

    res.json({
      success: true,
      data: analysisResult,
    });

    clearTimeout(timeout);
  } catch (error) {
    clearTimeout(timeout);
    console.error("Analysis error:", error.message);
    res.status(500).json({
      success: false,
      error: "Analysis failed - please try again later",
    });
  }
});

// Simple test endpoint to verify routing works
app.get("/api/test", (req, res) => {
  console.log("🧪 TEST ENDPOINT HIT!");
  res.json({ message: "Test endpoint working!" });
});

// Test Cloudinary connection
app.get("/api/test-cloudinary", async (req, res) => {
  try {
    console.log("☁️ Testing Cloudinary connection...");
    console.log("🔑 Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("🔑 API Key:", process.env.CLOUDINARY_API_KEY);
    console.log("🔑 API Secret exists:", !!process.env.CLOUDINARY_API_SECRET);

    // Test with a simple API call
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary ping successful:", result);

    res.json({
      success: true,
      message: "Cloudinary connection successful",
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      result: result,
    });
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  }
});

// SECURE: Airtable connection test endpoint
app.get("/api/test-airtable", async (req, res) => {
  try {
    console.log("📋 Testing Airtable connection...");
    console.log("🔑 API Key exists:", !!process.env.AIRTABLE_API_KEY);
    console.log("🏠 Base ID:", process.env.AIRTABLE_BASE_ID);

    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      return res.status(400).json({
        success: false,
        error:
          "Airtable not configured. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.",
      });
    }

    // Test connection by trying to read the base schema
    const testUrl = `https://api.airtable.com/v0/meta/bases/${process.env.AIRTABLE_BASE_ID}/tables`;

    const response = await fetch(testUrl, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).json({
          success: false,
          error:
            "Invalid Access Token. Please check your Airtable Personal Access Token.",
        });
      } else if (response.status === 404) {
        return res.status(404).json({
          success: false,
          error: "Base not found. Please check your Base ID.",
        });
      } else {
        return res.status(response.status).json({
          success: false,
          error: `Airtable API error: ${response.status}`,
        });
      }
    }

    const data = await response.json();
    console.log(
      "✅ Airtable connection successful. Tables found:",
      data.tables?.map((t) => t.name)
    );

    res.json({
      success: true,
      message: "Airtable connection successful",
      tables: data.tables?.map((t) => t.name) || [],
      baseId: process.env.AIRTABLE_BASE_ID,
    });
  } catch (error) {
    console.error("❌ Airtable connection failed:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// SECURE: Get Airtable data endpoint
app.get("/api/airtable-data", async (req, res) => {
  try {
    console.log("📊 Fetching Airtable data...");

    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      return res.status(400).json({
        success: false,
        error:
          "Airtable not configured. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.",
      });
    }

    // Fetch analyses data
    const analysesUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Analyses`;
    const analysesResponse = await fetch(analysesUrl, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!analysesResponse.ok) {
      throw new Error(`Failed to fetch analyses: ${analysesResponse.status}`);
    }

    const analysesData = await analysesResponse.json();

    // Fetch feedback data
    const feedbackUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Feedback`;
    const feedbackResponse = await fetch(feedbackUrl, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!feedbackResponse.ok) {
      throw new Error(`Failed to fetch feedback: ${feedbackResponse.status}`);
    }

    const feedbackData = await feedbackResponse.json();

    console.log("✅ Fetched data from Airtable:", {
      analyses: analysesData.records.length,
      feedback: feedbackData.records.length,
    });

    res.json({
      success: true,
      data: {
        analyses: analysesData.records,
        feedback: feedbackData.records,
      },
    });
  } catch (error) {
    console.error("❌ Failed to fetch Airtable data:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Shared analysis endpoint - retrieve analysis by ID (DEBUG VERSION)
app.get("/api/analysis/:analysisId", async (req, res) => {
  console.log("🔍 ANALYSIS ENDPOINT HIT!");
  console.log("📋 Analysis ID requested:", req.params.analysisId);
  console.log("🔑 Airtable API Key exists:", !!process.env.AIRTABLE_API_KEY);
  console.log("🏠 Base ID:", process.env.AIRTABLE_BASE_ID);

  try {
    const { analysisId } = req.params;

    // Log what we're searching for
    console.log(`🔍 Searching for Analysis_ID: "${analysisId}"`);

    // Test basic Airtable connection first
    console.log("🧪 Testing basic Airtable connection...");
    const testRecords = await base("Analyses")
      .select({ maxRecords: 1 })
      .firstPage();
    console.log(
      "✅ Basic connection works, found records:",
      testRecords.length
    );

    // Now search for specific record
    console.log("🎯 Searching for specific record...");
    const records = await base("Analyses")
      .select({
        filterByFormula: `{Analysis_ID} = '${analysisId}'`,
        maxRecords: 1,
      })
      .firstPage();

    console.log("📊 Search results:", records.length);

    if (records.length === 0) {
      console.log("❌ No records found for Analysis_ID:", analysisId);

      // Let's see what Analysis_IDs actually exist
      console.log("🔍 Getting sample Analysis_IDs from database...");
      const sampleRecords = await base("Analyses")
        .select({ maxRecords: 5 })
        .firstPage();
      const sampleIds = sampleRecords.map((r) => r.fields.Analysis_ID);
      console.log("📝 Sample Analysis_IDs in database:", sampleIds);

      return res.status(404).json({
        success: false,
        error: "Analysis not found",
        debug: {
          searchedFor: analysisId,
          sampleIds: sampleIds,
        },
      });
    }

    const record = records[0];
    const fields = record.fields;

    console.log("✅ Found record!", {
      id: fields.Analysis_ID,
      confidence: fields.Confidence,
      verdict: fields.Verdict,
    });

    // Generate explanation based on AI detection and confidence
    let explanation;
    if (fields.AI_Detected) {
      if (fields.Confidence >= 90) {
        explanation =
          "Analysis detected strong patterns characteristic of AI-generated content, including artificial lighting, synthetic textures, or computational artifacts.";
      } else if (fields.Confidence >= 70) {
        explanation =
          "Analysis detected inconsistencies in pixel patterns and lighting that are characteristic of AI-generated content.";
      } else {
        explanation =
          "Some signs of potential AI generation detected, but result requires careful interpretation.";
      }
    } else {
      if (fields.Confidence >= 90) {
        explanation =
          "Analysis shows natural patterns consistent with authentic photography, including realistic lighting and textures.";
      } else if (fields.Confidence >= 70) {
        explanation =
          "Content appears authentic with natural photographic characteristics and consistent metadata.";
      } else {
        explanation =
          "Content appears more likely to be authentic, though some analysis uncertainty remains.";
      }
    }

    // Return public analysis data (excluding sensitive info)
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
      // Use Cloudinary image URL if available
      imageUrl: fields.Image_URL || null,
    };

    console.log("🎉 Returning success response");
    res.json({
      success: true,
      data: analysisData,
    });
  } catch (error) {
    console.error("💥 ERROR in analysis endpoint:", error);
    console.error("💥 Error details:", error.message);
    console.error("💥 Error stack:", error.stack);

    res.status(500).json({
      success: false,
      error: "Failed to fetch analysis",
      debug: {
        message: error.message,
        type: error.constructor.name,
      },
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        error: "File too large - maximum size is 10MB",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: "Too many files - please upload one image at a time",
      });
    }
  }

  if (error.message.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Exposr backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
});

module.exports = app;
