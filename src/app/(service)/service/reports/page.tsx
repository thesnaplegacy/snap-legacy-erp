import { getServiceDashboardStats } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/constants';
import { FileBarChart, Download, Calendar, TrendingUp, Percent, Camera, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function ServiceReportsPage() {
  const stats = await getServiceDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileBarChart className="w-6 h-6 text-blue-400" />
            Performance & Operational Analytics
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Reconciled reporting across sales conversion, event margins, and production turnaround.
          </p>
        </div>
        <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-900 text-xs">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export Executive Report (PDF)
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-neutral-800 bg-neutral-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-semibold uppercase">Lead Conversion</span>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-[10px]">
              72% Win Rate
            </Badge>
          </div>
          <p className="text-2xl font-bold text-white">8 Confirmed</p>
          <p className="text-xs text-neutral-500">From 11 high-value wedding inquiries</p>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-semibold uppercase">Average Margin</span>
            <Badge variant="outline" className="border-blue-500/40 text-blue-400 bg-blue-500/10 text-[10px]">
              Target 70%+
            </Badge>
          </div>
          <p className="text-2xl font-bold text-blue-400">{stats.profit_margin}%</p>
          <p className="text-xs text-neutral-500">Net after crew, logistics, and album printing</p>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-semibold uppercase">Avg Turnaround</span>
            <Badge variant="outline" className="border-purple-500/40 text-purple-400 bg-purple-500/10 text-[10px]">
              On Schedule
            </Badge>
          </div>
          <p className="text-2xl font-bold text-white">18 Days</p>
          <p className="text-xs text-neutral-500">From shoot completion to final 4K master export</p>
        </Card>
      </div>
    </div>
  );
}
