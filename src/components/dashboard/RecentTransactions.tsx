import { Expense } from '@/types';
import { getCategoryInfo } from '@/lib/categories';
import { formatCurrency, formatRelativeDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

interface RecentTransactionsProps {
  expenses: Expense[];
}

export const RecentTransactions = ({ expenses }: RecentTransactionsProps) => {
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground">Your latest expenses</p>
        </div>
        <a 
          href="/expenses" 
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View all
        </a>
      </div>

      <div className="space-y-4">
        {recentExpenses.map((expense, index) => {
          const category = getCategoryInfo(expense.category);
          
          return (
            <div 
              key={expense.id}
              className={cn(
                'flex items-center gap-4 p-3 rounded-lg transition-colors',
                'hover:bg-secondary/50 animate-slide-in-right'
              )}
              style={{ animationDelay: `${500 + index * 50}ms` }}
            >
              {/* Category Icon */}
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <DynamicIcon 
                  name={category.icon} 
                  className="w-5 h-5"
                  style={{ color: category.color }}
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {expense.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {category.name} • {formatRelativeDate(expense.date)}
                </p>
              </div>

              {/* Amount */}
              <p className="text-sm font-semibold amount-negative">
                -{formatCurrency(expense.amount)}
              </p>
            </div>
          );
        })}
      </div>

      {recentExpenses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recent transactions</p>
        </div>
      )}
    </div>
  );
};
