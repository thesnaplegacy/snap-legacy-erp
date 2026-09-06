'use server';

import { createClient } from '@/lib/supabase/server';

export async function createAuditLog(
  action: string,
  module: string,
  recordId: string | null,
  oldValue: Record<string, unknown> | null,
  newValue: Record<string, unknown> | null,
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('audit_logs').insert({
      user_id: user?.id || null,
      action,
      module,
      record_id: recordId,
      old_value: oldValue,
      new_value: newValue,
    });
  } catch (err) {
    // Audit logging should never break the main flow
    console.error('Audit log error:', err);
  }
}

export async function getAuditLogs(options?: {
  module?: string;
  action?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  let query = supabase
    .from('audit_logs')
    .select('*, user:profiles(full_name, email)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (options?.module) {
    query = query.eq('module', options.module);
  }
  if (options?.action) {
    query = query.eq('action', options.action);
  }

  const limit = options?.limit || 50;
  const offset = options?.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
