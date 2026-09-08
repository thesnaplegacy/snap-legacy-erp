import Link from 'next/link';
import { Images, Plus, Eye, Key, CheckSquare, Calendar, ExternalLink, Sparkles } from 'lucide-react';
import { getMemoriesGalleries } from '@/actions/memories-actions';
import { formatDate } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function MemoriesGalleriesPage() {
  const galleries = await getMemoriesGalleries();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Studio Proofing
            </span>
            <span className="text-xs text-neutral-400">
              Private Watermarked Client Proofing
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Proofing Galleries
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Deliver secure watermarked digital galleries for client image culling, favorites selection, and print ordering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/memories/selections">
            <Button variant="outline" className="border-neutral-800 hover:bg-neutral-800 text-neutral-300 gap-2">
              <CheckSquare className="w-4 h-4 text-[#46BBD4]" />
              Client Selections
            </Button>
          </Link>
          <Button className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-2">
            <Plus className="w-4 h-4" />
            Create Gallery
          </Button>
        </div>
      </div>

      {/* Galleries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gal) => (
          <div
            key={gal.id}
            className="rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 overflow-hidden flex flex-col justify-between transition-all"
          >
            <div>
              {/* Cover Image */}
              <div className="h-44 w-full bg-neutral-950 relative overflow-hidden">
                {gal.cover_image_url ? (
                  <img
                    src={gal.cover_image_url}
                    alt={gal.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600">
                    <Images className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-neutral-950/80 backdrop-blur-md text-[#46BBD4] border border-[#46BBD4]/40">
                    {gal.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white">{gal.title}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Client: <span className="text-neutral-200">{gal.client?.name}</span>
                  </p>
                </div>

                <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Total Photos</span>
                    <span className="text-white font-semibold">{gal.total_photos} watermarked</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Selection Limit</span>
                    <span className="text-[#46BBD4] font-semibold">{gal.max_selections} photos included</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Access PIN</span>
                    <span className="font-mono text-neutral-300">{gal.access_code}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Client Views</span>
                    <span className="text-neutral-300">{gal.views_count} views</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center gap-2">
              <Link href="/memories/selections" className="w-full">
                <Button size="sm" className="w-full bg-[#46BBD4]/15 hover:bg-[#46BBD4]/25 text-[#46BBD4] border border-[#46BBD4]/30 gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" />
                  Review Selections
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
