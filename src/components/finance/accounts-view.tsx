'use client';

import { useState } from 'react';
import { ChartOfAccount } from '@/lib/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/constants';
import { Search, ShieldCheck } from 'lucide-react';

interface AccountsViewProps {
  initialAccounts: ChartOfAccount[];
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  asset: { label: 'Asset (1000)', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  liability: { label: 'Liability (2000)', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  equity: { label: 'Equity (3000)', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  revenue: { label: 'Revenue (4000)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  cogs: { label: 'COGS (5000)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  expense: { label: 'OpEx (6000)', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  other_income: { label: 'Other Inc (7000)', color: 'text-neutral-400', bg: 'bg-neutral-500/10 border-neutral-500/20' },
  other_expense: { label: 'Other Exp (7000)', color: 'text-neutral-400', bg: 'bg-neutral-500/10 border-neutral-500/20' },
};

export function AccountsView({ initialAccounts }: AccountsViewProps) {
  const [accounts] = useState<ChartOfAccount[]>(initialAccounts);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.account_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.description && acc.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || acc.account_type === selectedType;

    return matchesSearch && matchesType;
  });

  // Calculate totals by account type
  const totalAssets = accounts
    .filter((a) => a.account_type === 'asset')
    .reduce((sum, a) => sum + Number(a.current_balance || 0), 0);

  const totalLiabilities = accounts
    .filter((a) => a.account_type === 'liability')
    .reduce((sum, a) => sum + Number(a.current_balance || 0), 0);

  const totalEquity = accounts
    .filter((a) => a.account_type === 'equity')
    .reduce((sum, a) => sum + Number(a.current_balance || 0), 0);

  const totalRevenue = accounts
    .filter((a) => a.account_type === 'revenue')
    .reduce((sum, a) => sum + Number(a.current_balance || 0), 0);

  return (
    <div className="space-y-6">
      {/* Category Totals Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg border border-blue-500/20 bg-blue-950/20">
          <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">1000 • Total Assets</p>
          <p className="text-xl font-bold text-white mt-1">{formatCurrency(totalAssets)}</p>
        </div>
        <div className="p-3.5 rounded-lg border border-purple-500/20 bg-purple-950/20">
          <p className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">2000 • Total Liabilities</p>
          <p className="text-xl font-bold text-white mt-1">{formatCurrency(totalLiabilities)}</p>
        </div>
        <div className="p-3.5 rounded-lg border border-indigo-500/20 bg-indigo-950/20">
          <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">3000 • Total Equity</p>
          <p className="text-xl font-bold text-white mt-1">{formatCurrency(totalEquity)}</p>
        </div>
        <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20">
          <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">4000 • Total Revenue</p>
          <p className="text-xl font-bold text-white mt-1">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search accounts by code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-neutral-900/60 border-neutral-800 text-sm text-white focus-visible:ring-amber-500/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'asset', 'liability', 'equity', 'revenue', 'cogs', 'expense'].map((t) => (
            <Button
              key={t}
              variant={selectedType === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(t)}
              className={`h-8 text-xs capitalize ${
                selectedType === t
                  ? 'bg-amber-500 text-black font-semibold hover:bg-amber-600'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
              }`}
            >
              {t === 'all' ? `All (${accounts.length})` : t}
            </Button>
          ))}
        </div>
      </div>

      {/* Accounts Table */}
      <Card className="border-neutral-800/60 bg-neutral-900/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent text-xs text-neutral-400">
                <TableHead className="w-24">Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Normal Balance</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Current Balance</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-neutral-500 text-sm">
                    No accounts found matching search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccounts.map((account) => {
                  const typeConf = TYPE_CONFIG[account.account_type] || { label: account.account_type, color: 'text-neutral-400', bg: 'bg-neutral-800' };

                  return (
                    <TableRow
                      key={account.id}
                      className="border-neutral-800/60 hover:bg-neutral-800/30 transition-colors text-xs"
                    >
                      <TableCell className="font-mono font-bold text-amber-400">
                        {account.account_code}
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        <div>
                          <span>{account.account_name}</span>
                          {account.description && (
                            <p className="text-[11px] text-neutral-500 font-normal">{account.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${typeConf.bg} ${typeConf.color}`}>
                          {typeConf.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-neutral-400 uppercase">
                          {account.normal_balance}
                        </span>
                      </TableCell>
                      <TableCell className="text-neutral-400">
                        {account.currency}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-white">
                        {formatCurrency(Number(account.current_balance || 0))}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" /> Active
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
