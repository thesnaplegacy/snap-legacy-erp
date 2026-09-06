import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createMockSupabaseClient } from '@/lib/supabase/mock-client';

/**
 * Admin Supabase client — uses service_role key.
 * BYPASSES all RLS policies.
 * ONLY use server-side for admin operations.
 * NEVER import this in client components.
 */
export function createAdminClient() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return createMockSupabaseClient();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin configuration');
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
