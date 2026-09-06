import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <Shield className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">404</h1>
          <p className="text-neutral-500 mt-2">Page not found</p>
        </div>
        <Button
          variant="outline"
          className="border-neutral-700 hover:bg-neutral-800"
          render={<Link href="/" />}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
