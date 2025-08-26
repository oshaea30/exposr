import React, { useState } from 'react';
import { ANALYSIS_STATUS, CONSENT_TYPES } from '../constants';
import { validateImageFile, analyzeImage, fileToBase64 } from '../utils';
import FileUploadZone from './FileUploadZone';
import ImagePreview from './ImagePreview';
import AnalysisLoading from './AnalysisLoading';
import AnalysisResults from './AnalysisResults';
import { Button } from './ui';
import { HelpCircle, Users, Shield, Award } from 'lucide-react';
import { BUTTON_VARIANTS } from '../constants';

const FAQModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200 animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">❓ How does this work?</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                <span>🎯</span>
                <span>How accurate is AI detection?</span>
              </h3>
              <p className="text-gray-600">
                Our detection system uses advanced AI models to analyze images for signs of synthetic generation. While highly sophisticated, no AI detector is 100% accurate. We provide confidence scores and explanations to help you make informed decisions.
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                <span>🔒</span>
                <span>What data do you collect?</span>
              </h3>
              <p className="text-gray-600">
                We collect anonymous usage data including image metadata (dimensions, file size), analysis results, and optional user feedback. Your actual image is only stored if you give explicit consent for research purposes. We provide a delete code so you can remove your data anytime.
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                <span>🤖</span>
                <span>What types of AI-generated content can you detect?</span>
              </h3>
              <p className="text-gray-600">
                We can identify images created by popular AI models like DALL-E, Midjourney, Stable Diffusion, and others. We also detect deepfakes and face-swapped content.
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                <span>🗑️</span>
                <span>How do I delete my data?</span>
              </h3>
              <p className="text-gray-600">
                After each analysis, you'll receive a unique delete code. Visit our delete page and enter this code to remove all associated data. No account or personal information required.
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                <span>🤔</span>
                <span>What should I do if I think the result is wrong?</span>
              </h3>
              <p className="text-gray-600">
                Please use the feedback buttons below each result. This helps us improve our accuracy. AI detection is a tool to assist your judgment, not replace it. Consider multiple factors when making important decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialProofBanner = () => (
  <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-200 py-6">
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-4">
        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Trusted by thousands worldwide</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-gray-600">
        <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="font-medium">Journalists & Reporters</span>
        </div>
        <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <Shield className="w-4 h-4 text-purple-500" />
          <span className="font-medium">Content Creators</span>
        </div>
        <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <Award className="w-4 h-4 text-green-500" />
          <span className="font-medium">Everyday Users</span>
        </div>
      </div>
    </div>
  </div>
);

const AnalysisSection = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [status, setStatus] = useState(ANALYSIS_STATUS.IDLE);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [consent, setConsent] = useState({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file) => {
    try {
      validateImageFile(file);
      setError(null);
      
      const base64Image = await fileToBase64(file);
      setUploadedImage(base64Image);

      setStatus(ANALYSIS_STATUS.ANALYZING);
      setResult(null);

      const analysisResult = await analyzeImage(file, consent);
      setResult(analysisResult);
      setStatus(ANALYSIS_STATUS.COMPLETE);
    } catch (err) {
      setError(err.message);
      setStatus(ANALYSIS_STATUS.ERROR);
      setUploadedImage(null);
    }
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setResult(null);
    setStatus(ANALYSIS_STATUS.IDLE);
    setError(null);
    setConsent({});
    setFeedbackSubmitted(false);  // Reset feedback state
  };

  const handleConsentChange = (consentType, value) => {
    setConsent(prev => ({
      ...prev,
      [consentType]: value
    }));
  };

  const handleFeedbackSubmitted = (feedbackType, comment) => {
    console.log('📝 Feedback submitted:', { feedbackType, comment });
    console.log('🔄 Setting feedbackSubmitted to true');
    setFeedbackSubmitted(true);  // Mark feedback as submitted
  };

  const dragHandlers = {
    onDragEnter: handleDrag,
    onDragLeave: handleDrag,
    onDragOver: handleDrag,
    onDrop: handleDrop
  };

  return (
    <>
      <section id="upload-section" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Analyze Any Image
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Drop your image below and get instant AI detection results with confidence scores
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 animate-slide-up hover:shadow-2xl transition-shadow duration-300">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-up" role="alert">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}
            
            {!uploadedImage ? (
              <FileUploadZone 
                onFileSelect={handleFile}
                dragActive={dragActive}
                onDragHandlers={dragHandlers}
                consent={consent}
                onConsentChange={handleConsentChange}
              />
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <ImagePreview src={uploadedImage} onRemove={resetAnalysis} />
                </div>
                
                {status === ANALYSIS_STATUS.ANALYZING && (
                  <div className="animate-fade-in">
                    <AnalysisLoading />
                  </div>
                )}
                {status === ANALYSIS_STATUS.COMPLETE && result && (
                  <div className="animate-fade-in">
                    <AnalysisResults 
                      key={result.analysisId}  // Use unique key to prevent re-rendering
                      result={result} 
                      onReset={resetAnalysis}
                      onFeedbackSubmitted={handleFeedbackSubmitted}
                      feedbackSubmitted={feedbackSubmitted}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FAQ Button */}
          <div className="text-center mt-8 animate-slide-up-delayed">
            <Button
              variant={BUTTON_VARIANTS.OUTLINE}
              onClick={() => setShowFAQ(true)}
              className="inline-flex items-center space-x-2 hover:shadow-lg transition-all duration-200"
            >
              <HelpCircle className="w-4 h-4" />
              <span>How does this work?</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Banner */}
      <SocialProofBanner />

      {/* FAQ Modal */}
      <FAQModal isOpen={showFAQ} onClose={() => setShowFAQ(false)} />
    </>
  );
};

export default AnalysisSection;