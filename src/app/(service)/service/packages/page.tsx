import { getServicePackages } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import { Sparkles, Check, Plus, Camera, Film } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PackagesPage() {
  const packages = await getServicePackages();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-blue-400" />
            The Snap Service Packages
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Pre-configured service tiers preserved from existing operations (Silver, Gold, Platinum).
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`border-neutral-800 bg-neutral-900/60 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:border-blue-500/50 ${
              pkg.featured ? 'border-blue-500/50 ring-1 ring-blue-500/30' : ''
            }`}
          >
            {pkg.badge && (
              <div className="absolute top-3 right-3">
                <Badge
                  className={
                    pkg.featured
                      ? 'bg-blue-600 text-white border-0 text-[10px] font-bold'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 text-[10px]'
                  }
                >
                  {pkg.badge}
                </Badge>
              </div>
            )}

            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-xl font-bold text-white">{pkg.name}</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Complete photo & cinema bundle
              </CardDescription>
              <div className="pt-4">
                <span className="text-3xl font-extrabold text-white">
                  {formatCurrency(pkg.price)}
                </span>
                <span className="text-xs text-neutral-500 ml-1.5">/ event</span>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-3 flex-1">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                What&apos;s Included:
              </p>
              <ul className="space-y-2">
                {pkg.features_json.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="p-6 pt-2 border-t border-neutral-800/80">
              <Button
                variant={pkg.featured ? 'default' : 'outline'}
                className={`w-full text-xs font-semibold ${
                  pkg.featured
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                    : 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                Apply to Quotation
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
