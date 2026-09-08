import { getAgencyServices } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import Link from 'next/link';
import { Layers, Plus, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyServicesPage() {
  const services = await getAgencyServices();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-400" />
            Agency Service Library & Rate Card
          </h1>
          <p className="text-sm text-neutral-400">
            Standard pricing definitions across digital marketing, paid advertising, branding, and video production.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((svc) => (
          <Card key={svc.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all flex flex-col justify-between">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30">
                  {svc.category}
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-neutral-800 text-neutral-400">
                  {svc.pricing_type}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-white mt-2">{svc.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <p className="text-xs text-neutral-400 line-clamp-3">{svc.description}</p>

              <div className="pt-3 border-t border-neutral-800/80 flex items-baseline justify-between">
                <span className="text-[11px] text-neutral-500">Catalog Base Rate</span>
                <div className="text-right">
                  <span className="text-base font-bold text-white">{formatCurrency(svc.default_price)}</span>
                  <span className="text-[11px] text-neutral-500 ml-1">
                    {svc.pricing_type === 'monthly' ? '/ mo' : svc.pricing_type === 'hourly' ? '/ hr' : ''}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
