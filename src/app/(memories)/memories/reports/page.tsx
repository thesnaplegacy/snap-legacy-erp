import Link from 'next/link';
import { FileBarChart, TrendingUp, Users, Camera, DollarSign, Sparkles } from 'lucide-react';
import { getMemoriesReports } from '@/actions/memories-actions';
import { formatCurrency } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function MemoriesReportsPage() {
  const reports = await getMemoriesReports();
  const totalSessions = reports.sessionDistribution.reduce((acc, curr) => acc + curr.count, 0);
  const avgValue = Math.round(reports.summary.monthly_revenue / Math.max(1, totalSessions));

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Executive Analytics
            </span>
            <span className="text-xs text-neutral-400">
              Studio Conversion & Performance
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Studio Performance Reports
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Conversion analytics, session distribution, and average revenue per client.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/memories/profitability">
            <Button className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-2">
              <TrendingUp className="w-4 h-4" />
              Session Profitability
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Total Studio Revenue</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {formatCurrency(reports.summary.monthly_revenue)}
          </div>
          <div className="text-xs text-neutral-500 mt-1">Central finance verified</div>
        </div>
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Average Booking Value</div>
          <div className="text-2xl font-bold text-white mt-1">
            {formatCurrency(avgValue)}
          </div>
          <div className="text-xs text-[#46BBD4] mt-1">Per booked milestone</div>
        </div>
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Total Booked Sessions</div>
          <div className="text-2xl font-bold text-white mt-1">{totalSessions}</div>
          <div className="text-xs text-neutral-500 mt-1">Room A & B utilization</div>
        </div>
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Gross Studio Margin</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {reports.summary.gross_margin}%
          </div>
          <div className="text-xs text-neutral-500 mt-1">High conversion luxury funnel</div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 space-y-4">
        <h2 className="text-base font-bold text-white">Milestone Categories Share</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reports.sessionDistribution.map((item) => (
            <div key={item.type} className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{item.type}</span>
                <span className="text-xs font-bold text-[#46BBD4] bg-[#46BBD4]/10 px-2 py-0.5 rounded border border-[#46BBD4]/20">
                  {item.count} sessions
                </span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#46BBD4] h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (item.count / totalSessions) * 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-neutral-500">
                Revenue: {formatCurrency(item.revenue)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
