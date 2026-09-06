import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Target } from 'lucide-react';
import { formatCurrency, formatDate, STATUS_LABELS, STATUS_VARIANTS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from('leads')
    .select('*, brand:brands(name, color), client:clients(name), assigned_user:profiles!leads_assigned_to_fkey(full_name)')
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Leads</h1>
        <p className="text-sm text-neutral-500 mt-1">Track and manage business leads across all brands</p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {!leads || leads.length === 0 ? (
            <div className="p-12 text-center">
              <Target className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
              <p className="text-xs text-neutral-600 mt-1">Leads will appear here once created</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Title</TableHead>
                  <TableHead className="text-neutral-400">Brand</TableHead>
                  <TableHead className="text-neutral-400">Client</TableHead>
                  <TableHead className="text-neutral-400">Value</TableHead>
                  <TableHead className="text-neutral-400">Source</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                  <TableHead className="text-neutral-400">Assigned To</TableHead>
                  <TableHead className="text-neutral-400">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="border-neutral-800/50 hover:bg-neutral-800/30">
                    <TableCell className="font-medium text-white">{lead.title}</TableCell>
                    <TableCell>
                      {lead.brand ? (
                        <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: `${lead.brand.color}20`, color: lead.brand.color }}>
                          {lead.brand.name}
                        </Badge>
                      ) : <span className="text-neutral-600 text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-neutral-400">{lead.client?.name || '—'}</TableCell>
                    <TableCell className="text-neutral-300">{lead.value ? formatCurrency(Number(lead.value)) : '—'}</TableCell>
                    <TableCell className="text-neutral-400">{lead.source || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[lead.status] || 'outline'} className="text-xs">
                        {STATUS_LABELS[lead.status] || lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-400">{lead.assigned_user?.full_name || '—'}</TableCell>
                    <TableCell className="text-neutral-500 text-xs">{formatDate(lead.created_at)}</TableCell>
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
