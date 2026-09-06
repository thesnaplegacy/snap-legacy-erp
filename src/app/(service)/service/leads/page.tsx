import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import { Target, Plus, Phone, Calendar, MapPin, Sparkles } from 'lucide-react';
import { DEMO_LEADS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export default async function ServiceLeadsPage() {
  const leads = DEMO_LEADS.filter(
    (l) => l.brand_id === 'b0000000-0000-0000-0000-000000000002'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Target className="w-6 h-6 text-blue-400" />
            The Snap Service Leads & Inquiries
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Incoming wedding and event inquiries from website booking forms, Instagram, and referrals.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Inquiry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leads.map((lead) => (
          <Card key={lead.id} className="border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors">
            <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold text-white">{lead.title}</CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  {lead.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] capitalize border-blue-500/40 text-blue-400 bg-blue-500/10">
                {lead.status}
              </Badge>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2 border-t border-neutral-800/80 mt-3 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Source: <strong className="text-neutral-200 capitalize">{lead.source}</strong></span>
                <span className="text-neutral-400">Estimated Budget: <strong className="text-emerald-400 font-bold">{formatCurrency(lead.value || 0)}</strong></span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-neutral-500">Close Target: {formatDate(lead.expected_close_date || '')}</span>
                <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto">
                  Convert to Quotation ➔
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
