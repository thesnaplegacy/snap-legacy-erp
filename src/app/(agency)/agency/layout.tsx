import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AgencySidebar } from '@/components/layout/agency-sidebar';
import { AgencyHeader } from '@/components/layout/agency-header';
import { getCurrentUser } from '@/lib/auth/permissions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AgencySidebar />
      <SidebarInset className="bg-neutral-950 text-neutral-100">
        <AgencyHeader user={user} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
