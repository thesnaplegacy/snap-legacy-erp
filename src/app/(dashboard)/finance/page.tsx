import { getDashboardStats } from '@/actions/finance';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatCurrency } from '@/lib/constants';
import {
  DollarSign, TrendingUp, TrendingDown, Wallet, Landmark, ArrowDownLeft, ArrowUpRight, BarChart3,
} from 'lucide-react';

export default async function FinanceOverviewPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Finance Overview</h1>
        <p className="text-sm text-neutral-500 mt-1">Central financial summary across all brands</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Profit & Loss</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={formatCurrency(stats.total_revenue)} icon={TrendingUp} iconColor="text-emerald-500" />
          <StatCard title="Total Expenses" value={formatCurrency(stats.total_expenses)} icon={TrendingDown} iconColor="text-red-400" />
          <StatCard title="Gross Profit" value={formatCurrency(stats.gross_profit)} icon={DollarSign} iconColor="text-amber-500" />
          <StatCard title="Net Profit" value={formatCurrency(stats.net_profit)} icon={BarChart3} iconColor="text-amber-400" />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Balances</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Cash Balance" value={formatCurrency(stats.cash_balance)} icon={Wallet} iconColor="text-green-400" />
          <StatCard title="Bank Balance" value={formatCurrency(stats.bank_balance)} icon={Landmark} iconColor="text-blue-400" />
          <StatCard title="Receivables" value={formatCurrency(stats.receivables)} icon={ArrowDownLeft} iconColor="text-cyan-400" />
          <StatCard title="Payables" value={formatCurrency(stats.payables)} icon={ArrowUpRight} iconColor="text-orange-400" />
        </div>
      </div>
    </div>
  );
}
