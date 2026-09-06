import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
  iconColor = 'text-amber-500',
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'border-neutral-800/50 bg-neutral-900/50 backdrop-blur-sm hover:bg-neutral-900/80 transition-all duration-200',
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              {title}
            </p>
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-neutral-500">{subtitle}</p>
            )}
          </div>
          <div className={cn('p-2 rounded-lg bg-neutral-800/50', iconColor.replace('text-', 'text-'))}>
            <Icon className={cn('w-5 h-5', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
