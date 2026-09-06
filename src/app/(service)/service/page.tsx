import {
  getServiceDashboardStats,
  getServiceWeddings,
  getServiceCalendarEvents,
  getServiceEditingTasks,
  getServiceDeliverables,
} from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import Link from 'next/link';
import {
  Camera,
  Film,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
  Percent,
  Clock,
  AlertTriangle,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  UsersRound,
  FileSpreadsheet,
  Plus,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ServiceDashboardPage() {
  const [stats, weddings, calendarData, editingTasks, deliverables] = await Promise.all([
    getServiceDashboardStats(),
    getServiceWeddings(),
    getServiceCalendarEvents(),
    getServiceEditingTasks(),
    getServiceDeliverables(),
  ]);

  const conflicts = calendarData.conflicts || [];
  const upcomingFunctions = (calendarData.functions || []).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Workspace Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-neutral-900/60 to-neutral-950 border border-blue-500/20 backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400">
            <Camera className="w-3.5 h-3.5" />
            <span>The Snap Service Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Photography & Cinematography Workspace
          </h1>
          <p className="text-sm text-neutral-400">
            Operational center for multi-day weddings, shoot logistics, editing pipelines, and event costing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            render={<Link href="/service/quotations" />}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Quotation
          </Button>
          <Button
            variant="outline"
            render={<Link href="/service/calendar" />}
            className="border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 text-xs font-medium"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            Shoot Calendar
          </Button>
        </div>
      </div>

      {/* Team Conflicts Warning Banner (If any) */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-300">
              Team Scheduling Conflict Detected ({conflicts.length})
            </p>
            <p className="text-xs text-neutral-300">
              {conflicts[0].person_name} has multiple overlapping shoot assignments on{' '}
              <span className="font-semibold text-amber-200">{conflicts[0].date}</span>.
            </p>
            <Link
              href="/service/calendar"
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 hover:underline pt-1"
            >
              Resolve Conflicts on Calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Financial & Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Contracted Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(stats.contracted_revenue)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Received: <span className="text-emerald-400 font-medium">{formatCurrency(stats.received_revenue)}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Outstanding Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">
              {formatCurrency(stats.outstanding_revenue)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Pending client receipts
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Event Costs & Profit
            </CardTitle>
            <Receipt className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(stats.gross_profit)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Costs: {formatCurrency(stats.total_event_costs)} • Margin: <span className="text-blue-400 font-semibold">{stats.profit_margin}%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Active Productions
            </CardTitle>
            <Film className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.active_weddings} Weddings
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {stats.pending_edits} Edits Pending • {stats.pending_albums} Albums in Design
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Multi-Day Weddings & Upcoming Functions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Wedding Projects */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-neutral-800/80 bg-neutral-900/60">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-blue-400" />
                  Multi-Day Wedding Projects
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  Master wedding bookings with individual functions (Mehndi, Barat, Walima)
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" render={<Link href="/service/events/weddings" />} className="text-xs text-blue-400 hover:text-blue-300">
                View All Weddings ➔
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {weddings.length === 0 ? (
                <p className="text-xs text-neutral-500 py-4 text-center">No active weddings recorded.</p>
              ) : (
                weddings.map((w: any) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white">{w.name}</h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Client: <span className="text-neutral-200">{w.client?.name || 'Client'}</span> • {w.client?.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400 bg-blue-500/10">
                          {formatCurrency(w.total_value)}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-neutral-700 text-neutral-300">
                          {w.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Sub-functions pills */}
                    <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap gap-2">
                      {(w.functions || []).map((fn: any) => (
                        <div
                          key={fn.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span className="font-semibold text-white">{fn.function_name}</span>
                          <span className="text-neutral-500">({formatDate(fn.function_date)})</span>
                          <span className="text-neutral-400">• {fn.venue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Editing Workflow Radar */}
          <Card className="border-neutral-800/80 bg-neutral-900/60">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-cyan-400" />
                  Editing & Post-Production Queue
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  Highlight films, teaser reels, documentary edits, and deadlines
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" render={<Link href="/service/production/editing" />} className="text-xs text-blue-400 hover:text-blue-300">
                Editing Pipeline ➔
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {editingTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-950/40 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white">{task.title}</p>
                    <p className="text-[11px] text-neutral-400">
                      Editor: <span className="text-neutral-200">{task.editor_name || 'Unassigned'}</span> • Deadline:{' '}
                      <span className="text-amber-400 font-medium">{formatDate(task.deadline)}</span>
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] capitalize ${
                      task.status === 'in_progress'
                        ? 'border-blue-500/40 text-blue-400 bg-blue-500/10'
                        : task.status === 'files_received'
                        ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                        : 'border-neutral-700 text-neutral-400'
                    }`}
                  >
                    {task.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Upcoming Functions & Quick Schedule */}
        <div className="space-y-6">
          <Card className="border-neutral-800/80 bg-neutral-900/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Upcoming Functions & Shoots
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Chronological shoot schedule with call times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingFunctions.length === 0 ? (
                <p className="text-xs text-neutral-500 py-4 text-center">No upcoming functions scheduled.</p>
              ) : (
                upcomingFunctions.map((fn) => (
                  <div
                    key={fn.id}
                    className="p-3 rounded-xl border border-neutral-800 bg-neutral-950/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{fn.function_name}</span>
                      <span className="text-[10px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {formatDate(fn.function_date)}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">
                      📍 {fn.venue}, {fn.city}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      ⏰ Call Time: {fn.start_time || '18:30'} - {fn.end_time || '01:00'}
                    </p>
                  </div>
                ))
              )}

              <Button
                variant="outline"
                size="sm"
                render={<Link href="/service/calendar" />}
                className="w-full text-xs border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 mt-2"
              >
                Open Full Calendar ➔
              </Button>
            </CardContent>
          </Card>

          {/* Quick Navigation Cards */}
          <Card className="border-neutral-800/80 bg-neutral-900/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Service Portals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <Link
                href="/service/leads"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800/50 text-xs text-neutral-300 transition-colors"
              >
                <span>Lead Management</span>
                <span className="text-neutral-500">➔</span>
              </Link>
              <Link
                href="/service/packages"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800/50 text-xs text-neutral-300 transition-colors"
              >
                <span>Packages (Silver, Gold, Platinum)</span>
                <span className="text-neutral-500">➔</span>
              </Link>
              <Link
                href="/service/production/team"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800/50 text-xs text-neutral-300 transition-colors"
              >
                <span>Team & Freelancer Rates</span>
                <span className="text-neutral-500">➔</span>
              </Link>
              <Link
                href="/service/production/albums"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800/50 text-xs text-neutral-300 transition-colors"
              >
                <span>Luxury Albums Workflow</span>
                <span className="text-neutral-500">➔</span>
              </Link>
              <Link
                href="/service/finance/profit"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800/50 text-xs text-neutral-300 transition-colors"
              >
                <span>Event Costing & Profit Margins</span>
                <span className="text-neutral-500">➔</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
