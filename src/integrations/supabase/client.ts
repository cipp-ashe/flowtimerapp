import { createFrontendClient } from './config';

// Export the client for direct database operations
export const supabase = createFrontendClient();
