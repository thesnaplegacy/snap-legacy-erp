import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function RolesPage() {
  const supabase = await createClient();
  const { data: roles } = await supabase.from('roles').select('*').order('level', { ascending: false });
  const { data: permissions } = await supabase.from('permissions').select('*').order('module').order('action');

  // Get role-permission mappings
  const { data: rolePermissions } = await supabase.from('role_permissions').select('role_id, permission_id');

  // Group permissions by module
  const modules = Array.from(new Set<string>((permissions || []).map((p: any) => String(p.module || '')))).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Roles & Permissions</h1>
        <p className="text-sm text-neutral-500 mt-1">Database-driven RBAC system — manage roles and their permissions</p>
      </div>

      {/* Roles */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Roles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(roles || []).map((role) => {
            const permCount = (rolePermissions || []).filter((rp) => rp.role_id === role.id).length;
            return (
              <Card key={role.id} className="border-neutral-800/50 bg-neutral-900/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-white">{role.name}</CardTitle>
                    <Badge variant="outline" className="text-[10px]">Level {role.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-neutral-400 mb-2">{role.description || 'No description'}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{permCount} permissions</Badge>
                    {role.is_system && <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">System</Badge>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Permission Modules</h2>
        <Card className="border-neutral-800/50 bg-neutral-900/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Module</TableHead>
                  <TableHead className="text-neutral-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module: string) => {
                  const modulePerms = (permissions || []).filter((p: any) => p.module === module);
                  return (
                    <TableRow key={module} className="border-neutral-800/50 hover:bg-neutral-800/30">
                      <TableCell className="font-medium text-white capitalize">{module.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {modulePerms.map((p) => (
                            <Badge key={p.id} variant="outline" className="text-[10px] capitalize">{p.action}</Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
