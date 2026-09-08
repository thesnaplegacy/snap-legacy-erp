import { getAgencyDiscovery } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import Link from 'next/link';
import { Compass, Plus, Target, CheckCircle2, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyDiscoveryPage() {
  const records = await getAgencyDiscovery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-purple-400" />
            Discovery & Requirements Briefs
          </h1>
          <p className="text-sm text-neutral-400">
            Comprehensive creative strategy questionnaires, audience profiling, competitor benchmarks, and KPIs.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New Discovery Brief
        </Button>
      </div>

      <div className="space-y-4">
        {records.map((rec) => (
          <Card key={rec.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30 mb-1.5">
                    Brief #{rec.id.slice(-5)}
                  </Badge>
                  <CardTitle className="text-base font-bold text-white">
                    {rec.client?.name || 'Enterprise Discovery Session'}
                  </CardTitle>
                </div>
                <div className="text-xs text-neutral-400">
                  Target Budget: <span className="text-white font-semibold">{rec.budget ? formatCurrency(rec.budget) : 'Custom'}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-xs">
                <div>
                  <span className="text-neutral-500 font-medium block">Core Business Goals</span>
                  <p className="text-neutral-200 mt-1">{rec.business_goals || 'Scale brand presence and sales.'}</p>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium block">Target Demographic</span>
                  <p className="text-neutral-200 mt-1">{rec.target_audience || 'Urban demographic in major metros.'}</p>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium block">Primary Platforms</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(rec.current_platforms || ['Instagram', 'Meta Ads']).map((plat) => (
                      <Badge key={plat} variant="outline" className="text-[10px] bg-neutral-900 border-neutral-700 text-neutral-300">
                        {plat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {rec.kpis && (
                <div className="text-xs text-neutral-400">
                  <span className="font-semibold text-purple-300">Key Performance Indicators: </span>
                  {rec.kpis}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
