import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Package } from 'lucide-react';
import { formatCurrency, formatDate, STATUS_LABELS, STATUS_VARIANTS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export default async function AssetsPage() {
  const supabase = await createClient();
  const { data: assets } = await supabase
    .from('assets')
    .select('*, brand:brands(name, color)')
    .eq('is_archived', false)
    .order('name');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Asset Register</h1>
        <p className="text-sm text-neutral-500 mt-1">Track company assets across all brands</p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {!assets || assets.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Name</TableHead>
                  <TableHead className="text-neutral-400">Brand</TableHead>
                  <TableHead className="text-neutral-400">Type</TableHead>
                  <TableHead className="text-neutral-400">Serial No.</TableHead>
                  <TableHead className="text-neutral-400">Purchase Value</TableHead>
                  <TableHead className="text-neutral-400">Current Value</TableHead>
                  <TableHead className="text-neutral-400">Condition</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id} className="border-neutral-800/50 hover:bg-neutral-800/30">
                    <TableCell className="font-medium text-white">{asset.name}</TableCell>
                    <TableCell>
                      {asset.brand ? (
                        <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: `${asset.brand.color}20`, color: asset.brand.color }}>
                          {asset.brand.name}
                        </Badge>
                      ) : <span className="text-neutral-600 text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-neutral-400 capitalize">{asset.type}</TableCell>
                    <TableCell className="text-neutral-500 text-xs">{asset.serial_number || '—'}</TableCell>
                    <TableCell className="text-neutral-300">{asset.purchase_price ? formatCurrency(Number(asset.purchase_price)) : '—'}</TableCell>
                    <TableCell className="text-neutral-300">{asset.current_value ? formatCurrency(Number(asset.current_value)) : '—'}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs capitalize">{asset.condition}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[asset.status] || 'outline'} className="text-xs">
                        {STATUS_LABELS[asset.status] || asset.status}
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
