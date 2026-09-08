import { getAgencyTasks } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckSquare, Plus, Clock, User, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyTasksPage() {
  const tasks = await getAgencyTasks();

  const columns = [
    { key: 'todo', label: 'To Do', color: 'bg-neutral-800 text-neutral-300' },
    { key: 'in_progress', label: 'In Production', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { key: 'review', label: 'Internal Review', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { key: 'completed', label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-purple-400" />
            Creative Task Production Board
          </h1>
          <p className="text-sm text-neutral-400">
            Sprint management for Graphic Designers, Video Editors, 3D Motion Artists, and Copywriters.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);

          return (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-xs font-bold text-neutral-300">{col.label}</span>
                <Badge variant="outline" className={`text-[10px] ${col.color}`}>
                  {colTasks.length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[420px] p-2 rounded-xl bg-neutral-900/30 border border-neutral-800/80">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-xs text-neutral-600">
                    No active tasks
                  </div>
                ) : (
                  colTasks.map((t) => (
                    <Card
                      key={t.id}
                      className="border-neutral-800 bg-neutral-950/80 hover:border-purple-500/30 transition-all cursor-pointer group"
                    >
                      <CardContent className="p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline" className="text-[9px] bg-purple-500/10 text-purple-400 border-purple-500/20">
                            {t.task_type}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-[9px] ${
                              t.priority === 'urgent'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {t.priority}
                          </Badge>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                          {t.title}
                        </h4>

                        {t.notes && <p className="text-[11px] text-neutral-400 line-clamp-2">{t.notes}</p>}

                        <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-500">
                          <span>Assignee: <strong className="text-neutral-300">{t.assignee_name || 'Team'}</strong></span>
                          <span>Due {t.deadline}</span>
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
