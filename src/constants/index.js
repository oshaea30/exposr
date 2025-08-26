// Analysis status constants
export const ANALYSIS_STATUS = {
  IDLE: 'idle',
  ANALYZING: 'analyzing',
  COMPLETE: 'complete',
  ERROR: 'error'
};

// File validation constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// UI variants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline'
};

export const BADGE_VARIANTS = {
  DEFAULT: 'default',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info'
};

export const BUTTON_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

// Feedback types
export const FEEDBACK_TYPES = {
  ACCURATE: 'accurate',
  INACCURATE: 'inaccurate'
};

// Data collection consent
export const CONSENT_TYPES = {
  RESEARCH_TRAINING: 'research_training'
};
