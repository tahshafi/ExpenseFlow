import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryData } from '@/types';
import { formatCurrency } from '@/lib/formatters';

interface CategoryPieChartProps {
  data: CategoryData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card p-3 border border-border">
        <p className="text-sm font-medium text-foreground">{data.category}</p>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(data.amount)} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export const CategoryPieChart = ({ data }: CategoryPieChartProps) => {
  const topCategories = data.slice(0, 5);
  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Spending by Category</h3>
        <p className="text-sm text-muted-foreground">Where your money goes</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Chart */}
        <div className="w-full lg:w-1/2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topCategories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="amount"
              >
                {topCategories.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full lg:w-1/2 space-y-3">
          {topCategories.map((category, index) => (
            <div 
              key={category.category}
              className="flex items-center justify-between animate-slide-in-right"
              style={{ animationDelay: `${400 + index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-foreground">{category.category}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(category.amount)}
                </p>
                <p className="text-xs text-muted-foreground">{category.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Spending</span>
          <span className="text-lg font-bold text-foreground">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};
