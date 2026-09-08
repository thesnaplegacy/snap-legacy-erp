'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Search,
  Filter,
  Receipt,
  FileCheck2,
} from 'lucide-react';
import { getMemoriesSessions, recordMemoriesPayment } from '@/actions/memories-actions';
import { MemoriesSession } from '@/lib/types/database';
import { formatCurrency, formatDate } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export default function MemoriesPaymentsPage() {
  const [sessions, setSessions] = useState<MemoriesSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick state for modal or demo payment records
  const [showModal, setShowModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cash' | 'card' | 'online'>('bank_transfer');
  const [isDeposit, setIsDeposit] = useState(false);
  const [reference, setReference] = useState('');
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMemoriesSessions();
        setSessions(data);
        if (data.length > 0) {
          setSelectedSessionId(data[0].id);
        }
      } catch (e) {
        console.error('Failed to load sessions for payments:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId || !paymentAmount) return;

    setRecording(true);
    setMessage(null);
    try {
      const sess = sessions.find((s) => s.id === selectedSessionId);
      const res = await recordMemoriesPayment({
        clientId: sess?.client_id || 'c-001',
        sessionId: selectedSessionId,
        amount: parseFloat(paymentAmount),
        paymentMethod,
        isDeposit,
        reference: reference || `REF-MEM-${Date.now().toString().slice(-5)}`,
      });

      if (res.success) {
        setMessage(`Payment of PKR ${paymentAmount} recorded and synced to central finance ledger.`);
        setShowModal(false);
        setPaymentAmount('');
        setReference('');
        // Refresh sessions
        const updated = await getMemoriesSessions();
        setSessions(updated);
      } else {
        setMessage(res.error || 'Failed to record payment');
      }
    } catch (err: any) {
      setMessage(err.message || 'Error recording payment');
    } finally {
      setRecording(false);
    }
  };

  const totalCollected = sessions.reduce((acc, s) => acc + ((s.total_amount || 0) - (s.balance_due || 0)), 0);
  const totalBalanceDue = sessions.reduce((acc, s) => acc + (s.balance_due || 0), 0);
  const totalBooked = sessions.reduce((acc, s) => acc + (s.total_amount || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Studio Finance
            </span>
            <span className="text-xs text-neutral-400">
              Central Ledger Integration Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Payments & Retainers
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track deposit retainers and balance payments synced with The Snap Legacy central double-entry chart of accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowModal(true)}
            className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-2"
          >
            <Plus className="w-4 h-4" />
            Record Studio Payment
          </Button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-neutral-400 hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Total Retainers & Paid</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {formatCurrency(totalCollected)}
          </div>
          <div className="text-xs text-emerald-500/80 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Confirmed in Central Ledger
          </div>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Outstanding Balances</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {formatCurrency(totalBalanceDue)}
          </div>
          <div className="text-xs text-amber-500/80 mt-1">
            Payable on or before shoot-day
          </div>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs font-medium text-neutral-400">Gross Contracted Value</div>
          <div className="text-2xl font-bold text-white mt-1">
            {formatCurrency(totalBooked)}
          </div>
          <div className="text-xs text-[#46BBD4] mt-1">
            Active session pipeline
          </div>
        </div>
      </div>

      {/* Sessions Payment Status Ledger */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Session Payment Status</h2>

        <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Session & Client</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Paid / Retainer</th>
                  <th className="p-4">Balance Due</th>
                  <th className="p-4">Finance Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70">
                {sessions.map((session) => {
                  const paid = (session.total_amount || 0) - (session.balance_due || 0);
                  const isPaid = (session.balance_due || 0) <= 0;

                  return (
                    <tr key={session.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{session.title}</div>
                        <div className="text-neutral-400 text-[11px] mt-0.5">
                          {session.client?.name} • {session.session_date}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
                          {session.session_type}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">
                        {formatCurrency(session.total_amount || 0)}
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        {formatCurrency(paid)}
                      </td>
                      <td className="p-4 font-bold text-amber-400">
                        {formatCurrency(session.balance_due || 0)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isPaid
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {isPaid ? 'PAID IN FULL' : 'PARTIALLY PAID'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedSessionId(session.id);
                            setPaymentAmount(session.balance_due ? String(session.balance_due) : '');
                            setShowModal(true);
                          }}
                          className="border-neutral-800 hover:bg-neutral-800 text-xs text-[#46BBD4]"
                        >
                          Record
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#46BBD4]" />
                Record Studio Payment
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Select Studio Session
                </label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#46BBD4]"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.client?.name}) — Balance: PKR {s.balance_due || 0}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Amount Received (PKR)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 25000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#46BBD4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#46BBD4]"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Studio Cash</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Payment Nature
                  </label>
                  <select
                    value={isDeposit ? 'true' : 'false'}
                    onChange={(e) => setIsDeposit(e.target.value === 'true')}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#46BBD4]"
                  >
                    <option value="true">Booking Deposit Retainer</option>
                    <option value="false">Session Balance / Final</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Reference / Transaction No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. HBL-FT-994821"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#46BBD4]"
                />
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Automatically syncs double-entry debit/credit to Central ERP Finance.</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 border-neutral-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={recording}
                  className="w-1/2 bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold"
                >
                  {recording ? 'Syncing...' : 'Record Payment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
