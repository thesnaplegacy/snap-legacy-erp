import Link from 'next/link';
import { ShoppingBag, Plus, Sparkles, Check, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default function MemoriesProductsPage() {
  const products = [
    {
      id: 'prod-001',
      name: 'Archival Cotton Rag Fine-Art Print (12x18)',
      category: 'Fine-Art Prints',
      description: 'Hahnemühle 308gsm museum-grade cotton paper with 100-year fade-resistant archival pigment inks.',
      price: 6500,
      cost: 1800,
      turnaround: '3-5 business days',
    },
    {
      id: 'prod-002',
      name: 'Italian Handcrafted Acrylic Floating Frame (16x24)',
      category: 'Luxury Framing',
      description: 'Anti-reflective optical acrylic front with polished bevel edge and concealed aluminum sub-frame.',
      price: 24000,
      cost: 7500,
      turnaround: '7-10 business days',
    },
    {
      id: 'prod-003',
      name: 'Bespoke Heirloom Linen Baby Album (10x10, 30 Pages)',
      category: 'Heirloom Albums',
      description: 'Hardbound wrapped in Italian natural linen with custom gold foil debossing of baby birth details.',
      price: 45000,
      cost: 14000,
      turnaround: '12-14 business days',
    },
    {
      id: 'prod-004',
      name: 'Fine-Art Canvas Gallery Wrap (20x30)',
      category: 'Canvas',
      description: 'Heavyweight poly-cotton canvas hand-stretched over solid pine stretcher bars with satin varnish protection.',
      price: 18000,
      cost: 5000,
      turnaround: '5-7 business days',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Tangible Heirlooms
            </span>
            <span className="text-xs text-neutral-400">
              Museum Prints • Italian Frames • Heirloom Albums
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Physical Products & Heirloom Frames
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Archival wall art, hand-bound albums, and luxury bespoke framing catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-2">
            <Plus className="w-4 h-4" />
            Add Studio Product
          </Button>
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
                {prod.category}
              </span>

              <h3 className="text-base font-bold text-white leading-snug">
                {prod.name}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {prod.description}
              </p>
              <div className="text-[11px] text-neutral-500">
                Production turnaround: {prod.turnaround}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Retail Price</div>
                <div className="text-lg font-black text-white">
                  {formatCurrency(prod.price)}
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-neutral-800 hover:bg-neutral-800 text-neutral-300">
                Add to Order
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
