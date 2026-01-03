import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { IncomeVsExpenseChart } from '@/components/analytics/IncomeVsExpenseChart';
import { DailyActivityChart } from '@/components/analytics/DailyActivityChart';
import { CategoryBreakdown } from '@/components/analytics/CategoryBreakdown';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { expenses as expensesApi, income as incomeApi } from '@/lib/api';
import { Expense, Income, TimeFilter } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { generateMonthlyData, generateCategoryData } from '@/lib/dashboardUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { toast } from 'sonner';

const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, incomeRes] = await Promise.all([
          expensesApi.getAll(),
          incomeApi.getAll(),
        ]);
        setExpenses(expensesRes.data);
        setIncome(incomeRes.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const days = useMemo(() => {
    switch (timeFilter) {
      case 'this-month': return new Date().getDate();
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  }, [timeFilter]);

  const { filteredExpenses, filteredIncome, previousExpenses } = useMemo(() => {
    const now = new Date();
    
    if (timeFilter === 'this-month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      
      const filteredExpenses = expenses.filter(e => new Date(e.date) >= startOfMonth);
      const filteredIncome = income.filter(i => new Date(i.date) >= startOfMonth);
      
      const previousExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d >= startOfPrevMonth && d <= endOfPrevMonth;
      });

      return { filteredExpenses, filteredIncome, previousExpenses };
    }

    const cutoff = new Date();
    cutoff.setDate(now.getDate() - days);
    // Reset time to start of day for accurate comparison
    cutoff.setHours(0, 0, 0, 0);
    
    const previousCutoff = new Date(cutoff);
    previousCutoff.setDate(cutoff.getDate() - days);

    const filteredExpenses = expenses.filter(e => new Date(e.date) >= cutoff);
    const filteredIncome = income.filter(i => new Date(i.date) >= cutoff);

    const previousExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= previousCutoff && d < cutoff;
    });

    return { filteredExpenses, filteredIncome, previousExpenses };
  }, [expenses, income, days, timeFilter]);

  const stats = useMemo(() => {
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);
    const prevTotalExpenses = previousExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
    
    const expenseChange = prevTotalExpenses > 0 
      ? ((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100 
      : 0;

    const avgDailySpending = totalExpenses / days;
    const transactionCount = filteredExpenses.length;

    return {
      savingsRate,
      expenseChange,
      avgDailySpending,
      transactionCount
    };
  }, [filteredExpenses, filteredIncome, previousExpenses, days]);

  const monthlyData = useMemo(() => generateMonthlyData(expenses, income), [expenses, income]);
  const categoryData = useMemo(() => generateCategoryData(filteredExpenses), [filteredExpenses]);

  if (loading) {
    return (
      <MainLayout>
        <PageHeader 
          title="Analytics" 
          description="Loading your financial data..."
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

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
              <SelectItem value="this-month">This Month</SelectItem>
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
                {stats.savingsRate.toFixed(1)}%
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
                stats.expenseChange >= 0 ? 'text-expense' : 'text-income'
              }`}>
                {formatPercentage(stats.expenseChange)}
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
                {formatCurrency(stats.avgDailySpending)}
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
                {stats.transactionCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <IncomeVsExpenseChart data={monthlyData} />
        <CategoryPieChart data={categoryData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyActivityChart expenses={expenses} days={days} />
        <CategoryBreakdown data={categoryData} />
      </div>
    </MainLayout>
  );
};

export default Analytics;
