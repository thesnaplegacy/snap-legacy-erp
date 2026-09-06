import { getUsers } from '@/actions/users';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users as UsersIcon } from 'lucide-react';
import { formatDate, formatDateTime, STATUS_VARIANTS, STATUS_LABELS } from '@/lib/constants';

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Users</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage system users, roles, and brand access</p>
        </div>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="p-12 text-center">
              <UsersIcon className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
              <p className="text-xs text-neutral-600 mt-1">Users will appear here after registration</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">User</TableHead>
                  <TableHead className="text-neutral-400">Email</TableHead>
                  <TableHead className="text-neutral-400">Role</TableHead>
                  <TableHead className="text-neutral-400">Brand Access</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                  <TableHead className="text-neutral-400">Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u: Record<string, unknown>) => {
                  const userRoles = (u.user_roles as Array<{ role?: { name: string; slug: string } }>) || [];
                  const brandAccess = (u.user_brand_access as Array<{ brand?: { name: string; color: string } }>) || [];
                  const initials = (u.full_name as string || 'U')
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <TableRow key={u.id as string} className="border-neutral-800/50 hover:bg-neutral-800/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-neutral-700">
                            <AvatarFallback className="bg-amber-500/10 text-amber-500 text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-white">{u.full_name as string || 'Unnamed'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-400">{u.email as string}</TableCell>
                      <TableCell>
                        {userRoles.length > 0 ? (
                          <Badge variant="outline" className="text-xs">
                            {userRoles[0]?.role?.name || 'Unknown'}
                          </Badge>
                        ) : (
                          <span className="text-neutral-600 text-xs">No role</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {brandAccess.length > 0 ? (
                            brandAccess.map((ba, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-[10px] px-1.5"
                                style={{
                                  backgroundColor: `${ba.brand?.color || '#666'}20`,
                                  color: ba.brand?.color || '#666',
                                }}
                              >
                                {ba.brand?.name || 'Unknown'}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-neutral-600 text-xs">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANTS[u.status as string] || 'outline'} className="text-xs">
                          {STATUS_LABELS[u.status as string] || u.status as string}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-neutral-500 text-xs">
                        {formatDateTime(u.last_login_at as string)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
