import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Phone, Mail, MapPin, Plus, FolderKanban } from 'lucide-react';
import { DEMO_CLIENTS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export default async function ServiceClientsPage() {
  const clients = DEMO_CLIENTS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-400" />
            Central Client Profiles (Service History)
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Connected to the central The Snap Legacy client database. Seamless multi-brand profile without duplicates.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.map((client) => (
          <Card key={client.id} className="border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors">
            <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold text-white">{client.name}</CardTitle>
                <CardDescription className="text-xs text-neutral-400 flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-neutral-500" />
                  <span>{client.city}, {client.country}</span>
                  <span className="text-neutral-600">•</span>
                  <span className="capitalize">{client.type}</span>
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                {client.status}
              </Badge>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2 border-t border-neutral-800/80 mt-2 pt-3 text-xs text-neutral-300">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>{client.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-neutral-400">{client.email}</span>
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-blue-400 flex items-center gap-1 font-medium">
                  <FolderKanban className="w-3.5 h-3.5" />
                  View Wedding History
                </span>
                <span className="text-[10px] text-neutral-500">Source: {client.source}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
