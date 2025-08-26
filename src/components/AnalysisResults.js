import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, ThumbsUp, ThumbsDown, MessageSquare, Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { StatusBadge, ProgressBar, Button } from './ui';
import { BADGE_VARIANTS, BUTTON_VARIANTS, FEEDBACK_TYPES } from '../constants';
import { submitFeedback } from '../utils';

const FeedbackSection = ({ analysisId, onFeedbackSubmitted, feedbackSubmitted }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  console.log('🔍 FeedbackSection render - feedbackSubmitted:', feedbackSubmitted);

  // If feedback was submitted from parent, show thank you message
  // This must be checked FIRST before any other UI logic
  if (feedbackSubmitted) {
    console.log('🎉 Showing thank you message');
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Thank you for your feedback!</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Your feedback helps us improve our AI detection accuracy.
          </p>
        </div>
      </div>
    );
  }

  const handleFeedback = async (feedbackType) => {
    if (feedbackGiven || submitting) return; // Prevent multiple submissions
    
    console.log('🔘 Feedback button clicked:', feedbackType);
    setSubmitting(true);
    setFeedbackGiven(feedbackType);
    
    try {
      // If feedback is "inaccurate", show comment box first
      if (feedbackType === FEEDBACK_TYPES.INACCURATE) {
        console.log('❌ Showing comment box for inaccurate feedback');
        setShowCommentBox(true);
        setSubmitting(false);
        return;
      }
      
      // For "accurate" feedback, submit immediately
      console.log('✅ Submitting accurate feedback immediately');
      await submitFeedback(analysisId, feedbackType, '');
      console.log('✅ Accurate feedback submitted, calling onFeedbackSubmitted');
      onFeedbackSubmitted?.(feedbackType, '');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      // Reset state on error
      setFeedbackGiven(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentSubmit = async () => {
    setSubmitting(true);
    try {
      await submitFeedback(analysisId, feedbackGiven, comment);
      console.log('💬 Comment submitted, calling onFeedbackSubmitted');
      onFeedbackSubmitted?.(feedbackGiven, comment);  // This will trigger parent to show thank you
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipComment = async () => {
    setSubmitting(true);
    try {
      await submitFeedback(analysisId, feedbackGiven, '');
      console.log('⏭️ Comment skipped, calling onFeedbackSubmitted');
      onFeedbackSubmitted?.(feedbackGiven, '');  // This will trigger parent to show thank you
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 mt-4">
      <div className="text-center">
        <p className="text-sm text-gray-700 mb-3">Was this result accurate?</p>
        
        {!feedbackGiven && (
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => handleFeedback(FEEDBACK_TYPES.ACCURATE)}
              disabled={submitting}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Yes</span>
            </button>
            
            <button
              onClick={() => handleFeedback(FEEDBACK_TYPES.INACCURATE)}
              disabled={submitting}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>No</span>
            </button>
          </div>
        )}

        {showCommentBox && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MessageSquare className="w-4 h-4" />
              <span>Tell us what seemed wrong (optional):</span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What seemed wrong about the result?"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm"
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-center space-x-2">
              <Button
                variant={BUTTON_VARIANTS.OUTLINE}
                size="sm"
                onClick={handleSkipComment}
                disabled={submitting}
              >
                Skip
              </Button>
              <Button
                variant={BUTTON_VARIANTS.PRIMARY}
                size="sm"
                onClick={handleCommentSubmit}
                disabled={submitting}
                loading={submitting}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ShareSection = ({ analysisId }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  React.useEffect(() => {
    // Generate the shareable URL
    const currentUrl = window.location.origin;
    const shareableUrl = `${currentUrl}#share/${analysisId}`;
    setShareUrl(shareableUrl);
  }, [analysisId]);

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openShareUrl = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 text-blue-700 mb-2">
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Share This Analysis</span>
        </div>
        <p className="text-xs text-blue-600 mb-3">
          Share your AI detection results with others
        </p>
        
        <div className="flex items-center justify-center space-x-2 mb-3">
          <code className="bg-white px-3 py-2 rounded border text-xs font-mono text-blue-900 flex-1 truncate max-w-xs">
            {shareUrl}
          </code>
          <button
            onClick={copyShareUrl}
            className="p-2 text-blue-600 hover:text-blue-700 transition-colors bg-white rounded border"
            title="Copy share link"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={openShareUrl}
            className="p-2 text-blue-600 hover:text-blue-700 transition-colors bg-white rounded border"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        
        {copied && (
          <p className="text-xs text-green-600 font-medium">
            ✓ Link copied to clipboard!
          </p>
        )}
      </div>
    </div>
  );
};

const DeleteCodeDisplay = ({ deleteCode }) => {
  const [copied, setCopied] = useState(false);

  const copyDeleteCode = async () => {
    try {
      await navigator.clipboard.writeText(deleteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
      <div className="text-center">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Your Delete Code:</strong> Save this to remove your data later
        </p>
        <div className="flex items-center justify-center space-x-2">
          <code className="bg-white px-3 py-2 rounded border text-sm font-mono text-gray-900">
            {deleteCode}
          </code>
          <button
            onClick={copyDeleteCode}
            className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
            title="Copy delete code"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Visit <a href="#delete" className="underline hover:text-gray-700">the delete page</a> to remove your data using this code
        </p>
      </div>
    </div>
  );
};

const AnalysisResults = ({ result, onReset, onFeedbackSubmitted, feedbackSubmitted }) => (
  <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-100 animate-fade-in">
    <div className="text-center mb-6 animate-slide-up">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full blur-lg opacity-20 animate-pulse" />
        <StatusBadge variant={result.isAI ? BADGE_VARIANTS.DANGER : BADGE_VARIANTS.SUCCESS}>
          {result.isAI ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>{result.verdict}</span>
        </StatusBadge>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up-delayed">
      <div className="text-center bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
          Confidence Score
        </h4>
        <div className="text-4xl font-bold text-gray-900 mb-2 animate-number-count">
          {result.confidence}%
        </div>
        <ProgressBar value={result.confidence} className="animate-progress-grow" />
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
          Analysis
        </h4>
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 leading-relaxed">
            {result.explanation}
          </p>
        </div>
      </div>
    </div>

    {/* Share Section */}
    <ShareSection analysisId={result.analysisId} />

    {/* User Feedback Section */}
    <FeedbackSection 
      analysisId={result.analysisId}
      onFeedbackSubmitted={onFeedbackSubmitted}
      feedbackSubmitted={feedbackSubmitted}
    />

    {/* Delete Code Display */}
    <DeleteCodeDisplay deleteCode={result.deleteCode} />

    <div className="mt-6 pt-6 border-t border-gray-200 animate-slide-up-delayed-2">
      <Button 
        variant={BUTTON_VARIANTS.SECONDARY} 
        className="w-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg" 
        onClick={onReset}
      >
        Analyze Another Image
      </Button>
    </div>
  </div>
);

export default AnalysisResults;