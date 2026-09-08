'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  DollarSign,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getMemoriesQuotes, generateWhatsAppMessage } from '@/actions/memories-actions';
import { MemoriesQuote } from '@/lib/types/database';
import { formatCurrency, formatDate } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export default function MemoriesQuotesPage() {
  const [quotes, setQuotes] = useState<MemoriesQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMemoriesQuotes();
        setQuotes(data);
      } catch (e) {
        console.error('Failed to load quotes:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const copyLink = (accessKey: string) => {
    const url = `${window.location.origin}/quote/${accessKey}`;
    navigator.clipboard.writeText(url);
    setCopiedKey(accessKey);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleWhatsApp = async (quote: MemoriesQuote) => {
    const url = `${window.location.origin}/quote/${quote.access_key}`;
    const message = await generateWhatsAppMessage('quote', {
      clientName: quote.client?.name || 'Valued Parent',
      quoteUrl: url,
    });
    const waUrl = `https://wa.me/${(quote.client?.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Studio Sales
            </span>
            <span className="text-xs text-neutral-400">
              Luxury Milestones & Portraits
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Quotations & Estimates
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Build and track client quotations with automated public acceptance portals and immutable financial snapshots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/memories/packages">
            <Button variant="outline" className="border-neutral-800 hover:bg-neutral-800 text-neutral-300 gap-2">
              Browse Packages
            </Button>
          </Link>
          <Button className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-2">
            <Plus className="w-4 h-4" />
            New Studio Quote
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs text-neutral-400">Total Quotes</div>
          <div className="text-2xl font-bold text-white mt-1">{quotes.length}</div>
          <div className="text-xs text-[#46BBD4] mt-1">Generated all-time</div>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs text-neutral-400">Accepted & Booked</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {quotes.filter(q => q.status === 'accepted').length}
          </div>
          <div className="text-xs text-emerald-500/80 mt-1">Converted to sessions</div>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs text-neutral-400">Pending Review</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {quotes.filter(q => q.status === 'sent' || q.status === 'draft').length}
          </div>
          <div className="text-xs text-amber-500/80 mt-1">Follow up via WhatsApp</div>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs text-neutral-400">Pipeline Quotation Value</div>
          <div className="text-2xl font-bold text-white mt-1">
            {formatCurrency(quotes.reduce((sum, q) => sum + (q.total_amount || 0), 0))}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Avg 62,500 PKR / session</div>
        </div>
      </div>

      {/* Quote List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Quotations Master Registry</h2>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#46BBD4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading quotations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#46BBD4] bg-[#46BBD4]/10 px-2 py-0.5 rounded border border-[#46BBD4]/30">
                        {quote.quote_number}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          quote.status === 'accepted'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : quote.status === 'sent'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                        }`}
                      >
                        {quote.status.toUpperCase()}
                      </span>
                      {quote.package?.name && (
                        <span className="text-xs text-neutral-400">
                          • {quote.package.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {quote.client?.name || 'Valued Parent'}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Email: {quote.client?.email || 'N/A'} • Phone: {quote.client?.phone || 'N/A'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-neutral-400">Total Investment</div>
                      <div className="text-xl font-black text-white">
                        {formatCurrency(quote.total_amount)}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        Deposit: {formatCurrency(quote.deposit_required)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Copy Public Link */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyLink(quote.access_key)}
                        className="border-neutral-800 hover:bg-neutral-800 text-neutral-300 gap-1.5"
                      >
                        {copiedKey === quote.access_key ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Portal URL</span>
                          </>
                        )}
                      </Button>

                      {/* Open Portal */}
                      <Link href={`/quote/${quote.access_key}`} target="_blank">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-neutral-800 hover:bg-neutral-800 text-[#46BBD4] gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Portal
                        </Button>
                      </Link>

                      {/* WhatsApp Button */}
                      <Button
                        size="sm"
                        onClick={() => handleWhatsApp(quote)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Line Items Snapshot */}
                {quote.items && quote.items.length > 0 && (
                  <div className="pt-3 border-t border-neutral-800/80">
                    <div className="text-xs font-semibold text-neutral-400 mb-2">
                      Included Package Deliverables:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {quote.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800 text-xs"
                        >
                          <div className="font-semibold text-neutral-200">{item.service_name}</div>
                          <div className="text-neutral-400 text-[11px] mt-0.5 line-clamp-1">
                            {item.description}
                          </div>
                          <div className="text-[#46BBD4] font-medium text-[11px] mt-1">
                            {item.included_photos} Retouched Photos • {item.included_prints} Prints
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
