import React, { useState, useEffect } from 'react';
import { Brain, Sparkles } from 'lucide-react';

const AnalysisLoading = () => {
  const [loadingText, setLoadingText] = useState("We're analyzing your image...");
  const [progress, setProgress] = useState(0);
  
  const loadingMessages = [
    "We're analyzing your image...",
    "Detecting AI patterns... Sit tight!",
    "Our AI is thinking hard...",
    "Almost there... Just a moment!"
  ];
  
  useEffect(() => {
    let messageIndex = 0;
    let progressValue = 0;
    
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 2000);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 300);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);
  
  return (
    <div className="text-center py-8 px-6" role="status" aria-label="Analyzing image">
      {/* Animated icon with sparkles */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="absolute inset-0 animate-ping">
          <Brain className="w-12 h-12 text-purple-300 opacity-20" />
        </div>
        <Brain className="relative w-12 h-12 text-purple-600 animate-pulse" />
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
      </div>
      
      {/* Dynamic loading text with fade transition */}
      <div className="h-8 mb-4">
        <span className="text-lg font-medium text-gray-900 animate-pulse transition-all duration-500">
          {loadingText}
        </span>
      </div>
      
      {/* Enhanced progress bar */}
      <div className="mt-4 w-80 mx-auto bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>
      
      {/* Progress percentage */}
      <p className="text-sm text-purple-600 font-medium mt-2">
        {Math.round(progress)}% complete
      </p>
      
      <p className="text-xs text-gray-500 mt-3 max-w-xs mx-auto">
        Our AI is carefully examining your image for artificial patterns and anomalies
      </p>
    </div>
  );
};

export default AnalysisLoading;
