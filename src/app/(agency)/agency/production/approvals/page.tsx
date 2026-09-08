import { getAgencyApprovals } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/constants';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Clock, Plus, History, MessageSquare, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyApprovalsPage() {
  const approvals = await getAgencyApprovals();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-purple-400" />
            Client Approvals & Revision History
          </h1>
          <p className="text-sm text-neutral-400">
            Audit-logged client sign-offs, revision tickets, feedback comments, and timestamps.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Request New Approval
        </Button>
      </div>

      <div className="space-y-4">
        {approvals.map((app) => (
          <Card key={app.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30">
                      Revision #{app.revision_number}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] bg-neutral-800 text-neutral-400">
                      {app.item_type.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-white">{app.item_title}</CardTitle>
                  <CardDescription className="text-xs text-neutral-400">
                    Project: {app.project_name || 'Agency Project'}
                  </CardDescription>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    app.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : app.status === 'revision_requested'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  }`}
                >
                  {app.status.replace(/_/g, ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3">
              {app.feedback_comments && (
                <div className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                    <span>Client Feedback:</span>
                  </div>
                  <p className="text-xs text-neutral-400 pl-5">{app.feedback_comments}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-neutral-800/60 text-xs text-neutral-500">
                <span>
                  Reviewer: <strong className="text-neutral-300">{app.reviewer_name || 'Client Contact'}</strong>{' '}
                  {app.reviewer_email && `(${app.reviewer_email})`}
                </span>
                <span>
                  {app.client_action_at ? `Signed on ${formatDate(app.client_action_at)}` : 'Awaiting client action'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
