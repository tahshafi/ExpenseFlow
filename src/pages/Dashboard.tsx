import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { ExpenseTrendChart } from '@/components/dashboard/ExpenseTrendChart';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BudgetProgress } from '@/components/dashboard/BudgetProgress';
import { InsightsCard } from '@/components/dashboard/InsightsCard';
import { 
  calculateDashboardStats, 
  generateMonthlyData, 
  generateCategoryData 
} from '@/lib/mockData';
import { 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  CreditCard,
} from 'lucide-react';
import { expenses as expensesApi, income as incomeApi, budgets as budgetsApi } from '@/lib/api';
import { Expense, Income, Budget, DashboardStats, MonthlyData, CategoryData } from '@/types';
import { toast } from 'sonner';

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, incomeRes, budgetsRes] = await Promise.all([
          expensesApi.getAll(),
          incomeApi.getAll(),
          budgetsApi.getAll(),
        ]);

        const expensesData = expensesRes.data;
        const incomeData = incomeRes.data;
        let budgetsData = budgetsRes.data;

        // Calculate spent amount for each budget
        budgetsData = budgetsData.map((budget: Budget) => {
          const budgetExpenses = expensesData.filter((e: Expense) => {
            const d = new Date(e.date);
            return (
              e.category === budget.category &&
              d.getMonth() === budget.month &&
              d.getFullYear() === budget.year
            );
          });
          const spent = budgetExpenses.reduce((sum: number, e: Expense) => sum + e.amount, 0);
          return { ...budget, spent };
        });

        setExpenses(expensesData);
        setIncome(incomeData);
        setBudgets(budgetsData);

        // Calculate stats
        setStats(calculateDashboardStats(expensesData, incomeData));
        setMonthlyData(generateMonthlyData(expensesData, incomeData));
        setCategoryData(generateCategoryData(expensesData));
      } catch (error) {
        console.error(error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <MainLayout>
        <PageHeader 
          title="Dashboard" 
          description="Loading your financial overview..."
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
        title="Dashboard" 
        description="Welcome back! Here's your financial overview."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard
          title="Total Expenses"
          value={stats.totalExpenses}
          change={stats.expenseChange}
          icon={CreditCard}
          variant="expense"
          delay={0}
        />
        <StatCard
          title="Total Income"
          value={stats.totalIncome}
          change={stats.incomeChange}
          icon={Wallet}
          variant="income"
          delay={100}
        />
        <StatCard
          title="Savings"
          value={stats.savings}
          icon={PiggyBank}
          variant={stats.savings >= 0 ? 'income' : 'expense'}
          delay={200}
        />
        <StatCard
          title="Savings Rate"
          value={stats.savingsRate}
          icon={TrendingUp}
          variant="accent"
          isCurrency={false}
          delay={300}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ExpenseTrendChart data={monthlyData} />
        <CategoryPieChart data={categoryData} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions expenses={expenses} />
        <BudgetProgress budgets={budgets} />
        <InsightsCard stats={stats} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;