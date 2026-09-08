import Link from 'next/link';
import { 
  Camera, 
  Calendar, 
  Clock, 
  MapPin, 
  Flame, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  Search,
  Sparkles,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { getMemoriesSessions } from '@/actions/memories-actions';
import { formatCurrency, formatDate } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function MemoriesSessionsPage() {
  const sessions = await getMemoriesSessions();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Studio Sessions Master
            </span>
            <span className="text-xs text-neutral-400">
              Room A & Room B Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Studio Photography Sessions
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage scheduled newborn, milestone, cake smash, birthday, and family portrait sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/memories/calendar">
            <Button variant="outline" className="border-neutral-800 hover:bg-neutral-800 text-neutral-300 gap-2">
              <Calendar className="w-4 h-4 text-[#46BBD4]" />
              Studio Calendar
            </Button>
          </Link>
          <Link href="/memories/sessions/shoot-day">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-neutral-950 font-semibold gap-2 shadow-lg shadow-orange-500/20">
              <Flame className="w-4 h-4 fill-neutral-950" />
              Active Shoot Station
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Total Studio Sessions</div>
          <div className="text-2xl font-bold text-white mt-1">{sessions.length}</div>
          <div className="text-xs text-[#46BBD4] mt-1">Active in calendar</div>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Upcoming & Confirmed</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {sessions.filter(s => s.status === 'scheduled').length}
          </div>
          <div className="text-xs text-emerald-500/80 mt-1">Ready for studio prep</div>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">In Post-Production</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {sessions.filter(s => s.status === 'completed' || s.status === 'in_progress').length}
          </div>
          <div className="text-xs text-amber-500/80 mt-1">Proofing & editing</div>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Total Booked Value</div>
          <div className="text-2xl font-bold text-white mt-1">
            {formatCurrency(sessions.reduce((acc, s) => acc + (s.total_amount || 0), 0))}
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            Balance: {formatCurrency(sessions.reduce((acc, s) => acc + (s.balance_due || 0), 0))}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">All Sessions</h2>
          <div className="text-xs text-neutral-400">
            Showing {sessions.length} sessions
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Info */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
                      {session.session_type}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        session.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : session.status === 'in_progress'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}
                    >
                      {session.status.toUpperCase()}
                    </span>
                    {session.package?.name && (
                      <span className="text-xs text-neutral-400">
                        • {session.package.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#46BBD4]">
                      {session.title}
                    </h3>
                    <p className="text-sm text-neutral-300">
                      Client: <span className="font-semibold text-white">{session.client?.name || 'Walk-in Parent'}</span>
                      {session.client?.phone && ` (${session.client.phone})`}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#46BBD4]" />
                      <span>{session.session_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#46BBD4]" />
                      <span>{session.start_time || '10:00 AM'} - {session.end_time || '01:00 PM'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#46BBD4]" />
                      <span className="text-amber-300/90 font-medium">{session.studio_room || 'Room A (Newborn)'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#46BBD4]" />
                      <span>Photographer: {session.lead_photographer?.full_name || 'Senior Studio Master'}</span>
                    </div>
                  </div>

                  {session.special_notes && (
                    <div className="text-xs text-neutral-400 bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800">
                      <span className="text-neutral-500 font-semibold uppercase text-[10px] block mb-0.5">Shoot Day Notes:</span>
                      {session.special_notes}
                    </div>
                  )}
                </div>

                {/* Right: Financials & Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-800">
                  <div className="text-left lg:text-right">
                    <div className="text-xs text-neutral-400">Session Package Fee</div>
                    <div className="text-lg font-bold text-white">
                      {formatCurrency(session.total_amount || 0)}
                    </div>
                    <div className="text-xs mt-0.5">
                      {session.balance_due && session.balance_due > 0 ? (
                        <span className="text-amber-400 font-medium">
                          Balance Due: {formatCurrency(session.balance_due)}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">Fully Paid</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href={`/memories/sessions/${session.id}/shoot-day`}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        size="sm"
                        className="w-full bg-[#46BBD4]/15 hover:bg-[#46BBD4]/25 text-[#46BBD4] border border-[#46BBD4]/30 gap-1.5"
                      >
                        <Flame className="w-3.5 h-3.5 text-[#46BBD4]" />
                        Shoot Station
                      </Button>
                    </Link>
                    <Link href="/memories/galleries">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-neutral-800 hover:bg-neutral-800 text-neutral-300 gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5 text-neutral-400" />
                        Galleries
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
