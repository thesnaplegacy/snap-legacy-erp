import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ServiceSidebar } from '@/components/layout/service-sidebar';
import { ServiceHeader } from '@/components/layout/service-header';
import { getCurrentUser } from '@/lib/auth/permissions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ServiceLayout({
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
      <ServiceSidebar />
      <SidebarInset className="bg-neutral-950">
        <ServiceHeader user={user} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
