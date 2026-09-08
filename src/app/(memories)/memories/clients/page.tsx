import { getMemoriesClients } from '@/actions/memories-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Users,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Baby,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MemoriesClientsPage() {
  const clients = await getMemoriesClients();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#46BBD4]/15 text-xs font-semibold text-[#46BBD4] mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Central Client Master Extension</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Studio Client Directory</h1>
          <p className="text-xs text-neutral-400">
            Family dossiers, newborn milestones, cake smash sensitivities, and permanent lifetime history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((profile) => (
          <Card
            key={profile.id}
            className="border-neutral-800 bg-neutral-900/50 hover:border-[#46BBD4]/40 transition-all"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base text-white">{profile.client?.name}</CardTitle>
                  <CardDescription className="text-xs text-[#46BBD4] font-medium">
                    {profile.family_name || 'Family Profile'}
                  </CardDescription>
                </div>
                <Badge
                  variant={profile.status === 'vip' ? 'default' : 'secondary'}
                  className={profile.status === 'vip' ? 'bg-[#46BBD4] text-neutral-950 font-bold' : ''}
                >
                  {profile.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Children & Milestones */}
              {profile.children_info && profile.children_info.length > 0 && (
                <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-300">
                    <Baby className="w-3.5 h-3.5 text-[#46BBD4]" />
                    <span>Children / Milestones:</span>
                  </div>
                  {profile.children_info.map((child, idx) => (
                    <div key={idx} className="text-[11px] text-neutral-400 pl-5">
                      <span className="text-white font-medium">{child.name}</span>
                      {child.birth_date && ` • Born ${child.birth_date}`}
                      {child.notes && ` (${child.notes})`}
                    </div>
                  ))}
                </div>
              )}

              {profile.allergies_or_sensitivities && (
                <div className="text-[11px] text-amber-400 bg-amber-950/20 border border-amber-500/20 p-2 rounded-md">
                  <span className="font-semibold">Allergies/Sensitivities:</span> {profile.allergies_or_sensitivities}
                </div>
              )}

              <div className="space-y-1.5 text-xs text-neutral-400 pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{profile.client?.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{profile.client?.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{profile.client?.city || 'Faisalabad'}</span>
                </div>
              </div>

              {profile.special_instructions && (
                <p className="text-[11px] text-neutral-400 line-clamp-2 border-t border-neutral-800 pt-2">
                  <span className="font-medium text-neutral-300">Special Note:</span> {profile.special_instructions}
                </p>
              )}

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  render={<Link href="/memories/quotes" />}
                  className="text-xs h-7 border-neutral-700"
                >
                  Create Quote
                </Button>
                <Button
                  size="sm"
                  render={<Link href="/memories/sessions" />}
                  className="text-xs h-7 bg-[#46BBD4]/20 hover:bg-[#46BBD4]/30 text-[#46BBD4] border border-[#46BBD4]/30"
                >
                  View Sessions
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
