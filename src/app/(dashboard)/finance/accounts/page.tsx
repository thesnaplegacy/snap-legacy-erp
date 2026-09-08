import { getCentralChartOfAccounts } from '@/actions/finance-intelligence-actions';
import { AccountsView } from '@/components/finance/accounts-view';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
  const accounts = await getCentralChartOfAccounts();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
              CHART OF ACCOUNTS
            </span>
            <span className="text-xs text-neutral-500">• 1000 to 7000 Standard Structure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Chart of Accounts</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Standardized financial accounting classification governing all 3 brands and central treasury
          </p>
        </div>
      </div>

      <AccountsView initialAccounts={accounts} />
    </div>
  );
}
