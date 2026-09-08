'use client';

import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Shield,
  Calendar,
  Camera,
  Sparkles,
  Flame,
} from 'lucide-react';
import type { UserWithDetails } from '@/lib/types/database';

interface MemoriesHeaderProps {
  user: UserWithDetails;
}

export function MemoriesHeader({ user }: MemoriesHeaderProps) {
  const isSuperAdmin = user.roles.some(
    (r) => r.role?.slug === 'ceo_super_admin' || r.role?.slug === 'super_admin' || r.role_id === 'r-001'
  );

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-neutral-400 hover:text-white" />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#46BBD4]/15 border border-[#46BBD4]/30 text-xs font-semibold text-[#46BBD4]">
            <Heart className="w-3.5 h-3.5 fill-[#46BBD4]/20" />
            <span>Snap Memories</span>
          </div>

          <span className="text-neutral-600 hidden sm:inline">•</span>

          <span className="text-xs text-neutral-400 hidden sm:inline">
            Luxury Studio Operating System (Newborn, Milestones & Family)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick link to Shoot Day */}
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/memories/sessions/shoot-day" />}
          className="hidden md:inline-flex h-8 text-xs border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300"
        >
          <Flame className="w-3.5 h-3.5 mr-1.5 text-[#46BBD4]" />
          Shoot Day Workstation
        </Button>

        {/* Quick link to Calendar */}
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/memories/calendar" />}
          className="hidden sm:inline-flex h-8 text-xs border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300"
        >
          <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#46BBD4]" />
          Calendar
        </Button>

        {/* Quick Switch to The Snap Service */}
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/service" />}
          className="hidden lg:inline-flex h-8 text-xs border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300"
        >
          <Camera className="w-3 h-3 mr-1 text-blue-400" />
          Service
        </Button>

        {/* Quick Switch to The Snap Agency */}
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/agency" />}
          className="hidden xl:inline-flex h-8 text-xs border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300"
        >
          <Sparkles className="w-3 h-3 mr-1 text-purple-400" />
          Agency
        </Button>

        {/* Super admin badge */}
        {isSuperAdmin && (
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
            title="Switch to The Snap Legacy HQ Command"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">HQ Admin</span>
          </Link>
        )}
      </div>
    </header>
  );
}
