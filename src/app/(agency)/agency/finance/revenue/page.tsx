import { getAgencyDashboardStats, getAgencyRetainers, getAgencyProjects } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import Link from 'next/link';
import { TrendingUp, Repeat, FolderKanban, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyRevenuePage() {
  const [stats, retainers, projects] = await Promise.all([
    getAgencyDashboardStats(),
    getAgencyRetainers(),
    getAgencyProjects(),
  ]);

  const retainerMonthlyTotal = retainers
    .filter((r) => r.status === 'active')
    .reduce((sum, r) => sum + r.monthly_value, 0);

  const projectsTotalContract = projects
    .filter((p) => p.project_type !== 'retainer')
    .reduce((sum, p) => sum + p.contract_value, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Agency Revenue Streams
          </h1>
          <p className="text-sm text-neutral-400">
            Categorized agency cash inflows: Monthly retainers, fixed project milestones, and production fees.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-neutral-800 bg-neutral-900/50 p-5 space-y-2">
          <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 text-purple-400" /> Monthly Retainer MRR
          </span>
          <div className="text-2xl font-bold text-white">{formatCurrency(retainerMonthlyTotal)}</div>
          <p className="text-[11px] text-neutral-500">Recurring every 30 days across {retainers.length} clients</p>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/50 p-5 space-y-2">
          <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
            <FolderKanban className="w-3.5 h-3.5 text-blue-400" /> Fixed Project Contracts
          </span>
          <div className="text-2xl font-bold text-white">{formatCurrency(projectsTotalContract)}</div>
          <p className="text-[11px] text-neutral-500">Milestone-based one-off branding & launch projects</p>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/50 p-5 space-y-2">
          <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Total Recognized This Month
          </span>
          <div className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.monthly_revenue)}</div>
          <p className="text-[11px] text-neutral-500">Synchronized into The Snap Legacy Central Ledger</p>
        </Card>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/40">
        <CardHeader className="p-5 border-b border-neutral-800">
          <CardTitle className="text-sm font-bold text-white">Active Retainer Contracts (MRR Breakdown)</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-3">
          {retainers.map((ret) => (
            <div key={ret.id} className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{ret.retainer_name}</span>
                <span className="text-[11px] text-neutral-400">Billed monthly on day {ret.billing_day}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-purple-300">{formatCurrency(ret.monthly_value)}</span>
                <span className="text-[10px] text-neutral-500 block">/ month</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
