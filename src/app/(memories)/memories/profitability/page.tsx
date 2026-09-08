import Link from 'next/link';
import { TrendingUp, DollarSign, ArrowUpRight, PieChart, ShieldCheck, Sparkles } from 'lucide-react';
import { getMemoriesSessionProfitability } from '@/actions/memories-actions';
import { formatCurrency, formatDate } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function MemoriesProfitabilityPage() {
  const sessions = await getMemoriesSessionProfitability();

  const totalRev = sessions.reduce((sum, s) => sum + s.revenue, 0);
  const totalCost = sessions.reduce((sum, s) => sum + s.direct_costs, 0);
  const totalProfit = totalRev - totalCost;
  const overallMargin = totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Unit Economics
            </span>
            <span className="text-xs text-neutral-400">
              Direct Cost Analysis & Gross Margins
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Session Profitability
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Analyze direct studio expenses (smash cakes, organic props, print lab costs) against contracted revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/memories/reports">
            <Button variant="outline" className="border-neutral-800 hover:bg-neutral-800 text-neutral-300">
              Performance Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Aggregate KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Contracted Revenue</div>
          <div className="text-2xl font-bold text-white mt-1">{formatCurrency(totalRev)}</div>
          <div className="text-xs text-[#46BBD4] mt-1">Total booked sessions</div>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Direct Production Costs</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{formatCurrency(totalCost)}</div>
          <div className="text-xs text-neutral-500 mt-1">Props, cakes & labs</div>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Gross Studio Profit</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totalProfit)}</div>
          <div className="text-xs text-emerald-500/80 mt-1">Net gross contribution</div>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Average Gross Margin</div>
          <div className="text-2xl font-bold text-[#46BBD4] mt-1">{overallMargin}%</div>
          <div className="text-xs text-neutral-500 mt-1">Target &gt; 85%</div>
        </div>
      </div>

      {/* Per-Session Breakdown Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Session Unit Economics Ledger</h2>

        <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Session & Client</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Revenue</th>
                  <th className="p-4">Direct Costs</th>
                  <th className="p-4">Cost Breakdown</th>
                  <th className="p-4">Gross Profit</th>
                  <th className="p-4 text-right">Gross Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70">
                {sessions.map((sess) => (
                  <tr key={sess.session_id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{sess.session_title}</div>
                      <div className="text-neutral-400 text-[11px] mt-0.5">
                        {sess.client_name} • {formatDate(sess.session_date)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
                        {sess.session_type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">
                      {formatCurrency(sess.revenue)}
                    </td>
                    <td className="p-4 font-bold text-rose-400">
                      {formatCurrency(sess.direct_costs)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {sess.cost_breakdown.map((cb, idx) => (
                          <span
                            key={idx}
                            className="bg-neutral-950 px-2 py-0.5 rounded text-[10px] text-neutral-300 border border-neutral-800"
                          >
                            {cb.category}: {formatCurrency(cb.amount)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      {formatCurrency(sess.gross_profit)}
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-black text-[#46BBD4]">
                        {sess.gross_margin}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
