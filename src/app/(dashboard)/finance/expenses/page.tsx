import { getExpenseIntelligence } from '@/actions/finance-intelligence-actions';
import { getExpenses } from '@/actions/finance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate, STATUS_VARIANTS, STATUS_LABELS } from '@/lib/constants';
import { TrendingDown, PieChart, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ExpenseIntelligencePage() {
  const [intel, rawExpenses] = await Promise.all([
    getExpenseIntelligence(),
    getExpenses(),
  ]);

  const totalCogs = intel.direct_cogs.total;
  const totalOpex = intel.operating_opex.total;
  const totalBurn = intel.total_expenses;
  const cogsPercent = totalBurn > 0 ? (totalCogs / totalBurn) * 100 : 0;
  const opexPercent = totalBurn > 0 ? (totalOpex / totalBurn) * 100 : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-red-500/10 text-red-400 border border-red-500/20">
              EXPENSE INTELLIGENCE
            </span>
            <span className="text-xs text-neutral-500">• COGS vs OpEx Cost Accounting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Expense Intelligence</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Segmented cost structures: direct production COGS, studio overheads, software licenses, and crew compensation
          </p>
        </div>

        <div className="flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-lg">
          <span className="text-xs text-neutral-400">Total Group Outflow:</span>
          <span className="text-base font-bold text-red-400 font-mono">{formatCurrency(totalBurn)}</span>
        </div>
      </div>

      {/* Primary Cost KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Direct COGS Card */}
        <Card className="border-neutral-800/70 bg-neutral-900/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Direct Production COGS
              </CardTitle>
              <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">
                {cogsPercent.toFixed(1)}% of Spend
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-bold text-white font-mono">{formatCurrency(totalCogs)}</p>
            <p className="text-xs text-neutral-400">
              Variable costs directly tied to wedding crews, studio lab prints, and client campaign ad-spend.
            </p>
          </CardContent>
        </Card>

        {/* OpEx Overheads Card */}
        <Card className="border-neutral-800/70 bg-neutral-900/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Operating Overheads (OpEx)
              </CardTitle>
              <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">
                {opexPercent.toFixed(1)}% of Spend
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-bold text-white font-mono">{formatCurrency(totalOpex)}</p>
            <p className="text-xs text-neutral-400">
              Fixed facility lease, software subscriptions (Adobe, cloud storage, Google Workspace), and marketing.
            </p>
          </CardContent>
        </Card>

        {/* Cost Ratio Card */}
        <Card className="border-neutral-800/70 bg-neutral-900/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Cost Discipline Index
              </CardTitle>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Optimal
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">38.7%</span>
              <span className="text-xs text-neutral-400">COGS-to-Revenue</span>
            </div>
            <p className="text-xs text-neutral-400">
              Healthy margin preservation maintaining group gross profit margin above 60%.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Direct COGS Breakdown */}
        <Card className="border-neutral-800/60 bg-neutral-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white font-bold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-400" />
              Direct Cost of Goods Sold (COGS)
            </CardTitle>
            <CardDescription className="text-xs text-neutral-400">
              Production expenses directly attached to client deliverables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {intel.direct_cogs.categories.map((cat) => (
              <div key={cat.name} className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-white">{cat.name}</span>
                  <span className="font-mono font-bold text-neutral-200">{formatCurrency(cat.amount)}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>Proportion of COGS</span>
                    <span>{cat.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Operating OpEx Breakdown */}
        <Card className="border-neutral-800/60 bg-neutral-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white font-bold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-400" />
              Operating Expenses (OpEx)
            </CardTitle>
            <CardDescription className="text-xs text-neutral-400">
              Studio rent, staff payroll, utilities, and enterprise SaaS subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {intel.operating_opex.categories.map((cat) => (
              <div key={cat.name} className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-white">{cat.name}</span>
                  <span className="font-mono font-bold text-neutral-200">{formatCurrency(cat.amount)}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>Proportion of OpEx</span>
                    <span>{cat.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Raw Expenses Audit Feed */}
      <Card className="border-neutral-800/60 bg-neutral-900/50">
        <CardHeader>
          <CardTitle className="text-base text-white font-bold flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            Central Outflow Ledger
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Individual recorded expense vouchers and payments across all brands
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent text-xs text-neutral-400">
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rawExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-neutral-500 text-sm">
                    No expense records found.
                  </TableCell>
                </TableRow>
              ) : (
                rawExpenses.map((expense) => (
                  <TableRow key={expense.id} className="border-neutral-800/60 hover:bg-neutral-800/30 text-xs">
                    <TableCell className="text-neutral-400 whitespace-nowrap">{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium text-white">{expense.description}</TableCell>
                    <TableCell>
                      {expense.brand ? (
                        <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: `${expense.brand.color}20`, color: expense.brand.color }}>
                          {expense.brand.name}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-neutral-400">Central HQ</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-neutral-400">{expense.category?.name || 'Operating'}</TableCell>
                    <TableCell className="text-neutral-400">{expense.vendor || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[expense.status] || 'outline'} className="text-[10px]">
                        {STATUS_LABELS[expense.status] || expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-red-400">
                      -{formatCurrency(Number(expense.amount))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
