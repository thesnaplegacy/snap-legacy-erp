import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { UserCog } from 'lucide-react';
import { formatCurrency, STATUS_LABELS, STATUS_VARIANTS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export default async function FreelancersPage() {
  const supabase = await createClient();
  const { data: freelancers } = await supabase
    .from('freelancers')
    .select('*, brand:brands(name, color)')
    .eq('is_archived', false)
    .order('name');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Freelancers</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage freelancers and contractors</p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {!freelancers || freelancers.length === 0 ? (
            <div className="p-12 text-center">
              <UserCog className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Name</TableHead>
                  <TableHead className="text-neutral-400">Brand</TableHead>
                  <TableHead className="text-neutral-400">Specialization</TableHead>
                  <TableHead className="text-neutral-400">Rate</TableHead>
                  <TableHead className="text-neutral-400">Rate Type</TableHead>
                  <TableHead className="text-neutral-400">Email</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {freelancers.map((f) => (
                  <TableRow key={f.id} className="border-neutral-800/50 hover:bg-neutral-800/30">
                    <TableCell className="font-medium text-white">{f.name}</TableCell>
                    <TableCell>
                      {f.brand ? (
                        <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: `${f.brand.color}20`, color: f.brand.color }}>
                          {f.brand.name}
                        </Badge>
                      ) : <span className="text-neutral-600 text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-neutral-400">{f.specialization || '—'}</TableCell>
                    <TableCell className="text-neutral-300">{f.rate ? formatCurrency(Number(f.rate)) : '—'}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs capitalize">{f.rate_type?.replace('_', ' ') || '—'}</Badge></TableCell>
                    <TableCell className="text-neutral-400">{f.email || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[f.status] || 'outline'} className="text-xs">
                        {STATUS_LABELS[f.status] || f.status}
                      </Badge>
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
