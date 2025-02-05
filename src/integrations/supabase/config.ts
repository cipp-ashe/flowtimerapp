import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Frontend environment variables
export const FRONTEND_CONFIG = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
};

// Edge function environment config type
export interface EdgeConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

// Validate frontend environment variables
export const validateFrontendConfig = () => {
  if (!FRONTEND_CONFIG.supabaseUrl || !FRONTEND_CONFIG.supabaseAnonKey) {
    console.error("⚠️ Frontend Supabase configuration is missing!");
    return false;
  }
  return true;
};

// Create frontend client
export const createFrontendClient = () => {
  if (!validateFrontendConfig()) {
    throw new Error("Frontend Supabase configuration is missing");
  }
  return createClient<Database>(
    FRONTEND_CONFIG.supabaseUrl,
    FRONTEND_CONFIG.supabaseAnonKey
  );
};

// Create edge function client
export const createEdgeClient = (config: EdgeConfig) => {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error("Edge function Supabase configuration is missing");
  }
  return createClient<Database>(
    config.supabaseUrl,
    config.supabaseAnonKey
  );
};