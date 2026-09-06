import { Card, CardContent } from '@/components/ui/card';
import { FileBarChart } from 'lucide-react';

export default function BusinessReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Business Reports</h1>
        <p className="text-sm text-neutral-500 mt-1">Generate and view business performance reports</p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-12 text-center">
          <FileBarChart className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500">No data available</p>
          <p className="text-xs text-neutral-600 mt-1">
            Business reports will be generated from real database data.
            <br />
            Add clients, projects, and leads to see reports.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
