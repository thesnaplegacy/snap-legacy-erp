import { getReceivablesAgingReport, getPayablesSummary } from '@/actions/finance-intelligence-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/constants';
import {
  ArrowDownLeft, ArrowUpRight, User,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ReceivablesAgingPage() {
  const [arBuckets, apBills] = await Promise.all([
    getReceivablesAgingReport(),
    getPayablesSummary(),
  ]);

  const totalAr = arBuckets.reduce((sum, b) => sum + b.amount, 0);
  const totalAp = apBills.reduce((sum, b) => sum + b.amount, 0);
  const netWorkingCapital = totalAr - totalAp;

  const allInvoices = arBuckets.flatMap((b) => b.items);

  const bucketCurrent = arBuckets.find((b) => b.bucket_name.includes('0-30')) || { amount: 0, count: 0 };
  const bucket30 = arBuckets.find((b) => b.bucket_name.includes('31-60')) || { amount: 0, count: 0 };
  const bucket60 = arBuckets.find((b) => b.bucket_name.includes('61-90')) || { amount: 0, count: 0 };
  const bucket90 = arBuckets.find((b) => b.bucket_name.includes('90+')) || { amount: 0, count: 0 };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-purple-500/10 text-purple-400 border border-purple-500/20">
              WORKING CAPITAL RADAR
            </span>
            <span className="text-xs text-neutral-500">• Liquidity & Credit Risk Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Receivables & Payables Aging</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time aging buckets (0–30d, 31–60d, 61–90d, 90+d) and vendor payables tracking
          </p>
        </div>

        <div className="flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-lg">
          <span className="text-xs text-neutral-400">Net Working Capital:</span>
          <span className="text-base font-bold text-white font-mono">{formatCurrency(netWorkingCapital)}</span>
        </div>
      </div>

      {/* AR Aging 4-Bucket Grid */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ArrowDownLeft className="w-4 h-4 text-purple-400" />
          Accounts Receivable (AR) Aging Buckets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Bucket 1: 0 - 30 Days */}
          <Card className="border-neutral-800/70 bg-neutral-900/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">0 – 30 Days (Current)</CardTitle>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Healthy
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-400 font-mono">
                {formatCurrency(bucketCurrent.amount)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {totalAr > 0 ? ((bucketCurrent.amount / totalAr) * 100).toFixed(1) : 0}% of total AR ({bucketCurrent.count} items)
              </p>
            </CardContent>
          </Card>

          {/* Bucket 2: 31 - 60 Days */}
          <Card className="border-neutral-800/70 bg-neutral-900/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">31 – 60 Days</CardTitle>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Follow-up
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-400 font-mono">
                {formatCurrency(bucket30.amount)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {totalAr > 0 ? ((bucket30.amount / totalAr) * 100).toFixed(1) : 0}% of total AR ({bucket30.count} items)
              </p>
            </CardContent>
          </Card>

          {/* Bucket 3: 61 - 90 Days */}
          <Card className="border-neutral-800/70 bg-neutral-900/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">61 – 90 Days</CardTitle>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Escalated
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-400 font-mono">
                {formatCurrency(bucket60.amount)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {totalAr > 0 ? ((bucket60.amount / totalAr) * 100).toFixed(1) : 0}% of total AR ({bucket60.count} items)
              </p>
            </CardContent>
          </Card>

          {/* Bucket 4: 90+ Days */}
          <Card className="border-neutral-800/70 bg-neutral-900/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">90+ Days (Overdue)</CardTitle>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                  Critical
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-400 font-mono">
                {formatCurrency(bucket90.amount)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {totalAr > 0 ? ((bucket90.amount / totalAr) * 100).toFixed(1) : 0}% of total AR ({bucket90.count} items)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overdue Client Invoices Detail Table */}
      <Card className="border-neutral-800/60 bg-neutral-900/50">
        <CardHeader>
          <CardTitle className="text-base text-white font-bold flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" />
            Active Receivables Portfolio by Client
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Detailed invoice-level credit exposure across brands
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent text-xs text-neutral-400">
                <TableHead>Client Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Deliverable / Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead className="text-right">Outstanding Balance</TableHead>
                <TableHead className="text-center">Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allInvoices.map((inv, idx) => (
                <TableRow key={idx} className="border-neutral-800/60 hover:bg-neutral-800/30 text-xs">
                  <TableCell className="font-medium text-white">{inv.client_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] text-neutral-300">
                      {inv.brand_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-300">{inv.invoice_or_session}</TableCell>
                  <TableCell className="text-neutral-400">{formatDate(inv.date)}</TableCell>
                  <TableCell className="font-mono text-neutral-300">
                    {inv.days_overdue > 0 ? (
                      <span className={inv.days_overdue > 60 ? 'text-red-400 font-bold' : inv.days_overdue > 30 ? 'text-amber-400' : 'text-blue-400'}>
                        {inv.days_overdue} days
                      </span>
                    ) : (
                      <span className="text-emerald-400">On Time</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-white">
                    {formatCurrency(inv.balance_due)}
                  </TableCell>
                  <TableCell className="text-center">
                    {inv.days_overdue > 60 ? (
                      <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-400 bg-red-500/10">
                        High Risk
                      </Badge>
                    ) : inv.days_overdue > 30 ? (
                      <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/10">
                        Moderate
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                        Low Risk
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AP Payables Ledger Section */}
      <Card className="border-neutral-800/60 bg-neutral-900/50">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base text-white font-bold flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-orange-400" />
              Accounts Payable (AP) Vendor Bills
            </CardTitle>
            <CardDescription className="text-xs text-neutral-400">
              Pending supplier liabilities, lab printing bills, and studio rent obligations
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-400">Total AP: </span>
            <span className="font-mono font-bold text-orange-400 text-sm">
              {formatCurrency(totalAp)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent text-xs text-neutral-400">
                <TableHead>Bill #</TableHead>
                <TableHead>Vendor / Supplier</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apBills.map((bill) => (
                <TableRow key={bill.id} className="border-neutral-800/60 hover:bg-neutral-800/30 text-xs">
                  <TableCell className="font-mono font-semibold text-neutral-300">{bill.bill_number || '—'}</TableCell>
                  <TableCell className="font-medium text-white">{bill.vendor_name}</TableCell>
                  <TableCell className="text-neutral-400 capitalize">{bill.vendor_category.replace('_', ' ')}</TableCell>
                  <TableCell className="text-neutral-400">{formatDate(bill.due_date)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-orange-500/30 text-orange-400 bg-orange-500/10 uppercase">
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-white">
                    {formatCurrency(bill.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
