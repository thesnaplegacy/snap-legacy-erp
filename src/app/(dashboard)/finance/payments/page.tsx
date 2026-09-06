import { getPayments } from '@/actions/finance';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { CreditCard } from 'lucide-react';
import { formatCurrency, formatDate, STATUS_LABELS, STATUS_VARIANTS } from '@/lib/constants';

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Payments</h1>
        <p className="text-sm text-neutral-500 mt-1">Track client payments and receivables</p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Date</TableHead>
                  <TableHead className="text-neutral-400">Client</TableHead>
                  <TableHead className="text-neutral-400">Brand</TableHead>
                  <TableHead className="text-neutral-400">Method</TableHead>
                  <TableHead className="text-neutral-400">Reference</TableHead>
                  <TableHead className="text-neutral-400">Due Date</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                  <TableHead className="text-neutral-400 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="border-neutral-800/50 hover:bg-neutral-800/30">
                    <TableCell className="text-neutral-500 text-xs">{formatDate(payment.date)}</TableCell>
                    <TableCell className="font-medium text-white">{payment.client?.name || '—'}</TableCell>
                    <TableCell>
                      {payment.brand ? (
                        <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: `${payment.brand.color}20`, color: payment.brand.color }}>
                          {payment.brand.name}
                        </Badge>
                      ) : <span className="text-neutral-600 text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-neutral-400 capitalize">{payment.method?.replace('_', ' ') || '—'}</TableCell>
                    <TableCell className="text-neutral-500 text-xs">{payment.reference || '—'}</TableCell>
                    <TableCell className="text-neutral-500 text-xs">{formatDate(payment.due_date)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[payment.status] || 'outline'} className="text-xs">
                        {STATUS_LABELS[payment.status] || payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-white">
                      {formatCurrency(Number(payment.amount))}
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
