import { getServiceEditingTasks } from '@/actions/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/constants';
import { Film, Clock, CheckCircle2, AlertCircle, PlaySquare, RefreshCw, UserCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STAGES = [
  'files_received',
  'in_progress',
  'internal_review',
  'client_proof',
  'revision',
  'approved',
  'delivered',
];

export default async function EditingWorkflowPage() {
  const tasks = await getServiceEditingTasks();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Film className="w-6 h-6 text-blue-400" />
            10-Stage Editing & Post-Production Pipeline
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track video color grading, teaser cuts, highlight films, and client revisions with strict deadline monitoring.
          </p>
        </div>
      </div>

      {/* Editing Stages Progress Tracker */}
      <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-wrap gap-2 items-center justify-between text-xs">
        {STAGES.map((stage, i) => (
          <div key={stage} className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-[10px]">
              {i + 1}
            </span>
            <span className="capitalize font-medium text-neutral-300">
              {stage.replace(/_/g, ' ')}
            </span>
            {i < STAGES.length - 1 && <span className="text-neutral-600 hidden md:inline">➔</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors">
            <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-white">{task.title}</h3>
                  <Badge
                    variant="outline"
                    className={`text-[10px] capitalize ${
                      task.status === 'in_progress'
                        ? 'border-blue-500/40 text-blue-400 bg-blue-500/10'
                        : task.status === 'files_received'
                        ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                        : 'border-neutral-700 text-neutral-400'
                    }`}
                  >
                    {task.status.replace(/_/g, ' ')}
                  </Badge>
                  {task.priority === 'high' && (
                    <Badge variant="outline" className="text-[10px] border-red-500/40 text-red-400 bg-red-500/10">
                      High Priority
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-neutral-400 flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Editor: <strong className="text-neutral-200">{task.editor_name || 'Unassigned'}</strong></span>
                  <span className="text-neutral-600">•</span>
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Deadline: <strong className="text-amber-400">{formatDate(task.deadline)}</strong></span>
                </p>
                {task.notes && (
                  <p className="text-[11px] text-neutral-500 italic pt-1">
                    Note: {task.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-start lg:self-center">
                <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-950 text-xs">
                  Review Cut
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                  Update Stage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
