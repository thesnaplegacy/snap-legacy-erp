import {
  getAgencyDashboardStats,
  getAgencyProjects,
  getAgencyRetainers,
  getAgencyCampaigns,
  getAgencyContent,
  getAgencyApprovals,
} from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import Link from 'next/link';
import {
  Sparkles,
  TrendingUp,
  PiggyBank,
  Receipt,
  Percent,
  Repeat,
  Megaphone,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Users,
  Target,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyDashboardPage() {
  const [stats, projects, retainers, campaigns, contentItems, approvals] = await Promise.all([
    getAgencyDashboardStats(),
    getAgencyProjects(),
    getAgencyRetainers(),
    getAgencyCampaigns(),
    getAgencyContent(),
    getAgencyApprovals(),
  ]);

  const pendingApprovals = approvals.filter(
    (a) => a.status === 'pending_review' || a.status === 'sent_to_client'
  );
  const activeCampaigns = campaigns.filter((c) => c.status === 'Live' || c.status === 'Scheduled');
  const upcomingContent = contentItems.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Workspace Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-neutral-900/60 to-neutral-950 border border-purple-500/20 backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Snap Agency Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Creative & Digital Marketing Workspace
          </h1>
          <p className="text-sm text-neutral-400">
            Unified command for client retainers, ad campaigns, social media calendars, and creative production.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            render={<Link href="/agency/quotations" />}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Proposal
          </Button>
          <Button
            variant="outline"
            render={<Link href="/agency/content/calendar" />}
            className="border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 text-xs font-medium"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
            Content Calendar
          </Button>
        </div>
      </div>

      {/* Approvals Action Required Banner (If any) */}
      {pendingApprovals.length > 0 && (
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-3.5">
          <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-purple-300">
              Client Approvals Pending Review ({pendingApprovals.length})
            </p>
            <p className="text-xs text-neutral-300">
              Item &ldquo;{pendingApprovals[0].item_title}&rdquo; is awaiting client review response.
            </p>
            <Link
              href="/agency/production/approvals"
              className="inline-flex items-center gap-1 text-xs font-medium text-purple-400 hover:underline pt-1"
            >
              Open Approvals Manager <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Monthly Revenue */}
        <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardDescription className="text-xs font-medium text-neutral-400">Monthly Revenue</CardDescription>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-white">{formatCurrency(stats.monthly_revenue)}</div>
            <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">{stats.active_retainers} Retainers</span> active
            </p>
          </CardContent>
        </Card>

        {/* Outstanding Receivables */}
        <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardDescription className="text-xs font-medium text-neutral-400">Outstanding Invoices</CardDescription>
            <PiggyBank className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-amber-300">{formatCurrency(stats.outstanding_payments)}</div>
            <p className="text-[11px] text-neutral-400 mt-1">Pending payment cycle</p>
          </CardContent>
        </Card>

        {/* Monthly Direct Costs */}
        <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardDescription className="text-xs font-medium text-neutral-400">Monthly Direct Costs</CardDescription>
            <Receipt className="w-4 h-4 text-rose-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-neutral-200">{formatCurrency(stats.monthly_costs)}</div>
            <p className="text-[11px] text-neutral-400 mt-1">Ad spend & freelancers</p>
          </CardContent>
        </Card>

        {/* Gross Profit & Margin */}
        <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardDescription className="text-xs font-medium text-neutral-400">Gross Margin</CardDescription>
            <Percent className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-purple-300">{stats.gross_margin}%</div>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">
              +{formatCurrency(stats.gross_profit)} profit
            </p>
          </CardContent>
        </Card>

        {/* Active Retainers */}
        <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardDescription className="text-xs font-medium text-neutral-400">Active Retainers</CardDescription>
            <Repeat className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-white">{stats.active_retainers}</div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Across <span className="text-neutral-200 font-semibold">{stats.active_clients} clients</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Retainers & Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Retainers & Projects */}
        <Card className="lg:col-span-2 border-neutral-800 bg-neutral-900/40">
          <CardHeader className="p-5 flex flex-row items-center justify-between border-b border-neutral-800/60">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Repeat className="w-4 h-4 text-purple-400" />
                Active Retainers & Project Lifecycles
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Monthly recurring agency contracts and campaign deliverables
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/agency/retainers" />}
              className="text-xs border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
            >
              View All Retainers
            </Button>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {retainers.slice(0, 3).map((ret) => (
              <div
                key={ret.id}
                className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{ret.retainer_name}</span>
                    <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30">
                      {ret.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Billed every {ret.billing_day}th of month • Auto-renewal active
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{formatCurrency(ret.monthly_value)}</div>
                    <span className="text-[11px] text-neutral-500">/ month</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    render={<Link href={`/agency/projects`} />}
                    className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Ad Campaigns */}
        <Card className="border-neutral-800 bg-neutral-900/40">
          <CardHeader className="p-5 flex flex-row items-center justify-between border-b border-neutral-800/60">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-purple-400" />
                Live Campaigns
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">Paid media & organic funnels</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/agency/campaigns" />}
              className="text-xs border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
            >
              All
            </Button>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5">
            {activeCampaigns.map((camp) => (
              <div key={camp.id} className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white truncate">{camp.name}</span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    {camp.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Platform: {camp.platform}</span>
                  <span className="text-purple-300 font-medium">Budget: {formatCurrency(camp.budget)}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${Math.min(100, (camp.spend / camp.budget) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Grid: Content Calendar Queue & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Calendar Preview */}
        <Card className="lg:col-span-2 border-neutral-800 bg-neutral-900/40">
          <CardHeader className="p-5 flex flex-row items-center justify-between border-b border-neutral-800/60">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Upcoming Content Schedule
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Scheduled social media posts, reels, and video creatives
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/agency/content/calendar" />}
              className="text-xs border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
            >
              Full Calendar
            </Button>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {upcomingContent.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-lg bg-neutral-950/50 border border-neutral-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-300 shrink-0">
                    {c.content_type.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-white line-clamp-1">{c.title}</p>
                    <p className="text-[11px] text-neutral-400">
                      {c.platform} • Scheduled {c.scheduled_date}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    c.status === 'Approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : c.status === 'Client Review'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  }`}
                >
                  {c.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Agency Operations Hub */}
        <Card className="border-neutral-800 bg-neutral-900/40">
          <CardHeader className="p-5 border-b border-neutral-800/60">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-xs text-neutral-400">Rapid workflow shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-2.5">
            <Link
              href="/agency/leads"
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 hover:border-purple-500/40 bg-neutral-950/40 hover:bg-neutral-900/60 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-neutral-200">New Agency Inquiry</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/agency/discovery"
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 hover:border-purple-500/40 bg-neutral-950/40 hover:bg-neutral-900/60 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-neutral-200">Start Client Discovery</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/agency/services"
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 hover:border-purple-500/40 bg-neutral-950/40 hover:bg-neutral-900/60 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-neutral-200">Service Rate Card</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/agency/finance/profit"
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 hover:border-purple-500/40 bg-neutral-950/40 hover:bg-neutral-900/60 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Percent className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-neutral-200">Project Profitability</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
