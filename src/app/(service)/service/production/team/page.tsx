import { getServiceCalendarEvents } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/constants';
import { UsersRound, Plus, Camera, Film, Plane, UserCheck, DollarSign } from 'lucide-react';
import { DEMO_TEAM_ASSIGNMENTS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export default async function TeamProductionPage() {
  const assignments = DEMO_TEAM_ASSIGNMENTS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <UsersRound className="w-6 h-6 text-blue-400" />
            Crew Scheduling & Freelancer Costs
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Dispatch photographers, cinematographers, and drone operators with agreed rates and call times.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Assign Crew Member
        </Button>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/60 overflow-hidden">
        <CardHeader className="p-5 border-b border-neutral-800 bg-neutral-900/90">
          <CardTitle className="text-base font-bold text-white">Active Shoot Dispatches</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Internal core team and external freelancers scheduled for upcoming functions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3.5">Crew Member</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Call Time & Location</th>
                <th className="p-3.5 text-right">Agreed Rate</th>
                <th className="p-3.5 text-center">Type</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40 text-neutral-300">
              {assignments.map((ta) => (
                <tr key={ta.id} className="hover:bg-neutral-900/40">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-400" />
                    {ta.person_name}
                  </td>
                  <td className="p-3.5 capitalize text-neutral-300">
                    {ta.role.replace(/_/g, ' ')}
                  </td>
                  <td className="p-3.5 text-neutral-400">
                    <p className="font-medium text-neutral-200">{formatDateTime(ta.call_time)}</p>
                    <p className="text-[11px] text-neutral-500">{ta.location}</p>
                  </td>
                  <td className="p-3.5 text-right font-bold text-white">
                    {formatCurrency(ta.agreed_cost)}
                  </td>
                  <td className="p-3.5 text-center">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        ta.is_freelancer
                          ? 'border-purple-500/40 text-purple-300 bg-purple-500/10'
                          : 'border-blue-500/40 text-blue-300 bg-blue-500/10'
                      }`}
                    >
                      {ta.is_freelancer ? 'Freelancer' : 'Core Team'}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-center">
                    <Badge
                      variant="outline"
                      className={`text-[10px] capitalize ${
                        (ta.payment_status as string) === 'paid'
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                          : 'border-neutral-700 text-neutral-400'
                      }`}
                    >
                      {ta.payment_status}
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
