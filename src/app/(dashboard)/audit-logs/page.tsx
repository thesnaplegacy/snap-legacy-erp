import { getAuditLogs } from '@/actions/audit';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ScrollText } from 'lucide-react';
import { formatDateTime } from '@/lib/constants';

const ACTION_COLORS: Record<string, string> = {
  created: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  updated: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  archived: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  restored: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  deleted: 'bg-red-500/10 text-red-400 border-red-500/20',
  financial_change: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  settings_change: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  permission_change: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  role_change: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  login: 'bg-green-500/10 text-green-400 border-green-500/20',
  logout: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
};

export default async function AuditLogsPage() {
  const { data: logs, count } = await getAuditLogs({ limit: 100 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Audit Logs</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Immutable activity trail — {count} total records
        </p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <div className="p-12 text-center">
              <ScrollText className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
              <p className="text-xs text-neutral-600 mt-1">Audit logs will appear as actions are performed</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Timestamp</TableHead>
                  <TableHead className="text-neutral-400">User</TableHead>
                  <TableHead className="text-neutral-400">Action</TableHead>
                  <TableHead className="text-neutral-400">Module</TableHead>
                  <TableHead className="text-neutral-400">Record ID</TableHead>
                  <TableHead className="text-neutral-400">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="border-neutral-800/50 hover:bg-neutral-800/30">
                    <TableCell className="text-neutral-500 text-xs whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </TableCell>
                    <TableCell className="text-neutral-300 text-sm">
                      {log.user?.full_name || log.user?.email || 'System'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize border ${ACTION_COLORS[log.action] || 'text-neutral-400'}`}
                      >
                        {log.action.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">{log.module.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell className="text-neutral-600 text-xs font-mono">
                      {log.record_id ? log.record_id.slice(0, 8) + '...' : '—'}
                    </TableCell>
                    <TableCell className="text-neutral-500 text-xs max-w-xs truncate">
                      {log.new_value ? JSON.stringify(log.new_value).slice(0, 80) : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
