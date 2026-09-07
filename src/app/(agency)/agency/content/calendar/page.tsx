import { getAgencyContent } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, Plus, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyContentCalendarPage() {
  const contentItems = await getAgencyContent();

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-400" />
            Social Media Content Calendar
          </h1>
          <p className="text-sm text-neutral-400">
            Monthly schedule of Instagram Reels, feed carousels, and LinkedIn thought-leadership posts.
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
          <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 ml-2">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {daysOfWeek.map((d) => (
          <div key={d} className="text-center py-2 text-xs font-bold uppercase text-neutral-400 border-b border-neutral-800">
            {d}
          </div>
        ))}

        {Array.from({ length: 30 }).map((_, idx) => {
          const day = idx + 1;
          const matchingItems = contentItems.filter((it) => {
            const dayStr = it.scheduled_date.split('-')[2];
            return Number(dayStr) === day;
          });

          return (
            <div
              key={idx}
              className="min-h-[120px] p-2 rounded-xl border border-neutral-800/80 bg-neutral-950/50 flex flex-col justify-between hover:border-purple-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500">{day}</span>
                {matchingItems.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                )}
              </div>

              <div className="space-y-1.5 my-1">
                {matchingItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-1.5 rounded bg-purple-950/40 border border-purple-500/30 text-[10px] space-y-0.5"
                  >
                    <div className="flex items-center justify-between text-purple-300 font-semibold truncate">
                      <span>{item.platform}</span>
                      <span>{item.scheduled_time || '18:00'}</span>
                    </div>
                    <p className="text-neutral-200 line-clamp-1">{item.title}</p>
                  </div>
                ))}
              </div>

              <div className="text-[9px] text-neutral-600 text-right">
                {matchingItems.length > 0 ? `${matchingItems.length} post(s)` : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
