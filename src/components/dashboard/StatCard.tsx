import { ReactNode } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'default' | 'income' | 'expense' | 'accent';
  isCurrency?: boolean;
  delay?: number;
}

export const StatCard = ({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon: Icon,
  variant = 'default',
  isCurrency = true,
  delay = 0,
}: StatCardProps) => {
  const isPositiveChange = change !== undefined && change >= 0;

  const variantStyles = {
    default: 'from-primary/10 to-transparent',
    income: 'from-income/10 to-transparent',
    expense: 'from-expense/10 to-transparent',
    accent: 'from-accent/10 to-transparent',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    income: 'bg-income/10 text-income',
    expense: 'bg-expense/10 text-expense',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <div 
      className="stat-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50 rounded-xl',
        variantStyles[variant]
      )} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'p-2.5 rounded-xl',
            iconStyles[variant]
          )}>
            <Icon className="w-5 h-5" />
          </div>
          
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full',
              isPositiveChange 
                ? 'text-income bg-income/10' 
                : 'text-expense bg-expense/10'
            )}>
              {isPositiveChange ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{formatPercentage(change)}</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <p className="text-2xl lg:text-3xl font-bold text-foreground animate-number">
            {isCurrency ? formatCurrency(value) : value.toLocaleString()}
          </p>
        </div>

        {/* Label */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          {change !== undefined && (
            <p className="text-xs text-muted-foreground">{changeLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
};
