import Link from 'next/link';
import { Scissors, Clock, User, CheckCircle2, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { getMemoriesEditingPipeline } from '@/actions/memories-actions';
import { formatDate } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function MemoriesEditingPage() {
  const pipeline = await getMemoriesEditingPipeline();

  const stages = [
    { key: 'culling', label: 'RAW Ingest & Culling' },
    { key: 'editing', label: 'Skin & Retouching' },
    { key: 'color_grading', label: 'Color Grading & Cotton Profile' },
    { key: 'client_review', label: 'Quality Assurance' },
    { key: 'completed', label: 'Master Assets Ready' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Post-Production Engine
            </span>
            <span className="text-xs text-neutral-400">
              Fine-Art Skin & Archival Color Grading
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Editing Pipeline & Retouching Queue
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track retouchers, color profiles, revision cycles, and high-fidelity archival deliverables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/memories/deliverables">
            <Button variant="outline" className="border-neutral-800 hover:bg-neutral-800 text-neutral-300 gap-2">
              Deliverables Vault
            </Button>
          </Link>
        </div>
      </div>

      {/* Editing Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pipeline.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 space-y-4 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 capitalize">
                {item.status.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                Due {item.due_date ? formatDate(item.due_date) : 'Soon'}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {item.session?.title || 'Studio Session Retouching'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#46BBD4]" />
                Retoucher: {item.editor?.full_name || 'Master Retoucher'}
              </p>
            </div>

            <div className="p-3.5 bg-neutral-950/70 rounded-xl border border-neutral-800 text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-400">
                <span>Photos to Retouch</span>
                <span className="text-white font-semibold">{item.photos_count} fine-art plates</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Priority</span>
                <span className="text-[#46BBD4] font-semibold uppercase">{item.priority}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Revisions Logged</span>
                <span className="text-neutral-300">{item.revision_count}</span>
              </div>
            </div>

            {item.notes && (
              <div className="text-xs text-neutral-400 bg-neutral-950/40 p-3 rounded-lg border border-neutral-800/80">
                <span className="text-neutral-500 font-semibold block text-[10px] uppercase mb-1">
                  Color & Skin Guidelines:
                </span>
                {item.notes}
              </div>
            )}

            <div className="pt-2">
              <Link href="/memories/deliverables" className="w-full block">
                <Button size="sm" className="w-full bg-[#46BBD4]/15 hover:bg-[#46BBD4]/25 text-[#46BBD4] border border-[#46BBD4]/30">
                  Manage Deliverables
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
