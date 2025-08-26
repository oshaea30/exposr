// Backend-integrated analysis functions for Exposr
import { generateDeleteCode } from "./index.js";

// Backend API base URL - don't include /api here since we add it in the fetch calls
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// Analyze image using backend API
export const analyzeImageWithBackend = async (file, consent = {}) => {
  try {
    console.log("📤 Sending image to backend for analysis...");

    // Create FormData to send file
    const formData = new FormData();
    formData.append("image", file);
    formData.append("consent", JSON.stringify(consent));

    // Send to backend
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Backend error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Analysis failed");
    }

    console.log("✅ Backend analysis completed:", result.data);

    return result.data;
  } catch (error) {
    console.error("❌ Backend analysis failed:", error);
    throw error;
  }
};

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Backend not responding: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Backend connection test:", result);

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Backend connection failed:", error);
    return { success: false, error: error.message };
  }
};

// Get shared analysis from backend
export const getSharedAnalysis = async (analysisId) => {
  try {
    console.log("🔍 Fetching shared analysis from backend:", analysisId);

    const response = await fetch(`${API_BASE_URL}/api/analysis/${analysisId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to fetch analysis: ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch analysis");
    }

    console.log("✅ Shared analysis fetched:", result.data);

    return result.data;
  } catch (error) {
    console.error("❌ Failed to fetch shared analysis:", error);
    throw error;
  }
};
