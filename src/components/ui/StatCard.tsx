
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

export function StatCard({ title, value, icon, trend, className, valueClassName }: StatCardProps) {
  return (
    <div className={cn("glass-card p-6 flex flex-col", className)}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      
      <div className={cn("text-3xl font-semibold my-1", valueClassName)}>
        {typeof value === 'number' ? 
          new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            maximumFractionDigits: 0
          }).format(value) : 
          value
        }
      </div>
      
      {trend && (
        <div className="mt-1 flex items-center text-sm">
          <span className={cn(
            "mr-1",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-muted-foreground">from last month</span>
        </div>
      )}
    </div>
  );
}
