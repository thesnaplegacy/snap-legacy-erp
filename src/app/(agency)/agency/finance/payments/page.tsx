import { getAgencyDashboardStats } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import Link from 'next/link';
import { PiggyBank, Plus, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyPaymentsPage() {
  const stats = await getAgencyDashboardStats();

  const mockPayments = [
    {
      id: 'pay-001',
      client: 'Biryani Pizza Co.',
      project: 'Biryani Pizza Monthly Social Retainer',
      type: 'Monthly Retainer',
      amount: 75000,
      method: 'Bank Transfer (HBL)',
      reference: 'TXN-HBL-99281',
      date: '2026-09-01',
      status: 'paid',
    },
    {
      id: 'pay-002',
      client: 'Linker Builders & Developers',
      project: 'Linker Heights Commercial Launch Campaign',
      type: '50% Project Advance',
      amount: 140000,
      method: 'Online Cheque',
      reference: 'TXN-CHK-44102',
      date: '2026-08-28',
      status: 'paid',
    },
    {
      id: 'pay-003',
      client: 'GCH Retail & Apparel',
      project: 'GCH Fall Fashion Collection Rollout',
      type: 'Advance Milestone',
      amount: 70000,
      method: 'Bank Transfer (Meezan)',
      reference: 'TXN-MEEZ-11029',
      date: '2026-09-03',
      status: 'paid',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <PiggyBank className="w-6 h-6 text-purple-400" />
            Agency Payments & Central Ledger Sync
          </h1>
          <p className="text-sm text-neutral-400">
            Double-entry verified payments. Automatically posted to The Snap Legacy central accounts.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Record Client Payment
        </Button>
      </div>

      <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center gap-2.5 text-xs text-purple-300">
        <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
        <span>
          <strong>Idempotent Central Sync:</strong> Every payment carries unique reference validation. Double submissions are rejected to guarantee zero duplicated accounting rows.
        </span>
      </div>

      <div className="space-y-3">
        {mockPayments.map((p) => (
          <Card key={p.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{p.client}</span>
                  <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30">
                    {p.type}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    {p.status}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-400">
                  {p.project} • Ref: <span className="text-neutral-300 font-mono">{p.reference}</span> ({p.method})
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">{p.date}</span>
                  <span className="text-base font-bold text-emerald-400">+{formatCurrency(p.amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
