import { getAgencyTasks, getAgencyContent } from '@/actions/agency-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Palette, Film, Sparkles, Sliders, ExternalLink, Play } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgencyCreativeStudioPage() {
  const [tasks, content] = await Promise.all([getAgencyTasks(), getAgencyContent()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-purple-400" />
            Creative Production Studio
          </h1>
          <p className="text-sm text-neutral-400">
            Workstation for motion graphics rendering, sound design, color grading, and visual packaging.
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Queue New Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-white">Active Video & Motion Render Pipeline</h2>
          <Card className="border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Play className="w-5 h-5 fill-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Linker Heights 4K 3D Architectural Flythrough</h4>
                  <p className="text-xs text-neutral-400">Resolution: 3840x2160 • 60 FPS • ProRes 422 HQ</p>
                </div>
              </div>
              <Badge className="bg-purple-600 text-white text-xs">Rendering 75%</Badge>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Biryani Pizza 9:16 Vertical Reel Lookbook</h4>
                  <p className="text-xs text-neutral-400">DaVinci Resolve Color Grade • Custom Audio Sync</p>
                </div>
              </div>
              <Badge className="bg-emerald-600 text-white text-xs">Ready for Review</Badge>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Creative Team Workload</h2>
          <Card className="border-neutral-800 bg-neutral-900/40 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-semibold text-white">Ayesha Malik</span>
              <span className="text-purple-300">Creative Director</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-semibold text-white">Zunair Ahmad</span>
              <span className="text-neutral-400">Senior Graphic Designer (3 Tasks)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-semibold text-white">Muhammad Arif</span>
              <span className="text-neutral-400">3D & Motion Graphics (2 Tasks)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Umair Jabbar</span>
              <span className="text-neutral-400">Lead Video Editor (4 Tasks)</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
