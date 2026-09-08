'use client';

import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Shield,
  ExternalLink,
  Calendar,
  Camera,
} from 'lucide-react';
import type { UserWithDetails } from '@/lib/types/database';

interface AgencyHeaderProps {
  user: UserWithDetails;
}

export function AgencyHeader({ user }: AgencyHeaderProps) {
  const isSuperAdmin = user.roles.some((r) => r.role?.slug === 'ceo_super_admin' || r.role?.slug === 'super_admin' || r.role_id === 'r-001');

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-neutral-400 hover:text-white" />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Snap Agency</span>
          </div>

          <span className="text-neutral-600 hidden sm:inline">•</span>

          <span className="text-xs text-neutral-400 hidden sm:inline">
            Creative, Digital Marketing & Branding Workspace
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick link to Calendar */}
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/agency/content/calendar" />}
          className="hidden md:inline-flex h-8 text-xs border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300"
        >
          <Calendar className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
          Content Calendar
        </Button>

        {/* Quick Switch to The Snap Service */}
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/service" />}
          className="hidden lg:inline-flex h-8 text-xs border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300"
        >
          <Camera className="w-3 h-3 mr-1 text-blue-400" />
          <span>The Snap Service</span>
        </Button>

        {/* Super Admin Switcher back to Legacy HQ */}
        {isSuperAdmin && (
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/" />}
            className="h-8 text-xs border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
          >
            <Shield className="w-3 h-3 text-amber-400" />
            <span>Legacy HQ</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </Button>
        )}

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
          <div className="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-400">
            {user.full_name?.charAt(0) || 'A'}
          </div>
          <span className="text-xs font-medium text-neutral-300 hidden sm:inline">
            {user.full_name}
          </span>
        </div>
      </div>
    </header>
  );
}
