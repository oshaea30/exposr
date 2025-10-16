import React from 'react';
import { Brain, Shield } from 'lucide-react';

const BottomCTA = () => (
  <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 relative">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        Deepfakes, AI-generated hoaxes, & misinformation are flooding the internet.
      </h2>
      <p className="text-xl text-purple-100 mb-8">
        Stay informed. Verify before you share.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <div className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/30">
          <Brain className="w-6 h-6 inline mr-2" />
          AI Detected
        </div>
        <div className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/30">
          <Shield className="w-6 h-6 inline mr-2" />
          Verified with source
        </div>
      </div>
    </div>
  </section>
);

export default BottomCTA;
