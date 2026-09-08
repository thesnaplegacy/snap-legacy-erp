import { getAgencyClients } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants';
import Link from 'next/link';
import { Users, Plus, Globe, ExternalLink, Building2, Calendar, Phone, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyClientsPage() {
  const clients = await getAgencyClients();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Agency Clients Directory
          </h1>
          <p className="text-sm text-neutral-400">
            Enterprise master clients with Agency profiles, brand guidelines, and monthly budgets.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map((cp) => (
          <Card key={cp.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all group">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/20 mb-2">
                    {cp.industry || 'Business'}
                  </Badge>
                  <CardTitle className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {cp.company_name || cp.client?.name}
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    cp.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {cp.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3.5">
              {cp.notes && <p className="text-xs text-neutral-400 line-clamp-2">{cp.notes}</p>}

              <div className="space-y-1.5 pt-2 border-t border-neutral-800/60 text-xs text-neutral-400">
                {cp.client?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{cp.client.email}</span>
                  </div>
                )}
                {cp.client?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{cp.client.phone}</span>
                  </div>
                )}
                {cp.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    <a
                      href={cp.website}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline text-purple-300 truncate"
                    >
                      {cp.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Monthly Budget</span>
                  <span className="text-xs font-bold text-white">
                    {cp.monthly_budget ? formatCurrency(cp.monthly_budget) : 'Custom'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/agency/projects" />}
                  className="h-7 text-xs border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
                >
                  Projects <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
