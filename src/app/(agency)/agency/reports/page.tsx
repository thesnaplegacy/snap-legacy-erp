import { getAgencyReports } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import Link from 'next/link';
import { FileBarChart, Download, TrendingUp, Users, Target, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyReportsPage() {
  const reports = await getAgencyReports();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-purple-400" />
            Agency Reports & Executive Analytics
          </h1>
          <p className="text-sm text-neutral-400">
            Monthly gross performance, retainer renewal health, and campaign ROI.
          </p>
        </div>

        <Button variant="outline" className="h-8 text-xs border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200">
          <Download className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
          Export Executive PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-neutral-800 bg-neutral-900/40">
          <CardHeader className="p-5 border-b border-neutral-800">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" /> Monthly Growth Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {reports.monthlyPerformance.map((m, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{m.month}</span>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-400">Rev: {formatCurrency(m.revenue)}</span>
                  <span className="text-rose-400">Cost: -{formatCurrency(m.costs)}</span>
                  <span className="text-emerald-400 font-bold">+{formatCurrency(m.profit)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/40">
          <CardHeader className="p-5 border-b border-neutral-800">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" /> Sales Funnel & Deal Velocity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300">Lead to Proposal Conversion</span>
              <span className="text-white font-bold">62.5%</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300">Proposal to Contract Win Rate</span>
              <span className="text-emerald-400 font-bold">78.0%</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300">Average Client Retainer Value</span>
              <span className="text-purple-300 font-bold">PKR 95,000 / mo</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-300">Retainer Churn Rate</span>
              <span className="text-emerald-400 font-bold">0.0% (Zero churn in 2026)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
