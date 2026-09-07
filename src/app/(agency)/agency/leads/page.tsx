import { getAgencyLeads } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import Link from 'next/link';
import { Target, Plus, Phone, Mail, ArrowRight, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyLeadsPage() {
  const leads = await getAgencyLeads();

  const stages = [
    { key: 'new', label: 'New Inquiries', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { key: 'contacted', label: 'Contacted', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    { key: 'qualified', label: 'Qualified', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { key: 'proposal', label: 'Proposal Sent', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { key: 'won', label: 'Won / Signed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            Agency Leads & CRM Pipeline
          </h1>
          <p className="text-sm text-neutral-400">
            Track inquiries, discovery requirements, and conversion to active retainer contracts.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Lead
        </Button>
      </div>

      {/* Stage Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.key);

          return (
            <div key={stage.key} className="space-y-3">
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-xs font-semibold text-neutral-300">{stage.label}</span>
                <Badge variant="outline" className={`text-[10px] ${stage.color}`}>
                  {stageLeads.length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[400px] p-2 rounded-xl bg-neutral-900/30 border border-neutral-800/80">
                {stageLeads.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-xs text-neutral-600">
                    No leads
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      className="border-neutral-800 bg-neutral-950/80 hover:border-purple-500/30 transition-all cursor-pointer group"
                    >
                      <CardContent className="p-3.5 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                            {lead.title}
                          </h4>
                        </div>

                        {lead.description && (
                          <p className="text-[11px] text-neutral-400 line-clamp-2">{lead.description}</p>
                        )}

                        <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-500">
                          <span className="font-semibold text-purple-300">
                            {lead.value ? formatCurrency(lead.value) : 'TBD'}
                          </span>
                          <span>{formatDate(lead.created_at)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
