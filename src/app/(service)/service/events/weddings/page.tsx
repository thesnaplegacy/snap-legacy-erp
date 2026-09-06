import { getServiceWeddings } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import Link from 'next/link';
import {
  FolderKanban,
  Calendar,
  MapPin,
  Clock,
  Camera,
  Film,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WeddingsPage() {
  const weddings = await getServiceWeddings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-blue-400" />
            Multi-Day Wedding Projects
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Master wedding records connecting multiple ceremonies (Mehndi, Barat, Walima) under a single project and quotation.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          New Wedding Booking
        </Button>
      </div>

      <div className="space-y-6">
        {weddings.map((wedding: any) => (
          <Card key={wedding.id} className="border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <CardHeader className="bg-neutral-900/90 border-b border-neutral-800 p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-white">
                      {wedding.name}
                    </CardTitle>
                    <Badge variant="outline" className="border-blue-500/40 text-blue-400 bg-blue-500/10 text-xs">
                      Master Project
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-neutral-400">
                    Client: <span className="font-semibold text-neutral-200">{wedding.client?.name}</span> • Phone: {wedding.client?.phone} • {wedding.description}
                  </CardDescription>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-neutral-500">Contract Value</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(wedding.total_value)}</p>
                  </div>
                  <Button variant="outline" size="sm" render={<Link href="/service/calendar" />} className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs">
                    View Schedule <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Ceremonies & Functions ({wedding.functions?.length || 3})
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(wedding.functions || []).map((fn: any, idx: number) => (
                  <div
                    key={fn.id}
                    className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/70 space-y-2.5 relative group hover:border-blue-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        {fn.function_name}
                      </span>
                      <Badge variant="outline" className="text-[10px] border-neutral-700 text-neutral-300 capitalize">
                        {fn.function_type}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-neutral-400">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-neutral-200 font-medium">{formatDate(fn.function_date)}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{fn.start_time} - {fn.end_time} ({fn.coverage_hours} hrs)</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="truncate">{fn.venue}, {fn.city}</span>
                      </p>
                    </div>

                    {fn.notes && (
                      <p className="text-[11px] text-neutral-500 italic border-t border-neutral-800/80 pt-2 line-clamp-2">
                        &quot;{fn.notes}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
