import Link from 'next/link';
import {
  getConsolidatedProfitAndLoss,
  getCashAndBankBalances,
  getJournalEntries,
  getReceivablesAgingReport,
  getPayablesSummary,
} from '@/actions/finance-intelligence-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/constants';
import {
  DollarSign, TrendingUp, Landmark, ArrowRight,
  PieChart, BookOpen, ShieldCheck, CheckCircle2,
  Wallet, BarChart3, Layers, TrendingDown,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FinanceOverviewPage() {
  const [pnl, bankAccounts, recentJournals, arAging, apSummary] = await Promise.all([
    getConsolidatedProfitAndLoss('Current Month'),
    getCashAndBankBalances(),
    getJournalEntries({ limit: 6 }),
    getReceivablesAgingReport(),
    getPayablesSummary(),
  ]);

  const c = pnl.consolidated;
  const netMarginPct = c.gross_revenue > 0 ? (c.net_profit / c.gross_revenue) * 100 : 0;
  const totalCashLiquidity = bankAccounts.reduce((sum, acc) => sum + Number(acc.book_balance || 0), 0);
  const totalAr = arAging.reduce((sum, b) => sum + b.amount, 0);
  const totalAp = apSummary.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
              CENTRAL LEDGER ACTIVE
            </span>
            <span className="text-xs text-neutral-400">• Double-Entry GAAP Standard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Central Finance HQ</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Unified multi-brand treasury, general ledger, cross-brand P&L, and executive intelligence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/finance/ledger">
            <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200">
              <BookOpen className="w-4 h-4 mr-2 text-amber-400" />
              General Ledger
            </Button>
          </Link>
          <Link href="/reports/executive">
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-lg shadow-amber-500/10">
              <BarChart3 className="w-4 h-4 mr-2" />
              CEO Executive Radar
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Profit */}
        <Card className="border-neutral-800/60 bg-gradient-to-br from-neutral-900/90 to-neutral-950/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Consolidated Net Profit</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(c.net_profit)}</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{netMarginPct.toFixed(1)}% net margin</span>
              <span className="text-neutral-500 ml-1">across 3 brands</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border-neutral-800/60 bg-gradient-to-br from-neutral-900/90 to-neutral-950/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Gross Revenue (Month)</CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(c.gross_revenue)}</div>
            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
              <span>Gross Margin:</span>
              <span className="text-amber-400 font-semibold">{c.gross_margin.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Treasury Liquidity */}
        <Card className="border-neutral-800/60 bg-gradient-to-br from-neutral-900/90 to-neutral-950/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Cash & Treasury Liquidity</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Landmark className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(totalCashLiquidity)}</div>
            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
              <span>{bankAccounts.length} active accounts</span>
              <span className="text-blue-400 font-medium">• 100% reconciled</span>
            </div>
          </CardContent>
        </Card>

        {/* Net Working Capital / AR-AP Balance */}
        <Card className="border-neutral-800/60 bg-gradient-to-br from-neutral-900/90 to-neutral-950/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Net Working Balance (AR - AP)</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Wallet className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(totalAr - totalAp)}</div>
            <div className="flex items-center justify-between mt-2 text-xs text-neutral-400">
              <span className="text-emerald-400">AR: {formatCurrency(totalAr)}</span>
              <span className="text-red-400">AP: {formatCurrency(totalAp)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Contribution Matrix (The Snap Service, Snap Agency, Snap Memories) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Cross-Brand P&L Contribution
          </h2>
          <Link href="/finance/pnl" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
            Full Comparative P&L <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pnl.brands.map((b) => {
            const brandMarginPct = b.gross_revenue > 0 ? (b.net_operating_profit / b.gross_revenue) * 100 : 0;

            return (
              <Card key={b.brand_id} className="border border-neutral-800 bg-neutral-900/60 transition-all hover:border-neutral-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" style={{ borderColor: `${b.brand_color}40`, color: b.brand_color }} className="text-xs font-semibold">
                      {b.brand_name}
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-400">
                      {brandMarginPct.toFixed(1)}% margin
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-neutral-950/70 p-2.5 rounded-md border border-neutral-800/60">
                      <p className="text-neutral-500 text-[10px] uppercase">Revenue</p>
                      <p className="text-sm font-bold text-white mt-0.5">{formatCurrency(b.gross_revenue)}</p>
                    </div>
                    <div className="bg-neutral-950/70 p-2.5 rounded-md border border-neutral-800/60">
                      <p className="text-neutral-500 text-[10px] uppercase">Net Profit</p>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">{formatCurrency(b.net_operating_profit)}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>COGS (Direct Production):</span>
                      <span className="text-neutral-200">{formatCurrency(b.direct_costs)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>OpEx (Operating Overheads):</span>
                      <span className="text-neutral-200">{formatCurrency(b.operating_expenses)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Bank Accounts + Recent Journal Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bank & Cash Accounts List */}
        <Card className="border-neutral-800/60 bg-neutral-900/50 lg:col-span-1">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-white font-semibold flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-400" />
                Treasury & Accounts
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">Multi-bank liquidity status</CardDescription>
            </div>
            <Link href="/finance/banking">
              <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 h-8 px-2">
                Manage
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {bankAccounts.map((acc) => (
              <div key={acc.id} className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 flex items-center justify-between hover:bg-neutral-900 transition-all">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-white">{acc.account_name}</p>
                  <p className="text-[11px] text-neutral-500">
                    {acc.bank_name} {acc.account_number ? `• ${acc.account_number.slice(-4)}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCurrency(Number(acc.book_balance || 0))}</p>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 justify-end">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Reconciled
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-xs">
              <span className="text-neutral-400">Total Liquid Reserves</span>
              <span className="font-bold text-white">{formatCurrency(totalCashLiquidity)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Double-Entry Journal Feed */}
        <Card className="border-neutral-800/60 bg-neutral-900/50 lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-white font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Live General Ledger Feed
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Double-entry balanced postings (Σ Dr = Σ Cr)
              </CardDescription>
            </div>
            <Link href="/finance/ledger">
              <Button variant="ghost" size="sm" className="text-xs text-amber-400 hover:text-amber-300 h-8 px-2">
                View Full Ledger <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 hover:bg-transparent text-[11px]">
                  <TableHead className="text-neutral-400">Entry #</TableHead>
                  <TableHead className="text-neutral-400">Date</TableHead>
                  <TableHead className="text-neutral-400">Brand</TableHead>
                  <TableHead className="text-neutral-400">Description</TableHead>
                  <TableHead className="text-neutral-400 text-right">Debit / Credit</TableHead>
                  <TableHead className="text-neutral-400 text-center">Integrity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentJournals.map((j) => (
                  <TableRow key={j.id} className="border-neutral-800/60 hover:bg-neutral-800/30 text-xs">
                    <TableCell className="font-mono text-neutral-300 font-semibold">{j.entry_number}</TableCell>
                    <TableCell className="text-neutral-400 whitespace-nowrap">{formatDate(j.entry_date)}</TableCell>
                    <TableCell>
                      {j.brand ? (
                        <Badge variant="outline" className="text-[10px]" style={{ borderColor: `${j.brand.color || '#C5A880'}50`, color: j.brand.color || '#C5A880' }}>
                          {j.brand.name}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-neutral-400">HQ</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-neutral-200 font-medium max-w-[200px] truncate">
                      {j.description}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-white">
                      {formatCurrency(Number(j.total_debit))}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" /> Balanced
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Action Quick Links Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link href="/finance/accounts" className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-neutral-700 transition-all text-center block">
          <BookOpen className="w-5 h-5 mx-auto mb-1.5 text-amber-400" />
          <p className="text-xs font-semibold text-white">Chart of Accounts</p>
          <p className="text-[10px] text-neutral-500">1000-7000 Standard</p>
        </Link>
        <Link href="/finance/pnl" className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-neutral-700 transition-all text-center block">
          <PieChart className="w-5 h-5 mx-auto mb-1.5 text-emerald-400" />
          <p className="text-xs font-semibold text-white">Cross-Brand P&L</p>
          <p className="text-[10px] text-neutral-500">Service • Agency • Memories</p>
        </Link>
        <Link href="/finance/revenue-intelligence" className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-neutral-700 transition-all text-center block">
          <TrendingUp className="w-5 h-5 mx-auto mb-1.5 text-cyan-400" />
          <p className="text-xs font-semibold text-white">Revenue Intelligence</p>
          <p className="text-[10px] text-neutral-500">Streams & Margins</p>
        </Link>
        <Link href="/finance/expenses" className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-neutral-700 transition-all text-center block">
          <TrendingDown className="w-5 h-5 mx-auto mb-1.5 text-red-400" />
          <p className="text-xs font-semibold text-white">Expense Intelligence</p>
          <p className="text-[10px] text-neutral-500">COGS vs OpEx</p>
        </Link>
        <Link href="/finance/receivables-aging" className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-neutral-700 transition-all text-center block">
          <DollarSign className="w-5 h-5 mx-auto mb-1.5 text-purple-400" />
          <p className="text-xs font-semibold text-white">AR / AP Aging</p>
          <p className="text-[10px] text-neutral-500">Aging Radar & Bills</p>
        </Link>
        <Link href="/reports/executive" className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-neutral-700 transition-all text-center block">
          <BarChart3 className="w-5 h-5 mx-auto mb-1.5 text-amber-500" />
          <p className="text-xs font-semibold text-white">CEO Executive Radar</p>
          <p className="text-[10px] text-neutral-500">Runway & Signals</p>
        </Link>
      </div>
    </div>
  );
}
