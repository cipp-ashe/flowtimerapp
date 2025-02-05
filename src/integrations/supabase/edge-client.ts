// @ts-expect-error Deno imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { EdgeConfig, createEdgeClient } from './config';

// Create edge function client with Deno environment variables
export const createEdgeClientFromEnv = () => {
  // @ts-expect-error Deno env
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || '';
  // @ts-expect-error Deno env
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || '';

  const config: EdgeConfig = {
    supabaseUrl,
    supabaseAnonKey
  };

  return createEdgeClient(config);
};

// Create a Deno-specific Supabase client
// This should be used in edge functions
export const createDenoClient = () => {
  // @ts-expect-error Deno env
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || '';
  // @ts-expect-error Deno env
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables missing in edge function");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};