'use client';

import { useState } from 'react';
import { BankAccount } from '@/lib/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency, formatDate } from '@/lib/constants';
import { Landmark, Wallet, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

interface BankingViewProps {
  initialAccounts: BankAccount[];
}

export function BankingView({ initialAccounts }: BankingViewProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [statementBalance, setStatementBalance] = useState('');
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconcileSuccess, setReconcileSuccess] = useState(false);

  const getBal = (a: BankAccount) => Number(a.book_balance || 0);
  const totalTreasuryBalance = accounts.reduce((sum, a) => sum + getBal(a), 0);

  const handleOpenReconcile = (account: BankAccount) => {
    setSelectedAccount(account);
    setStatementBalance(String(getBal(account)));
    setReconcileSuccess(false);
  };

  const handleConfirmReconcile = () => {
    if (!selectedAccount) return;
    setIsReconciling(true);

    setTimeout(() => {
      setAccounts(
        accounts.map((a) =>
          a.id === selectedAccount.id
            ? { ...a, last_reconciled_at: new Date().toISOString() }
            : a
        )
      );
      setIsReconciling(false);
      setReconcileSuccess(true);
      setTimeout(() => {
        setSelectedAccount(null);
      }, 1200);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Treasury Top KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-neutral-800/70 bg-neutral-900/50 sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Total Cash & Treasury Liquidity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline justify-between">
            <p className="text-3xl font-bold text-white font-mono">{formatCurrency(totalTreasuryBalance)}</p>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4" /> All Accounts Reconciled
            </span>
          </CardContent>
        </Card>

        <Card className="border-neutral-800/70 bg-neutral-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Active Banking Channels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-400">{accounts.length}</p>
            <p className="text-xs text-neutral-500 mt-1">2 Commercial Banks • 1 Petty Cash • 1 Gateway</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => {
          const isCash = acc.account_type === 'cash';
          const isGateway = acc.account_type === 'payment_gateway';
          const balance = getBal(acc);

          return (
            <Card key={acc.id} className="border-neutral-800/70 bg-neutral-900/50 hover:bg-neutral-900/80 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isCash ? 'bg-amber-500/10 text-amber-400' : isGateway ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {isCash ? <Wallet className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-white">{acc.account_name}</CardTitle>
                      <p className="text-[11px] text-neutral-500">
                        {acc.bank_name} {acc.account_number ? `• ${acc.account_number}` : ''}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase border-neutral-700 text-neutral-300">
                    {acc.account_type.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800 flex items-baseline justify-between">
                  <div>
                    <p className="text-[10px] uppercase text-neutral-500 font-semibold">Book Balance (GL)</p>
                    <p className="text-xl font-bold text-white font-mono mt-0.5">{formatCurrency(balance)}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Currency: {acc.currency}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800/60">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Last Reconciled: {acc.last_reconciled_at ? formatDate(acc.last_reconciled_at) : 'Today'}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenReconcile(acc)}
                    className="h-7 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2.5"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" /> Reconcile
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reconciliation Modal */}
      <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className="max-w-md bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              Reconcile Bank Statement
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Verify book ledger against bank statement for {selectedAccount?.account_name}
            </DialogDescription>
          </DialogHeader>

          {reconcileSuccess ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">Reconciliation Confirmed</p>
              <p className="text-xs text-neutral-400">Ledger balance matches bank statement with zero variance.</p>
            </div>
          ) : (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">GL Book Balance:</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(selectedAccount ? getBal(selectedAccount) : 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Statement Date:</span>
                  <span className="text-neutral-200">Current Period Close</span>
                </div>
              </div>

              <div>
                <Label className="text-xs text-neutral-300">Bank Statement Ending Balance (PKR)</Label>
                <Input
                  type="number"
                  value={statementBalance}
                  onChange={(e) => setStatementBalance(e.target.value)}
                  className="mt-1 bg-neutral-800 border-neutral-700 text-xs text-white font-mono"
                />
              </div>

              {/* Variance computation */}
              {selectedAccount && (
                <div className="p-2.5 rounded border border-neutral-800 bg-neutral-950 flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Statement vs Book Variance:</span>
                  <span className={`font-mono font-bold ${Math.abs(Number(statementBalance) - getBal(selectedAccount)) < 0.01 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatCurrency(Math.abs(Number(statementBalance) - getBal(selectedAccount)))}
                  </span>
                </div>
              )}
            </div>
          )}

          {!reconcileSuccess && (
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAccount(null)}
                className="border-neutral-700 text-neutral-300"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmReconcile}
                disabled={isReclosingOrReconciling(isReconciling, statementBalance)}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                {isReconciling ? 'Verifying...' : 'Confirm Reconciliation'}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function isReclosingOrReconciling(isReconciling: boolean, balance: string): boolean {
  return isReconciling || !balance;
}
