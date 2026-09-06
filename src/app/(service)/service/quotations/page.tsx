import { getServiceQuotations } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import {
  FileSpreadsheet,
  Plus,
  Lock,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function QuotationsPage() {
  const quotations = await getServiceQuotations();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-blue-400" />
            Quotations & Historical Pricing
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Service proposals with guaranteed historical pricing snapshots — locked at creation time.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Quotation
        </Button>
      </div>

      {/* Pricing Snapshot Notice */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-2.5 text-xs text-blue-300">
        <Lock className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          <strong>Historical Pricing Guarantee:</strong> Even if library rates or package prices are updated in the future, all issued quotations preserve their original contracted line-item rates.
        </span>
      </div>

      <div className="space-y-4">
        {quotations.map((quote: any) => (
          <Card key={quote.id} className="border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <CardHeader className="p-5 border-b border-neutral-800 bg-neutral-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {quote.quotation_number}
                  </span>
                  <CardTitle className="text-base font-bold text-white">{quote.project_name}</CardTitle>
                </div>
                <CardDescription className="text-xs text-neutral-400">
                  Client: <span className="text-neutral-200 font-semibold">{quote.client_name}</span> • Created: {formatDate(quote.created_at)} • Valid Until: {formatDate(quote.valid_until)}
                </CardDescription>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Total Contract</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(quote.total_amount)}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`capitalize text-xs ${
                    quote.status === 'accepted'
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                      : 'border-blue-500/40 text-blue-400 bg-blue-500/10'
                  }`}
                >
                  {quote.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-3">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Snapshot Line Items ({quote.items?.length || 0})
              </p>

              <div className="rounded-xl border border-neutral-800/80 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="p-3">Service / Coverage</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Discount</th>
                      <th className="p-3 text-right">Total (Locked)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40 text-neutral-300">
                    {(quote.items || []).map((item: any) => (
                      <tr key={item.id} className="hover:bg-neutral-900/40">
                        <td className="p-3 font-medium text-white">{item.service_name}</td>
                        <td className="p-3 text-right text-neutral-400">{formatCurrency(item.unit_price)}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right text-neutral-500">
                          {item.discount_amount > 0 ? `-${formatCurrency(item.discount_amount)}` : '—'}
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-400">
                          {formatCurrency(item.total_price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
