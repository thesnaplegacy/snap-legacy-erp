import { getBrands } from '@/actions/brands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { formatDate, STATUS_VARIANTS } from '@/lib/constants';

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Brands</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage The Snap Legacy brand portfolio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <Card
            key={brand.id}
            className="border-neutral-800/50 bg-neutral-900/50 hover:bg-neutral-900/80 transition-all duration-200 group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${brand.color || '#C9A84C'}20` }}
                  >
                    <Building2
                      className="w-5 h-5"
                      style={{ color: brand.color || '#C9A84C' }}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-white">{brand.name}</CardTitle>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                      {brand.type === 'parent' ? 'Parent Company' : 'Subsidiary'}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-neutral-400 line-clamp-2">
                {brand.description || 'No description'}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/50">
                <Badge
                  variant={STATUS_VARIANTS[brand.status] || 'outline'}
                  className="text-xs"
                >
                  {brand.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <span className="text-[10px] text-neutral-600">
                  Since {formatDate(brand.created_at)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
