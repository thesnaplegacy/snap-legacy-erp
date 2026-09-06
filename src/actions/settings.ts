'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser, hasPermission } from '@/lib/auth/permissions';
import { createAuditLog } from './audit';

export async function getSettings(brandId?: string) {
  const supabase = await createClient();
  let query = supabase.from('settings').select('*').order('category').order('key');
  if (brandId) {
    query = query.eq('brand_id', brandId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function updateSetting(id: string, value: unknown) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'settings', 'update')) {
    return { error: 'Unauthorized' };
  }

  const supabase = await createClient();
  const { data: oldSetting } = await supabase.from('settings').select('*').eq('id', id).single();

  const { data, error } = await supabase
    .from('settings')
    .update({
      value: JSON.stringify(value),
      updated_by: user?.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };

  await createAuditLog('settings_change', 'settings', id, oldSetting, data);
  return { success: true, data };
}

export async function createSetting(formData: FormData) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'settings', 'create')) {
    return { error: 'Unauthorized' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('settings')
    .insert({
      brand_id: (formData.get('brand_id') as string) || null,
      category: (formData.get('category') as string) || 'general',
      key: formData.get('key') as string,
      value: JSON.stringify(formData.get('value') as string),
      description: (formData.get('description') as string) || null,
      updated_by: user?.id,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  await createAuditLog('created', 'settings', data.id, null, data);
  return { success: true, data };
}
