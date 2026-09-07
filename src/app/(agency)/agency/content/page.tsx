import { getAgencyContent } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Image as ImageIcon, Plus, Calendar, Film, Share2, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyContentQueuePage() {
  const contentItems = await getAgencyContent();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-purple-400" />
            Social Media Content Queue & Assets
          </h1>
          <p className="text-sm text-neutral-400">
            Post copy, carousels, vertical reels, dynamic captions, and production statuses.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Create Content Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {contentItems.map((item) => (
          <Card key={item.id} className="border-neutral-800 bg-neutral-900/40 hover:border-purple-500/30 transition-all flex flex-col justify-between overflow-hidden">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30">
                  {item.platform} • {item.content_type}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    item.status === 'Approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : item.status === 'Client Review'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {item.status}
                </Badge>
              </div>

              <CardTitle className="text-base font-bold text-white mt-2">{item.title}</CardTitle>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3">
              {item.caption && (
                <p className="text-xs text-neutral-300 bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80 line-clamp-3">
                  {item.caption}
                </p>
              )}

              <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Scheduled: <strong className="text-purple-300">{item.scheduled_date}</strong></span>
                <span>{item.designer_name ? `Designer: ${item.designer_name}` : 'Team assigned'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
