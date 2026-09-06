import { getTransactions } from '@/actions/finance';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ArrowRightLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/constants';

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Transactions</h1>
        <p className="text-sm text-neutral-500 mt-1">Immutable financial transaction ledger — records cannot be modified</p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <ArrowRightLeft className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Date</TableHead>
                  <TableHead className="text-neutral-400">Type</TableHead>
                  <TableHead className="text-neutral-400">Description</TableHead>
                  <TableHead className="text-neutral-400">Brand</TableHead>
                  <TableHead className="text-neutral-400">Account</TableHead>
                  <TableHead className="text-neutral-400">Category</TableHead>
                  <TableHead className="text-neutral-400">Reference</TableHead>
                  <TableHead className="text-neutral-400">Reversal</TableHead>
                  <TableHead className="text-neutral-400 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className={`border-neutral-800/50 hover:bg-neutral-800/30 ${tx.is_reversal ? 'opacity-70' : ''}`}>
                    <TableCell className="text-neutral-500 text-xs">{formatDate(tx.date)}</TableCell>
                    <TableCell>
                      <Badge variant={tx.type === 'credit' ? 'default' : 'destructive'} className="text-xs">
                        {tx.type === 'credit' ? 'Credit' : 'Debit'}
                      </Badge>
                    </TableCell>
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
                    <TableCell>
                      {tx.is_reversal ? (
                        <Badge variant="destructive" className="text-[10px]">Reversal</Badge>
                      ) : '—'}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(Number(tx.amount))}
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
