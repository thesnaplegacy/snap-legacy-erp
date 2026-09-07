import { getAgencyRetainers } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import Link from 'next/link';
import { Repeat, Plus, Calendar, CheckCircle2, History } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyRetainersPage() {
  const retainers = await getAgencyRetainers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Repeat className="w-6 h-6 text-purple-400" />
            Agency Monthly Retainers & Recurring Revenue
          </h1>
          <p className="text-sm text-neutral-400">
            Dedicated monthly cycles with auto-renewal, deliverable quotas, and permanent historical archiving.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New Retainer Contract
        </Button>
      </div>

      <div className="space-y-4">
        {retainers.map((ret) => (
          <Card key={ret.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold text-white">{ret.retainer_name}</CardTitle>
                    <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30">
                      {ret.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-neutral-400">
                    Client: <span className="text-white font-medium">{ret.client?.name || 'Biryani Pizza Co.'}</span> • Billing Day: {ret.billing_day}th of month
                  </CardDescription>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">Monthly Rate</span>
                  <span className="text-lg font-bold text-white">{formatCurrency(ret.monthly_value)}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              {ret.notes && <p className="text-xs text-neutral-400">{ret.notes}</p>}

              {/* Monthly Cycles */}
              <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Monthly Cycles
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white">August 2026</span>
                      <span className="text-[10px] text-emerald-400 block font-medium">Billed & Paid</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      Closed
                    </Badge>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-950/60 border border-purple-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white">September 2026</span>
                      <span className="text-[10px] text-purple-300 block font-medium">Active Production</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse">
                      Live
                    </Badge>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-neutral-300">October 2026</span>
                      <span className="text-[10px] text-neutral-500 block font-medium">Auto-Renew Planned</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-neutral-800 text-neutral-400">
                      Upcoming
                    </Badge>
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
