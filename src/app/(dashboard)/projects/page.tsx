import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { FolderKanban } from 'lucide-react';
import { formatCurrency, formatDate, STATUS_LABELS, STATUS_VARIANTS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*, brand:brands(name, color), client:clients(name)')
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage projects across all brands</p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {!projects || projects.length === 0 ? (
            <div className="p-12 text-center">
              <FolderKanban className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
              <p className="text-xs text-neutral-600 mt-1">Projects will appear here once created</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Name</TableHead>
                  <TableHead className="text-neutral-400">Brand</TableHead>
                  <TableHead className="text-neutral-400">Client</TableHead>
                  <TableHead className="text-neutral-400">Budget</TableHead>
                  <TableHead className="text-neutral-400">Start</TableHead>
                  <TableHead className="text-neutral-400">End</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="border-neutral-800/50 hover:bg-neutral-800/30">
                    <TableCell className="font-medium text-white">{project.name}</TableCell>
                    <TableCell>
                      {project.brand ? (
                        <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: `${project.brand.color}20`, color: project.brand.color }}>
                          {project.brand.name}
                        </Badge>
                      ) : <span className="text-neutral-600 text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-neutral-400">{project.client?.name || '—'}</TableCell>
                    <TableCell className="text-neutral-300">{project.budget ? formatCurrency(Number(project.budget)) : '—'}</TableCell>
                    <TableCell className="text-neutral-500 text-xs">{formatDate(project.start_date)}</TableCell>
                    <TableCell className="text-neutral-500 text-xs">{formatDate(project.end_date)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[project.status] || 'outline'} className="text-xs">
                        {STATUS_LABELS[project.status] || project.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
