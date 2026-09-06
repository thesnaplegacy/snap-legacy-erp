'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser, hasPermission } from '@/lib/auth/permissions';
import { createAuditLog } from './audit';

export async function getClients(options?: { includeArchived?: boolean; brandId?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from('clients')
    .select('*, client_brand_associations(*, brand:brands(id, name, slug, color))')
    .order('created_at', { ascending: false });

  if (!options?.includeArchived) {
    query = query.eq('is_archived', false);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getClient(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*, client_brand_associations(*, brand:brands(id, name, slug, color))')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createClientAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'clients', 'create')) {
    return { error: 'Unauthorized' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: formData.get('name') as string,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      company: (formData.get('company') as string) || null,
      address: (formData.get('address') as string) || null,
      city: (formData.get('city') as string) || null,
      country: (formData.get('country') as string) || null,
      type: (formData.get('type') as string) || 'individual',
      source: (formData.get('source') as string) || null,
      notes: (formData.get('notes') as string) || null,
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Associate with brands
  const brandIds = formData.getAll('brand_ids') as string[];
  if (brandIds.length > 0) {
    await supabase.from('client_brand_associations').insert(
      brandIds.map((brandId) => ({
        client_id: data.id,
        brand_id: brandId,
      }))
    );
  }

  await createAuditLog('created', 'clients', data.id, null, data);
  return { success: true, data };
}

export async function updateClientAction(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'clients', 'update')) {
    return { error: 'Unauthorized' };
  }

  const supabase = await createClient();
  const { data: oldClient } = await supabase.from('clients').select('*').eq('id', id).single();

  const { data, error } = await supabase
    .from('clients')
    .update({
      name: formData.get('name') as string,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      company: (formData.get('company') as string) || null,
      address: (formData.get('address') as string) || null,
      city: (formData.get('city') as string) || null,
      country: (formData.get('country') as string) || null,
      type: (formData.get('type') as string) || 'individual',
      source: (formData.get('source') as string) || null,
      notes: (formData.get('notes') as string) || null,
      status: (formData.get('status') as string) || 'active',
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };

  // Update brand associations
  const brandIds = formData.getAll('brand_ids') as string[];
  await supabase.from('client_brand_associations').delete().eq('client_id', id);
  if (brandIds.length > 0) {
    await supabase.from('client_brand_associations').insert(
      brandIds.map((brandId) => ({
        client_id: id,
        brand_id: brandId,
      }))
    );
  }

  await createAuditLog('updated', 'clients', id, oldClient, data);
  return { success: true, data };
}

export async function archiveClient(id: string) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'clients', 'archive')) {
    return { error: 'Unauthorized' };
  }

  const supabase = await createClient();
  const { data: oldClient } = await supabase.from('clients').select('*').eq('id', id).single();

  const { data, error } = await supabase
    .from('clients')
    .update({
      is_archived: true,
      archived_at: new Date().toISOString(),
      archived_by: user?.id,
      status: 'inactive',
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };

  await createAuditLog('archived', 'clients', id, oldClient, data);
  return { success: true };
}

export async function restoreClient(id: string) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'clients', 'restore')) {
    return { error: 'Unauthorized' };
  }

  const supabase = await createClient();
  const { data: oldClient } = await supabase.from('clients').select('*').eq('id', id).single();

  const { data, error } = await supabase
    .from('clients')
    .update({
      is_archived: false,
      archived_at: null,
      archived_by: null,
      status: 'active',
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };

  await createAuditLog('restored', 'clients', id, oldClient, data);
  return { success: true };
}
