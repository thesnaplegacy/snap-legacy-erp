'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser, hasPermission } from '@/lib/auth/permissions';
import { createAuditLog } from './audit';

export async function getUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_roles(*, role:roles(*)), user_brand_access(*, brand:brands(id, name, slug, color))')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createUser(formData: FormData) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'users', 'create')) {
    return { error: 'Unauthorized' };
  }

  const admin = createAdminClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;

  // Create auth user via admin client
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authError) return { error: authError.message };

  // Update profile name (trigger creates profile, but name might not be set)
  await admin.from('profiles').update({ full_name: fullName }).eq('id', authData.user.id);

  // Assign role
  const roleId = formData.get('role_id') as string;
  if (roleId) {
    await admin.from('user_roles').insert({
      user_id: authData.user.id,
      role_id: roleId,
      assigned_by: user?.id,
    });
  }

  // Assign brand access
  const brandIds = formData.getAll('brand_ids') as string[];
  if (brandIds.length > 0) {
    await admin.from('user_brand_access').insert(
      brandIds.map((brandId) => ({
        user_id: authData.user.id,
        brand_id: brandId,
        granted_by: user?.id,
      }))
    );
  }

  await createAuditLog('created', 'users', authData.user.id, null, { email, full_name: fullName, role_id: roleId });
  return { success: true };
}

export async function updateUserRole(userId: string, roleId: string) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'roles', 'update')) {
    return { error: 'Unauthorized' };
  }

  const admin = createAdminClient();

  // Remove existing roles
  const { data: oldRoles } = await admin.from('user_roles').select('*').eq('user_id', userId);
  await admin.from('user_roles').delete().eq('user_id', userId);

  // Assign new role
  const { error } = await admin.from('user_roles').insert({
    user_id: userId,
    role_id: roleId,
    assigned_by: user?.id,
  });

  if (error) return { error: error.message };

  await createAuditLog('role_change', 'users', userId, { roles: oldRoles }, { role_id: roleId });
  return { success: true };
}

export async function updateUserBrandAccess(userId: string, brandIds: string[]) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'users', 'update')) {
    return { error: 'Unauthorized' };
  }

  const admin = createAdminClient();

  const { data: oldAccess } = await admin.from('user_brand_access').select('*').eq('user_id', userId);
  await admin.from('user_brand_access').delete().eq('user_id', userId);

  if (brandIds.length > 0) {
    await admin.from('user_brand_access').insert(
      brandIds.map((brandId) => ({
        user_id: userId,
        brand_id: brandId,
        granted_by: user?.id,
      }))
    );
  }

  await createAuditLog('permission_change', 'users', userId, { brand_access: oldAccess }, { brand_ids: brandIds });
  return { success: true };
}

export async function toggleUserStatus(userId: string) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'users', 'update')) {
    return { error: 'Unauthorized' };
  }

  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('*').eq('id', userId).single();
  if (!profile) return { error: 'User not found' };

  const newStatus = profile.status === 'active' ? 'inactive' : 'active';
  const { error } = await admin
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', userId);

  if (error) return { error: error.message };

  await createAuditLog('updated', 'users', userId, { status: profile.status }, { status: newStatus });
  return { success: true };
}
