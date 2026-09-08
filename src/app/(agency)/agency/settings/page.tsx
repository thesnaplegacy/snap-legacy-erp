import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Sparkles, Shield, Palette, Globe, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencySettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-400" />
            Agency Workspace Settings
          </h1>
          <p className="text-sm text-neutral-400">
            Brand configuration, default billing terms, workspace isolation keys, and member privileges.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-neutral-800 bg-neutral-900/40">
          <CardHeader className="p-5 border-b border-neutral-800">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Brand Identity & Tenant Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div>
              <label className="text-neutral-400 block mb-1">Brand Name</label>
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white font-semibold">
                The Snap Agency
              </div>
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Brand ID (UUID)</label>
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-purple-300 font-mono text-[11px]">
                b0000000-0000-0000-0000-000000000003
              </div>
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Brand Color Theme</label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#8B5CF6] border border-white/20" />
                <span className="text-neutral-300 font-mono">#8B5CF6 (Creative Indigo)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/40">
          <CardHeader className="p-5 border-b border-neutral-800">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-400" /> Financial & Invoicing Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div>
              <label className="text-neutral-400 block mb-1">Operating Currency</label>
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white">
                PKR — Pakistani Rupee (Rs.)
              </div>
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Default Retainer Billing Day</label>
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white">
                1st of every calendar month
              </div>
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Central Sync Status</label>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Two-Way Sync with The Snap Legacy HQ Ledger
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
