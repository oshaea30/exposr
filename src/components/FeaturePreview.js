import React from 'react';
import { CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import { FeatureCard } from '../ui';

/**
 * Feature preview section showing app capabilities
 */
const FeaturePreview = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'AI detected',
      description: 'Advanced algorithms identify synthetic content'
    },
    {
      icon: Shield,
      title: 'Verified with source',
      description: 'Cross-reference with authentic databases'
    },
    {
      icon: AlertTriangle,
      title: 'Manipulated content',
      description: 'Detect edited or altered media'
    }
  ];

  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};

export default FeaturePreview;
