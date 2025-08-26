import React from "react";
import { Button } from "./ui";
import { CheckCircle, Shield, AlertTriangle, Brain, Sparkles } from "lucide-react";
import { BUTTON_SIZES } from "../constants";

const HeroSection = ({ onScrollToUpload }) => (
  <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
    {/* Background Elements */}
    <div className="absolute inset-0">
      {/* Glassmorphism background shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl" />
    </div>
    
    <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-28">
      {/* Main Hero Content */}
      <div className="text-center mb-20">
        {/* Badge with animation */}
        <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-8 shadow-lg animate-fade-in hover:shadow-xl hover:scale-105 transition-all duration-300">
          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
          <span className="text-sm font-medium text-gray-700">AI Detection Technology</span>
        </div>
        
        {/* Main Headline with staggered animations */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-8 leading-[1.1]">
          <div className="animate-slide-up">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Spot AI-generated
            </span>
          </div>
          <div className="animate-slide-up-delayed">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Content Instantly
            </span>
          </div>
        </h1>
        
        {/* Subtitle with better microcopy */}
        <div className="animate-slide-up-delayed-2">
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            From deepfakes to AI-generated misinformation,
            <br />
            <span className="text-gray-700 font-medium">Exposr helps you verify what's real in seconds</span>
          </p>
        </div>
        
        {/* Enhanced CTA Button */}
        <div className="animate-slide-up-delayed-2">
          <Button 
            size={BUTTON_SIZES.LG} 
            onClick={onScrollToUpload}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out backdrop-blur-sm rounded-full px-10 py-5 text-lg font-semibold group"
          >
            <span className="flex items-center space-x-2">
              <span>Start Detecting</span>
              <Brain className="w-5 h-5 group-hover:animate-pulse" />
            </span>
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column - Enhanced Status Badges */}
        <div className="space-y-6 animate-slide-up-delayed">
          <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 transform hover:scale-105 hover:shadow-xl transition-all duration-300 hover-lift">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-lg">AI detected</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/60 hover:shadow-lg transition-all duration-300 hover-lift">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-700 text-lg">Verified with source</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-300">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-700 text-lg">Manipulated content</span>
          </div>
        </div>
        {/* Right Column - Enhanced Preview Card */}
        <div className="flex flex-col items-center lg:items-end space-y-8 w-full animate-slide-up-delayed-2">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full shadow-2xl shadow-blue-500/10 border border-white/20 hover:shadow-3xl hover:scale-105 transition-all duration-500 hover-lift">
            {/* Image Preview */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-56 mb-6 flex items-center justify-center overflow-hidden shadow-inner">
              <img
                src={`${window.location.origin}/blur.png`}
                alt="AI Generated Example"
                className="object-cover h-full w-full rounded-2xl"
                onError={(e) => {
                  console.error('Failed to load blur.png:', e);
                  console.error('Image src:', e.target.src);
                  console.error('Current location:', window.location.href);
                  e.target.style.display = 'none';
                  // Show fallback content
                  const container = e.target.parentElement;
                  container.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full text-gray-500">
                      <div class="w-16 h-16 bg-gray-300 rounded-full mb-3 flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <p class="text-sm font-medium">AI Generated Example</p>
                      <p class="text-xs text-gray-400">Image preview</p>
                    </div>
                  `;
                }}
                onLoad={() => console.log('blur.png loaded successfully')}
              />
            </div>
            
            {/* Detection Status */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                  AI Generated
                </span>
              </div>
              
              <div className="flex items-center justify-center space-x-3 text-sm mb-4">
                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full shadow-sm">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-600 font-medium">Verified with source</span>
              </div>
            </div>
            
            {/* Enhanced Progress bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                  <span>AI Confidence</span>
                  <span>87%</span>
                </div>
                <div className="h-2 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-sm" style={{ width: "87%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                  <span>Manipulation</span>
                  <span>52%</span>
                </div>
                <div className="h-2 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-sm" style={{ width: "52%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Text Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
        {/* Left Column - Text */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Deepfakes, AI-generated hoaxes, & misinformation are flooding the
            internet.
          </h2>
        </div>
        {/* Right Column - Detection Icon and Status */}
        <div className="flex flex-col items-center lg:items-end space-y-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Brain className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              DETECTED
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center justify-center w-5 h-5 bg-purple-600 rounded-full">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-900 font-medium">AI Detected</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center justify-center w-5 h-5 bg-gray-400 rounded-full">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-600">Verified with source</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
