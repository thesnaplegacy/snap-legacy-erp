import { getMemoriesLeads } from '@/actions/memories-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import Link from 'next/link';
import {
  Target,
  Plus,
  Phone,
  Mail,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  Filter,
  MessageCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MemoriesLeadsPage() {
  const leads = await getMemoriesLeads();

  const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'QUOTE_SENT', 'CONVERTED', 'LOST'] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#46BBD4]/15 text-xs font-semibold text-[#46BBD4] mb-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>Studio Inquiries & CRM</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Studio Leads Pipeline</h1>
          <p className="text-xs text-neutral-400">
            Track inquiries for newborn, milestone, birthday, and family sessions with duplicate client protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            render={<Link href="/memories/quotes" />}
            className="bg-[#46BBD4] hover:bg-[#3ba8be] text-neutral-950 font-bold text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Quotation
          </Button>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => {
          const columnLeads = leads.filter((l) => l.status === status);
          return (
            <div key={status} className="space-y-3 min-w-[220px]">
              <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-xs font-bold tracking-wider text-neutral-300">{status}</span>
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                  {columnLeads.length}
                </Badge>
              </div>

              <div className="space-y-2.5">
                {columnLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    className="border-neutral-800 bg-neutral-900/50 hover:border-[#46BBD4]/50 transition-all p-3 space-y-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{lead.name}</span>
                        <Badge variant="outline" className="text-[9px] border-neutral-700 text-neutral-400">
                          {lead.source}
                        </Badge>
                      </div>
                      <Badge className="text-[10px] bg-[#46BBD4]/15 text-[#46BBD4] border-0 font-medium">
                        {lead.service_interest}
                      </Badge>
                    </div>

                    {lead.child_name && (
                      <p className="text-[11px] text-neutral-400">
                        Baby/Child: <span className="text-neutral-200">{lead.child_name}</span>{' '}
                        {lead.child_age_or_milestone && `(${lead.child_age_or_milestone})`}
                      </p>
                    )}

                    <div className="space-y-1 pt-1 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#46BBD4]" />
                        <span>{lead.phone}</span>
                      </div>
                      {lead.preferred_session_date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-neutral-500" />
                          <span>Pref: {lead.preferred_session_date}</span>
                        </div>
                      )}
                      {lead.budget && (
                        <div className="text-neutral-300 font-medium">
                          Budget: {formatCurrency(Number(lead.budget))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-neutral-800/80">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#46BBD4] hover:underline"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </a>

                      {lead.status !== 'CONVERTED' && (
                        <Button
                          size="sm"
                          render={<Link href="/memories/quotes" />}
                          className="text-[10px] h-6 px-2 bg-neutral-800 hover:bg-neutral-700 text-white"
                        >
                          Quote
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}

                {columnLeads.length === 0 && (
                  <div className="p-4 rounded-lg border border-dashed border-neutral-800 text-center text-xs text-neutral-600">
                    No leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
