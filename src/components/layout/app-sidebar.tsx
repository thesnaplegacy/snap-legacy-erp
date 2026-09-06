'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCircle,
  Briefcase,
  Target,
  FolderKanban,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Landmark,
  ArrowRightLeft,
  UsersRound,
  UserCog,
  ShieldCheck,
  Package,
  FileBarChart,
  FileText,
  Settings,
  ScrollText,
  ChevronDown,
  Shield,
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

const navigation = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Business',
    icon: Briefcase,
    items: [
      { title: 'Brands', url: '/brands', icon: Building2 },
      { title: 'Clients', url: '/clients', icon: Users },
      { title: 'Leads', url: '/leads', icon: Target },
      { title: 'Projects', url: '/projects', icon: FolderKanban },
    ],
  },
  {
    title: 'Finance',
    icon: DollarSign,
    items: [
      { title: 'Overview', url: '/finance', icon: DollarSign },
      { title: 'Revenue', url: '/finance/revenue', icon: TrendingUp },
      { title: 'Expenses', url: '/finance/expenses', icon: TrendingDown },
      { title: 'Payments', url: '/finance/payments', icon: CreditCard },
      { title: 'Accounts', url: '/finance/accounts', icon: Landmark },
      { title: 'Transactions', url: '/finance/transactions', icon: ArrowRightLeft },
    ],
  },
  {
    title: 'People',
    icon: UsersRound,
    items: [
      { title: 'Employees', url: '/people/employees', icon: UserCircle },
      { title: 'Freelancers', url: '/people/freelancers', icon: UserCog },
      { title: 'Roles & Permissions', url: '/people/roles', icon: ShieldCheck },
    ],
  },
  {
    title: 'Assets',
    icon: Package,
    items: [
      { title: 'Asset Register', url: '/assets', icon: Package },
    ],
  },
  {
    title: 'Reports',
    icon: FileBarChart,
    items: [
      { title: 'Business Reports', url: '/reports/business', icon: FileBarChart },
      { title: 'Financial Reports', url: '/reports/financial', icon: FileText },
    ],
  },
  {
    title: 'System',
    icon: Settings,
    items: [
      { title: 'Users', url: '/users', icon: Users },
      { title: 'Audit Logs', url: '/audit-logs', icon: ScrollText },
      { title: 'Settings', url: '/settings', icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-neutral-800/50">
      <SidebarHeader className="border-b border-neutral-800/50 px-4 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
            <Shield className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white">The Snap Legacy</span>
            <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">HQ Command</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {navigation.map((item) => (
          <SidebarGroup key={item.title} className="py-0">
            {item.url ? (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    className={`rounded-lg transition-all duration-150 ${
                      pathname === item.url
                        ? 'bg-amber-500/10 text-amber-500 font-medium'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                    render={<Link href={item.url} />}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            ) : (
              <Collapsible
                defaultOpen={item.items?.some((sub) => pathname.startsWith(sub.url))}
                className="group/collapsible"
              >
                <SidebarGroupLabel className="px-2 py-1.5 text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
                  <CollapsibleTrigger className="flex items-center justify-between w-full hover:text-neutral-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items?.map((sub) => (
                        <SidebarMenuItem key={sub.url}>
                          <SidebarMenuButton
                            isActive={pathname === sub.url}
                            className={`rounded-lg transition-all duration-150 text-sm ${
                              pathname === sub.url
                                ? 'bg-amber-500/10 text-amber-500 font-medium'
                                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                            }`}
                            render={<Link href={sub.url} />}
                          >
                            <sub.icon className="w-4 h-4" />
                            <span>{sub.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800/50 px-4 py-3">
        <div className="text-[10px] text-neutral-600 text-center">
          The Snap Legacy ERP v1.0 — Phase 1
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
