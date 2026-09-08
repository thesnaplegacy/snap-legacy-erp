'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Plus,
  Send,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Phone,
  Clock,
} from 'lucide-react';
import { getMemoriesCommunications, generateWhatsAppMessage } from '@/actions/memories-actions';
import { MemoriesCommunication } from '@/lib/types/database';
import { Button } from '@/components/ui/button';

export default function MemoriesCommunicationsPage() {
  const [comms, setComms] = useState<MemoriesCommunication[]>([]);
  const [loading, setLoading] = useState(true);

  // Generator State
  const [showGen, setShowGen] = useState(false);
  const [genType, setGenType] = useState<'quote' | 'booking' | 'prep' | 'reminder_7d' | 'reminder_1d' | 'review'>('prep');
  const [clientName, setClientName] = useState('Dr. Ayesha Tariq');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [sessionType, setSessionType] = useState('Newborn');
  const [sessionDate, setSessionDate] = useState('2026-09-14');
  const [childName, setChildName] = useState('Baby Rayan');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMemoriesCommunications();
        setComms(data);
      } catch (e) {
        console.error('Failed to load communications:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleGenerate = async () => {
    const res = await generateWhatsAppMessage(genType, {
      clientName,
      sessionType,
      sessionDate,
      childName,
      quoteUrl: `${window.location.origin}/quote/demo_access_key`,
    });
    setGeneratedText(res);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const launchWhatsApp = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(generatedText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Parent Relations
            </span>
            <span className="text-xs text-neutral-400">
              WhatsApp & Notification History
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Client Communications & WhatsApp Dispatcher
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Studio message templates, quote links, prep guides, and booking confirmations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setShowGen(true);
              handleGenerate();
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-lg shadow-emerald-600/20"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Message Generator
          </Button>
        </div>
      </div>

      {/* Generator Modal */}
      {showGen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                WhatsApp Message Generator
              </h3>
              <button
                onClick={() => setShowGen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Message Template</label>
                  <select
                    value={genType}
                    onChange={(e: any) => setGenType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="prep">Shoot Preparation Guide</option>
                    <option value="quote">Quotation Link</option>
                    <option value="booking">Booking Confirmation</option>
                    <option value="reminder_7d">7-Day Reminder</option>
                    <option value="reminder_1d">1-Day Arrival Reminder</option>
                    <option value="review">Review & Referral Request</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">WhatsApp Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Child Name</label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-1">
                <Button
                  size="sm"
                  onClick={handleGenerate}
                  className="w-full bg-[#46BBD4]/15 hover:bg-[#46BBD4]/25 text-[#46BBD4] border border-[#46BBD4]/30"
                >
                  Regenerate Template Text
                </Button>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Generated Message</label>
                <textarea
                  rows={4}
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={copyMessage}
                  className="w-1/2 border-neutral-800 gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </Button>
                <Button
                  onClick={launchWhatsApp}
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Open WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communications Log Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Outbound Communications Log</h2>

        <div className="grid grid-cols-1 gap-3">
          {comms.map((comm) => (
            <div
              key={comm.id}
              className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
                    {comm.communication_type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {comm.status}
                  </span>
                </div>
                <span className="text-xs text-neutral-500">
                  {comm.created_at ? new Date(comm.created_at).toLocaleString() : 'Recent'}
                </span>
              </div>

              <div className="p-3 bg-neutral-950/70 rounded-lg border border-neutral-800 text-xs text-neutral-300 font-mono">
                {comm.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
