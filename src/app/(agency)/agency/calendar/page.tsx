import { getAgencyProjects, getAgencyContent } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, Calendar, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyCalendarPage() {
  const [projects, contentItems] = await Promise.all([getAgencyProjects(), getAgencyContent()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-purple-400" />
            Agency Project & Campaign Schedule
          </h1>
          <p className="text-sm text-neutral-400">
            Unified chronological schedule for project milestones, campaign launches, and client reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 border-neutral-800 bg-neutral-900 text-neutral-300">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-bold text-white px-2">September 2026</span>
          <Button variant="outline" size="sm" className="h-8 border-neutral-800 bg-neutral-900 text-neutral-300">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center py-2 text-xs font-semibold uppercase text-neutral-500 border-b border-neutral-800">
            {day}
          </div>
        ))}

        {/* Days grid sample */}
        {Array.from({ length: 28 }).map((_, i) => {
          const dayNum = i + 1;
          const hasEvent = dayNum === 12 || dayNum === 14 || dayNum === 18;

          return (
            <div
              key={i}
              className={`min-h-[100px] p-2 rounded-xl border ${
                hasEvent ? 'border-purple-500/40 bg-purple-950/15' : 'border-neutral-800/60 bg-neutral-950/40'
              } flex flex-col justify-between`}
            >
              <span className={`text-xs font-semibold ${hasEvent ? 'text-purple-300 font-bold' : 'text-neutral-500'}`}>
                {dayNum}
              </span>

              {dayNum === 12 && (
                <div className="p-1.5 rounded bg-purple-600/20 border border-purple-500/30 text-[10px] text-purple-200 font-medium truncate">
                  🎬 4K Reel Launch
                </div>
              )}

              {dayNum === 14 && (
                <div className="p-1.5 rounded bg-blue-600/20 border border-blue-500/30 text-[10px] text-blue-200 font-medium truncate">
                  📊 Feast Carousel
                </div>
              )}

              {dayNum === 18 && (
                <div className="p-1.5 rounded bg-emerald-600/20 border border-emerald-500/30 text-[10px] text-emerald-200 font-medium truncate">
                  🏢 Linker 3D Teaser
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
