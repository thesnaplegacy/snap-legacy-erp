import { getServiceFinanceOverview, recordServicePayment } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import { PiggyBank, Plus, CheckCircle2, ArrowRightLeft, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ServicePaymentsPage() {
  const finance = await getServiceFinanceOverview();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <PiggyBank className="w-6 h-6 text-blue-400" />
            Client Payments & Central Ledger Sync
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Recorded receipts automatically post to The Snap Legacy HQ central transactions ledger.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>
          <strong>Two-Way Central Finance Sync:</strong> Every payment logged here instantaneously generates a verified credit entry in The Snap Legacy central accounts without manual reconciliation.
        </span>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/60 overflow-hidden">
        <CardHeader className="p-5 border-b border-neutral-800 bg-neutral-900/90">
          <CardTitle className="text-base font-bold text-white">Payment Receipts</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Confirmed advances and installments tied to wedding bookings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3.5">Reference</th>
                <th className="p-3.5">Client & Wedding</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Date</th>
                <th className="p-3.5 text-center">Central Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40 text-neutral-300">
              {finance.revenue.map((pay: any) => (
                <tr key={pay.id} className="hover:bg-neutral-900/40">
                  <td className="p-3.5 font-mono text-blue-400 font-medium">{pay.reference}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-white">{pay.client_name}</p>
                    <p className="text-[11px] text-neutral-400">{pay.project_name}</p>
                  </td>
                  <td className="p-3.5 text-neutral-300">{pay.method}</td>
                  <td className="p-3.5 text-right font-bold text-emerald-400">
                    {formatCurrency(pay.amount)}
                  </td>
                  <td className="p-3.5 text-center text-neutral-400">{formatDate(pay.date)}</td>
                  <td className="p-3.5 text-center">
                    <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                      Synced to HQ
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
