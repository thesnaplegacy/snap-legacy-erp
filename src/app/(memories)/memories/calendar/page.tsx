import { getMemoriesSessions } from '@/actions/memories-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Clock,
  Camera,
  MapPin,
  Flame,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MemoriesCalendarPage() {
  const sessions = await getMemoriesSessions();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#46BBD4]/15 text-xs font-semibold text-[#46BBD4] mb-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Studio Scheduling & Conflict Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Studio Calendar</h1>
          <p className="text-xs text-neutral-400">
            Room reservations, photographer scheduling, and real-time slot conflict protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            render={<Link href="/memories/sessions" />}
            className="bg-[#46BBD4] hover:bg-[#3ba8be] text-neutral-950 font-bold text-xs"
          >
            Manage Sessions
          </Button>
        </div>
      </div>

      {/* Calendar Timeline & Room Schedule */}
      <div className="space-y-4">
        <Card className="border-neutral-800 bg-neutral-900/40">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-white">September 2026 Studio Schedule</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-[#46BBD4]/40 text-[#46BBD4]">
                  Room A: Soft Light Newborn
                </Badge>
                <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-400">
                  Room B: Cake Smash & Party
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#46BBD4]/40 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-white">{sess.title}</span>
                    <Badge variant="outline" className="text-[10px] border-[#46BBD4]/40 text-[#46BBD4]">
                      {sess.session_type}
                    </Badge>
                    <Badge
                      variant={sess.booking_status === 'confirmed' ? 'default' : 'secondary'}
                      className="text-[10px]"
                    >
                      {sess.booking_status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                    <span className="flex items-center gap-1 text-white font-medium">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#46BBD4]" />
                      {sess.session_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      {sess.start_time} – {sess.end_time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      {sess.studio_room || sess.location}
                    </span>
                    {sess.assigned_photographer && (
                      <span className="flex items-center gap-1 text-neutral-300">
                        <Camera className="w-3.5 h-3.5 text-neutral-500" />
                        {sess.assigned_photographer.full_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    render={<Link href={`/memories/sessions/${sess.id}/shoot-day`} />}
                    className="h-8 text-xs bg-[#46BBD4]/15 hover:bg-[#46BBD4]/30 text-[#46BBD4] border border-[#46BBD4]/30 font-medium"
                  >
                    <Flame className="w-3.5 h-3.5 mr-1" />
                    Shoot Day Workstation
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
