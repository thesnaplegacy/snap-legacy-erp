import { getServiceLibrary } from '@/actions/service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import { Layers, Plus, Camera, Video, Plane, Film, BookOpen, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await getServiceLibrary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-blue-400" />
            Service Library & Rate Card
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Master catalog of photography, cinematography, drone operations, and album deliverables.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc) => (
          <Card key={svc.id} className="border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors">
            <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-400" />
                  {svc.name}
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  {svc.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] border-neutral-700 text-neutral-300 capitalize">
                {svc.unit?.replace(/_/g, ' ') || 'fixed'}
              </Badge>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex items-center justify-between border-t border-neutral-800/80 mt-2">
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Catalog Rate</p>
                <p className="text-lg font-bold text-white">
                  {formatCurrency(svc.base_price || 0)}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300">
                Edit Rate Card
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
