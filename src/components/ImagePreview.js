import React from 'react';

const ImagePreview = ({ src, onRemove, alt = "Uploaded image" }) => (
  <div className="relative inline-block">
    <img
      src={src}
      alt={alt}
      className="w-full max-w-md mx-auto rounded-xl shadow-lg"
      loading="lazy"
    />
    <button
      onClick={onRemove}
      className="absolute top-2 right-2 bg-white hover:bg-gray-100 text-gray-600 w-8 h-8 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
      aria-label="Remove image"
      title="Remove image"
    >
      <span className="text-lg leading-none">×</span>
    </button>
  </div>
);

export default ImagePreview;
