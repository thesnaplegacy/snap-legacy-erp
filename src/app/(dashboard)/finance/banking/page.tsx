import { getCashAndBankBalances } from '@/actions/finance-intelligence-actions';
import { BankingView } from '@/components/finance/banking-view';

export const dynamic = 'force-dynamic';

export default async function BankingPage() {
  const accounts = await getCashAndBankBalances();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
              TREASURY & BANKING
            </span>
            <span className="text-xs text-neutral-500">• Multi-Account Cash & Bank Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Cash & Bank Accounts</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Meezan Bank, HBL, Studio Petty Cash, and Payment Gateway balances with live statement reconciliation
          </p>
        </div>
      </div>

      <BankingView initialAccounts={accounts} />
    </div>
  );
}
