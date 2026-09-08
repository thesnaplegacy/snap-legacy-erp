import { getExecutiveIntelligenceRadar } from '@/actions/finance-intelligence-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/constants';
import {
  BarChart3, TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck,
  Flame, Clock, Award, ArrowUpRight, Zap, Target, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ExecutiveRadarPage() {
  const radar = await getExecutiveIntelligenceRadar();
  const kpis = radar.kpis;

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/40 bg-red-950/30 text-red-400';
      case 'warning':
        return 'border-amber-500/40 bg-amber-950/30 text-amber-400';
      case 'info':
        return 'border-blue-500/40 bg-blue-950/30 text-blue-400';
      default:
        return 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* CEO Executive Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
              CEO COMMAND RADAR
            </span>
            <span className="text-xs text-neutral-400">• High-Level Strategic Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Executive Intelligence Radar</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Consolidated enterprise health, cash runway, portfolio growth, and automated strategic risk signals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/finance/pnl">
            <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-xs text-neutral-300">
              Cross-Brand P&L
            </Button>
          </Link>
          <Link href="/finance/ledger">
            <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-xs text-neutral-300">
              General Ledger
            </Button>
          </Link>
        </div>
      </div>

      {/* CEO Vitals 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cash Runway */}
        <Card className="border-neutral-800/70 bg-gradient-to-br from-neutral-900/90 to-neutral-950/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Cash Runway</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">
              {kpis.cash_runway_months.toFixed(1)} <span className="text-base font-normal text-neutral-400">months</span>
            </div>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> High liquidity reserve buffer
            </p>
          </CardContent>
        </Card>

        {/* Monthly Burn Rate */}
        <Card className="border-neutral-800/70 bg-gradient-to-br from-neutral-900/90 to-neutral-950/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Monthly Burn Rate</CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">
              {formatCurrency(kpis.monthly_burn_rate)}
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Combined fixed OpEx & recurring production overhead
            </p>
          </CardContent>
        </Card>

        {/* MoM Revenue Growth */}
        <Card className="border-neutral-800/70 bg-gradient-to-br from-neutral-900/90 to-neutral-950/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Portfolio Growth (MoM)</CardTitle>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400 tracking-tight">
              +{kpis.mom_revenue_growth.toFixed(1)}%
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Driven by studio bookings & wedding deposits
            </p>
          </CardContent>
        </Card>

        {/* Operating Margin */}
        <Card className="border-neutral-800/70 bg-gradient-to-br from-neutral-900/90 to-neutral-950/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Group Gross Margin</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Target className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">
              {kpis.gross_margin.toFixed(1)}%
            </div>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> Well above industry benchmark
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Brand Performance Ranking Table */}
      <Card className="border-neutral-800/60 bg-neutral-900/50">
        <CardHeader className="border-b border-neutral-800/80 pb-4">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Brand Performance Matrix & Health Status
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Multi-brand contribution ranking across revenue, margins, and operational health
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent text-xs text-neutral-400">
                <TableHead>Brand Name</TableHead>
                <TableHead className="text-right">Realized Revenue</TableHead>
                <TableHead className="text-right">Direct COGS</TableHead>
                <TableHead className="text-right">Gross Margin %</TableHead>
                <TableHead className="text-right">Operating Profit</TableHead>
                <TableHead className="text-center">Operational Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radar.pnl.brands.map((bp) => (
                <TableRow key={bp.brand_id} className="border-neutral-800/60 hover:bg-neutral-800/30 text-xs">
                  <TableCell className="font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bp.brand_color }} />
                    {bp.brand_name}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-white">
                    {formatCurrency(bp.gross_revenue)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-neutral-300">
                    {formatCurrency(bp.direct_costs)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-amber-400 font-semibold">
                    {bp.gross_margin.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-400">
                    {formatCurrency(bp.net_operating_profit)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Optimal
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Strategic Executive Alerts */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Automated Executive Risk & Opportunity Signals
        </h2>

        <div className="space-y-3">
          {radar.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getSeverityStyle(alert.severity)} transition-all`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{alert.title}</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">{alert.message}</p>
                </div>

                {alert.action_href && (
                  <Link href={alert.action_href}>
                    <Button size="sm" variant="ghost" className="text-xs text-white hover:bg-white/10 shrink-0">
                      {alert.action_label || 'Take Action'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
