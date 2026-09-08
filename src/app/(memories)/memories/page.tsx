import {
  getMemoriesDashboardStats,
  getMemoriesSessions,
  getMemoriesGalleries,
  getMemoriesTasks,
  getMemoriesLeads,
  getMemoriesQuotes,
  getMemoriesNextActions,
} from '@/actions/memories-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import Link from 'next/link';
import {
  Heart,
  Calendar,
  Camera,
  Flame,
  Clock,
  ArrowRight,
  Plus,
  Users,
  Target,
  FileText,
  AlertCircle,
  Images,
  TrendingUp,
  CreditCard,
  PiggyBank,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MemoriesDashboardPage() {
  const [stats, sessions, galleries, tasks, leads, quotes, nextActions] = await Promise.all([
    getMemoriesDashboardStats(),
    getMemoriesSessions(),
    getMemoriesGalleries(),
    getMemoriesTasks(),
    getMemoriesLeads(),
    getMemoriesQuotes(),
    getMemoriesNextActions(),
  ]);

  const upcomingSessions = sessions.filter((s) => s.booking_status === 'confirmed').slice(0, 3);
  const activeGalleries = galleries.slice(0, 3);
  const pendingTasks = tasks.filter((t) => t.status === 'todo' || t.status === 'in_progress').slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Workspace Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#46BBD4]/20 via-neutral-900/60 to-neutral-950 border border-[#46BBD4]/30 backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#46BBD4]/15 border border-[#46BBD4]/30 text-xs font-semibold text-[#46BBD4]">
            <Heart className="w-3.5 h-3.5 fill-[#46BBD4]/30" />
            <span>Snap Memories Studio OS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Studio Command Center
          </h1>
          <p className="text-sm text-neutral-400">
            Luxury studio operations for newborn, baby milestones, cake smash, birthday, and family heritage portraiture.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            render={<Link href="/memories/quotes" />}
            className="bg-[#46BBD4] hover:bg-[#3ba8be] text-neutral-950 text-xs font-bold shadow-lg shadow-[#46BBD4]/20"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Create Quotation
          </Button>
          <Button
            variant="outline"
            render={<Link href="/memories/calendar" />}
            className="border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 text-xs font-medium"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#46BBD4]" />
            Studio Calendar
          </Button>
        </div>
      </div>

      {/* Action Required Radar (Prioritizes operational bottlenecks) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#46BBD4]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Action Required Radar</h2>
          </div>
          <span className="text-xs text-neutral-500">Prioritized by urgency</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {nextActions.map((action) => (
            <div
              key={action.id}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3 backdrop-blur-sm transition-all ${
                action.priority === 'urgent'
                  ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/50'
                  : action.priority === 'high'
                  ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-neutral-900/50 border-neutral-800 hover:border-[#46BBD4]/40'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={action.priority === 'urgent' ? 'destructive' : action.priority === 'high' ? 'outline' : 'secondary'}
                    className="text-[10px] uppercase font-bold tracking-wider"
                  >
                    {action.priority}
                  </Badge>
                  <span className="text-[11px] text-neutral-400 truncate max-w-[130px]">
                    {action.client_name}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white leading-snug">{action.title}</h3>
                <p className="text-[11px] text-neutral-400 line-clamp-2">{action.reason}</p>
              </div>

              <Link
                href={action.action_href}
                className="inline-flex items-center justify-between text-xs font-semibold text-[#46BBD4] hover:text-[#57C1DA] pt-2 border-t border-neutral-800/60 transition-colors"
              >
                <span>{action.action_label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400">Monthly Studio Revenue</CardTitle>
            <CreditCard className="w-4 h-4 text-[#46BBD4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(stats.monthly_revenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.gross_margin}% Gross Margin</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400">Net Studio Profit</CardTitle>
            <PiggyBank className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              {formatCurrency(stats.gross_profit)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Costs: {formatCurrency(stats.monthly_direct_costs)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400">Upcoming Confirmed Shoots</CardTitle>
            <Camera className="w-4 h-4 text-[#46BBD4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight">
              {stats.upcoming_sessions_count}
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Active booking holds: {stats.active_booking_holds}
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-400">Proofing & Editing Queue</CardTitle>
            <Images className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400 tracking-tight">
              {stats.editing_queue_count} in editing
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {stats.pending_selections_count} awaiting client selection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Operations Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confirmed Sessions & Shoot Day Launch */}
        <Card className="border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-white">Upcoming Confirmed Sessions</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Scheduled studio shoots and checklist readiness
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/memories/sessions" />}
              className="text-xs h-7 border-neutral-800 hover:bg-neutral-800"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingSessions.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-center justify-between gap-3 hover:border-[#46BBD4]/40 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white truncate">{s.title}</span>
                    <Badge variant="outline" className="text-[10px] border-[#46BBD4]/40 text-[#46BBD4]">
                      {s.session_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {s.session_date} ({s.start_time}–{s.end_time})
                    </span>
                    <span>•</span>
                    <span>{s.studio_room || s.location}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  render={<Link href={`/memories/sessions/${s.id}/shoot-day`} />}
                  className="bg-[#46BBD4]/15 hover:bg-[#46BBD4]/30 text-[#46BBD4] border border-[#46BBD4]/30 text-xs shrink-0"
                >
                  <Flame className="w-3 h-3 mr-1 text-[#46BBD4]" />
                  Shoot Day
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Client Proofing Galleries & Selections */}
        <Card className="border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-white">Client Proofing Galleries</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Watermarked proofing sets delivered for client selection
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/memories/galleries" />}
              className="text-xs h-7 border-neutral-800 hover:bg-neutral-800"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeGalleries.map((g) => (
              <div
                key={g.id}
                className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white truncate">{g.title}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {g.total_photos} photos
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span>Deadline: {g.selection_deadline || 'Open'}</span>
                    <span>•</span>
                    <span>Max {g.max_selections} picks</span>
                    <span>•</span>
                    <span>Status: {g.status.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/memories/galleries" />}
                  className="text-xs h-7 border-neutral-800 text-neutral-300"
                >
                  Inspect
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tasks & Direct Action Section */}
      <Card className="border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-white">Studio Operational Tasks</CardTitle>
            <CardDescription className="text-xs text-neutral-400">
              Automated workflows, prop preparations, and cake orders
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/memories/tasks" />}
            className="text-xs h-7 border-neutral-800 hover:bg-neutral-800"
          >
            Manage All Tasks
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingTasks.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-lg border border-neutral-800/80 bg-neutral-950/40 flex items-start justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate">{t.title}</span>
                    <Badge
                      variant={t.priority === 'urgent' || t.priority === 'high' ? 'destructive' : 'outline'}
                      className="text-[9px] uppercase"
                    >
                      {t.priority}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">{t.description}</p>
                  <span className="text-[10px] text-neutral-500">Due: {t.due_date}</span>
                </div>

                <Badge variant="outline" className="text-[10px] shrink-0 border-neutral-700 text-neutral-400">
                  {t.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
