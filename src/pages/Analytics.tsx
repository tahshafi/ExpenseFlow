import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { IncomeVsExpenseChart } from '@/components/analytics/IncomeVsExpenseChart';
import { DailyActivityChart } from '@/components/analytics/DailyActivityChart';
import { CategoryBreakdown } from '@/components/analytics/CategoryBreakdown';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { 
  mockExpenses, 
  mockMonthlyData, 
  mockCategoryData,
  mockStats,
} from '@/lib/mockData';
import { TimeFilter } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');

  const avgDailySpending = mockStats.totalExpenses / 30;
  const highestDay = Math.max(...mockExpenses.map(e => e.amount));

  return (
    <MainLayout>
      <PageHeader 
        title="Analytics" 
        description="Deep dive into your financial data"
        actions={
          <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
            <SelectTrigger className="w-[150px] bg-secondary border-border">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-income/10">
              <TrendingUp className="w-5 h-5 text-income" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Savings Rate</p>
              <p className="text-xl font-bold text-income">
                {mockStats.savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-expense/10">
              <TrendingDown className="w-5 h-5 text-expense" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expense Change</p>
              <p className={`text-xl font-bold ${
                mockStats.expenseChange >= 0 ? 'text-expense' : 'text-income'
              }`}>
                {formatPercentage(mockStats.expenseChange)}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Daily Spend</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(avgDailySpending)}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Activity className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-xl font-bold text-foreground">
                {mockStats.transactionCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <IncomeVsExpenseChart data={mockMonthlyData} />
        <CategoryPieChart data={mockCategoryData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyActivityChart expenses={mockExpenses} days={30} />
        <CategoryBreakdown data={mockCategoryData} />
      </div>
    </MainLayout>
  );
};

export default Analytics;
