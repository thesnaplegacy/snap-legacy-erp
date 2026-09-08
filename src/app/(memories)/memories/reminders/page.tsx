import Link from 'next/link';
import { Bell, Clock, CheckCircle2, MessageCircle, AlertCircle, Calendar, Sparkles } from 'lucide-react';
import { getMemoriesReminders } from '@/actions/memories-actions';
import { formatDate } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function MemoriesRemindersPage() {
  const reminders = await getMemoriesReminders();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Automation Dispatcher
            </span>
            <span className="text-xs text-neutral-400">
              7-Day • 3-Day • 1-Day Milestones
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Automated Session Reminders
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Automated shoot preparation advice, wardrobe guidelines, and studio arrival confirmations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/memories/communications">
            <Button variant="outline" className="border-neutral-800 hover:bg-neutral-800 text-neutral-300 gap-2">
              <MessageCircle className="w-4 h-4 text-[#46BBD4]" />
              Message History
            </Button>
          </Link>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map((rem) => (
          <div
            key={rem.id}
            className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
                  {rem.reminder_type.replace(/_/g, ' ').toUpperCase()}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    rem.status === 'sent'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {rem.status.toUpperCase()}
                </span>
                <span className="text-xs text-neutral-500">
                  Scheduled: {formatDate(rem.scheduled_for)}
                </span>
              </div>

              <div className="text-base font-bold text-white">
                Session: {rem.session?.title || 'Studio Milestone Session'}
              </div>

              <div className="p-3 bg-neutral-950/70 rounded-xl border border-neutral-800 text-xs text-neutral-300 max-w-2xl font-mono">
                "{rem.message}"
              </div>

              <div className="text-xs text-neutral-500">
                Recipient: <span className="text-neutral-300">{rem.client?.name}</span>
                {rem.sent_at && ` • Sent at: ${new Date(rem.sent_at).toLocaleString()}`}
              </div>
            </div>

            <div>
              {rem.status === 'sent' ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Dispatched
                </div>
              ) : (
                <Button size="sm" className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  Send Now
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
