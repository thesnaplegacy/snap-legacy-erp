import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function FinancialReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Financial Reports</h1>
        <p className="text-sm text-neutral-500 mt-1">Generate and view financial reports and statements</p>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-12 text-center">
          <FileText className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500">No data available</p>
          <p className="text-xs text-neutral-600 mt-1">
            Financial reports will be generated from real transaction data.
            <br />
            Add accounts and transactions to see reports.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
