import Link from 'next/link';
import { Share2, Star, Heart, MessageSquare, Gift, ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default function MemoriesFollowUpsPage() {
  const followUps = [
    {
      id: 'fu-001',
      client_name: 'Dr. Ayesha Tariq',
      session: 'Baby Rayan Newborn Session',
      status: 'review_received',
      rating: 5,
      feedback: 'The team was so gentle with Baby Rayan! The warm studio kept him sound asleep throughout the 3 hours.',
      referral_code: 'AYESHA-MEM-10',
      referral_count: 2,
    },
    {
      id: 'fu-002',
      client_name: 'Sara Khan',
      session: 'Zayd Khan 6-Month Sitter Inquiry',
      status: 'pending_followup',
      rating: null,
      feedback: 'Sent pricing brochure via WhatsApp. Awaiting milestone confirmation.',
      referral_code: 'SARA-MEM-15',
      referral_count: 0,
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Retention & Loyalty
            </span>
            <span className="text-xs text-neutral-400">
              Post-Delivery Care & Referral Program
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Follow-Ups, Reviews & Referrals
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track parent feedback, Google reviews, and lifetime milestone anniversary reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/memories/communications">
            <Button className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-2">
              <MessageSquare className="w-4 h-4" />
              Send Review Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs text-neutral-400">Average Studio Rating</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 flex items-center gap-1.5">
            5.0 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-xs text-neutral-500 mt-1">100% 5-star parent feedback</div>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs text-neutral-400">Active Referral Advocates</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">14 Parents</div>
          <div className="text-xs text-neutral-500 mt-1">Word-of-mouth growth</div>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs text-neutral-400">Repeat Milestone Rate</div>
          <div className="text-2xl font-bold text-[#46BBD4] mt-1">68%</div>
          <div className="text-xs text-neutral-500 mt-1">Newborn $\rightarrow$ Cake Smash</div>
        </div>
      </div>

      {/* Reviews and Follow-Ups List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Client Feedback & Advocates</h2>

        <div className="grid grid-cols-1 gap-4">
          {followUps.map((fu) => (
            <div
              key={fu.id}
              className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 space-y-3 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">{fu.client_name}</h3>
                  <p className="text-xs text-neutral-400">{fu.session}</p>
                </div>
                <div className="flex items-center gap-2">
                  {fu.rating && (
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {fu.rating}.0 Star Review
                    </div>
                  )}
                  <span className="text-xs bg-neutral-950 px-2.5 py-1 rounded-full border border-neutral-800 text-neutral-400 font-mono">
                    Ref: {fu.referral_code}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-neutral-950/70 rounded-xl border border-neutral-800 text-xs text-neutral-300 italic">
                "{fu.feedback}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
