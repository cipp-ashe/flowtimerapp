import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5?target=deno';

export const getSupabaseClient = () => {
  // @ts-expect-error Deno env
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  // @ts-expect-error Deno env
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing environment variables:", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    });
    throw new Error("Required Supabase environment variables are missing");
  }

  try {
    console.log('Creating Supabase client with:', {
      urlExists: !!supabaseUrl,
      keyExists: !!supabaseAnonKey
    });

    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    });
    
    return client;
  } catch (error) {
    console.error("Failed to create Supabase client:", {
      error,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};
