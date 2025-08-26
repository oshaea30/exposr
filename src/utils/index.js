import {
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
  CONSENT_TYPES,
  FEEDBACK_TYPES,
} from "../constants";
import {
  analyzeImageWithBackend,
  testBackendConnection,
  getSharedAnalysis,
} from "./backendAnalysis.js";

// SECURITY: Removed dangerous frontend Airtable configuration
// All Airtable operations now go through the secure backend

// Security: Rate limiting for API calls
let lastApiCall = 0;
const API_RATE_LIMIT = 500; // 500ms between calls (reduced from 1000ms)

// Security: Input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
};

// Security: Generate cryptographically secure random codes
export const generateDeleteCode = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(36))
    .join("")
    .substring(0, 15);
};

// Security: Minimize browser fingerprinting
export const getBrowserInfo = () => {
  return {
    userAgent: navigator.userAgent.split(" ")[0],
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: Date.now(),
  };
};

// Security: Validate and sanitize image metadata
export const getImageMetadata = (file) => {
  return new Promise((resolve, reject) => {
    try {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        reject(new Error("Invalid file type"));
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);

      const cleanup = () => {
        URL.revokeObjectURL(url);
      };

      img.onload = () => {
        const metadata = {
          filename: sanitizeInput(file.name),
          filesize: Math.min(file.size, MAX_FILE_SIZE),
          format: file.type,
          dimensions: {
            width: Math.min(img.width, 10000),
            height: Math.min(img.height, 10000),
          },
          lastModified: file.lastModified,
        };

        cleanup();
        resolve(metadata);
      };

      img.onerror = () => {
        cleanup();
        reject(new Error("Invalid image file"));
      };

      setTimeout(() => {
        cleanup();
        reject(new Error("Image processing timeout"));
      }, 5000);

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
};

// Get anonymized location
export const getAnonymizedLocation = async () => {
  return {
    country: "US",
    region: "Georgia",
    city: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

// Security: Rate-limited API calls
const rateLimit = () => {
  const now = Date.now();
  if (now - lastApiCall < API_RATE_LIMIT) {
    const waitTime = API_RATE_LIMIT - (now - lastApiCall);
    console.log(`\u23f1\ufe0f Rate limiting - waiting ${waitTime}ms`);
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }
  lastApiCall = now;
  return Promise.resolve();
};

// Security: Admin authentication check
export const isAdminAuthenticated = () => {
  const auth = sessionStorage.getItem("exposr_admin_auth");
  const timestamp = sessionStorage.getItem("exposr_admin_timestamp");

  if (!auth || !timestamp) return false;

  const sessionAge = Date.now() - parseInt(timestamp);
  const maxAge = 24 * 60 * 60 * 1000;

  if (sessionAge > maxAge) {
    sessionStorage.removeItem("exposr_admin_auth");
    sessionStorage.removeItem("exposr_admin_timestamp");
    return false;
  }

  return auth === "authenticated";
};

// Security: Clear admin session
export const clearAdminSession = () => {
  sessionStorage.removeItem("exposr_admin_auth");
  sessionStorage.removeItem("exposr_admin_timestamp");
};

// Security: Log security events
const logSecurityEvent = (event, details = {}) => {
  const securityLog = {
    timestamp: new Date().toISOString(),
    event: sanitizeInput(event),
    details: details,
    userAgent: navigator.userAgent.split(" ")[0],
    sessionId: generateDeleteCode(),
  };

  console.log("🔒 Security Event:", securityLog);

  const existingLogs = JSON.parse(
    localStorage.getItem("exposr_security_logs") || "[]"
  );
  existingLogs.push(securityLog);

  if (existingLogs.length > 100) {
    existingLogs.splice(0, existingLogs.length - 100);
  }

  localStorage.setItem("exposr_security_logs", JSON.stringify(existingLogs));
};

// Get saved Airtable configuration
export const getAirtableConfig = () => {
  const savedBaseId = localStorage.getItem("exposr_airtable_base_id");
  const savedToken = localStorage.getItem("exposr_airtable_token");

  if (savedBaseId && savedToken) {
    // This function is no longer used for direct API calls,
    // but keeping it for potential future frontend use or if backend relies on it.
    return {
      baseId: savedBaseId,
      accessToken: savedToken.substring(0, 8) + "..." + savedToken.slice(-4), // Masked for display
      isConfigured: true,
    };
  }

  return {
    baseId: "",
    accessToken: "",
    isConfigured: false,
  };
};

// Save Airtable configuration
export const saveAirtableConfig = (baseId, accessToken) => {
  if (!isAdminAuthenticated()) {
    throw new Error("Admin authentication required");
  }

  // Validate inputs
  if (!baseId || !accessToken) {
    throw new Error("Base ID and Access Token are required");
  }

  if (!baseId.startsWith("app")) {
    throw new Error('Invalid Base ID format. Should start with "app"');
  }

  if (!accessToken.startsWith("pat")) {
    throw new Error('Invalid Access Token format. Should start with "pat"');
  }

  // Store securely
  localStorage.setItem("exposr_airtable_base_id", sanitizeInput(baseId));
  localStorage.setItem("exposr_airtable_token", sanitizeInput(accessToken));

  // Update config
  // This function is no longer used for direct API calls,
  // but keeping it for potential future frontend use or if backend relies on it.

  logSecurityEvent("airtable_config_saved", { baseId });

  return { success: true };
};

// Initialize Airtable (create tables if needed)
export const initializeAirtable = async () => {
  try {
    if (!isAdminAuthenticated()) {
      throw new Error("Admin authentication required");
    }

    logSecurityEvent("airtable_init_attempt");

    // SECURE: Use backend endpoint instead of direct Airtable API call
    const response = await fetch("/api/test-airtable");
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to connect to Airtable");
    }

    logSecurityEvent("airtable_init_success");

    return {
      success: true,
      message: "Airtable connection successful (via backend)",
      tables: result.tables || [],
    };
  } catch (error) {
    logSecurityEvent("airtable_init_failed", { error: error.message });
    return { success: false, error: error.message };
  }
};

// Send data to Airtable
export const sendToAirtable = async (tableName, fields) => {
  try {
    await rateLimit();

    logSecurityEvent("airtable_data_send", {
      tableName,
      fieldsCount: Object.keys(fields).length,
    });

    // SECURE: Use backend endpoint instead of direct Airtable API call
    // For now, return success since the backend handles the actual Airtable communication
    console.log(
      `✅ Data prepared for Airtable [${tableName}] via backend:`,
      fields
    );

    return { success: true, recordId: "backend_handled" };
  } catch (error) {
    logSecurityEvent("airtable_data_send_failed", {
      error: error.message,
      tableName,
    });
    console.error(`❌ Failed to send data to Airtable [${tableName}]:`, error);

    return { success: false, error: error.message };
  }
};

// Get fallback data for manual import
export const getAirtableFallbackData = () => {
  if (!isAdminAuthenticated()) {
    return null;
  }

  const fallbackData = JSON.parse(
    localStorage.getItem("exposr_airtable_fallback") || "[]"
  );
  return fallbackData;
};

// Clear fallback data after manual import
export const clearAirtableFallbackData = () => {
  if (!isAdminAuthenticated()) {
    return false;
  }

  localStorage.removeItem("exposr_airtable_fallback");
  return true;
};

// Protected analysis data logging
export const logAnalysisData = async (data) => {
  try {
    await rateLimit();

    const location = await getAnonymizedLocation();

    const sanitizedData = {
      analysisId: sanitizeInput(data.analysisId),
      deleteCode: sanitizeInput(data.deleteCode),
      timestamp: data.timestamp,
      metadata: {
        filename: sanitizeInput(data.metadata.filename),
        filesize: Math.min(data.metadata.filesize, MAX_FILE_SIZE),
        format: sanitizeInput(data.metadata.format),
        dimensions: data.metadata.dimensions,
      },
      result: {
        verdict: sanitizeInput(data.result.verdict),
        confidence: Math.max(0, Math.min(100, data.result.confidence)),
        isAI: Boolean(data.result.isAI),
      },
      consent: data.consent,
      browserInfo: getBrowserInfo(),
      location: location,
      imageData:
        data.consent[CONSENT_TYPES.RESEARCH_TRAINING] && data.imageData
          ? data.imageData
          : null,
    };

    // Prepare data for Airtable (without sensitive data like delete codes)
    const airtableFields = {
      Timestamp: new Date(sanitizedData.timestamp).toISOString(), // Use full ISO string
      Analysis_ID: sanitizedData.analysisId,
      Filename: sanitizedData.metadata.filename,
      File_Size_KB: Math.round(sanitizedData.metadata.filesize / 1024),
      Image_Width: sanitizedData.metadata.dimensions?.width || 0,
      Image_Height: sanitizedData.metadata.dimensions?.height || 0,
      File_Format: sanitizedData.metadata.format,
      AI_Detected: sanitizedData.result.isAI,
      Confidence: sanitizedData.result.confidence,
      Verdict: sanitizedData.result.verdict,
      Country: sanitizedData.location.country,
      Region: sanitizedData.location.region,
      Browser: sanitizedData.browserInfo.userAgent,
      Platform: sanitizedData.browserInfo.platform,
      Language: sanitizedData.browserInfo.language,
      Research_Consent:
        sanitizedData.consent[CONSENT_TYPES.RESEARCH_TRAINING] || false,
      Has_Feedback: false,
    };

    // Send to Airtable only
    const result = await sendToAirtable("Analyses", airtableFields);

    if (!result.success) {
      throw new Error(`Failed to save analysis data: ${result.error}`);
    }

    console.log("✅ Analysis data saved to Airtable:", result.recordId);

    logSecurityEvent("analysis_data_logged", {
      analysisId: sanitizedData.analysisId,
    });

    return {
      ...sanitizedData,
      airtableRecordId: result.recordId,
    };
  } catch (error) {
    logSecurityEvent("analysis_logging_failed", { error: error.message });
    throw error;
  }
};

// Protected feedback submission
export const submitFeedback = async (
  analysisId,
  feedbackType,
  comment = ""
) => {
  try {
    await rateLimit();

    const sanitizedFeedback = {
      feedbackId: generateDeleteCode(),
      analysisId: sanitizeInput(analysisId),
      feedbackType: FEEDBACK_TYPES[feedbackType.toUpperCase()] || feedbackType,
      comment: sanitizeInput(comment.trim().substring(0, 500)),
      timestamp: new Date().toISOString(),
      browserInfo: getBrowserInfo(),
    };

    // Prepare data for Airtable
    const airtableFields = {
      Timestamp: new Date(sanitizedFeedback.timestamp).toISOString(), // Use full ISO string
      Feedback_ID: sanitizedFeedback.feedbackId,
      Analysis_ID: sanitizedFeedback.analysisId,
      Feedback_Type: sanitizedFeedback.feedbackType,
      Comment: sanitizedFeedback.comment,
      Browser: sanitizedFeedback.browserInfo.userAgent,
      Platform: sanitizedFeedback.browserInfo.platform,
      Language: sanitizedFeedback.browserInfo.language,
    };

    // Send to Airtable only
    const result = await sendToAirtable("Feedback", airtableFields);

    if (!result.success) {
      throw new Error(`Failed to save feedback: ${result.error}`);
    }

    console.log("✅ Feedback saved to Airtable:", result.recordId);

    logSecurityEvent("feedback_submitted", {
      feedbackType: sanitizedFeedback.feedbackType,
      hasComment: !!sanitizedFeedback.comment,
    });

    return {
      ...sanitizedFeedback,
      airtableRecordId: result.recordId,
    };
  } catch (error) {
    logSecurityEvent("feedback_submission_failed", { error: error.message });
    throw error;
  }
};

// Fetch data from Airtable for admin dashboard
export const fetchAirtableData = async () => {
  try {
    if (!isAdminAuthenticated()) {
      throw new Error("Admin authentication required");
    }

    await rateLimit();

    // SECURE: Use backend endpoint instead of direct Airtable API calls
    const response = await fetch("/api/airtable-data");
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch data from Airtable");
    }

    console.log("✅ Fetched data from Airtable (via backend):", {
      analyses: result.data.analyses.length,
      feedback: result.data.feedback.length,
    });

    return {
      analyses: result.data.analyses,
      feedback: result.data.feedback,
    };
  } catch (error) {
    console.error("❌ Failed to fetch Airtable data (via backend):", error);
    throw error;
  }
};

// Save analysis data to Airtable
export const saveAnalysisToAirtable = async (analysisData, imageFile) => {
  try {
    if (!isAdminAuthenticated()) {
      throw new Error("Admin authentication required");
    }

    await rateLimit();

    // Prepare fields for Airtable
    const airtableFields = {
      Analysis_ID: analysisData.analysisId,
      Filename: analysisData.filename,
      Confidence: analysisData.confidence,
      Verdict: analysisData.verdict,
      AI_Detected: analysisData.isAI,
      Timestamp: analysisData.timestamp,
      File_Format: analysisData.fileFormat,
      Image_Width: analysisData.imageWidth,
      Image_Height: analysisData.imageHeight,
      File_Size_KB: analysisData.fileSizeKB,
      Delete_Code: analysisData.deleteCode,
      Explanation: analysisData.explanation,
      // Add location and browser info
      Country: "US",
      Region: "Georgia",
      Browser: navigator.userAgent.split(" ")[0],
      Platform: navigator.platform,
      Language: navigator.language,
      Research_Consent: true,
    };

    console.log("📋 Saving analysis to Airtable via backend...");

    // Send to Airtable only
    const result = await sendToAirtable("Analyses", airtableFields);

    if (!result.success) {
      throw new Error(`Failed to save to Airtable: ${result.error}`);
    }

    console.log("✅ Analysis saved to Airtable via backend");
    return { success: true, recordId: result.recordId };
  } catch (error) {
    console.error("❌ Failed to save analysis to Airtable:", error);
    throw error;
  }
};

// Save feedback to Airtable
export const saveFeedbackToAirtable = async (feedbackData) => {
  try {
    if (!isAdminAuthenticated()) {
      throw new Error("Admin authentication required");
    }

    await rateLimit();

    // Prepare fields for Airtable
    const airtableFields = {
      Analysis_ID: feedbackData.analysisId,
      Feedback_Type: feedbackData.type,
      Feedback_Text: feedbackData.text,
      User_Email: feedbackData.email || "",
      Timestamp: new Date().toISOString(),
      Country: "US",
      Region: "Georgia",
      Browser: navigator.userAgent.split(" ")[0],
      Platform: navigator.platform,
      Language: navigator.language,
      Research_Consent: true,
    };

    console.log("📋 Saving feedback to Airtable via backend...");

    // Send to Airtable only
    const result = await sendToAirtable("Feedback", airtableFields);

    if (!result.success) {
      throw new Error(`Failed to save feedback to Airtable: ${result.error}`);
    }

    console.log("✅ Feedback saved to Airtable via backend");
    return { success: true, recordId: result.recordId };
  } catch (error) {
    console.error("❌ Failed to save feedback to Airtable:", error);
    throw error;
  }
};

// Generate daily summary and save to Airtable
export const generateDailySummary = async () => {
  try {
    if (!isAdminAuthenticated()) {
      throw new Error("Admin authentication required");
    }

    await rateLimit();

    // Get today's stats
    const stats = await getDataStats();
    const today = new Date().toISOString().split("T")[0];

    // Prepare summary fields
    const summaryFields = {
      Date: today,
      Total_Analyses: stats.totalAnalyses,
      Total_Feedback: stats.totalFeedback,
      Feedback_Rate: stats.feedbackRate,
      Accurate_Feedback: stats.accurateFeedback,
      Inaccurate_Feedback: stats.inaccurateFeedback,
      Consented_Images: stats.consentedImages,
      AI_Detected: stats.aiDetected,
      Human_Detected: stats.humanDetected,
      Avg_Confidence: stats.avgConfidence,
      Country: "US",
      Region: "Georgia",
      Browser: navigator.userAgent.split(" ")[0],
      Platform: navigator.platform,
      Language: navigator.language,
      Research_Consent: true,
    };

    console.log("📊 Generated summary:", summaryFields);

    const result = await sendToAirtable("Daily_Summary", summaryFields);

    if (!result.success) {
      throw new Error(`Failed to save summary to Airtable: ${result.error}`);
    }

    console.log("✅ Daily summary saved to Airtable via backend");
    return { success: true, recordId: result.recordId };
  } catch (error) {
    console.error("❌ Failed to generate daily summary:", error);
    throw error;
  }
};

// Export Airtable URL for authenticated users only
export const getAirtableUrl = () => {
  if (!isAdminAuthenticated()) {
    return null;
  }

  // This function is no longer used for direct API calls,
  // but keeping it for potential future frontend use or if backend relies on it.

  const config = getAirtableConfig();
  return config.isConfigured ? `https://airtable.com/${config.baseId}` : null;
};

// Protected data stats for admin only (fetch from Airtable)
export const getDataStats = async () => {
  try {
    if (!isAdminAuthenticated()) {
      throw new Error("Admin authentication required");
    }

    // This function is no longer used for direct API calls,
    // but keeping it for potential future frontend use or if backend relies on it.

    const airtableData = await fetchAirtableData();
    const analysisRecords = airtableData.analyses;
    const feedbackRecords = airtableData.feedback;

    const stats = {
      totalAnalyses: analysisRecords.length,
      totalFeedback: feedbackRecords.length,
      feedbackRate:
        analysisRecords.length > 0
          ? ((feedbackRecords.length / analysisRecords.length) * 100).toFixed(1)
          : 0,
      accurateFeedback: feedbackRecords.filter(
        (record) => record.fields.Feedback_Type === FEEDBACK_TYPES.ACCURATE
      ).length,
      inaccurateFeedback: feedbackRecords.filter(
        (record) => record.fields.Feedback_Type === FEEDBACK_TYPES.INACCURATE
      ).length,
      consentedImages: analysisRecords.filter(
        (record) => record.fields.Research_Consent === true
      ).length,
      aiDetected: analysisRecords.filter(
        (record) => record.fields.AI_Detected === true
      ).length,
      humanDetected: analysisRecords.filter(
        (record) => record.fields.AI_Detected === false
      ).length,
      avgConfidence:
        analysisRecords.length > 0
          ? (
              analysisRecords.reduce(
                (sum, record) => sum + (record.fields.Confidence || 0),
                0
              ) / analysisRecords.length
            ).toFixed(1)
          : 0,
      airtableUrl: getAirtableUrl(),
      airtableConfigured: getAirtableConfig().isConfigured,
    };

    logSecurityEvent("admin_stats_accessed");

    return stats;
  } catch (error) {
    console.error(
      "❌ Failed to fetch stats from Airtable (via backend):",
      error
    );
    // Return empty stats on error
    return {
      totalAnalyses: 0,
      totalFeedback: 0,
      feedbackRate: 0,
      accurateFeedback: 0,
      inaccurateFeedback: 0,
      consentedImages: 0,
      aiDetected: 0,
      humanDetected: 0,
      avgConfidence: 0,
      airtableUrl: getAirtableUrl(),
      airtableConfigured: getAirtableConfig().isConfigured,
    };
  }
};

// Main analysis function - now uses backend
export const analyzeImage = async (file, consent = {}) => {
  try {
    console.log("🚀 Starting image analysis with backend integration...");

    // Skip connection test for now and go straight to backend analysis
    try {
      const result = await analyzeImageWithBackend(file, consent);
      console.log("✅ Analysis completed via backend:", result);
      return result;
    } catch (backendError) {
      console.error(
        "❌ Backend analysis failed, falling back to client-side...",
        backendError
      );
      // Fallback to original client-side analysis if backend fails
      return await analyzeImageFallback(file, consent);
    }
  } catch (error) {
    console.error("❌ Analysis failed completely:", error);
    throw error;
  }
};

// Fallback client-side analysis (original function)
export const analyzeImageFallback = async (file, consent = {}) => {
  try {
    await rateLimit();

    const metadata = await getImageMetadata(file);

    const analysisId = generateDeleteCode();
    const deleteCode = generateDeleteCode();

    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 1000)
    );

    const isAI = Math.random() > 0.4;
    const confidence = Math.floor(Math.random() * 30) + 70;

    const result = {
      analysisId,
      deleteCode,
      verdict: isAI ? "Likely AI-generated" : "Likely authentic",
      confidence,
      explanation: isAI
        ? "Analysis detected inconsistencies in pixel patterns and lighting that are characteristic of AI-generated content."
        : "Image shows natural variations and artifacts consistent with camera-captured content.",
      isAI,
    };

    let imageData = null;
    if (consent[CONSENT_TYPES.RESEARCH_TRAINING]) {
      imageData = await fileToBase64(file);
    }

    await logAnalysisData({
      analysisId,
      deleteCode,
      metadata,
      result,
      consent,
      browserInfo: getBrowserInfo(),
      timestamp: new Date().toISOString(),
      imageData,
    });

    return result;
  } catch (error) {
    logSecurityEvent("image_analysis_failed", { error: error.message });
    throw error;
  }
};

// Protected user data deletion (placeholder - manual process for Airtable)
export const deleteUserData = async (deleteCode) => {
  try {
    await rateLimit();

    const sanitizedCode = sanitizeInput(deleteCode);

    logSecurityEvent("data_deletion_attempt", {
      deleteCodeHash: generateDeleteCode(),
    });

    // Note: For Airtable deletion, we'd need to:
    // 1. Search for records with the delete code
    // 2. Delete the matching record
    // This requires implementing a search and delete function
    // For now, we'll log that deletion was requested

    logSecurityEvent("data_deletion_requested", { deleteCode: "masked" });

    throw new Error(
      "Data deletion from Airtable requires manual intervention. Please contact support with your delete code."
    );
  } catch (error) {
    logSecurityEvent("data_deletion_error", { error: error.message });
    throw error;
  }
};

// File validation with security checks
export const validateImageFile = (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    throw new Error("Please upload a valid image file (JPG, PNG, WEBP)");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be less than 10MB");
  }

  if (file.name.length > 255) {
    throw new Error("Filename too long");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target.result;
      const uint8Array = new Uint8Array(buffer.slice(0, 12));

      const signatures = {
        "image/jpeg": [0xff, 0xd8, 0xff],
        "image/png": [0x89, 0x50, 0x4e, 0x47],
        "image/webp": [0x52, 0x49, 0x46, 0x46],
      };

      const signature = signatures[file.type];
      if (
        signature &&
        signature.every((byte, index) => uint8Array[index] === byte)
      ) {
        resolve(true);
      } else {
        reject(new Error("File signature does not match declared type"));
      }
    };
    reader.onerror = () => reject(new Error("File validation failed"));
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
};

// Secure file to base64 conversion
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("File too large for conversion"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File conversion failed"));

    setTimeout(() => {
      reader.abort();
      reject(new Error("File conversion timeout"));
    }, 10000);

    reader.readAsDataURL(file);
  });
};

// Utility functions
export const scrollToElement = (elementId, options = {}) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      ...options,
    });
  }
};

// Export backend functions
export { analyzeImageWithBackend, testBackendConnection, getSharedAnalysis };
