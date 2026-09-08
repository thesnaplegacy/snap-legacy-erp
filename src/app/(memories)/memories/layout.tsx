import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MemoriesSidebar } from '@/components/layout/memories-sidebar';
import { MemoriesHeader } from '@/components/layout/memories-header';
import { getCurrentUser } from '@/lib/auth/permissions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MemoriesLayout({
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
      <MemoriesSidebar />
      <SidebarInset className="bg-neutral-950 text-neutral-100">
        <MemoriesHeader user={user} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
