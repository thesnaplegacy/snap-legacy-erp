import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { UserCircle } from 'lucide-react';
import { formatCurrency, formatDate, STATUS_LABELS, STATUS_VARIANTS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export default async function EmployeesPage() {
  const supabase = await createClient();
  const { data: employees } = await supabase
    .from('employees')
    .select('*, brand:brands(name, color)')
    .eq('is_archived', false)
    .order('name');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Employees</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage employees across all brands</p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {!employees || employees.length === 0 ? (
            <div className="p-12 text-center">
              <UserCircle className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Name</TableHead>
                  <TableHead className="text-neutral-400">Brand</TableHead>
                  <TableHead className="text-neutral-400">Position</TableHead>
                  <TableHead className="text-neutral-400">Department</TableHead>
                  <TableHead className="text-neutral-400">Type</TableHead>
                  <TableHead className="text-neutral-400">Hire Date</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id} className="border-neutral-800/50 hover:bg-neutral-800/30">
                    <TableCell className="font-medium text-white">{emp.name}</TableCell>
                    <TableCell>
                      {emp.brand ? (
                        <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: `${emp.brand.color}20`, color: emp.brand.color }}>
                          {emp.brand.name}
                        </Badge>
                      ) : <span className="text-neutral-600 text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-neutral-400">{emp.position || '—'}</TableCell>
                    <TableCell className="text-neutral-400">{emp.department || '—'}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs capitalize">{emp.employment_type.replace('_', ' ')}</Badge></TableCell>
                    <TableCell className="text-neutral-500 text-xs">{formatDate(emp.hire_date)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[emp.status] || 'outline'} className="text-xs">
                        {STATUS_LABELS[emp.status] || emp.status}
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
