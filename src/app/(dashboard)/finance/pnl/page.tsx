import { getConsolidatedProfitAndLoss } from '@/actions/finance-intelligence-actions';
import { PnLView } from '@/components/finance/pnl-view';

export const dynamic = 'force-dynamic';

export default async function ProfitAndLossPage() {
  const pnl = await getConsolidatedProfitAndLoss('2026-Q1');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
              CROSS-BRAND P&L
            </span>
            <span className="text-xs text-neutral-500">• Consolidated & Segmented Reporting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Cross-Brand Profit & Loss</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Comparative financial performance: The Snap Service, The Snap Agency, Snap Memories, and Consolidated HQ
          </p>
        </div>
      </div>

      <PnLView initialPnL={pnl} />
    </div>
  );
}
