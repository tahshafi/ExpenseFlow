import { DashboardStats } from '@/types';
import { getCategoryInfo } from '@/lib/categories';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { TrendingUp, TrendingDown, Lightbulb, AlertCircle, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightsCardProps {
  stats: DashboardStats;
}

interface Insight {
  icon: React.ElementType;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'info';
}

export const InsightsCard = ({ stats }: InsightsCardProps) => {
  const insights: Insight[] = [];

  // Savings insight
  if (stats.savingsRate > 20) {
    insights.push({
      icon: Award,
      title: 'Great savings rate!',
      description: `You're saving ${stats.savingsRate.toFixed(0)}% of your income this month.`,
      type: 'positive',
    });
  } else if (stats.savingsRate < 0) {
    insights.push({
      icon: AlertCircle,
      title: 'Spending exceeds income',
      description: `You've spent ${formatCurrency(Math.abs(stats.savings))} more than earned.`,
      type: 'warning',
    });
  }

  // Expense change insight
  if (stats.expenseChange > 10) {
    insights.push({
      icon: TrendingUp,
      title: 'Spending increased',
      description: `Your expenses are up ${formatPercentage(stats.expenseChange)} from last month.`,
      type: 'warning',
    });
  } else if (stats.expenseChange < -10) {
    insights.push({
      icon: TrendingDown,
      title: 'Spending decreased',
      description: `Great job! Expenses are down ${formatPercentage(Math.abs(stats.expenseChange))}.`,
      type: 'positive',
    });
  }

  // Top category insight
  if (stats.highestCategory.amount > 0) {
    const category = getCategoryInfo(stats.highestCategory.category);
    insights.push({
      icon: Lightbulb,
      title: `Highest spending: ${category.name}`,
      description: `You've spent ${formatCurrency(stats.highestCategory.amount)} on ${category.name.toLowerCase()}.`,
      type: 'info',
    });
  }

  const typeStyles = {
    positive: 'bg-income/10 text-income border-income/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info: 'bg-accent/10 text-accent border-accent/20',
  };

  const iconStyles = {
    positive: 'text-income',
    warning: 'text-warning',
    info: 'text-accent',
  };

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-warning" />
        <h3 className="text-lg font-semibold text-foreground">Insights</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          
          return (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border animate-slide-in-right',
                typeStyles[insight.type]
              )}
              style={{ animationDelay: `${700 + index * 100}ms` }}
            >
              <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconStyles[insight.type])} />
              <div>
                <p className="text-sm font-medium">{insight.title}</p>
                <p className="text-sm opacity-80 mt-0.5">{insight.description}</p>
              </div>
            </div>
          );
        })}

        {insights.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Keep tracking to unlock insights!</p>
          </div>
        )}
      </div>
    </div>
  );
};
