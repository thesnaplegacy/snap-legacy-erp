'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Heart,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Camera,
  Download,
  AlertCircle,
  FileCheck,
  Lock,
  Sparkles,
} from 'lucide-react';
import { getPublicQuoteByAccessKey, acceptPublicQuote } from '@/actions/memories-actions';
import { MemoriesQuote } from '@/lib/types/database';
import { formatCurrency, formatDate } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export default function PublicQuotePage() {
  const params = useParams();
  const accessKey = params?.accessKey as string;

  const [quote, setQuote] = useState<MemoriesQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [acceptedSuccess, setAcceptedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      if (!accessKey) return;
      try {
        const res = await getPublicQuoteByAccessKey(accessKey);
        if (res.success && res.quote) {
          setQuote(res.quote);
          if (res.quote.status === 'accepted') {
            setAcceptedSuccess(true);
          }
        } else {
          setError(res.error || 'Quotation not found or link has expired.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load quotation.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [accessKey]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await acceptPublicQuote(accessKey, signature);
      if (res.success) {
        setAcceptedSuccess(true);
        if (quote) {
          setQuote({
            ...quote,
            status: 'accepted',
            client_signature: signature,
            accepted_at: new Date().toISOString(),
          });
        }
      } else {
        setError(res.error || 'Failed to accept quotation.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while accepting quotation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-2 border-[#46BBD4] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-neutral-400 text-sm">Loading your custom studio quotation...</p>
      </div>
    );
  }

  if (error && !quote) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h1 className="text-xl font-bold">Quotation Unavailable</h1>
          <p className="text-sm text-neutral-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#46BBD4]/20 to-[#57C1DA]/10 border border-[#46BBD4]/40 flex items-center justify-center shadow-lg shadow-[#46BBD4]/10">
              <Heart className="w-6 h-6 text-[#46BBD4]" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white">Snap Memories</div>
              <div className="text-xs uppercase tracking-widest text-[#46BBD4] font-medium">
                Luxury Milestone & Family Studio
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="font-mono text-sm font-semibold text-neutral-300">
              Quote #{quote?.quote_number}
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              Valid until: {quote?.valid_until ? formatDate(quote.valid_until) : '14 Days'}
            </div>
          </div>
        </div>

        {/* Status Notification */}
        {acceptedSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-emerald-400">
                Quotation Formally Accepted!
              </div>
              <div className="text-xs text-emerald-300/80 mt-0.5">
                Signed by <span className="font-semibold">{quote?.client_signature || signature}</span>. Our studio concierge will contact you via WhatsApp to finalize your session time and deposit.
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#46BBD4]/10 border border-[#46BBD4]/25 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#46BBD4] flex-shrink-0" />
            <div className="text-xs text-[#46BBD4]/90">
              Welcome! Please review your custom photography experience deliverables below. To lock in your studio date, digitally sign and accept.
            </div>
          </div>
        )}

        {/* Client & Studio Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Prepared For
            </div>
            <div className="text-base font-bold text-white">
              {quote?.client?.name || 'Valued Parent'}
            </div>
            <div className="text-xs text-neutral-400">{quote?.client?.email || 'N/A'}</div>
            <div className="text-xs text-neutral-400">{quote?.client?.phone || 'N/A'}</div>
          </div>

          <div className="space-y-1 md:text-right">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Studio Location
            </div>
            <div className="text-base font-bold text-white">Snap Memories Studio</div>
            <div className="text-xs text-neutral-400">Kohinoor One Plaza / Executive Suite</div>
            <div className="text-xs text-neutral-400">Faisalabad, Pakistan</div>
          </div>
        </div>

        {/* Deliverables & Line Items */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-950/40 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
              Package Deliverables & Inclusions
            </h2>
            <span className="text-xs text-[#46BBD4] font-medium">
              {quote?.package?.name || 'Custom Studio Package'}
            </span>
          </div>

          <div className="divide-y divide-neutral-800/60">
            {quote?.items && quote.items.length > 0 ? (
              quote.items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="text-base font-bold text-white">{item.service_name}</div>
                    <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#46BBD4] font-medium pt-1">
                      <span>• {item.included_photos} Fine-Art Retouched Photos</span>
                      {item.included_prints > 0 && (
                        <span>• {item.included_prints} Archival Cotton Prints</span>
                      )}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-base font-black text-white">
                      {formatCurrency(item.total_price)}
                    </div>
                    <div className="text-xs text-neutral-500">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-sm text-neutral-400">
                Custom studio milestone package includes session time, props, styling, and archival editing.
              </div>
            )}
          </div>

          {/* Totals Section */}
          <div className="p-6 bg-neutral-950/60 border-t border-neutral-800 space-y-3">
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Subtotal</span>
              <span className="text-white">{formatCurrency(quote?.subtotal || quote?.total_amount || 0)}</span>
            </div>
            {quote?.discount ? (
              <div className="flex justify-between text-sm text-emerald-400">
                <span>Promotional Courtesy</span>
                <span>-{formatCurrency(quote.discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-lg font-black text-white pt-2 border-t border-neutral-800">
              <span>Total Investment</span>
              <span className="text-[#46BBD4]">{formatCurrency(quote?.total_amount || 0)}</span>
            </div>
            <div className="flex justify-between text-xs text-amber-400 pt-1">
              <span>Initial Retainer Deposit Required (Locks Date & Props)</span>
              <span className="font-bold">{formatCurrency(quote?.deposit_required || 25000)}</span>
            </div>
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Remaining Balance (Payable on Shoot Day)</span>
              <span>{formatCurrency(quote?.balance_due || (quote?.total_amount || 0) - (quote?.deposit_required || 0))}</span>
            </div>
          </div>
        </div>

        {/* Studio Safe Care Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#46BBD4]">
              <ShieldCheck className="w-4 h-4" />
              Sanitized & Warmed Studio
            </div>
            <p className="text-xs text-neutral-400">
              Room temperatures calibrated to 78°F-80°F. Organic cotton wraps sanitized before every session.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#46BBD4]">
              <Clock className="w-4 h-4" />
              Baby-Paced Flow
            </div>
            <p className="text-xs text-neutral-400">
              Never rushed. We accommodate feeding, diaper changes, and soothing pauses whenever needed.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#46BBD4]">
              <Camera className="w-4 h-4" />
              Private Watermarked Proofing
            </div>
            <p className="text-xs text-neutral-400">
              Select your favorite portraits from your private digital proofing gallery in the comfort of your home.
            </p>
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#46BBD4]" />
              Digital Acceptance & Session Agreement
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              By typing your full legal name below, you confirm your acceptance of the package deliverables, pricing, and studio terms.
            </p>
          </div>

          {acceptedSuccess ? (
            <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="text-xs text-neutral-400">Digital Signature Record:</div>
              <div className="font-serif italic text-xl text-emerald-400 font-semibold">
                {quote?.client_signature || signature}
              </div>
              <div className="text-[11px] text-neutral-500">
                Accepted electronically • Immutable ledger record secured
              </div>
            </div>
          ) : (
            <form onSubmit={handleAccept} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">
                  Full Name (Electronic Signature)
                </label>
                <input
                  type="text"
                  required
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="e.g. Dr. Ayesha Tariq"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#46BBD4]"
                />
              </div>

              {error && (
                <div className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting || !signature.trim()}
                className="w-full bg-gradient-to-r from-[#46BBD4] to-[#57C1DA] hover:from-[#3ea7be] hover:to-[#4bb4cd] text-neutral-950 font-bold py-3 text-sm gap-2 shadow-xl shadow-[#46BBD4]/20"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Accept Quotation & Confirm Reservation
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-neutral-500 space-y-1 pb-8">
          <p>© {new Date().getFullYear()} Snap Memories — Studio Operating System. Powered by The Snap Legacy ERP.</p>
          <p>Questions? Contact our studio concierge at +92 321 9988776 or info@snapmemories.com</p>
        </div>
      </div>
    </div>
  );
}
