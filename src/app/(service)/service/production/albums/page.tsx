import { getServiceAlbumOrders } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import { BookOpen, Plus, Palette, Printer, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AlbumsPage() {
  const albums = await getServiceAlbumOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Luxury Wedding Albums Pipeline
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            End-to-end album curation: client photo selection, flush mount design, acrylic cover binding, and lab printing.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          New Album Order
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {albums.map((album) => (
          <Card key={album.id} className="border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors">
            <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-white">{album.album_title}</h3>
                  <Badge variant="outline" className="text-[10px] border-blue-500/40 text-blue-400 bg-blue-500/10">
                    {album.album_size} • {album.cover_type.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] capitalize border-amber-500/40 text-amber-300 bg-amber-500/10">
                    {album.status.replace(/_/g, ' ')}
                  </Badge>
                </div>

                <p className="text-xs text-neutral-400">
                  Client: <span className="text-neutral-200 font-semibold">{album.client?.name || 'Client'}</span> • {album.photos_selected_count} Photos / {album.pages_count} Pages • Lab Vendor: <span className="text-neutral-200">{album.printing_vendor}</span>
                </p>

                <div className="flex items-center gap-4 text-xs pt-1">
                  <span className="text-neutral-500">
                    Selling Price: <strong className="text-white">{formatCurrency(album.selling_price)}</strong>
                  </span>
                  <span className="text-neutral-500">
                    Printing Cost: <strong className="text-neutral-300">{formatCurrency(album.printing_cost)}</strong>
                  </span>
                  <span className="text-neutral-500">
                    Net Margin: <strong className="text-emerald-400">{formatCurrency(album.selling_price - album.printing_cost)}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-950 text-xs">
                  Review Proofs
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                  Update State
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
