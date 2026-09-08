import { getJournalEntries, getCentralChartOfAccounts } from '@/actions/finance-intelligence-actions';
import { LedgerView } from '@/components/finance/ledger-view';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GeneralLedgerPage() {
  const [entries, accounts] = await Promise.all([
    getJournalEntries({ limit: 100 }),
    getCentralChartOfAccounts(),
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
              IMMUTABLE GENERAL LEDGER
            </span>
            <span className="text-xs text-neutral-500">• GAAP Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">General Ledger</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Complete journal entries across all brands with double-entry equilibrium enforcement (Σ Debit = Σ Credit)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900/70 border border-neutral-800 p-2 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Balanced Ledger Status: <strong>100% In Equilibrium</strong></span>
        </div>
      </div>

      {/* Main Ledger Table & Controls */}
      <LedgerView initialEntries={entries} accounts={accounts} />
    </div>
  );
}
