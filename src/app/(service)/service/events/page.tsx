import { getServiceCalendarEvents } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/constants';
import Link from 'next/link';
import { CalendarDays, MapPin, Clock, Plus, Users, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AllEventsPage() {
  const { functions } = await getServiceCalendarEvents();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-blue-400" />
            All Events & Shoot Logistics
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Complete schedule of upcoming, in-progress, and completed wedding functions and ceremonies.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold" render={<Link href="/service/events/weddings" />}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Wedding Function
        </Button>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/60 overflow-hidden">
        <CardHeader className="p-5 border-b border-neutral-800 bg-neutral-900/90">
          <CardTitle className="text-base font-bold text-white">Confirmed Shoot Schedule</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Functions with assigned crew members and call times
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3.5">Function Name</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Venue & City</th>
                <th className="p-3.5">Assigned Crew</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40 text-neutral-300">
              {functions.map((fn: any) => (
                <tr key={fn.id} className="hover:bg-neutral-900/40">
                  <td className="p-3.5">
                    <p className="font-bold text-white">{fn.function_name}</p>
                    <p className="text-[11px] text-neutral-400 capitalize">{fn.function_type}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-medium text-neutral-200">{formatDate(fn.function_date)}</p>
                    <p className="text-[11px] text-neutral-500">{fn.start_time} - {fn.end_time}</p>
                  </td>
                  <td className="p-3.5 text-neutral-300">
                    <p className="font-medium text-white">{fn.venue}</p>
                    <p className="text-[11px] text-neutral-400">{fn.city}</p>
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {(fn.team_assignments || []).map((ta: any) => (
                        <span key={ta.id} className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300">
                          {ta.person_name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    <Badge variant="outline" className="text-[10px] capitalize border-blue-500/40 text-blue-400 bg-blue-500/10">
                      {fn.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
