import Link from 'next/link';
import { Package, Download, ExternalLink, HardDrive, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { getMemoriesDeliverables } from '@/actions/memories-actions';
import { formatDate } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function MemoriesDeliverablesPage() {
  const deliverables = await getMemoriesDeliverables();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Digital Vault
            </span>
            <span className="text-xs text-neutral-400">
              High-Res Master & Web Optimized Assets
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Client Deliverables & Asset Vault
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Archival cloud storage distribution, watermarked proofing packages, and full-resolution print exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-2">
            <HardDrive className="w-4 h-4" />
            Upload Master Asset
          </Button>
        </div>
      </div>

      {/* Deliverables List */}
      <div className="space-y-4">
        {deliverables.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
                  {item.deliverable_type}
                </span>
                <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                  {item.version}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{item.title}</h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                <span>Client: <strong className="text-neutral-200">{item.client?.name}</strong></span>
                <span>File: <strong className="text-neutral-200 font-mono">{item.file_name}</strong></span>
                <span>Size: <strong className="text-neutral-200">{((item.file_size || 0) / (1024 * 1024)).toFixed(1)} MB</strong></span>
                <span>Delivered: <strong className="text-neutral-200">{item.delivered_at ? formatDate(item.delivered_at) : 'Active'}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.download_url && (
                <a href={item.download_url} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-2">
                    <Download className="w-4 h-4" />
                    Download File
                  </Button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
