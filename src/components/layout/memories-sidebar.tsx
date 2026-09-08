'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  LayoutDashboard,
  Target,
  Users,
  Calendar,
  Camera,
  Flame,
  FileText,
  Boxes,
  CreditCard,
  Images,
  CheckSquare,
  Scissors,
  Package,
  ListTodo,
  Bell,
  MessageCircle,
  Share2,
  Layers,
  ShoppingBag,
  FileBarChart,
  TrendingUp,
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

const navigation = [
  {
    title: 'WORK',
    items: [
      { title: 'Overview', url: '/memories', icon: LayoutDashboard },
      { title: 'Leads CRM', url: '/memories/leads', icon: Target },
      { title: 'Clients', url: '/memories/clients', icon: Users },
      { title: 'Calendar', url: '/memories/calendar', icon: Calendar },
      { title: 'Sessions', url: '/memories/sessions', icon: Camera },
      { title: 'Shoot Day', url: '/memories/sessions/shoot-day', icon: Flame },
    ],
  },
  {
    title: 'SALES',
    items: [
      { title: 'Quotes', url: '/memories/quotes', icon: FileText },
      { title: 'Packages', url: '/memories/packages', icon: Boxes },
      { title: 'Payments', url: '/memories/payments', icon: CreditCard },
    ],
  },
  {
    title: 'PRODUCTION',
    items: [
      { title: 'Galleries', url: '/memories/galleries', icon: Images },
      { title: 'Selections', url: '/memories/selections', icon: CheckSquare },
      { title: 'Editing', url: '/memories/editing', icon: Scissors },
      { title: 'Deliverables', url: '/memories/deliverables', icon: Package },
      { title: 'Tasks', url: '/memories/tasks', icon: ListTodo },
    ],
  },
  {
    title: 'COMMUNICATION',
    items: [
      { title: 'Reminders', url: '/memories/reminders', icon: Bell },
      { title: 'Communications', url: '/memories/communications', icon: MessageCircle },
      { title: 'Follow-ups & Referrals', url: '/memories/follow-ups', icon: Share2 },
    ],
  },
  {
    title: 'CATALOG',
    items: [
      { title: 'Services', url: '/memories/services', icon: Layers },
      { title: 'Products & Frames', url: '/memories/products', icon: ShoppingBag },
    ],
  },
  {
    title: 'REPORTING',
    items: [
      { title: 'Reports', url: '/memories/reports', icon: FileBarChart },
      { title: 'Profitability', url: '/memories/profitability', icon: TrendingUp },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { title: 'Settings', url: '/memories/settings', icon: Settings },
    ],
  },
];

export function MemoriesSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-neutral-800/50">
      <SidebarHeader className="border-b border-neutral-800/50 px-4 py-4">
        <Link href="/memories" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#46BBD4]/20 to-[#57C1DA]/10 border border-[#46BBD4]/30 group-hover:border-[#46BBD4]/60 transition-colors">
            <Heart className="w-5 h-5 text-[#46BBD4]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white">Snap Memories</span>
            <span className="text-[10px] font-medium text-[#46BBD4] uppercase tracking-widest">Studio OS</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {navigation.map((group) => (
          <SidebarGroup key={group.title} className="py-1">
            <SidebarGroupLabel className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider px-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url || (item.url !== '/memories' && pathname.startsWith(item.url));
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className={`rounded-lg transition-all duration-150 ${
                          isActive
                            ? 'bg-[#46BBD4]/15 text-[#46BBD4] font-medium'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                        }`}
                        render={<Link href={item.url} />}
                      >
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-[#46BBD4]' : ''}`} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800/50 p-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500" />
          <span>Back to Legacy HQ</span>
        </Link>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
