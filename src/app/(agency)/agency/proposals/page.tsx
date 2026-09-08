import { getAgencyProposals } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/constants';
import Link from 'next/link';
import { FileText, Plus, CheckCircle2, Eye, Send, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyProposalsPage() {
  const proposals = await getAgencyProposals();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Agency Proposals & Agreements
          </h1>
          <p className="text-sm text-neutral-400">
            Professional multi-section proposals with strategy, deliverable scopes, and digital client approval.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Draft Proposal
        </Button>
      </div>

      <div className="space-y-4">
        {proposals.map((p) => (
          <Card key={p.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-purple-400 font-semibold">{p.cover_title || 'Creative Proposal'}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        p.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-white">{p.title}</CardTitle>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">Investment</span>
                  <span className="text-sm font-bold text-white">{p.investment_summary || 'Custom'}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              {p.strategy && (
                <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 text-xs text-neutral-300">
                  <strong className="text-purple-300">Strategic Direction: </strong>
                  {p.strategy}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-neutral-800/60 text-xs text-neutral-400">
                <span>
                  Scope: <strong className="text-neutral-200">{p.scope_of_work}</strong>
                </span>
                {p.client_signature && (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Signed by {p.client_signature}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
