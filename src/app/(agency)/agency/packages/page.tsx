import { getAgencyPackages } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import Link from 'next/link';
import { Box, Plus, Check } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyPackagesPage() {
  const packages = await getAgencyPackages();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-purple-400" />
            Agency Bundled Packages
          </h1>
          <p className="text-sm text-neutral-400">
            Standardized multi-service bundles offering discounted rates for recurring retainers and one-off brand overhauls.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Create Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/40 transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {pkg.badge && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-purple-600 text-white text-[10px] font-bold border-none shadow-md">
                  {pkg.badge}
                </Badge>
              </div>
            )}

            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-bold text-white">{pkg.name}</CardTitle>
              <CardDescription className="text-xs text-neutral-400 mt-1">{pkg.description}</CardDescription>

              <div className="pt-4 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{formatCurrency(pkg.price)}</span>
                <span className="text-xs text-neutral-500">
                  {pkg.billing_interval === 'monthly' ? '/ month' : 'one-time'}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-4">
              <div className="pt-4 border-t border-neutral-800/80 space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">Inclusions</span>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {(pkg.features_json || []).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                render={<Link href="/agency/quotations" />}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold mt-4"
              >
                Use in Quotation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
