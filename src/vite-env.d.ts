/// <reference types="vite/client" />

interface ImportMeta {
  env: {
    MODE: string;
    BASE_URL: string;
    PROD: boolean;
    DEV: boolean;
    SSR: boolean;
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
    VITE_FIRECRAWL_API_KEY?: string;
    VITE_OPENAI_API_KEY?: string;
    [key: string]: string | boolean | undefined;
  };
}