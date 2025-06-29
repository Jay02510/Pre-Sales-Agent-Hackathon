// Application Configuration
export const config = {
  app: {
    name: 'PreSales AI Research Agent',
    version: '2.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  
  services: {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      enabled: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
    },
    
    firecrawl: {
      apiKey: import.meta.env.VITE_FIRECRAWL_API_KEY || '',
      baseUrl: 'https://api.firecrawl.dev/v0',
      enabled: !!import.meta.env.VITE_FIRECRAWL_API_KEY,
    },
    
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      enabled: !!import.meta.env.VITE_OPENAI_API_KEY,
      model: 'gpt-4o-mini',
      maxTokens: 2000,
    },
  },
  
  features: {
    authentication: true,
    reportGeneration: true,
    crmExport: true,
    feedback: true,
    analytics: false, // Future feature
  },
  
  ui: {
    theme: 'default',
    animations: true,
    compactMode: false,
  },
  
  performance: {
    batchSize: 3, // For URL scraping
    cacheTimeout: 300000, // 5 minutes
    retryAttempts: 3,
  },
} as const;

export type AppConfig = typeof config;