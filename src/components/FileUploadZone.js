import React, { useRef } from 'react';
import { Upload, Info } from 'lucide-react';
import { Button } from './ui';
import { BUTTON_VARIANTS, CONSENT_TYPES } from '../constants';

const ConsentCheckbox = ({ consent, onConsentChange }) => (
  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
    <div className="flex items-start space-x-3">
      <input
        type="checkbox"
        id="research-consent"
        checked={consent[CONSENT_TYPES.RESEARCH_TRAINING] !== undefined ? consent[CONSENT_TYPES.RESEARCH_TRAINING] : true}
        onChange={(e) => onConsentChange(CONSENT_TYPES.RESEARCH_TRAINING, e.target.checked)}
        className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <div className="flex-1">
        <label htmlFor="research-consent" className="text-sm text-blue-900 cursor-pointer">
          <span className="font-medium">Help us improve:</span> I consent to this image being used for research and training purposes (optional)
        </label>
        <div className="flex items-start space-x-2 mt-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            This helps us improve our AI detection accuracy. Your image will be stored securely and used only for research. You can delete it anytime using your delete code.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const PrivacyNotice = () => (
  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
    <div className="flex items-start space-x-2">
      <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
      <div className="text-xs text-gray-600">
        <p className="font-medium mb-1">Privacy Notice:</p>
        <ul className="space-y-1">
          <li>• We collect anonymous usage data to improve our service</li>
          <li>• Your image is not stored unless you give consent above</li>
          <li>• You'll receive a delete code to remove your data anytime</li>
          <li>• No personal information or account required</li>
        </ul>
      </div>
    </div>
  </div>
);

const FileUploadZone = ({ onFileSelect, dragActive, onDragHandlers, consent, onConsentChange }) => {
  const fileInputRef = useRef(null);
  
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0], consent);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Enhanced dropzone with cinematic styling */}
      <div
        className={`group relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
          dragActive 
            ? 'border-purple-500 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 shadow-xl transform scale-[1.02]' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-gray-50 hover:via-purple-25 hover:to-blue-25 hover:shadow-lg hover:transform hover:scale-[1.01]'
        }`}
        {...onDragHandlers}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Animated upload icon */}
        <div className="relative z-10">
          <Upload className={`w-16 h-16 mx-auto mb-4 transition-all duration-300 ${
            dragActive 
              ? 'text-purple-500 transform scale-110 animate-bounce' 
              : 'text-gray-400 group-hover:text-purple-500 group-hover:transform group-hover:scale-105'
          }`} />
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-purple-900">
            {dragActive ? "Drop it like it's hot!" : "Drag & drop an image to start"}
          </h3>
          <p className="text-gray-600 mb-6 transition-colors duration-300 group-hover:text-purple-700">
            {dragActive ? "We're ready to catch it!" : "Or click to select a file from your device"}
          </p>
          
          <Button 
            variant={BUTTON_VARIANTS.PRIMARY}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            Choose Image
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            aria-label="Upload image file"
          />
          
          <p className="text-sm text-gray-500 mt-4 transition-colors duration-300 group-hover:text-purple-600">
            Supports JPG, PNG, WEBP up to 10MB
          </p>
        </div>
      </div>

      {/* Consent Checkbox */}
      <ConsentCheckbox 
        consent={consent}
        onConsentChange={onConsentChange}
      />

      {/* Privacy Notice */}
      <PrivacyNotice />
    </div>
  );
};

export default FileUploadZone;