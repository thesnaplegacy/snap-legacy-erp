import Link from 'next/link';
import { Flame, Calendar, Clock, MapPin, ArrowRight, Camera, Sparkles } from 'lucide-react';
import { getMemoriesSessions } from '@/actions/memories-actions';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function ShootDayIndexPage() {
  const sessions = await getMemoriesSessions();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            Live Floor Operations
          </span>
          <span className="text-xs text-neutral-400">
            Studio Shoot-Day Command
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Shoot-Day Operational Station
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Select an active or upcoming studio session to launch pre-shoot safety checklists, warming monitors, feeding pause logs, and post-shoot ingest.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Select Active Studio Session</h2>

        {sessions.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-neutral-900/40 border border-neutral-800 text-neutral-400">
            <Camera className="w-10 h-10 mx-auto mb-3 text-neutral-600" />
            <p className="text-base font-semibold text-white">No Active Sessions Found</p>
            <p className="text-xs mt-1">Schedule a session in the calendar to launch the shoot day station.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
                      {session.session_type}
                    </span>
                    <span className="text-xs text-amber-400 font-medium">
                      {session.studio_room || 'Room A'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{session.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#46BBD4]" />
                      <span>{session.session_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#46BBD4]" />
                      <span>{session.start_time} - {session.end_time}</span>
                    </div>
                    <div>
                      Parent: <span className="text-white font-medium">{session.client?.name}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Link href={`/memories/sessions/${session.id}/shoot-day`}>
                    <Button className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-neutral-950 font-bold gap-2 shadow-lg shadow-orange-500/20">
                      <Flame className="w-4 h-4 fill-neutral-950" />
                      Launch Floor Checklist
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
