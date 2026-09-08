import { getAgencyProjects } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import Link from 'next/link';
import { FolderKanban, Plus, Calendar, ArrowRight, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyProjectsPage() {
  const projects = await getAgencyProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-purple-400" />
            Agency Projects & Client Workspaces
          </h1>
          <p className="text-sm text-neutral-400">
            Lifecycle command for retainer clients, brand identity redesigns, and high-impact digital campaigns.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Create Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <Card
            key={proj.id}
            className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all flex flex-col justify-between group"
          >
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    proj.project_type === 'retainer'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}
                >
                  {proj.project_type}
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  {proj.status}
                </Badge>
              </div>

              <CardTitle className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mt-2">
                {proj.name}
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Client: {proj.client?.name || 'Commercial Client'}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              {proj.description && (
                <p className="text-xs text-neutral-400 line-clamp-2">{proj.description}</p>
              )}

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Contract Value</span>
                  <span className="text-sm font-bold text-white">{formatCurrency(proj.contract_value)}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`/agency/projects/${proj.id}`} />}
                  className="h-8 text-xs border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200"
                >
                  Open Command <ArrowRight className="w-3.5 h-3.5 ml-1 text-purple-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
