import { CategoryData } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface CategoryBreakdownProps {
  data: CategoryData[];
}

export const CategoryBreakdown = ({ data }: CategoryBreakdownProps) => {
  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Category Breakdown</h3>
        <p className="text-sm text-muted-foreground">Detailed spending analysis</p>
      </div>

      <div className="space-y-4">
        {data.map((category, index) => (
          <div 
            key={category.category}
            className="animate-slide-in-right"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium text-foreground">
                  {category.category}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(category.amount)}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({category.percentage}%)
                </span>
              </div>
            </div>
            <div className="progress-bar h-2">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${category.percentage}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="text-lg font-bold text-foreground">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};
