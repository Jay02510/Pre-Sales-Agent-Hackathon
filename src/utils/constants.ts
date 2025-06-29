// Application Constants
export const APP_CONSTANTS = {
  // URL Validation
  SUPPORTED_URL_PATTERNS: [
    /^https?:\/\/[^\/]*\.com/,
    /^https?:\/\/[^\/]*\.org/,
    /^https?:\/\/[^\/]*\.net/,
    /^https?:\/\/linkedin\.com\/company\//,
    /^https?:\/\/[^\/]*news[^\/]*/,
    /^https?:\/\/[^\/]*blog[^\/]*/,
  ],
  
  RESTRICTED_DOMAINS: [
    'instagram.com',
    'facebook.com', 
    'twitter.com',
    'x.com',
    'tiktok.com',
    'snapchat.com',
    'pinterest.com',
    'reddit.com',
    'youtube.com',
    'discord.com',
    'telegram.org',
    'whatsapp.com',
  ],
  
  // Report Generation
  MAX_URLS_PER_REPORT: 10,
  MIN_CONTENT_LENGTH: 100,
  MAX_CONTENT_LENGTH: 10000,
  
  // UI Constants
  LOADING_STEPS: [
    { key: 'extract', label: 'Extracting content from web sources', progress: 25 },
    { key: 'analyze', label: 'Analyzing content with AI', progress: 50 },
    { key: 'generate', label: 'Generating comprehensive report', progress: 75 },
    { key: 'finalize', label: 'Finalizing and saving report', progress: 90 },
  ],
  
  // CRM Export
  CRM_FORMATS: {
    SALESFORCE: 'salesforce',
    HUBSPOT: 'hubspot', 
    PIPEDRIVE: 'pipedrive',
    UNIVERSAL: 'universal',
    JSON: 'json',
    VCARD: 'vcard',
  },
  
  // Feedback
  RATING_SCALE: { MIN: 1, MAX: 5 },
  FEEDBACK_TYPES: ['positive', 'negative'] as const,
  
  // Performance
  DEBOUNCE_DELAY: 300,
  CACHE_KEYS: {
    REPORTS: 'reports',
    USER_PREFERENCES: 'user_preferences',
    FEEDBACK: 'feedback',
  },
} as const;

export type FeedbackType = typeof APP_CONSTANTS.FEEDBACK_TYPES[number];