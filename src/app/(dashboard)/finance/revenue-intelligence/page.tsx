import { getRevenueStreamIntelligence } from '@/actions/finance-intelligence-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/constants';
import { TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RevenueIntelligencePage() {
  const streams = await getRevenueStreamIntelligence();
  const totalRevenue = streams.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              REVENUE RADAR
            </span>
            <span className="text-xs text-neutral-500">• Multi-Stream Yield Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Revenue Stream Intelligence</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Segmented analysis across weddings, retainers, creative campaigns, studio sessions, and heirloom products
          </p>
        </div>

        <div className="flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-lg">
          <span className="text-xs text-neutral-400">Total Portfolio Yield:</span>
          <span className="text-base font-bold text-white font-mono">{formatCurrency(totalRevenue)}</span>
        </div>
      </div>

      {/* Stream Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {streams.map((stream) => (
          <Card key={stream.stream_id} className="border-neutral-800/70 bg-neutral-900/50 hover:bg-neutral-900/80 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" style={{ borderColor: `${stream.brand_color}40`, color: stream.brand_color }} className="text-xs font-semibold">
                  {stream.brand_name}
                </Badge>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Active Stream
                </span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-2">
                {stream.stream_name}
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                {stream.percentage_of_total.toFixed(1)}% of total group revenue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-neutral-950/70 p-3 rounded-lg border border-neutral-800/80">
                <p className="text-[10px] uppercase font-semibold text-neutral-500">Realized Volume</p>
                <p className="text-xl font-bold text-white font-mono mt-0.5">{formatCurrency(stream.amount)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-neutral-950/50 p-2.5 rounded border border-neutral-800/60">
                  <span className="text-neutral-500 text-[10px] uppercase block">Volume / Deliverables</span>
                  <span className="font-bold text-white text-sm mt-0.5 block">{stream.transaction_count}</span>
                </div>
                <div className="bg-neutral-950/50 p-2.5 rounded border border-neutral-800/60">
                  <span className="text-neutral-500 text-[10px] uppercase block">Avg Ticket</span>
                  <span className="font-bold text-amber-400 text-sm mt-0.5 block font-mono">
                    {formatCurrency(stream.average_ticket)}
                  </span>
                </div>
              </div>

              {/* Progress bar for share of revenue */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>Revenue Share</span>
                  <span className="font-semibold text-white">{stream.percentage_of_total.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${stream.percentage_of_total}%`, backgroundColor: stream.brand_color }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deep-Dive Comparative Table */}
      <Card className="border-neutral-800/60 bg-neutral-900/50">
        <CardHeader>
          <CardTitle className="text-base text-white font-bold flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            Stream Profitability & Concentration Matrix
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Evaluating stream resilience, average revenue per client, and group share
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent text-xs text-neutral-400">
                <TableHead>Revenue Stream</TableHead>
                <TableHead>Operating Brand</TableHead>
                <TableHead className="text-right">Total Realized</TableHead>
                <TableHead className="text-right">Share of Group</TableHead>
                <TableHead className="text-right">Deliverables / Count</TableHead>
                <TableHead className="text-right">Avg Ticket Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {streams.map((stream) => (
                <TableRow key={stream.stream_id} className="border-neutral-800/60 hover:bg-neutral-800/30 text-xs">
                  <TableCell className="font-semibold text-white">
                    {stream.stream_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] text-neutral-300">
                      {stream.brand_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-white">
                    {formatCurrency(stream.amount)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-neutral-300">
                    {stream.percentage_of_total.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right font-mono text-neutral-300">
                    {stream.transaction_count}
                  </TableCell>
                  <TableCell className="text-right font-mono text-amber-400 font-semibold">
                    {formatCurrency(stream.average_ticket)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
