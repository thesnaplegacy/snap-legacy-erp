import { getServiceDeliverables } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/constants';
import { PackageCheck, Database, HardDrive, ExternalLink, Plus, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DeliverablesPage() {
  const deliverables = await getServiceDeliverables();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <PackageCheck className="w-6 h-6 text-blue-400" />
            Client Deliverables Vault
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Storage metadata register linking 4K master films and photo galleries to cloud object storage.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Deliverable
        </Button>
      </div>

      <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-400">
        <HardDrive className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          <strong>Storage Architecture:</strong> Master raw binaries & 4K ProRes renders are stored in dedicated cloud object vaults. PostgreSQL strictly records URI pointers and release status.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {deliverables.map((del) => (
          <Card key={del.id} className="border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors">
            <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-white">{del.title}</h3>
                  <Badge variant="outline" className="text-[10px] border-neutral-700 text-neutral-300 capitalize">
                    {del.type.replace(/_/g, ' ')}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[10px] capitalize ${
                      del.status === 'delivered'
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                        : 'border-blue-500/40 text-blue-400 bg-blue-500/10'
                    }`}
                  >
                    {del.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                  <Database className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate max-w-md text-neutral-300">{del.storage_reference}</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Target Deadline: <span className="text-neutral-300 font-medium">{formatDate(del.deadline || '')}</span> • {del.notes}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-950 text-xs">
                  Copy Access Link
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                  Mark Delivered
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
