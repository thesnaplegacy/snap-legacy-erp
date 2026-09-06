'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser, hasPermission } from '@/lib/auth/permissions';
import { createAuditLog } from './audit';

export async function getBrands() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('is_parent', { ascending: false })
    .order('name');

  if (error) throw error;
  return data;
}

export async function createBrand(formData: FormData) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'brands', 'create')) {
    return { error: 'Unauthorized' };
  }

  const supabase = await createClient();
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const color = formData.get('color') as string;
  const type = formData.get('type') as string;

  // Get organization ID
  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .single();

  if (!org) return { error: 'No organization found' };

  const { data, error } = await supabase
    .from('brands')
    .insert({
      organization_id: org.id,
      name,
      slug,
      description: description || null,
      color: color || null,
      type: type || 'subsidiary',
      is_parent: false,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  await createAuditLog('created', 'brands', data.id, null, data);
  return { success: true, data };
}

export async function updateBrand(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'brands', 'update')) {
    return { error: 'Unauthorized' };
  }

  const supabase = await createClient();

  // Get old value for audit
  const { data: oldBrand } = await supabase.from('brands').select('*').eq('id', id).single();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const color = formData.get('color') as string;
  const status = formData.get('status') as string;

  const { data, error } = await supabase
    .from('brands')
    .update({
      name,
      description: description || null,
      color: color || null,
      status: status || 'active',
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };

  await createAuditLog('updated', 'brands', id, oldBrand, data);
  return { success: true, data };
}

export async function toggleBrandStatus(id: string) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'brands', 'update')) {
    return { error: 'Unauthorized' };
  }

  const supabase = await createClient();
  const { data: brand } = await supabase.from('brands').select('*').eq('id', id).single();
  if (!brand) return { error: 'Brand not found' };

  // Don't allow deactivating parent brand
  if (brand.is_parent) return { error: 'Cannot deactivate parent brand' };

  const newStatus = brand.status === 'active' ? 'inactive' : 'active';
  const { data, error } = await supabase
    .from('brands')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };

  await createAuditLog('updated', 'brands', id, brand, data);
  return { success: true, data };
}
