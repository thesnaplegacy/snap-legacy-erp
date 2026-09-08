import { getAgencyFinanceOverview } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import Link from 'next/link';
import { Receipt, Plus, Tag, FileText, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyCostsPage() {
  const finance = await getAgencyFinanceOverview();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-purple-400" />
            Agency Direct Costs & Expenses
          </h1>
          <p className="text-sm text-neutral-400">
            Ad spend, freelance videographers, stock CGI models, and production expenses synced into central finance.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Log Direct Expense
        </Button>
      </div>

      <div className="space-y-3">
        {finance.expenses.map((exp) => (
          <Card key={exp.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{exp.description}</span>
                  <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-400 border-rose-500/30">
                    {exp.category}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-400">
                  Vendor: <span className="text-neutral-200">{exp.vendor || 'Direct Expense'}</span> • Project:{' '}
                  <span className="text-purple-300">{exp.project_name || 'Agency Operation'}</span>
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">{exp.date}</span>
                  <span className="text-base font-bold text-rose-400">-{formatCurrency(exp.amount)}</span>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  {exp.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
