import { Budget } from '@/types';
import { getCategoryInfo } from '@/lib/categories';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

interface BudgetProgressProps {
  budgets: Budget[];
}

export const BudgetProgress = ({ budgets }: BudgetProgressProps) => {
  const sortedBudgets = [...budgets].sort((a, b) => (b.spent / b.amount) - (a.spent / a.amount));

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Budget Overview</h3>
          <p className="text-sm text-muted-foreground">Monthly spending limits</p>
        </div>
        <a 
          href="/budgets" 
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Manage
        </a>
      </div>

      <div className="space-y-5">
        {sortedBudgets.slice(0, 5).map((budget, index) => {
          const category = getCategoryInfo(budget.category);
          const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
          const isOverBudget = budget.spent > budget.amount;
          const isNearLimit = percentage >= 80 && !isOverBudget;

          let progressColor = 'bg-primary';
          if (isOverBudget) progressColor = 'bg-expense';
          else if (isNearLimit) progressColor = 'bg-warning';

          return (
            <div 
              key={budget.id}
              className="animate-slide-in-right"
              style={{ animationDelay: `${600 + index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DynamicIcon 
                    name={category.icon} 
                    className="w-4 h-4"
                    style={{ color: category.color }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {category.name}
                  </span>
                  {isOverBudget && (
                    <AlertTriangle className="w-4 h-4 text-expense" />
                  )}
                </div>
                <div className="text-right">
                  <span className={cn(
                    'text-sm font-medium',
                    isOverBudget ? 'text-expense' : 'text-foreground'
                  )}>
                    {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {' / '}{formatCurrency(budget.amount)}
                  </span>
                </div>
              </div>

              <div className="progress-bar">
                <div 
                  className={cn('progress-bar-fill', progressColor)}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {isOverBudget && (
                <p className="text-xs text-expense mt-1">
                  Over budget by {formatCurrency(budget.spent - budget.amount)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
