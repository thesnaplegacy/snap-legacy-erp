'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  Users,
  Target,
  Clock,
  Compass,
  FileSpreadsheet,
  FileText,
  Layers,
  Box,
  FolderKanban,
  Repeat,
  CalendarDays,
  Megaphone,
  Calendar,
  Image as ImageIcon,
  Share2,
  CheckSquare,
  Palette,
  CheckCircle2,
  PackageCheck,
  DollarSign,
  TrendingUp,
  PiggyBank,
  Receipt,
  Percent,
  FileBarChart,
  Settings,
  ChevronDown,
  ArrowLeft,
  Camera,
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

const agencyNavigation = [
  {
    title: 'Dashboard',
    url: '/agency',
    icon: LayoutDashboard,
  },
  {
    title: 'CRM',
    icon: Users,
    items: [
      { title: 'Leads & Inquiries', url: '/agency/leads', icon: Target },
      { title: 'Clients Directory', url: '/agency/clients', icon: Users },
      { title: 'Follow-ups & Radar', url: '/agency/follow-ups', icon: Clock },
      { title: 'Discovery Briefs', url: '/agency/discovery', icon: Compass },
    ],
  },
  {
    title: 'Sales & Proposals',
    icon: FileSpreadsheet,
    items: [
      { title: 'Quotations', url: '/agency/quotations', icon: FileSpreadsheet },
      { title: 'Proposals', url: '/agency/proposals', icon: FileText },
      { title: 'Service Library', url: '/agency/services', icon: Layers },
      { title: 'Packages & Bundles', url: '/agency/packages', icon: Box },
    ],
  },
  {
    title: 'Projects & Retainers',
    icon: FolderKanban,
    items: [
      { title: 'All Projects', url: '/agency/projects', icon: FolderKanban },
      { title: 'Retainer Contracts', url: '/agency/retainers', icon: Repeat },
      { title: 'Project Calendar', url: '/agency/calendar', icon: CalendarDays },
    ],
  },
  {
    title: 'Marketing & Campaigns',
    icon: Megaphone,
    items: [
      { title: 'Ad Campaigns', url: '/agency/campaigns', icon: Megaphone },
      { title: 'Content Calendar', url: '/agency/content/calendar', icon: Calendar },
      { title: 'Content Queue', url: '/agency/content', icon: ImageIcon },
      { title: 'Social Accounts', url: '/agency/social', icon: Share2 },
    ],
  },
  {
    title: 'Creative Production',
    icon: Palette,
    items: [
      { title: 'Creative Tasks', url: '/agency/production/tasks', icon: CheckSquare },
      { title: 'Production Studio', url: '/agency/production/creative', icon: Palette },
      { title: 'Client Approvals', url: '/agency/production/approvals', icon: CheckCircle2 },
      { title: 'Deliverables Vault', url: '/agency/production/deliverables', icon: PackageCheck },
    ],
  },
  {
    title: 'Agency Finance',
    icon: DollarSign,
    items: [
      { title: 'Revenue Streams', url: '/agency/finance/revenue', icon: TrendingUp },
      { title: 'Payments Received', url: '/agency/finance/payments', icon: PiggyBank },
      { title: 'Direct Costs', url: '/agency/finance/costs', icon: Receipt },
      { title: 'Project Profitability', url: '/agency/finance/profit', icon: Percent },
    ],
  },
  {
    title: 'Reports & Analytics',
    url: '/agency/reports',
    icon: FileBarChart,
  },
  {
    title: 'Brand Settings',
    url: '/agency/settings',
    icon: Settings,
  },
];

export function AgencySidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-neutral-800 bg-neutral-950">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-neutral-800/80 px-4 py-3.5">
        <Link href="/agency" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-white tracking-tight truncate flex items-center gap-1.5">
              The Snap Agency
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            </span>
            <span className="text-[11px] text-purple-400 font-medium truncate">
              Creative & Digital Marketing
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-2 py-3 space-y-1">
        {agencyNavigation.map((item) => {
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
                        <item.icon className="h-3.5 w-3.5 text-purple-400" />
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
                                    ? 'bg-purple-600/20 text-purple-300 font-medium border border-purple-500/30'
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
                      ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/80'
                  }`}
                  render={<Link href={item.url!} />}
                >
                  <item.icon className="h-4 w-4 shrink-0 text-purple-400" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          );
        })}
      </SidebarContent>

      {/* Switcher Footer */}
      <SidebarFooter className="border-t border-neutral-800/80 p-3 space-y-2">
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
        <Link
          href="/service"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900/40 hover:bg-neutral-800/60 rounded-lg border border-neutral-800/60 transition-all duration-200 group"
        >
          <Camera className="h-3.5 w-3.5 text-blue-400 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-medium text-neutral-300">The Snap Service</span>
            <span className="text-[10px] text-neutral-500">Wedding & Event Cinema</span>
          </div>
        </Link>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
