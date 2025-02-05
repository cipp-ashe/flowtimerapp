/// <reference types="vite/client" />

declare global {
  interface Window {
    __reactRouterFutureWarnings?: {
      [key: string]: any;
    };
  }
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module 'react' {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    // Add other env variables as needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};