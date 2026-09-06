import { createBrowserClient } from '@supabase/ssr';
import { createMockSupabaseClient } from '@/lib/supabase/mock-client';

export function createClient() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'false') {
    return createMockSupabaseClient() as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
