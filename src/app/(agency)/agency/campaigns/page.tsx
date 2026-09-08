import { getAgencyCampaigns } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import Link from 'next/link';
import { Megaphone, Plus, TrendingUp, BarChart3, Globe } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyCampaignsPage() {
  const campaigns = await getAgencyCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-purple-400" />
            Ad Campaigns & Growth Funnels
          </h1>
          <p className="text-sm text-neutral-400">
            Performance ad management across Meta Ads, Google PPC, TikTok, and cross-channel promotions.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Launch Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {campaigns.map((camp) => (
          <Card key={camp.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30">
                      {camp.campaign_type}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] bg-neutral-800 text-neutral-300">
                      {camp.platform}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-white">{camp.name}</CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    camp.status === 'Live'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {camp.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              {camp.objective && (
                <p className="text-xs text-neutral-300 bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80">
                  <strong className="text-purple-300">Target Objective: </strong>
                  {camp.objective}
                </p>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Ad Spend: {formatCurrency(camp.spend)}</span>
                  <span className="font-semibold text-white">Total Budget: {formatCurrency(camp.budget)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, (camp.spend / camp.budget) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Timeline: {camp.start_date || 'Ongoing'} — {camp.end_date || 'Continuous'}</span>
                <span className="text-emerald-400 font-semibold">Estimated ROAS: 4.2x</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
