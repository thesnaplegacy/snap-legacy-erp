'use client';

import { useState } from 'react';
import { ConsolidatedPnL } from '@/lib/types/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/constants';
import {
  Download, Calendar, Layers, ArrowUpRight,
} from 'lucide-react';

interface PnLViewProps {
  initialPnL: ConsolidatedPnL;
}

export function PnLView({ initialPnL }: PnLViewProps) {
  const [pnl] = useState<ConsolidatedPnL>(initialPnL);
  const [selectedPeriod, setSelectedPeriod] = useState(pnl.date_range);

  const serviceBrand = pnl.brands.find((b) => b.brand_name.includes('Service')) || {
    brand_name: 'The Snap Service',
    gross_revenue: 0,
    direct_costs: 0,
    gross_profit: 0,
    gross_margin: 0,
    operating_expenses: 0,
    net_operating_profit: 0,
  };

  const agencyBrand = pnl.brands.find((b) => b.brand_name.includes('Agency')) || {
    brand_name: 'The Snap Agency',
    gross_revenue: 0,
    direct_costs: 0,
    gross_profit: 0,
    gross_margin: 0,
    operating_expenses: 0,
    net_operating_profit: 0,
  };

  const memoriesBrand = pnl.brands.find((b) => b.brand_name.includes('Memories')) || {
    brand_name: 'Snap Memories',
    gross_revenue: 0,
    direct_costs: 0,
    gross_profit: 0,
    gross_margin: 0,
    operating_expenses: 0,
    net_operating_profit: 0,
  };

  const c = pnl.consolidated;
  const netMarginPct = c.gross_revenue > 0 ? (c.net_profit / c.gross_revenue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <span className="text-xs text-neutral-400">Fiscal Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="h-9 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-xs text-white focus:ring-1 focus:ring-amber-500"
          >
            <option value="2026-Q1">Q1 2026 (Jan 1 – Mar 31)</option>
            <option value="Current Month">Current Month (September 2026)</option>
            <option value="2026-M02">February 2026</option>
            <option value="2026-M01">January 2026</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="border-neutral-800 bg-neutral-900/60 text-neutral-300 text-xs hover:bg-neutral-800"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
            Export Statement
          </Button>
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-neutral-800/60 bg-neutral-900/50">
          <CardHeader className="pb-1 text-xs text-neutral-400 font-medium">CONSOLIDATED REVENUE</CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(c.gross_revenue)}</p>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> 100% Target Attainment
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800/60 bg-neutral-900/50">
          <CardHeader className="pb-1 text-xs text-neutral-400 font-medium">TOTAL DIRECT COGS</CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(c.direct_costs)}</p>
            <p className="text-xs text-neutral-400 mt-1">
              {((c.direct_costs / (c.gross_revenue || 1)) * 100).toFixed(1)}% of revenue
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800/60 bg-neutral-900/50">
          <CardHeader className="pb-1 text-xs text-neutral-400 font-medium">CONSOLIDATED GROSS PROFIT</CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-400 tracking-tight">{formatCurrency(c.gross_profit)}</p>
            <p className="text-xs text-amber-400/80 mt-1">{c.gross_margin.toFixed(1)}% Gross Margin</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800/60 bg-neutral-900/50">
          <CardHeader className="pb-1 text-xs text-neutral-400 font-medium">NET OPERATING PROFIT</CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-400 tracking-tight">{formatCurrency(c.net_profit)}</p>
            <p className="text-xs text-emerald-400/80 mt-1">{netMarginPct.toFixed(1)}% Net Margin</p>
          </CardContent>
        </Card>
      </div>

      {/* Comparative Multi-Column P&L Table */}
      <Card className="border-neutral-800/60 bg-neutral-900/50">
        <CardHeader className="border-b border-neutral-800/80 pb-4">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Consolidated & Segmented P&L Statement (PKR)
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Reporting Currency: PKR • Central General Ledger Accrual Basis
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent text-xs text-neutral-400">
                <TableHead className="w-72 font-semibold">Account Category / Line Item</TableHead>
                <TableHead className="text-right font-semibold text-amber-300">The Snap Service</TableHead>
                <TableHead className="text-right font-semibold text-blue-400">The Snap Agency</TableHead>
                <TableHead className="text-right font-semibold text-pink-400">Snap Memories</TableHead>
                <TableHead className="text-right font-bold text-white bg-neutral-800/30">Consolidated Total</TableHead>
                <TableHead className="text-right font-semibold text-neutral-400">% Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {/* REVENUE SECTION */}
              <TableRow className="bg-neutral-950/70 border-neutral-800 font-bold text-neutral-300">
                <TableCell colSpan={6} className="py-2.5 tracking-wider uppercase text-[11px] text-amber-400">
                  1. Operating Revenue
                </TableCell>
              </TableRow>

              <TableRow className="border-neutral-800/40 hover:bg-neutral-800/20">
                <TableCell className="pl-6 text-neutral-300 font-medium">Gross Revenue from Services & Sales</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(serviceBrand.gross_revenue)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(agencyBrand.gross_revenue)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(memoriesBrand.gross_revenue)}</TableCell>
                <TableCell className="text-right font-mono font-bold text-white bg-neutral-800/20">
                  {formatCurrency(c.gross_revenue)}
                </TableCell>
                <TableCell className="text-right font-mono text-neutral-400">100.0%</TableCell>
              </TableRow>

              <TableRow className="border-neutral-800/60 bg-neutral-950/30 font-semibold">
                <TableCell className="pl-6 text-white">Total Operating Revenue</TableCell>
                <TableCell className="text-right font-mono text-amber-300">{formatCurrency(serviceBrand.gross_revenue)}</TableCell>
                <TableCell className="text-right font-mono text-blue-300">{formatCurrency(agencyBrand.gross_revenue)}</TableCell>
                <TableCell className="text-right font-mono text-pink-300">{formatCurrency(memoriesBrand.gross_revenue)}</TableCell>
                <TableCell className="text-right font-mono font-bold text-white bg-neutral-800/30">
                  {formatCurrency(c.gross_revenue)}
                </TableCell>
                <TableCell className="text-right font-mono text-neutral-300">100.0%</TableCell>
              </TableRow>

              {/* COGS SECTION */}
              <TableRow className="bg-neutral-950/70 border-neutral-800 font-bold text-neutral-300">
                <TableCell colSpan={6} className="py-2.5 tracking-wider uppercase text-[11px] text-amber-400">
                  2. Cost of Goods Sold (COGS)
                </TableCell>
              </TableRow>

              <TableRow className="border-neutral-800/40 hover:bg-neutral-800/20">
                <TableCell className="pl-6 text-neutral-400">Direct Production & Crew Compensation</TableCell>
                <TableCell className="text-right font-mono text-neutral-300">{formatCurrency(serviceBrand.direct_costs * 0.7)}</TableCell>
                <TableCell className="text-right font-mono text-neutral-300">{formatCurrency(agencyBrand.direct_costs * 0.5)}</TableCell>
                <TableCell className="text-right font-mono text-neutral-300">{formatCurrency(memoriesBrand.direct_costs * 0.5)}</TableCell>
                <TableCell className="text-right font-mono text-neutral-200 bg-neutral-800/20">
                  {formatCurrency(serviceBrand.direct_costs * 0.7 + agencyBrand.direct_costs * 0.5 + memoriesBrand.direct_costs * 0.5)}
                </TableCell>
                <TableCell className="text-right font-mono text-neutral-400">—</TableCell>
              </TableRow>

              <TableRow className="border-neutral-800/40 hover:bg-neutral-800/20">
                <TableCell className="pl-6 text-neutral-400">Lab Prints, Heirloom Materials & Ad Spend</TableCell>
                <TableCell className="text-right font-mono text-neutral-300">{formatCurrency(serviceBrand.direct_costs * 0.3)}</TableCell>
                <TableCell className="text-right font-mono text-neutral-300">{formatCurrency(agencyBrand.direct_costs * 0.5)}</TableCell>
                <TableCell className="text-right font-mono text-neutral-300">{formatCurrency(memoriesBrand.direct_costs * 0.5)}</TableCell>
                <TableCell className="text-right font-mono text-neutral-200 bg-neutral-800/20">
                  {formatCurrency(serviceBrand.direct_costs * 0.3 + agencyBrand.direct_costs * 0.5 + memoriesBrand.direct_costs * 0.5)}
                </TableCell>
                <TableCell className="text-right font-mono text-neutral-400">—</TableCell>
              </TableRow>

              <TableRow className="border-neutral-800/60 bg-neutral-950/30 font-semibold">
                <TableCell className="pl-6 text-neutral-300">Total Direct Cost of Goods Sold</TableCell>
                <TableCell className="text-right font-mono text-red-400">({formatCurrency(serviceBrand.direct_costs)})</TableCell>
                <TableCell className="text-right font-mono text-red-400">({formatCurrency(agencyBrand.direct_costs)})</TableCell>
                <TableCell className="text-right font-mono text-red-400">({formatCurrency(memoriesBrand.direct_costs)})</TableCell>
                <TableCell className="text-right font-mono font-bold text-red-400 bg-neutral-800/30">
                  ({formatCurrency(c.direct_costs)})
                </TableCell>
                <TableCell className="text-right font-mono text-red-400">
                  {((c.direct_costs / (c.gross_revenue || 1)) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>

              {/* GROSS PROFIT ROW */}
              <TableRow className="border-neutral-700 bg-amber-500/10 font-bold">
                <TableCell className="text-white uppercase tracking-wide text-xs">Gross Profit</TableCell>
                <TableCell className="text-right font-mono text-amber-300">{formatCurrency(serviceBrand.gross_profit)}</TableCell>
                <TableCell className="text-right font-mono text-blue-300">{formatCurrency(agencyBrand.gross_profit)}</TableCell>
                <TableCell className="text-right font-mono text-pink-300">{formatCurrency(memoriesBrand.gross_profit)}</TableCell>
                <TableCell className="text-right font-mono text-white bg-amber-500/20">
                  {formatCurrency(c.gross_profit)}
                </TableCell>
                <TableCell className="text-right font-mono text-amber-400">{c.gross_margin.toFixed(1)}%</TableCell>
              </TableRow>

              {/* OPEX SECTION */}
              <TableRow className="bg-neutral-950/70 border-neutral-800 font-bold text-neutral-300">
                <TableCell colSpan={6} className="py-2.5 tracking-wider uppercase text-[11px] text-amber-400">
                  3. Operating Overheads & Expenses (OpEx)
                </TableCell>
              </TableRow>

              <TableRow className="border-neutral-800/40 hover:bg-neutral-800/20">
                <TableCell className="pl-6 text-neutral-400">Operating Expenses Allocated</TableCell>
                <TableCell className="text-right font-mono text-neutral-300">{formatCurrency(serviceBrand.operating_expenses)}</TableCell>
                <TableCell className="text-right font-mono text-neutral-300">{formatCurrency(agencyBrand.operating_expenses)}</TableCell>
                <TableCell className="text-right font-mono text-neutral-300">{formatCurrency(memoriesBrand.operating_expenses)}</TableCell>
                <TableCell className="text-right font-mono text-neutral-200 bg-neutral-800/20">
                  {formatCurrency(c.operating_expenses)}
                </TableCell>
                <TableCell className="text-right font-mono text-neutral-400">—</TableCell>
              </TableRow>

              <TableRow className="border-neutral-800/60 bg-neutral-950/30 font-semibold">
                <TableCell className="pl-6 text-neutral-300">Total Operating Expenses</TableCell>
                <TableCell className="text-right font-mono text-red-400">({formatCurrency(serviceBrand.operating_expenses)})</TableCell>
                <TableCell className="text-right font-mono text-red-400">({formatCurrency(agencyBrand.operating_expenses)})</TableCell>
                <TableCell className="text-right font-mono text-red-400">({formatCurrency(memoriesBrand.operating_expenses)})</TableCell>
                <TableCell className="text-right font-mono font-bold text-red-400 bg-neutral-800/30">
                  ({formatCurrency(c.operating_expenses)})
                </TableCell>
                <TableCell className="text-right font-mono text-red-400">
                  {((c.operating_expenses / (c.gross_revenue || 1)) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>

              {/* NET PROFIT BOTTOM LINE */}
              <TableRow className="border-t-2 border-emerald-500 bg-emerald-950/30 font-bold text-sm">
                <TableCell className="text-emerald-400 uppercase tracking-wide">
                  Net Operating Profit (Bottom Line)
                </TableCell>
                <TableCell className="text-right font-mono text-emerald-400">{formatCurrency(serviceBrand.net_operating_profit)}</TableCell>
                <TableCell className="text-right font-mono text-emerald-400">{formatCurrency(agencyBrand.net_operating_profit)}</TableCell>
                <TableCell className="text-right font-mono text-emerald-400">{formatCurrency(memoriesBrand.net_operating_profit)}</TableCell>
                <TableCell className="text-right font-mono text-white bg-emerald-500/20 text-base font-extrabold">
                  {formatCurrency(c.net_profit)}
                </TableCell>
                <TableCell className="text-right font-mono text-emerald-400 font-extrabold">
                  {netMarginPct.toFixed(1)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
