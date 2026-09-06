import { getSettings } from '@/actions/settings';
import { getBrands } from '@/actions/brands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon } from 'lucide-react';
import { formatDateTime } from '@/lib/constants';

interface SettingRow {
  id: string;
  brand_id: string | null;
  category: string;
  key: string;
  value: unknown;
  description: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export default async function SettingsPage() {
  const settings: SettingRow[] = await getSettings();
  const brands = await getBrands();

  // Group settings by brand
  const brandMap = new Map(brands.map((b) => [b.id, b]));
  const grouped: Record<string, SettingRow[]> = {};
  for (const s of settings) {
    const key = s.brand_id || 'global';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Persistent database-backed settings — survive across browsers, devices, and deployments
        </p>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <Card className="border-neutral-800/50 bg-neutral-900/50">
          <CardContent className="p-12 text-center">
            <SettingsIcon className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500">No data available</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([brandId, brandSettings]) => {
          const brand = brandId !== 'global' ? (brandMap.get(brandId) as Record<string, any> | undefined) : null;
          // Group by category within brand
          const categories: Record<string, SettingRow[]> = {};
          for (const s of brandSettings) {
            if (!categories[s.category]) categories[s.category] = [];
            categories[s.category].push(s);
          }

          return (
            <Card key={brandId} className="border-neutral-800/50 bg-neutral-900/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {Boolean(brand) && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: (brand?.color as string) || '#C9A84C' }}
                    />
                  )}
                  <CardTitle className="text-base text-white">
                    {brand ? (brand.name as string) : 'Global'} Settings
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(categories).map(([category, catSettings]) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 capitalize">
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {catSettings.map((setting) => {
                        let displayValue = '';
                        try {
                          const parsed = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
                          displayValue = typeof parsed === 'object' ? JSON.stringify(parsed, null, 2) : String(parsed);
                        } catch {
                          displayValue = String(setting.value);
                        }

                        return (
                          <div key={setting.id} className="flex items-start justify-between py-2 border-b border-neutral-800/30 last:border-0">
                            <div className="space-y-0.5">
                              <p className="text-sm text-white font-medium">{setting.key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                              {setting.description && (
                                <p className="text-xs text-neutral-500">{setting.description}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary" className="text-xs font-mono">
                                {displayValue.length > 30 ? displayValue.slice(0, 30) + '...' : displayValue}
                              </Badge>
                              <p className="text-[10px] text-neutral-600 mt-1">
                                Updated {formatDateTime(setting.updated_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
