'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Camera,
  LayoutDashboard,
  Users,
  Target,
  FileSpreadsheet,
  Layers,
  Sparkles,
  CalendarDays,
  FolderKanban,
  UsersRound,
  Film,
  PackageCheck,
  BookOpen,
  DollarSign,
  TrendingUp,
  Receipt,
  PiggyBank,
  Percent,
  FileBarChart,
  Settings,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const serviceNavigation = [
  {
    title: 'Dashboard',
    url: '/service',
    icon: LayoutDashboard,
  },
  {
    title: 'CRM',
    icon: Users,
    items: [
      { title: 'Leads & Inquiries', url: '/service/leads', icon: Target },
      { title: 'Clients Directory', url: '/service/clients', icon: Users },
    ],
  },
  {
    title: 'Sales & Pricing',
    icon: FileSpreadsheet,
    items: [
      { title: 'Quotations', url: '/service/quotations', icon: FileSpreadsheet },
      { title: 'Service Library', url: '/service/services', icon: Layers },
      { title: 'Packages', url: '/service/packages', icon: Sparkles },
    ],
  },
  {
    title: 'Events & Weddings',
    icon: CalendarDays,
    items: [
      { title: 'All Events', url: '/service/events', icon: CalendarDays },
      { title: 'Multi-Day Weddings', url: '/service/events/weddings', icon: FolderKanban },
      { title: 'Shoot Calendar', url: '/service/calendar', icon: CalendarDays },
    ],
  },
  {
    title: 'Production Pipeline',
    icon: Film,
    items: [
      { title: 'Team & Freelancers', url: '/service/production/team', icon: UsersRound },
      { title: 'Editing Workflow', url: '/service/production/editing', icon: Film },
      { title: 'Deliverables Vault', url: '/service/production/deliverables', icon: PackageCheck },
      { title: 'Luxury Albums', url: '/service/production/albums', icon: BookOpen },
    ],
  },
  {
    title: 'Event Finance',
    icon: DollarSign,
    items: [
      { title: 'Revenue & Contracts', url: '/service/finance/revenue', icon: TrendingUp },
      { title: 'Event Costs', url: '/service/finance/costs', icon: Receipt },
      { title: 'Payments & Ledger', url: '/service/finance/payments', icon: PiggyBank },
      { title: 'Event Profitability', url: '/service/finance/profit', icon: Percent },
    ],
  },
  {
    title: 'Analytics & Reports',
    url: '/service/reports',
    icon: FileBarChart,
  },
  {
    title: 'Brand Settings',
    url: '/service/settings',
    icon: Settings,
  },
];

export function ServiceSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-neutral-800 bg-neutral-950">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-neutral-800/80 px-4 py-3.5">
        <Link href="/service" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <Camera className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-white tracking-tight truncate flex items-center gap-1.5">
              The Snap Service
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            </span>
            <span className="text-[11px] text-blue-400/80 font-medium truncate">
              Photography & Cinema
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-2 py-3 space-y-1">
        {serviceNavigation.map((item) => {
          if (item.items) {
            const hasActiveChild = item.items.some(
              (sub) => pathname === sub.url || pathname.startsWith(sub.url + '/')
            );

            return (
              <Collapsible key={item.title} defaultOpen={hasActiveChild} className="group/collapsible">
                <SidebarGroup className="p-0">
                  <SidebarGroupLabel className="px-2 py-1.5 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                    <CollapsibleTrigger className="flex items-center justify-between w-full hover:text-white transition-colors">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-3.5 w-3.5 text-blue-400" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent className="pl-4 pt-1 space-y-0.5 border-l border-neutral-800/60 ml-4">
                      <SidebarMenu>
                        {item.items.map((sub) => {
                          const isActive = pathname === sub.url || pathname.startsWith(sub.url + '/');
                          return (
                            <SidebarMenuItem key={sub.url}>
                              <SidebarMenuButton
                                isActive={isActive}
                                className={`rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                                  isActive
                                    ? 'bg-blue-600/15 text-blue-400 font-medium border border-blue-500/30'
                                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                                }`}
                                render={<Link href={sub.url} />}
                              >
                                <sub.icon className="h-3.5 w-3.5 shrink-0" />
                                <span>{sub.title}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            );
          }

          const isActive = pathname === item.url;
          return (
            <SidebarMenu key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/80'
                  }`}
                  render={<Link href={item.url!} />}
                >
                  <item.icon className="h-4 w-4 shrink-0 text-blue-400/80" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          );
        })}
      </SidebarContent>

      {/* Switcher Footer back to Legacy HQ */}
      <SidebarFooter className="border-t border-neutral-800/80 p-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800/80 rounded-lg border border-neutral-800 transition-all duration-200 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-amber-500 group-hover:-translate-x-0.5 transition-transform" />
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-200">The Snap Legacy HQ</span>
            <span className="text-[10px] text-neutral-500">Central Command Center</span>
          </div>
        </Link>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
