'use client';

import { signOut } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Camera, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  user: {
    full_name: string;
    email: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl px-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-neutral-400 hover:text-white" />
        <Separator orientation="vertical" className="h-5 bg-neutral-800" />
        <span className="text-sm text-neutral-500 hidden sm:block">The Snap Legacy HQ</span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/service" />}
          className="h-8 text-xs border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-medium"
        >
          <Camera className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">The Snap Service Workspace</span>
          <span className="sm:hidden">Service</span>
          <ArrowRight className="w-3 h-3 ml-0.5 opacity-70" />
        </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-neutral-800/60 rounded-lg px-2"
            />
          }
        >
          <Avatar className="h-7 w-7 border border-neutral-700">
            <AvatarFallback className="bg-amber-500/10 text-amber-500 text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-neutral-300 hidden sm:block">
            {user?.full_name || 'User'}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800">
          <DropdownMenuLabel className="text-neutral-300">
            <div>{user?.full_name}</div>
            <div className="text-xs text-neutral-500 font-normal">{user?.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-800" />
          <DropdownMenuItem className="text-neutral-400 hover:text-white focus:bg-neutral-800">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-neutral-800" />
          <DropdownMenuItem
            className="text-red-400 hover:text-red-300 focus:bg-neutral-800"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </header>
  );
}
