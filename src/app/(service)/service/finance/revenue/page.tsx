import { getServiceFinanceOverview, getServiceDashboardStats } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/constants';
import { TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ServiceRevenuePage() {
  const [stats, finance] = await Promise.all([
    getServiceDashboardStats(),
    getServiceFinanceOverview(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          Revenue & Contract Value
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Accurate derivation of contracted booking values, collected advances, and remaining client receivables.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs text-neutral-400 uppercase tracking-wider">Contracted Value</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.contracted_revenue)}</p>
            <p className="text-xs text-neutral-500 mt-1">Total agreed wedding packages</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs text-neutral-400 uppercase tracking-wider">Realized Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.received_revenue)}</p>
            <p className="text-xs text-neutral-500 mt-1">Collected via bank & cash</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs text-neutral-400 uppercase tracking-wider">Receivables Outstanding</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold text-amber-400">{formatCurrency(stats.outstanding_revenue)}</p>
            <p className="text-xs text-neutral-500 mt-1">Due on or before event date</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/60 overflow-hidden">
        <CardHeader className="p-5 border-b border-neutral-800 bg-neutral-900/90">
          <CardTitle className="text-base font-bold text-white">Revenue Sources</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Confirmed client receipts allocated to specific wedding contracts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3.5">Reference</th>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Wedding Project</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Receipt Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40 text-neutral-300">
              {finance.revenue.map((r: any) => (
                <tr key={r.id} className="hover:bg-neutral-900/40">
                  <td className="p-3.5 font-mono text-blue-400">{r.reference}</td>
                  <td className="p-3.5 font-bold text-white">{r.client_name}</td>
                  <td className="p-3.5 text-neutral-400">{r.project_name}</td>
                  <td className="p-3.5 text-right font-bold text-emerald-400">{formatCurrency(r.amount)}</td>
                  <td className="p-3.5 text-center text-neutral-400">{formatDate(r.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
