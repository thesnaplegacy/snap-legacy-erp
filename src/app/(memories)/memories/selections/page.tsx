'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Sparkles,
  ArrowRight,
  User,
  Scissors,
  Images,
  MessageSquare,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { getMemoriesGalleries } from '@/actions/memories-actions';
import { DEMO_MEMORIES_SELECTIONS } from '@/lib/demo-data';
import { Button } from '@/components/ui/button';

export default function MemoriesSelectionsPage() {
  const [selections, setSelections] = useState(DEMO_MEMORIES_SELECTIONS);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Culling & Approval
            </span>
            <span className="text-xs text-neutral-400">
              Parent Selections & Feedback
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Client Photo Selections
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Review parent-selected favorites, special skin/color retouching requests, and push approved images directly to the editing workstation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/memories/editing">
            <Button className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-2">
              <Scissors className="w-4 h-4" />
              Editing Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Selections List */}
      <div className="space-y-4">
        {selections.map((sel) => (
          <div
            key={sel.id}
            className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 space-y-4 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selections Submitted
                  </span>
                  <span className="text-xs text-neutral-400">
                    {sel.submitted_at ? new Date(sel.submitted_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Parent: {sel.client?.name || 'Dr. Ayesha & Tariq'}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-neutral-400">Chosen Portraits</div>
                  <div className="text-xl font-black text-[#46BBD4]">
                    {sel.selected_photos.length} Photos
                  </div>
                </div>
                <Link href="/memories/editing">
                  <Button size="sm" className="bg-[#46BBD4]/15 hover:bg-[#46BBD4]/25 text-[#46BBD4] border border-[#46BBD4]/30 gap-1.5">
                    <Scissors className="w-3.5 h-3.5" />
                    Open in Retouching
                  </Button>
                </Link>
              </div>
            </div>

            {/* Selected Photo Filename Pills */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-400">Selected Filenames:</div>
              <div className="flex flex-wrap gap-2">
                {sel.selected_photos.map((photo) => (
                  <span
                    key={photo}
                    className="font-mono text-xs bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800 text-neutral-300"
                  >
                    {photo}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes & Feedback */}
            {sel.client_feedback && (
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs space-y-1">
                <div className="text-neutral-500 font-semibold uppercase text-[10px] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  Client Retouching Instructions
                </div>
                <p className="text-neutral-300 italic">
                  "{sel.client_feedback}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
