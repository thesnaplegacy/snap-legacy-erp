import type { Metadata } from 'next';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'The Snap Legacy — ERP',
  description: 'The Snap Legacy Central Command — Enterprise Resource Planning',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="min-h-screen font-sans antialiased"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
