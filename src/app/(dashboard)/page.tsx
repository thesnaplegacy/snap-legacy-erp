import {
  getDashboardStats,
  getBrandPerformance,
  getRecentTransactions,
  getUpcomingEvents,
  getActiveProjects,
  getOutstandingPayments,
  getRecentLeads,
} from '@/actions/finance';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatDateTime, STATUS_LABELS, STATUS_VARIANTS, BRAND_COLORS } from '@/lib/constants';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  FolderKanban,
  CreditCard,
  Target,
  Building2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [stats, brandPerformance, recentTx, events, projects, payments, leads] =
    await Promise.all([
      getDashboardStats(),
      getBrandPerformance(),
      getRecentTransactions(5),
      getUpcomingEvents(5),
      getActiveProjects(5),
      getOutstandingPayments(5),
      getRecentLeads(5),
    ]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">The Snap Legacy — Executive Overview</p>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.total_revenue)}
          icon={TrendingUp}
          iconColor="text-emerald-500"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats.total_expenses)}
          icon={TrendingDown}
          iconColor="text-red-400"
        />
        <StatCard
          title="Gross Profit"
          value={formatCurrency(stats.gross_profit)}
          icon={DollarSign}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(stats.net_profit)}
          icon={DollarSign}
          iconColor="text-amber-400"
        />
      </div>

      {/* Balance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cash Balance"
          value={formatCurrency(stats.cash_balance)}
          icon={Wallet}
          iconColor="text-green-400"
        />
        <StatCard
          title="Bank Balance"
          value={formatCurrency(stats.bank_balance)}
          icon={Landmark}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Receivables"
          value={formatCurrency(stats.receivables)}
          icon={ArrowDownLeft}
          iconColor="text-cyan-400"
        />
        <StatCard
          title="Payables"
          value={formatCurrency(stats.payables)}
          icon={ArrowUpRight}
          iconColor="text-orange-400"
        />
      </div>

      {/* Brand Performance */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-500" />
          Brand Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {brandPerformance.length === 0 ? (
            <Card className="md:col-span-3 border-neutral-800/50 bg-neutral-900/50">
              <CardContent className="p-8 text-center text-neutral-500">
                No data available
              </CardContent>
            </Card>
          ) : (
            brandPerformance.map((bp) => (
              <Card
                key={bp.brand.id}
                className="border-neutral-800/50 bg-neutral-900/50 hover:bg-neutral-900/80 transition-all"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: bp.brand.color || '#C9A84C' }}
                    />
                    <CardTitle className="text-sm font-semibold text-white">
                      {bp.brand.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">Revenue</p>
                      <p className="text-sm font-semibold text-emerald-400">
                        {formatCurrency(bp.revenue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">Expenses</p>
                      <p className="text-sm font-semibold text-red-400">
                        {formatCurrency(bp.expenses)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">Active Projects</p>
                      <p className="text-sm font-semibold text-white">{bp.active_projects}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">Active Leads</p>
                      <p className="text-sm font-semibold text-white">{bp.active_leads}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="border-neutral-800/50 bg-neutral-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-500" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTx.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {recentTx.map((tx: Record<string, unknown>) => (
                  <div key={tx.id as string} className="flex items-center justify-between py-2 border-b border-neutral-800/50 last:border-0">
                    <div>
                      <p className="text-sm text-white">{tx.description as string || 'Transaction'}</p>
                      <p className="text-xs text-neutral-500">{formatDate(tx.date as string)}</p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount as number)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="border-neutral-800/50 bg-neutral-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-blue-400" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {projects.map((project: Record<string, unknown>) => (
                  <div key={project.id as string} className="flex items-center justify-between py-2 border-b border-neutral-800/50 last:border-0">
                    <div>
                      <p className="text-sm text-white">{project.name as string}</p>
                      <p className="text-xs text-neutral-500">
                        {(project.client as Record<string, unknown>)?.name as string || 'No client'}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANTS[project.status as string] || 'outline'} className="text-xs">
                      {STATUS_LABELS[project.status as string] || project.status as string}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-neutral-800/50 bg-neutral-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-purple-400" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {events.map((event: Record<string, unknown>) => (
                  <div key={event.id as string} className="flex items-center justify-between py-2 border-b border-neutral-800/50 last:border-0">
                    <div>
                      <p className="text-sm text-white">{event.name as string}</p>
                      <p className="text-xs text-neutral-500">{formatDateTime(event.event_date as string)}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {STATUS_LABELS[event.status as string] || event.status as string}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Outstanding Payments */}
        <Card className="border-neutral-800/50 bg-neutral-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-400" />
              Outstanding Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment: Record<string, unknown>) => (
                  <div key={payment.id as string} className="flex items-center justify-between py-2 border-b border-neutral-800/50 last:border-0">
                    <div>
                      <p className="text-sm text-white">
                        {(payment.client as Record<string, unknown>)?.name as string || 'Unknown'}
                      </p>
                      <p className="text-xs text-neutral-500">Due: {formatDate(payment.due_date as string)}</p>
                    </div>
                    <span className="text-sm font-semibold text-amber-400">
                      {formatCurrency(payment.amount as number)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="border-neutral-800/50 bg-neutral-900/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {leads.map((lead: Record<string, unknown>) => (
                  <div key={lead.id as string} className="flex items-center justify-between py-2 border-b border-neutral-800/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: (lead.brand as Record<string, unknown>)?.color as string || '#C9A84C' }}
                      />
                      <div>
                        <p className="text-sm text-white">{lead.title as string}</p>
                        <p className="text-xs text-neutral-500">{(lead.brand as Record<string, unknown>)?.name as string || 'Legacy'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {Boolean(lead.value) && (
                        <span className="text-sm text-neutral-300">{formatCurrency(lead.value as number)}</span>
                      )}
                      <Badge variant={STATUS_VARIANTS[lead.status as string] || 'outline'} className="text-xs">
                        {STATUS_LABELS[lead.status as string] || (lead.status as string)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
