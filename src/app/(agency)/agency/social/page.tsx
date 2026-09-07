import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Share2, Plus, Globe, ArrowUpRight, TrendingUp, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencySocialAccountsPage() {
  const accounts = [
    {
      client: 'Biryani Pizza Co.',
      handle: '@biryanipizzapk',
      platform: 'Instagram',
      followers: '48.5K',
      growth: '+12.4%',
      status: 'Connected',
    },
    {
      client: 'GCH Retail & Apparel',
      handle: '@gchretailpk',
      platform: 'Instagram',
      followers: '124.2K',
      growth: '+8.7%',
      status: 'Connected',
    },
    {
      client: 'Linker Builders',
      handle: 'Linker Builders & Developers',
      platform: 'LinkedIn',
      followers: '15.8K',
      growth: '+24.1%',
      status: 'Connected',
    },
    {
      client: 'Biryani Pizza Co.',
      handle: '@biryanipizza_tiktok',
      platform: 'TikTok',
      followers: '89.0K',
      growth: '+35.2%',
      status: 'Connected',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-purple-400" />
            Connected Social Media Accounts
          </h1>
          <p className="text-sm text-neutral-400">
            Brand channels, audience metrics, engagement growth, and publishing permissions.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Connect New Channel
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map((acc, idx) => (
          <Card key={idx} className="border-neutral-800 bg-neutral-900/40 p-5 space-y-4 hover:border-purple-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30">
                  {acc.platform}
                </Badge>
                <h3 className="text-sm font-bold text-white mt-1">{acc.client}</h3>
                <span className="text-xs text-neutral-400">{acc.handle}</span>
              </div>
              <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                {acc.status}
              </Badge>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 block">Followers</span>
                <span className="text-base font-bold text-white">{acc.followers}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 block">30d Growth</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> {acc.growth}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
