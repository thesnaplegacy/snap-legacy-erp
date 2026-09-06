import { getServiceSettings } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Shield, Landmark, Save, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ServiceSettingsPage() {
  const settings = await getServiceSettings();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-blue-400" />
          The Snap Service Brand Settings
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Brand-isolated operational configuration: invoice banking details, quotation terms, and default shoot policies.
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-2.5 text-xs text-blue-300">
        <Lock className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          <strong>Brand Isolation Guarantee:</strong> Settings modified here apply exclusively to <em>The Snap Service</em> client documents and will not alter global The Snap Legacy HQ or other sister brands.
        </span>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/60">
        <CardHeader className="p-5 border-b border-neutral-800">
          <CardTitle className="text-base font-bold text-white">Brand Profile & Contact</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Public studio credentials printed on quotations and client deliverables
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Brand Display Name</Label>
              <Input
                defaultValue={settings.brand_name}
                className="bg-neutral-950 border-neutral-800 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Tagline</Label>
              <Input
                defaultValue={settings.tagline}
                className="bg-neutral-950 border-neutral-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Official Inquiries Email</Label>
              <Input
                defaultValue={settings.email}
                className="bg-neutral-950 border-neutral-800 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Studio Phone / WhatsApp</Label>
              <Input
                defaultValue={settings.phone}
                className="bg-neutral-950 border-neutral-800 text-xs text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/60">
        <CardHeader className="p-5 border-b border-neutral-800">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-400" />
            Invoice & Quotation Banking Details
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Bank account details populated on client quotation invoices for advance transfer
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Account Title</Label>
              <Input
                defaultValue={settings.bank_account_title}
                className="bg-neutral-950 border-neutral-800 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Bank Name</Label>
              <Input
                defaultValue={settings.bank_name}
                className="bg-neutral-950 border-neutral-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">Account Number</Label>
              <Input
                defaultValue={settings.account_number}
                className="bg-neutral-950 border-neutral-800 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">IBAN</Label>
              <Input
                defaultValue={settings.iban}
                className="bg-neutral-950 border-neutral-800 text-xs text-white font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/60">
        <CardHeader className="p-5 border-b border-neutral-800">
          <CardTitle className="text-base font-bold text-white">Default Quotation Contract Terms</CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Standard payment schedule and shoot liability clauses automatically inserted on new quotations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <Textarea
            defaultValue={settings.default_terms}
            rows={4}
            className="bg-neutral-950 border-neutral-800 text-xs text-neutral-300 leading-relaxed"
          />
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save Brand Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
