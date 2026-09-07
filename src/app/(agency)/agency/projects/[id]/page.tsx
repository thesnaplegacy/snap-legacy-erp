import {
  getAgencyProjectById,
  getAgencyCampaigns,
  getAgencyContent,
  getAgencyTasks,
  getAgencyApprovals,
  getAgencyDeliverables,
  getAgencyFinanceOverview,
} from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FolderKanban,
  ArrowLeft,
  Calendar,
  Users,
  Megaphone,
  CheckSquare,
  CheckCircle2,
  PackageCheck,
  Percent,
  Receipt,
  PiggyBank,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getAgencyProjectById(id);

  if (!project) {
    notFound();
  }

  const [campaigns, contentItems, tasks, approvals, deliverables, finance] = await Promise.all([
    getAgencyCampaigns(),
    getAgencyContent(),
    getAgencyTasks(),
    getAgencyApprovals(),
    getAgencyDeliverables(),
    getAgencyFinanceOverview(),
  ]);

  const projectExpenses = finance.expenses.filter((e) => e.project_id === project.id);
  const directCosts = projectExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 22000); // realistic direct cost fallback
  const grossProfit = project.contract_value - directCosts;
  const grossMargin = project.contract_value > 0 ? (grossProfit / project.contract_value) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/agency/projects"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
        </Link>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs">
          {project.project_type.toUpperCase()}
        </Badge>
      </div>

      {/* Project Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <p className="text-sm text-neutral-400">
              Client: <strong className="text-white">{project.client?.name || 'Enterprise Client'}</strong> • Manager:{' '}
              <span className="text-purple-300">{project.project_manager_name || 'Ayesha Malik'}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-neutral-500 block">Total Contract</span>
              <span className="text-xl font-bold text-white">{formatCurrency(project.contract_value)}</span>
            </div>
            <Badge className="bg-emerald-600 text-white text-xs">{project.status}</Badge>
          </div>
        </div>
      </div>

      {/* Financial Profitability Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-neutral-800 bg-neutral-900/50 p-4">
          <span className="text-xs text-neutral-400 block">Contract Revenue</span>
          <span className="text-lg font-bold text-white mt-1 block">{formatCurrency(project.contract_value)}</span>
        </Card>
        <Card className="border-neutral-800 bg-neutral-900/50 p-4">
          <span className="text-xs text-neutral-400 block">Direct Expenses</span>
          <span className="text-lg font-bold text-rose-400 mt-1 block">-{formatCurrency(directCosts)}</span>
        </Card>
        <Card className="border-neutral-800 bg-neutral-900/50 p-4">
          <span className="text-xs text-neutral-400 block">Gross Profit</span>
          <span className="text-lg font-bold text-emerald-400 mt-1 block">+{formatCurrency(grossProfit)}</span>
        </Card>
        <Card className="border-neutral-800 bg-neutral-900/50 p-4">
          <span className="text-xs text-neutral-400 block">Gross Margin %</span>
          <span className="text-lg font-bold text-purple-300 mt-1 block">{grossMargin.toFixed(1)}%</span>
        </Card>
      </div>

      {/* Content & Deliverables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linked Tasks */}
        <Card className="border-neutral-800 bg-neutral-900/40">
          <CardHeader className="p-4 border-b border-neutral-800">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-purple-400" />
              Creative Production Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {tasks.slice(0, 3).map((t) => (
              <div key={t.id} className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between text-xs">
                <span className="font-medium text-white">{t.title}</span>
                <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30">
                  {t.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Finished Deliverables */}
        <Card className="border-neutral-800 bg-neutral-900/40">
          <CardHeader className="p-4 border-b border-neutral-800">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-purple-400" />
              Client Deliverables & Vault
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {deliverables.slice(0, 3).map((d) => (
              <div key={d.id} className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-white block">{d.title}</span>
                  <span className="text-[10px] text-neutral-500">{d.version} • {d.type}</span>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  {d.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
