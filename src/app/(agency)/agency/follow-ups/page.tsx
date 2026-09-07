import { getAgencyClients, getAgencyLeads } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, CheckCircle2, Calendar, Phone, Mail, ArrowRight, AlertCircle, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyFollowUpsPage() {
  const [clients, leads] = await Promise.all([getAgencyClients(), getAgencyLeads()]);

  const upcomingFollowUps = [
    {
      id: 'f-1',
      title: 'Review Fall Campaign Proposals with GCH Retail',
      type: 'Client Call',
      contact: 'director@gchretail.com',
      date: 'Tomorrow at 11:30 AM',
      priority: 'high',
      status: 'pending',
    },
    {
      id: 'f-2',
      title: 'Monthly Performance ROAS Check-in with Biryani Pizza',
      type: 'Strategy Review',
      contact: 'management@biryanipizza.pk',
      date: 'Thursday at 4:00 PM',
      priority: 'medium',
      status: 'pending',
    },
    {
      id: 'f-3',
      title: 'Deliverable Proofing Handoff with Linker Builders',
      type: 'Executive Meeting',
      contact: 'ceo@linkerbuilders.pk',
      date: 'Next Monday at 2:00 PM',
      priority: 'urgent',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-400" />
            Client Follow-ups & Radar
          </h1>
          <p className="text-sm text-neutral-400">
            Scheduled touchpoints, contract renewals, and account manager reminders.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Schedule Follow-up
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-white">Upcoming Action Items</h2>

          {upcomingFollowUps.map((item) => (
            <Card key={item.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.title}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        item.priority === 'urgent'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      }`}
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {item.type} • Contact: <span className="text-neutral-300">{item.contact}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-purple-300 shrink-0">{item.date}</span>
                  <Button variant="outline" size="sm" className="h-8 text-xs border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Mark Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Renewal Radar</h2>
          <Card className="border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 space-y-1">
              <span className="text-xs font-bold text-white">Biryani Pizza Monthly Retainer</span>
              <p className="text-[11px] text-neutral-400">Next billing cycle: 1st of October 2026</p>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                Auto-Renew Enabled
              </Badge>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 space-y-1">
              <span className="text-xs font-bold text-white">GCH Fall Fashion Collection</span>
              <p className="text-[11px] text-neutral-400">Campaign ends October 25, 2026</p>
              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30">
                Winter Proposal Due
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
