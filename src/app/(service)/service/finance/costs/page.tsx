import { getServiceFinanceOverview } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import { Receipt, Plus, Tag, UserCheck, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ServiceCostsPage() {
  const finance = await getServiceFinanceOverview();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-blue-400" />
            Event Cost Structure
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Categorized shoot expenses including freelance crew fees, van fuel, hotel accommodation, and album lab printing.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Log Event Cost
        </Button>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/60 overflow-hidden">
        <CardHeader className="p-5 border-b border-neutral-800 bg-neutral-900/90">
          <CardTitle className="text-base font-bold text-white">Itemized Production Costs</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Expenses tied directly to wedding functions that reduce net gross margins
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Expense Description</th>
                <th className="p-3.5">Vendor / Payee</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40 text-neutral-300">
              {finance.costs.map((cost) => (
                <tr key={cost.id} className="hover:bg-neutral-900/40">
                  <td className="p-3.5">
                    <Badge variant="outline" className="text-[10px] capitalize border-blue-500/30 text-blue-300 bg-blue-500/10">
                      {cost.category.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-medium text-white">{cost.description}</td>
                  <td className="p-3.5 text-neutral-400">{cost.vendor_name || 'Direct / Internal'}</td>
                  <td className="p-3.5 text-right font-bold text-red-400">{formatCurrency(cost.amount)}</td>
                  <td className="p-3.5 text-center">
                    <Badge
                      variant="outline"
                      className={`text-[10px] capitalize ${
                        cost.payment_status === 'paid'
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                          : 'border-amber-500/40 text-amber-300 bg-amber-500/10'
                      }`}
                    >
                      {cost.payment_status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
