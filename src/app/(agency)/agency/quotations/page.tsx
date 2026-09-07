import { getAgencyQuotations } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import Link from 'next/link';
import { FileSpreadsheet, Plus, CheckCircle2, Clock, Lock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyQuotationsPage() {
  const quotations = await getAgencyQuotations();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-purple-400" />
            Agency Quotations & Snapshot Engine
          </h1>
          <p className="text-sm text-neutral-400">
            Historical price snapshotting locks catalog rates at proposal creation time. Old quotes never drift.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Create Quotation
        </Button>
      </div>

      <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center gap-2.5 text-xs text-purple-300">
        <Lock className="w-4 h-4 text-purple-400 shrink-0" />
        <span>
          <strong>Snapshot Pricing Active:</strong> All quotations permanently preserve the unit rate, discount, and package value at the timestamp of creation.
        </span>
      </div>

      <div className="space-y-3">
        {quotations.map((q) => (
          <Card key={q.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{q.quotation_number || `TSA-Q-${q.id.slice(0, 6)}`}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      q.status === 'accepted'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {q.status}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-400">
                  Client: <span className="text-neutral-200 font-medium">{q.client?.name || 'Enterprise Client'}</span> • Created {formatDate(q.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">Total Contract Snapshot</span>
                  <span className="text-base font-bold text-white">{formatCurrency(q.total_amount)}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/agency/proposals" />}
                  className="h-8 text-xs border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200"
                >
                  View Proposal <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
