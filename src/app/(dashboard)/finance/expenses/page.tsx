import { getExpenses } from '@/actions/finance';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TrendingDown } from 'lucide-react';
import { formatCurrency, formatDate, STATUS_LABELS, STATUS_VARIANTS } from '@/lib/constants';

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Expenses</h1>
        <p className="text-sm text-neutral-500 mt-1">Track business expenses across all brands</p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {expenses.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingDown className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Date</TableHead>
                  <TableHead className="text-neutral-400">Description</TableHead>
                  <TableHead className="text-neutral-400">Brand</TableHead>
                  <TableHead className="text-neutral-400">Category</TableHead>
                  <TableHead className="text-neutral-400">Vendor</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                  <TableHead className="text-neutral-400 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id} className="border-neutral-800/50 hover:bg-neutral-800/30">
                    <TableCell className="text-neutral-500 text-xs">{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium text-white">{expense.description}</TableCell>
                    <TableCell>
                      {expense.brand ? (
                        <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: `${expense.brand.color}20`, color: expense.brand.color }}>
                          {expense.brand.name}
                        </Badge>
                      ) : <span className="text-neutral-600 text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-neutral-400">{expense.category?.name || '—'}</TableCell>
                    <TableCell className="text-neutral-400">{expense.vendor || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[expense.status] || 'outline'} className="text-xs">
                        {STATUS_LABELS[expense.status] || expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-400">
                      -{formatCurrency(Number(expense.amount))}
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
