import { getTransactions } from '@/actions/finance';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/constants';

export default async function RevenuePage() {
  const transactions = await getTransactions();
  const revenue = transactions.filter((t) => t.type === 'credit' && !t.is_reversal);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Revenue</h1>
        <p className="text-sm text-neutral-500 mt-1">Income transactions across all brands</p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {revenue.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingUp className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Date</TableHead>
                  <TableHead className="text-neutral-400">Description</TableHead>
                  <TableHead className="text-neutral-400">Brand</TableHead>
                  <TableHead className="text-neutral-400">Account</TableHead>
                  <TableHead className="text-neutral-400">Category</TableHead>
                  <TableHead className="text-neutral-400">Reference</TableHead>
                  <TableHead className="text-neutral-400 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenue.map((tx) => (
                  <TableRow key={tx.id} className="border-neutral-800/50 hover:bg-neutral-800/30">
                    <TableCell className="text-neutral-500 text-xs">{formatDate(tx.date)}</TableCell>
                    <TableCell className="font-medium text-white">{tx.description || '—'}</TableCell>
                    <TableCell>
                      {tx.brand ? (
                        <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: `${tx.brand.color}20`, color: tx.brand.color }}>
                          {tx.brand.name}
                        </Badge>
                      ) : <span className="text-neutral-600 text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-neutral-400">{tx.account?.name || '—'}</TableCell>
                    <TableCell className="text-neutral-400">{tx.category?.name || '—'}</TableCell>
                    <TableCell className="text-neutral-500 text-xs">{tx.reference || '—'}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-400">
                      +{formatCurrency(Number(tx.amount))}
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
