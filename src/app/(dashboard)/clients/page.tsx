import { getClients } from '@/actions/clients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users } from 'lucide-react';
import { formatDate, STATUS_VARIANTS, STATUS_LABELS } from '@/lib/constants';

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Clients</h1>
          <p className="text-sm text-neutral-500 mt-1">Central client database across all brands</p>
        </div>
      </div>

      <Card className="border-neutral-800/50 bg-neutral-900/50">
        <CardContent className="p-0">
          {clients.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-500">No data available</p>
              <p className="text-xs text-neutral-600 mt-1">Clients will appear here once created</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800/50 hover:bg-transparent">
                  <TableHead className="text-neutral-400">Name</TableHead>
                  <TableHead className="text-neutral-400">Company</TableHead>
                  <TableHead className="text-neutral-400">Email</TableHead>
                  <TableHead className="text-neutral-400">Phone</TableHead>
                  <TableHead className="text-neutral-400">Type</TableHead>
                  <TableHead className="text-neutral-400">Brands</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                  <TableHead className="text-neutral-400">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="border-neutral-800/50 hover:bg-neutral-800/30">
                    <TableCell className="font-medium text-white">{client.name}</TableCell>
                    <TableCell className="text-neutral-400">{client.company || '—'}</TableCell>
                    <TableCell className="text-neutral-400">{client.email || '—'}</TableCell>
                    <TableCell className="text-neutral-400">{client.phone || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {client.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {client.client_brand_associations?.map((assoc: { id: string; brand?: { name: string; color: string } }) => (
                          <Badge
                            key={assoc.id}
                            variant="secondary"
                            className="text-[10px] px-1.5"
                            style={{
                              backgroundColor: `${assoc.brand?.color || '#666'}20`,
                              color: assoc.brand?.color || '#666',
                              borderColor: `${assoc.brand?.color || '#666'}30`,
                            }}
                          >
                            {assoc.brand?.name || 'Unknown'}
                          </Badge>
                        )) || <span className="text-neutral-600 text-xs">None</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[client.status] || 'outline'} className="text-xs">
                        {STATUS_LABELS[client.status] || client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-500 text-xs">{formatDate(client.created_at)}</TableCell>
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
