import { Budget } from '@/types';
import { getCategoryInfo } from '@/lib/categories';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

interface BudgetCardProps {
  budget: Budget;
  onEdit?: (budget: Budget) => void;
  onDelete?: (budget: Budget) => void;
}

export const BudgetCard = ({ budget, onEdit, onDelete }: BudgetCardProps) => {
  const category = getCategoryInfo(budget.category);
  const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
  const remaining = budget.amount - budget.spent;
  const isOverBudget = budget.spent > budget.amount;
  const isNearLimit = percentage >= 80 && !isOverBudget;

  let progressColor = 'bg-primary';
  let statusColor = 'text-primary';
  if (isOverBudget) {
    progressColor = 'bg-expense';
    statusColor = 'text-expense';
  } else if (isNearLimit) {
    progressColor = 'bg-warning';
    statusColor = 'text-warning';
  }

  return (
    <div className="glass-card p-6 hover:shadow-glow transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center w-12 h-12 rounded-xl"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <DynamicIcon 
              name={category.icon} 
              className="w-6 h-6"
              style={{ color: category.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(budget.year, budget.month).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit?.(budget)}
            className="h-8 w-8"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete?.(budget)}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-foreground">
            {formatCurrency(budget.spent)}
          </span>
          <span className="text-sm text-muted-foreground">
            of {formatCurrency(budget.amount)}
          </span>
        </div>
        <div className="progress-bar h-3">
          <div 
            className={cn('progress-bar-fill', progressColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOverBudget && <AlertTriangle className="w-4 h-4 text-expense" />}
          <span className={cn('text-sm font-medium', statusColor)}>
            {isOverBudget 
              ? `Over by ${formatCurrency(Math.abs(remaining))}`
              : `${formatCurrency(remaining)} remaining`
            }
          </span>
        </div>
        <span className={cn('text-sm font-semibold', statusColor)}>
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};
