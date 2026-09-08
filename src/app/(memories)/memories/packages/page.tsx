import Link from 'next/link';
import { Boxes, Plus, Check, Clock, Images, Sparkles, AlertCircle } from 'lucide-react';
import { getMemoriesPackages } from '@/actions/memories-actions';
import { formatCurrency } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function MemoriesPackagesPage() {
  const packages = await getMemoriesPackages();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Studio Offerings
            </span>
            <span className="text-xs text-neutral-400">
              Newborn • Milestone • Cake Smash • Birthday • Family
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Curated Studio Packages
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Turnkey luxury studio packages configured with included photos, prints, posing sets, and time allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/memories/services">
            <Button variant="outline" className="border-neutral-800 hover:bg-neutral-800 text-neutral-300 gap-2">
              Service Catalog
            </Button>
          </Link>
          <Button className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-2">
            <Plus className="w-4 h-4" />
            Create Package
          </Button>
        </div>
      </div>

      {/* Strict Policy Banner */}
      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3 text-xs text-neutral-400">
        <Sparkles className="w-4 h-4 text-[#46BBD4] flex-shrink-0" />
        <span>
          <strong className="text-white">Studio Specialization:</strong> Snap Memories exclusively caters to Newborn, Baby Milestone, Cake Smash, Birthday, Family Heritage, Anniversary, and Lifestyle sessions. (Weddings are managed by The Snap Service).
        </span>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 p-6 flex flex-col justify-between transition-all duration-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
                  {pkg.session_type}
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  {Math.round(pkg.duration_minutes / 60) || 2} Hours Studio
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2.5">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Deliverable Highlights:
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <Check className="w-4 h-4 text-[#46BBD4] flex-shrink-0" />
                  <span>{pkg.included_photos} Fine-Art Retouched Photos</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <Check className="w-4 h-4 text-[#46BBD4] flex-shrink-0" />
                  <span>{pkg.prints_included || 'Archival Prints Included'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <Check className="w-4 h-4 text-[#46BBD4] flex-shrink-0" />
                  <span>Private Digital Watermarked Proofing Gallery</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Starting at</div>
                <div className="text-xl font-black text-white">
                  {formatCurrency(pkg.base_price)}
                </div>
              </div>

              <Link href="/memories/quotes">
                <Button
                  size="sm"
                  className="bg-[#46BBD4]/15 hover:bg-[#46BBD4]/25 text-[#46BBD4] border border-[#46BBD4]/30 font-semibold"
                >
                  Draft Quote
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
