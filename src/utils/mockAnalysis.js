/**
 * Mock AI image analysis utility
 * Simulates realistic AI detection results with evidence points
 */

// Evidence points database for realistic analysis results
const EVIDENCE_POINTS = {
  human: [
    "Natural camera noise and grain patterns detected",
    "Authentic EXIF metadata with camera sensor information",
    "Realistic lighting inconsistencies typical of photography",
    "Natural compression artifacts from camera processing",
    "Organic color variations and imperfections",
    "Authentic depth of field and focus characteristics",
    "Real-world optical distortions and aberrations",
    "Natural skin texture and pore detail variations",
    "Authentic shadow patterns and light physics",
    "Genuine environmental reflections and lighting"
  ],
  ai: [
    "Signature smoothing patterns typical of diffusion models",
    "Abnormal pixel distributions consistent with GAN generation",
    "Missing or corrupted EXIF metadata",
    "Over-perfect symmetry uncommon in natural photography",
    "Telltale compression artifacts from AI upscaling",
    "Unnatural color gradients typical of neural networks",
    "Anatomical inconsistencies common in AI generation",
    "Repetitive texture patterns characteristic of AI models",
    "Impossible lighting scenarios that defy physics",
    "Blending artifacts around object boundaries",
    "Facial features showing AI generation hallmarks",
    "Background elements with AI-typical distortions"
  ],
  inconclusive: [
    "Mixed compression signatures from multiple sources",
    "Partial metadata suggesting post-processing",
    "Some regions show AI characteristics, others appear natural",
    "Ambiguous texture patterns that could be either source",
    "Conflicting evidence from different analysis methods",
    "Low resolution limiting detailed analysis capability",
    "Heavy post-processing masking original source indicators",
    "Quality degradation affecting detection accuracy"
  ]
};

// Weighted probability for more realistic distribution
const RESULT_WEIGHTS = {
  human: 0.45,    // 45% chance - most images are still human-created
  ai: 0.35,       // 35% chance - growing but not dominant
  inconclusive: 0.20  // 20% chance - realistic analysis limitations
};

/**
 * Simulates AI image analysis with realistic results
 * @param {File} file - The image file to analyze
 * @returns {Promise<Object>} Analysis result with verdict, confidence, and evidence
 */
export const analyzeImageMock = async (file) => {
  // Simulate processing time (1.5-3 seconds for realism)
  const processingTime = 1500 + Math.random() * 1500;
  await new Promise(resolve => setTimeout(resolve, processingTime));

  // 10% chance of analysis error
  if (Math.random() < 0.1) {
    throw new Error("Analysis failed. Our servers are experiencing high load. Please try again in a moment.");
  }

  // Determine result type based on weighted probabilities
  const random = Math.random();
  let resultType;
  if (random < RESULT_WEIGHTS.human) {
    resultType = 'human';
  } else if (random < RESULT_WEIGHTS.human + RESULT_WEIGHTS.ai) {
    resultType = 'ai';
  } else {
    resultType = 'inconclusive';
  }

  // Generate confidence score based on result type
  let confidence;
  let verdict;
  let explanation;
  
  switch (resultType) {
    case 'human':
      confidence = 75 + Math.floor(Math.random() * 20); // 75-94%
      verdict = 'Likely Human-Created';
      explanation = 'This image appears to be created by a human. No AI traces found.';
      break;
    case 'ai':
      confidence = 70 + Math.floor(Math.random() * 25); // 70-94%
      verdict = 'AI-Generated';
      explanation = 'AI-generated image detected. This image shows traits consistent with diffusion models like Midjourney or DALL·E.';
      break;
    case 'inconclusive':
      confidence = 45 + Math.floor(Math.random() * 30); // 45-74%
      verdict = 'Inconclusive';
      explanation = 'Analysis inconclusive. This image has both real and synthetic characteristics.';
      break;
  }

  // Select 3-4 random evidence points for this result type
  const availableEvidence = EVIDENCE_POINTS[resultType];
  const evidenceCount = 3 + Math.floor(Math.random() * 2); // 3-4 points
  const selectedEvidence = [];
  const usedIndices = new Set();

  while (selectedEvidence.length < evidenceCount && selectedEvidence.length < availableEvidence.length) {
    const randomIndex = Math.floor(Math.random() * availableEvidence.length);
    if (!usedIndices.has(randomIndex)) {
      selectedEvidence.push(availableEvidence[randomIndex]);
      usedIndices.add(randomIndex);
    }
  }

  // Add some technical metadata for realism
  const technicalDetails = generateTechnicalDetails(file, resultType);

  return {
    verdict,
    confidence,
    explanation,
    evidencePoints: selectedEvidence,
    isAI: resultType === 'ai',
    isInconclusive: resultType === 'inconclusive',
    technicalDetails,
    analysisId: generateAnalysisId(),
    timestamp: new Date().toISOString()
  };
};

/**
 * Generates realistic technical details for the analysis
 * @param {File} file - The uploaded file
 * @param {string} resultType - The analysis result type
 * @returns {Object} Technical analysis details
 */
const generateTechnicalDetails = (file, resultType) => {
  const details = {
    fileSize: formatFileSize(file.size),
    dimensions: null, // Would be populated by actual image analysis
    format: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
    processingTime: (1.5 + Math.random() * 1.5).toFixed(2) + 's'
  };

  // Add result-specific technical indicators
  switch (resultType) {
    case 'human':
      details.exifData = "Present and valid";
      details.compressionType = "Camera-native JPEG";
      details.noiseAnalysis = "Natural sensor noise detected";
      break;
    case 'ai':
      details.exifData = "Missing or synthetic";
      details.compressionType = "AI-processed compression";
      details.noiseAnalysis = "Artificial noise patterns";
      break;
    case 'inconclusive':
      details.exifData = "Partially present";
      details.compressionType = "Mixed compression signatures";
      details.noiseAnalysis = "Ambiguous noise patterns";
      break;
  }

  return details;
};

/**
 * Formats file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generates a unique analysis ID for tracking
 * @returns {string} Unique analysis identifier
 */
const generateAnalysisId = () => {
  return 'EXP-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
};
