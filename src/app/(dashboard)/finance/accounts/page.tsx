import { getAccounts } from '@/actions/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Landmark } from 'lucide-react';
import { formatCurrency, STATUS_LABELS, STATUS_VARIANTS } from '@/lib/constants';

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Accounts</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage financial accounts — cash, bank, receivables, payables</p>
      </div>

      {accounts.length === 0 ? (
        <Card className="border-neutral-800/50 bg-neutral-900/50">
          <CardContent className="p-12 text-center">
            <Landmark className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500">No data available</p>
            <p className="text-xs text-neutral-600 mt-1">Create your first financial account</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="border-neutral-800/50 bg-neutral-900/50 hover:bg-neutral-900/80 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white">{account.name}</CardTitle>
                  <Badge variant={STATUS_VARIANTS[account.status] || 'outline'} className="text-xs">
                    {STATUS_LABELS[account.status] || account.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] capitalize">{account.type.replace('_', ' ')}</Badge>
                  {account.brand && (
                    <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: `${account.brand.color}20`, color: account.brand.color }}>
                      {account.brand.name}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500">Balance</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(Number(account.balance), account.currency)}</p>
                  </div>
                  {account.bank_name && (
                    <p className="text-xs text-neutral-500">{account.bank_name} {account.account_number ? `• ${account.account_number}` : ''}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
