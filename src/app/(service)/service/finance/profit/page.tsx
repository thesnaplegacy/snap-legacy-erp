import { getServiceFinanceOverview, getServiceDashboardStats } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/constants';
import { Percent, TrendingUp, DollarSign, Receipt, PiggyBank } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EventProfitabilityPage() {
  const [stats, finance] = await Promise.all([
    getServiceDashboardStats(),
    getServiceFinanceOverview(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Percent className="w-6 h-6 text-blue-400" />
          Event Costing & Profit Margins
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Database-driven gross profitability per wedding booking after factoring photographer, videographer, travel, and album costs.
        </p>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs text-neutral-400 uppercase tracking-wider">Total Contracted</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.contracted_revenue)}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs text-neutral-400 uppercase tracking-wider">Total Shoot Costs</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold text-red-400">{formatCurrency(stats.total_event_costs)}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs text-neutral-400 uppercase tracking-wider">Gross Profit</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.gross_profit)}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs text-neutral-400 uppercase tracking-wider">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-2xl font-bold text-blue-400">{stats.profit_margin}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Per Wedding Profitability Table */}
      <Card className="border-neutral-800 bg-neutral-900/60 overflow-hidden">
        <CardHeader className="p-5 border-b border-neutral-800 bg-neutral-900/90">
          <CardTitle className="text-base font-bold text-white">Project-by-Project Reconciliation</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Real contract revenue vs real verified shoot and production expenses
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3.5">Wedding Project</th>
                <th className="p-3.5 text-right">Contract Value</th>
                <th className="p-3.5 text-right">Received</th>
                <th className="p-3.5 text-right">Shoot Costs</th>
                <th className="p-3.5 text-right">Gross Profit</th>
                <th className="p-3.5 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40 text-neutral-300">
              {finance.profitability.map((p) => (
                <tr key={p.project_id} className="hover:bg-neutral-900/40">
                  <td className="p-3.5 font-bold text-white">{p.name}</td>
                  <td className="p-3.5 text-right font-medium text-neutral-200">{formatCurrency(p.contracted)}</td>
                  <td className="p-3.5 text-right text-neutral-400">{formatCurrency(p.received)}</td>
                  <td className="p-3.5 text-right text-red-400 font-medium">{formatCurrency(p.cost)}</td>
                  <td className="p-3.5 text-right font-bold text-emerald-400">{formatCurrency(p.profit)}</td>
                  <td className="p-3.5 text-right font-bold text-blue-400">{p.margin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
