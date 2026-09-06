import { createClient } from '@/lib/supabase/server';
import type { UserWithDetails } from '@/lib/types/database';
import { ROLE_SLUGS } from '@/lib/constants';
import { DEMO_USER } from '@/lib/demo-data';

/**
 * Get the current authenticated user with roles, brand access, and permissions.
 * Always call server-side.
 */
export async function getCurrentUser(): Promise<UserWithDetails | null> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return DEMO_USER;
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  // Get user roles with role details
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('*, role:roles(*)')
    .eq('user_id', user.id);

  // Get brand access with brand details
  const { data: brandAccess } = await supabase
    .from('user_brand_access')
    .select('*, brand:brands(*)')
    .eq('user_id', user.id);

  // Get permissions for user's roles
  const roleIds = (userRoles || []).map((ur) => ur.role_id);
  const { data: rolePermissions } = await supabase
    .from('role_permissions')
    .select('permission:permissions(module, action)')
    .in('role_id', roleIds.length ? roleIds : ['none']);

  const permissions = (rolePermissions || [])
    .map((rp) => {
      const perm = rp.permission as unknown as { module: string; action: string } | null;
      return perm ? `${perm.module}:${perm.action}` : null;
    })
    .filter((p): p is string => p !== null);

  return {
    ...profile,
    roles: userRoles || [],
    brand_access: brandAccess || [],
    permissions: [...new Set(permissions)],
  };
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: UserWithDetails | null, module: string, action: string): boolean {
  if (!user) return false;

  // Super admin has all permissions
  if (isSuperAdmin(user)) return true;

  return user.permissions.includes(`${module}:${action}`);
}

/**
 * Check if user is Super Admin
 */
export function isSuperAdmin(user: UserWithDetails | null): boolean {
  if (!user) return false;
  return user.roles.some((ur) => ur.role?.slug === ROLE_SLUGS.CEO_SUPER_ADMIN);
}

/**
 * Check if user has access to a specific brand
 */
export function hasBrandAccess(user: UserWithDetails | null, brandId: string): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return user.brand_access.some((ba) => ba.brand_id === brandId);
}

/**
 * Get the list of brand IDs the user has access to
 */
export function getUserBrandIds(user: UserWithDetails): string[] {
  if (isSuperAdmin(user)) return []; // empty means "all" for super admin
  return user.brand_access.map((ba) => ba.brand_id);
}
