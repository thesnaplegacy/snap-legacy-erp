import { getAgencyDeliverables } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/constants';
import Link from 'next/link';
import { PackageCheck, Plus, Download, ExternalLink, HardDrive, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyDeliverablesPage() {
  const deliverables = await getAgencyDeliverables();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-purple-400" />
            Client Deliverables Vault
          </h1>
          <p className="text-sm text-neutral-400">
            Finished client assets, vector logo packages, brand guidelines, and high-resolution master exports.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Deliverable Vault
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {deliverables.map((deliv) => (
          <Card key={deliv.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all flex flex-col justify-between">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30">
                      {deliv.type}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] bg-neutral-800 text-neutral-300">
                      {deliv.version}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-white">{deliv.title}</CardTitle>
                  <CardDescription className="text-xs text-neutral-400">
                    Project: {deliv.project_name || 'Commercial Project'}
                  </CardDescription>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    deliv.status === 'delivered'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  }`}
                >
                  {deliv.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 text-xs text-neutral-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>File: <strong className="text-white">{deliv.file_name || 'master-export.zip'}</strong></span>
                  <span>{deliv.file_size ? `${(deliv.file_size / (1024 * 1024)).toFixed(1)} MB` : 'Cloud Vault'}</span>
                </div>
                {deliv.delivered_to && (
                  <p className="text-[11px] text-neutral-500">
                    Handed over to: <span className="text-neutral-300">{deliv.delivered_to}</span>
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Client Approved
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download Vault Asset
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
