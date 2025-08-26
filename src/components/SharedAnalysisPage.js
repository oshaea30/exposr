import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, FileText, Monitor, Calendar, ArrowLeft, Upload } from 'lucide-react';
import { StatusBadge, ProgressBar, Button } from './ui';
import { BADGE_VARIANTS, BUTTON_VARIANTS } from '../constants';

const SharedAnalysisPage = ({ analysisId, onGoHome }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/analysis/${analysisId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Analysis not found. The link may be invalid or expired.');
          } else {
            setError('Failed to load analysis. Please try again later.');
          }
          return;
        }

        const result = await response.json();
        setAnalysisData(result.data);
      } catch (err) {
        console.error('Error fetching shared analysis:', err);
        setError('Failed to load analysis. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    if (analysisId) {
      fetchAnalysis();
    }
  }, [analysisId]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (sizeKB) => {
    if (sizeKB < 1024) {
      return `${sizeKB} KB`;
    }
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analysis Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            variant={BUTTON_VARIANTS.PRIMARY} 
            onClick={onGoHome}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Exposr
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Exposr</h1>
              <p className="text-xs text-gray-500">AI Image Detection</p>
            </div>
          </div>
          <Button 
            variant={BUTTON_VARIANTS.OUTLINE} 
            size="sm" 
            onClick={onGoHome}
            className="inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exposr
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Analysis Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Shared analysis from {formatDate(analysisData.timestamp)}
                </p>
              </div>
              <StatusBadge variant={analysisData.isAI ? BADGE_VARIANTS.DANGER : BADGE_VARIANTS.SUCCESS}>
                {analysisData.isAI ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>{analysisData.verdict}</span>
              </StatusBadge>
            </div>
          </div>

          {/* Analyzed Image */}
          {analysisData.imageUrl ? (
            <div className="px-6 py-4 bg-white border-b border-gray-200">
              <div className="flex justify-center">
                <div className="max-w-md w-full">
                  <img 
                    src={analysisData.imageUrl} 
                    alt={`Analyzed image: ${analysisData.filename}`}
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-center">
                <div className="max-w-md w-full text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Image not available for this analysis</p>
                  <p className="text-xs text-gray-400 mt-1">Newer analyses will include the original image</p>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Confidence Score */}
              <div className="text-center lg:text-left">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Confidence Score
                </h3>
                <div className="text-5xl font-bold text-gray-900 mb-3">
                  {analysisData.confidence}%
                </div>
                <ProgressBar value={analysisData.confidence} />
                <p className="text-sm text-gray-600 mt-2">
                  {analysisData.isAI 
                    ? 'High likelihood of AI generation detected'
                    : 'Appears to be authentic content'
                  }
                </p>
              </div>

              {/* File Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  File Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {analysisData.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {analysisData.fileFormat.replace('image/', '').toUpperCase()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-700">
                        {analysisData.imageWidth} × {analysisData.imageHeight} pixels
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(analysisData.fileSizeKB)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-700">
                        Analyzed on {formatDate(analysisData.timestamp)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Analysis ID: {analysisData.analysisId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Explanation */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Analysis Details
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysisData.explanation}
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-blue-50 px-6 py-6 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Try Exposr Yourself
              </h3>
              <p className="text-gray-600 mb-4">
                Upload your own images to detect AI-generated content with advanced analysis.
              </p>
              <Button 
                variant={BUTTON_VARIANTS.PRIMARY} 
                onClick={onGoHome}
                className="inline-flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Analyze Your Images
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          Powered by <span className="font-semibold text-blue-600">Exposr</span> - Advanced AI Detection Technology
        </p>
      </div>
    </div>
  );
};

export default SharedAnalysisPage;