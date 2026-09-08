import Link from 'next/link';
import { Layers, Plus, Sparkles, Check, Clock } from 'lucide-react';
import { getMemoriesServices } from '@/actions/memories-actions';
import { formatCurrency } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function MemoriesServicesPage() {
  const services = await getMemoriesServices();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Studio Service Master
            </span>
            <span className="text-xs text-neutral-400">
              Core Photography Categories
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Studio Services & Experiences
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Standard service offerings across all luxury baby, milestone, birthday, and family portraiture.
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
            Add Service
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
                  {svc.category}
                </span>
                <span className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.round(svc.session_duration_minutes / 60) || 1}h
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{svc.name}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {svc.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Base Price</div>
                <div className="text-lg font-black text-white">
                  {formatCurrency(svc.default_price)}
                </div>
              </div>
              <Link href="/memories/quotes">
                <Button size="sm" variant="outline" className="border-neutral-800 hover:bg-neutral-800 text-neutral-300">
                  Include in Quote
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
