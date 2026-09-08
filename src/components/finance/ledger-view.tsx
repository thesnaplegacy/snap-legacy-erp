'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JournalEntry, ChartOfAccount } from '@/lib/types/database';
import { postJournalEntry, reverseJournalEntry } from '@/actions/finance-intelligence-actions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency, formatDate } from '@/lib/constants';
import {
  Search, Plus, ShieldCheck, ChevronDown, ChevronRight, RotateCcw,
  AlertTriangle, Trash2, BookOpen,
} from 'lucide-react';

interface LedgerViewProps {
  initialEntries: JournalEntry[];
  accounts: ChartOfAccount[];
}

export function LedgerView({ initialEntries, accounts }: LedgerViewProps) {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // New Entry Dialog State
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEntryBrand, setNewEntryBrand] = useState<string>('');
  const [newEntryDesc, setNewEntryDesc] = useState('');
  const [newEntryRef, setNewEntryRef] = useState('');
  const [lines, setLines] = useState<Array<{ account_id: string; debit: number; credit: number; memo: string }>>([
    { account_id: accounts[0]?.id || '', debit: 0, credit: 0, memo: '' },
    { account_id: accounts[1]?.id || '', debit: 0, credit: 0, memo: '' },
  ]);

  // Reversal Dialog State
  const [reversalTarget, setReversalTarget] = useState<JournalEntry | null>(null);
  const [reversalReason, setReversalReason] = useState('');
  const [isReversing, setIsReversing] = useState(false);

  // Calculations for New Entry
  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;
  const balanceDifference = Math.abs(totalDebit - totalCredit);

  // Filtering
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.entry_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.reference && entry.reference.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBrand =
      selectedBrand === 'ALL' ||
      (selectedBrand === 'HQ' && !entry.brand) ||
      (entry.brand && entry.brand.name.toUpperCase().includes(selectedBrand));

    const matchesStatus =
      selectedStatus === 'ALL' || entry.status === selectedStatus.toLowerCase();

    return matchesSearch && matchesBrand && matchesStatus;
  });

  const handleAddLine = () => {
    setLines([...lines, { account_id: accounts[0]?.id || '', debit: 0, credit: 0, memo: '' }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, field: string, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const handleCreateEntry = async () => {
    if (!isBalanced || !newEntryDesc) return;
    setIsSubmitting(true);
    try {
      const res = await postJournalEntry({
        date: newEntryDate,
        brandId: newEntryBrand || undefined,
        sourceModule: 'manual',
        reference: newEntryRef || undefined,
        description: newEntryDesc,
        lines: lines.map((l) => ({
          accountId: l.account_id,
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0,
          memo: l.memo || newEntryDesc,
        })),
      });

      if (res.success) {
        const newEntry: JournalEntry = {
          id: `je-${Date.now()}`,
          organization_id: '00000000-0000-0000-0000-000000000001',
          entry_number: res.entryNumber || `JE-2026-${Date.now().toString().slice(-4)}`,
          entry_date: newEntryDate,
          brand_id: newEntryBrand || null,
          source_module: 'manual',
          description: newEntryDesc,
          reference: newEntryRef || null,
          total_debit: totalDebit,
          total_credit: totalCredit,
          status: 'posted',
          posted_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          lines: lines.map((l, idx) => ({
            id: `jl-${Date.now()}-${idx}`,
            entry_id: `je-${Date.now()}`,
            account_id: l.account_id,
            line_number: idx + 1,
            debit_amount: Number(l.debit) || 0,
            credit_amount: Number(l.credit) || 0,
            memo: l.memo || newEntryDesc,
            account: accounts.find((a) => a.id === l.account_id),
          })),
        };
        setEntries([newEntry, ...entries]);
        setIsNewEntryOpen(false);
        setNewEntryDesc('');
        setNewEntryRef('');
        router.refresh();
      } else {
        alert(res.error || 'Failed to post entry');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReverseEntry = async () => {
    if (!reversalTarget || !reversalReason) return;
    setIsReversing(true);
    try {
      const res = await reverseJournalEntry(reversalTarget.id, reversalReason);
      if (res.success) {
        setEntries(
          entries.map((e) =>
            e.id === reversalTarget.id ? { ...e, status: 'reversed' as const } : e
          )
        );
        const revEntry: JournalEntry = {
          id: `rev-${Date.now()}`,
          organization_id: '00000000-0000-0000-0000-000000000001',
          entry_number: res.reversalNumber || `REV-${reversalTarget.entry_number}`,
          entry_date: new Date().toISOString().split('T')[0],
          brand_id: reversalTarget.brand_id,
          source_module: reversalTarget.source_module,
          description: `REVERSAL: ${reversalTarget.description} (Reason: ${reversalReason})`,
          reference: `Reversal of ${reversalTarget.entry_number}`,
          total_debit: reversalTarget.total_credit,
          total_credit: reversalTarget.total_debit,
          status: 'posted',
          posted_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          lines: reversalTarget.lines?.map((l) => ({
            ...l,
            debit_amount: l.credit_amount,
            credit_amount: l.debit_amount,
            memo: `Reversal of ${l.memo || reversalTarget.description}`,
          })),
        };
        setEntries((prev) => [revEntry, ...prev]);
        setReversalTarget(null);
        setReversalReason('');
        router.refresh();
      } else {
        alert(res.error || 'Failed to reverse entry');
      }
    } catch (err: any) {
      alert(err.message || 'Error reversing entry');
    } finally {
      setIsReversing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search entries by #, memo, reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-neutral-900/60 border-neutral-800 text-sm text-white focus-visible:ring-amber-500/30"
            />
          </div>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="h-9 px-3 rounded-md bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Brands</option>
            <option value="SERVICE">The Snap Service</option>
            <option value="AGENCY">The Snap Agency</option>
            <option value="MEMORIES">Snap Memories</option>
            <option value="HQ">Central HQ</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 px-3 rounded-md bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="POSTED">Posted</option>
            <option value="REVERSED">Reversed</option>
          </select>
        </div>

        <Button
          onClick={() => setIsNewEntryOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs h-9"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New Journal Entry
        </Button>
      </div>

      {/* Ledger Table */}
      <Card className="border-neutral-800/60 bg-neutral-900/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent text-xs text-neutral-400">
                <TableHead className="w-8"></TableHead>
                <TableHead>Entry #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Total Debit</TableHead>
                <TableHead className="text-right">Total Credit</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-neutral-500 text-sm">
                    No journal entries matching filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => {
                  const isExpanded = expandedEntryId === entry.id;
                  return (
                    <>
                      <TableRow
                        key={entry.id}
                        className="border-neutral-800/60 hover:bg-neutral-800/30 cursor-pointer transition-colors text-xs"
                        onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                      >
                        <TableCell className="w-8 text-neutral-500">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </TableCell>
                        <TableCell className="font-mono font-bold text-neutral-200">
                          {entry.entry_number}
                        </TableCell>
                        <TableCell className="text-neutral-400 whitespace-nowrap">
                          {formatDate(entry.entry_date)}
                        </TableCell>
                        <TableCell>
                          {entry.brand ? (
                            <Badge
                              variant="outline"
                              className="text-[10px]"
                              style={{ borderColor: `${entry.brand.color || '#C5A880'}50`, color: entry.brand.color || '#C5A880' }}
                            >
                              {entry.brand.name}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-neutral-400">
                              Central HQ
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-neutral-200 font-medium max-w-xs truncate">
                          {entry.description}
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-neutral-400">
                          {entry.reference || '—'}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold text-emerald-400">
                          {formatCurrency(Number(entry.total_debit))}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold text-blue-400">
                          {formatCurrency(Number(entry.total_credit))}
                        </TableCell>
                        <TableCell className="text-center">
                          {entry.status === 'posted' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <ShieldCheck className="w-3 h-3" /> Posted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <RotateCcw className="w-3 h-3" /> Reversed
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          {entry.status === 'posted' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setReversalTarget(entry);
                                setReversalReason('');
                              }}
                              className="h-7 px-2 text-[11px] text-neutral-400 hover:text-amber-400 hover:bg-amber-500/10"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Reverse
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Expanded Sub-table for Journal Lines */}
                      {isExpanded && (
                        <TableRow className="border-neutral-800/80 bg-neutral-950/70 hover:bg-neutral-950/70">
                          <TableCell colSpan={10} className="p-4">
                            <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 space-y-2">
                              <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-neutral-300">Journal Lines</span>
                                  <span className="text-neutral-500">• {entry.lines?.length || 0} line items</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-neutral-400">Dr/Cr Equilibrium:</span>
                                  <span className="font-mono text-emerald-400 font-semibold">
                                    Σ Dr ({formatCurrency(Number(entry.total_debit))}) = Σ Cr ({formatCurrency(Number(entry.total_credit))})
                                  </span>
                                </div>
                              </div>

                              <Table>
                                <TableHeader>
                                  <TableRow className="border-neutral-800/60 hover:bg-transparent text-[11px] text-neutral-400">
                                    <TableHead>Account Code</TableHead>
                                    <TableHead>Account Name</TableHead>
                                    <TableHead>Line Memo</TableHead>
                                    <TableHead className="text-right">Debit</TableHead>
                                    <TableHead className="text-right">Credit</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {entry.lines?.map((line) => (
                                    <TableRow key={line.id} className="border-neutral-800/40 text-xs">
                                      <TableCell className="font-mono text-amber-400 font-semibold">
                                        {line.account?.account_code || '—'}
                                      </TableCell>
                                      <TableCell className="font-medium text-white">
                                        {line.account?.account_name || 'Account'}
                                      </TableCell>
                                      <TableCell className="text-neutral-400 italic">
                                        {line.memo || entry.description}
                                      </TableCell>
                                      <TableCell className="text-right font-mono font-medium text-emerald-400">
                                        {Number(line.debit_amount) > 0 ? formatCurrency(Number(line.debit_amount)) : '—'}
                                      </TableCell>
                                      <TableCell className="text-right font-mono font-medium text-blue-400">
                                        {Number(line.credit_amount) > 0 ? formatCurrency(Number(line.credit_amount)) : '—'}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Journal Entry Modal */}
      <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
        <DialogContent className="max-w-3xl bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Post General Ledger Journal Entry
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Create a balanced double-entry transaction adhering to GAAP standards (Σ Debit = Σ Credit).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-neutral-300">Date</Label>
                <Input
                  type="date"
                  value={newEntryDate}
                  onChange={(e) => setNewEntryDate(e.target.value)}
                  className="mt-1 bg-neutral-800/80 border-neutral-700 text-xs text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-neutral-300">Brand Attribution</Label>
                <select
                  value={newEntryBrand}
                  onChange={(e) => setNewEntryBrand(e.target.value)}
                  className="w-full mt-1 h-9 px-3 rounded-md bg-neutral-800/80 border border-neutral-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Central HQ (Unattributed)</option>
                  <option value="SERVICE">The Snap Service</option>
                  <option value="AGENCY">The Snap Agency</option>
                  <option value="MEMORIES">Snap Memories</option>
                </select>
              </div>
              <div>
                <Label className="text-xs text-neutral-300">Reference # (Invoice / Cheque)</Label>
                <Input
                  placeholder="e.g. INV-2026-081"
                  value={newEntryRef}
                  onChange={(e) => setNewEntryRef(e.target.value)}
                  className="mt-1 bg-neutral-800/80 border-neutral-700 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-neutral-300">Description / Memo</Label>
              <Input
                placeholder="e.g. Monthly cloud infrastructure allocation across brands"
                value={newEntryDesc}
                onChange={(e) => setNewEntryDesc(e.target.value)}
                className="mt-1 bg-neutral-800/80 border-neutral-700 text-xs text-white"
              />
            </div>

            {/* Line Items Builder */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-300">Journal Lines</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLine}
                  className="h-7 text-xs border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Line
                </Button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {lines.map((line, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-neutral-950/60 p-2 rounded-md border border-neutral-800">
                    <div className="col-span-4">
                      <select
                        value={line.account_id}
                        onChange={(e) => handleLineChange(idx, 'account_id', e.target.value)}
                        className="w-full h-8 px-2 rounded bg-neutral-800 border border-neutral-700 text-xs text-white"
                      >
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.account_code} — {acc.account_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Line memo (optional)"
                        value={line.memo}
                        onChange={(e) => handleLineChange(idx, 'memo', e.target.value)}
                        className="h-8 text-xs bg-neutral-800 border-neutral-700 text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Debit"
                        value={line.debit || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          handleLineChange(idx, 'debit', val);
                          if (val > 0) handleLineChange(idx, 'credit', 0);
                        }}
                        className="h-8 text-xs text-right bg-neutral-800 border-neutral-700 text-emerald-400 font-mono"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Credit"
                        value={line.credit || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          handleLineChange(idx, 'credit', val);
                          if (val > 0) handleLineChange(idx, 'debit', 0);
                        }}
                        className="h-8 text-xs text-right bg-neutral-800 border-neutral-700 text-blue-400 font-mono"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={lines.length <= 2}
                        onClick={() => handleRemoveLine(idx)}
                        className="h-7 w-7 p-0 text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Equilibrium Status Indicator */}
              <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 font-mono">
                  <span>
                    Total Dr: <strong className="text-emerald-400">{formatCurrency(totalDebit)}</strong>
                  </span>
                  <span>
                    Total Cr: <strong className="text-blue-400">{formatCurrency(totalCredit)}</strong>
                  </span>
                </div>

                {isBalanced ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" /> Balanced & Ready to Post
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                    <AlertTriangle className="w-4 h-4" /> Out of Balance by {formatCurrency(balanceDifference)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsNewEntryOpen(false)}
              className="border-neutral-700 text-neutral-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEntry}
              disabled={!isBalanced || isSubmitting || !newEntryDesc}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
            >
              {isSubmitting ? 'Posting...' : 'Commit to General Ledger'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reverse Entry Audit Modal */}
      <Dialog open={!!reversalTarget} onOpenChange={() => setReversalTarget(null)}>
        <DialogContent className="max-w-md bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              Reverse Journal Entry {reversalTarget?.entry_number}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Per strict GAAP standards, posted entries are never deleted or modified. A full mirror reversal entry will be posted to the ledger with an audit trail.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 space-y-1">
              <p className="text-neutral-400">Target Entry: <span className="text-white font-medium">{reversalTarget?.description}</span></p>
              <p className="text-neutral-400">Original Amount: <span className="font-mono text-emerald-400">{formatCurrency(Number(reversalTarget?.total_debit || 0))}</span></p>
            </div>

            <div>
              <Label className="text-xs text-neutral-300">Mandatory Reason for Reversal</Label>
              <Input
                placeholder="e.g. Duplicate posting / Incorrect period attribution"
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="mt-1 bg-neutral-800 border-neutral-700 text-xs text-white"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReversalTarget(null)}
              className="border-neutral-700 text-neutral-300"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleReverseEntry}
              disabled={isReversing || !reversalReason.trim()}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
            >
              {isReversing ? 'Reversing...' : 'Post Reversal Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
