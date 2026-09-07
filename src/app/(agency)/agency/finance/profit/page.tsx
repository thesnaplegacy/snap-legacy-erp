import { getAgencyProjectProfitability } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import Link from 'next/link';
import { Percent, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyProfitabilityPage() {
  const profitabilityList = await getAgencyProjectProfitability();

  const totalRev = profitabilityList.reduce((sum, p) => sum + p.revenue, 0);
  const totalCost = profitabilityList.reduce((sum, p) => sum + p.direct_costs, 0);
  const totalProfit = totalRev - totalCost;
  const overallMargin = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Percent className="w-6 h-6 text-purple-400" />
            Project & Retainer Profitability
          </h1>
          <p className="text-sm text-neutral-400">
            Real-time Gross Profit and Gross Margin % calculations per project and retainer contract.
          </p>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-neutral-800 bg-neutral-900/50 p-5 space-y-1">
          <span className="text-xs font-semibold text-neutral-400">Total Tracked Revenue</span>
          <div className="text-2xl font-bold text-white">{formatCurrency(totalRev)}</div>
        </Card>
        <Card className="border-neutral-800 bg-neutral-900/50 p-5 space-y-1">
          <span className="text-xs font-semibold text-neutral-400">Total Direct Costs</span>
          <div className="text-2xl font-bold text-rose-400">-{formatCurrency(totalCost)}</div>
        </Card>
        <Card className="border-neutral-800 bg-neutral-900/50 p-5 space-y-1">
          <span className="text-xs font-semibold text-neutral-400">Gross Profit Realized</span>
          <div className="text-2xl font-bold text-emerald-400">+{formatCurrency(totalProfit)}</div>
        </Card>
        <Card className="border-neutral-800 bg-neutral-900/50 p-5 space-y-1">
          <span className="text-xs font-semibold text-neutral-400">Average Gross Margin</span>
          <div className="text-2xl font-bold text-purple-300">{overallMargin.toFixed(1)}%</div>
        </Card>
      </div>

      {/* Individual Project Cards */}
      <div className="space-y-4">
        {profitabilityList.map((p) => (
          <Card key={p.project_id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold text-white">{p.project_name}</CardTitle>
                  <CardDescription className="text-xs text-neutral-400">
                    Client: <strong className="text-neutral-200">{p.client_name}</strong>
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/30 font-bold px-3 py-1">
                  Margin: {p.gross_margin}%
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-xs">
                <div>
                  <span className="text-neutral-500 block">Revenue</span>
                  <span className="font-bold text-white text-sm">{formatCurrency(p.revenue)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Direct Expenses</span>
                  <span className="font-bold text-rose-400 text-sm">-{formatCurrency(p.direct_costs)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Gross Profit</span>
                  <span className="font-bold text-emerald-400 text-sm">+{formatCurrency(p.gross_profit)}</span>
                </div>
              </div>

              {p.cost_breakdown && p.cost_breakdown.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Direct Cost Allocations
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {p.cost_breakdown.map((cb, idx) => (
                      <Badge key={idx} variant="outline" className="text-[11px] bg-neutral-900 border-neutral-800 text-neutral-300">
                        {cb.category}: <strong className="text-white ml-1">{formatCurrency(cb.amount)}</strong>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
