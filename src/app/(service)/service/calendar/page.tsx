import { getServiceCalendarEvents } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/constants';
import {
  CalendarDays,
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  Camera,
  Film,
  CheckCircle,
  Filter,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const { functions, conflicts } = await getServiceCalendarEvents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-blue-400" />
            Shoot Calendar & Conflict Radar
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Master shoot schedule with automated crew overlap and double-booking conflict detection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-900 text-xs">
            Month
          </Button>
          <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-900 text-xs">
            Week
          </Button>
          <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-900 text-xs">
            Day
          </Button>
        </div>
      </div>

      {/* Conflicts Alert Section */}
      {conflicts.length > 0 ? (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-neutral-900/60 to-neutral-950 border border-red-500/30 space-y-3">
          <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
            <span>CRITICAL: TEAM SCHEDULING CONFLICT DETECTED</span>
          </div>
          <p className="text-xs text-neutral-300">
            The following team members are scheduled for multiple shoot locations or overlapping functions on the same date:
          </p>

          <div className="space-y-2 pt-1">
            {conflicts.map((conflict, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="text-xs font-bold text-red-300">{conflict.person_name}</span>
                  <span className="text-xs text-neutral-400 ml-2">Date: {conflict.date}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {conflict.conflicting_functions.map((cf, cidx) => (
                    <Badge key={cidx} variant="outline" className="text-[10px] border-red-500/40 text-red-300 bg-red-500/10">
                      {cf.function_name} ({cf.time_window}) — {cf.role.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>No scheduling conflicts detected. All assigned crew members have clear coverage windows.</span>
        </div>
      )}

      {/* Calendar Timeline List */}
      <div className="grid grid-cols-1 gap-4">
        <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
          September 2026 Functions Timeline
        </h2>

        {functions.map((fn: any) => (
          <Card key={fn.id} className="border-neutral-800 bg-neutral-900/60 overflow-hidden hover:border-neutral-700 transition-colors">
            <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shrink-0">
                  <span className="text-xs font-medium uppercase">
                    {new Date(fn.function_date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold text-white">
                    {new Date(fn.function_date).getDate()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{fn.function_name}</h3>
                    <Badge variant="outline" className="text-[10px] border-neutral-700 text-neutral-300 capitalize">
                      {fn.function_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-400 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{fn.venue}, {fn.city}</span>
                    <span className="text-neutral-600">•</span>
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{fn.start_time} - {fn.end_time} ({fn.coverage_hours}h)</span>
                  </p>
                </div>
              </div>

              {/* Assigned Crew */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="space-y-1 text-right sm:text-left">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Assigned Crew ({fn.team_assignments?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(fn.team_assignments || []).map((ta: any) => (
                      <span
                        key={ta.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-[11px] text-neutral-200"
                      >
                        <Camera className="w-3 h-3 text-blue-400" />
                        {ta.person_name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
