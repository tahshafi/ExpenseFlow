import { Expense, Income, DashboardStats, MonthlyData, CategoryData, ExpenseCategory } from '@/types';
import { getCategoryColor } from './categories';

// Calculate dashboard stats from expenses and income
export const calculateDashboardStats = (expenses: Expense[], income: Income[]): DashboardStats => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  const currentMonthIncome = income.filter(i => {
    const d = new Date(i.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonthIncome = income.filter(i => {
    const d = new Date(i.date);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  const totalExpenses = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = currentMonthIncome.reduce((sum, i) => sum + i.amount, 0);
  const lastMonthTotalExpenses = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastMonthTotalIncome = lastMonthIncome.reduce((sum, i) => sum + i.amount, 0);

  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  const expenseChange = lastMonthTotalExpenses > 0 
    ? ((totalExpenses - lastMonthTotalExpenses) / lastMonthTotalExpenses) * 100 
    : 0;
  
  const incomeChange = lastMonthTotalIncome > 0 
    ? ((totalIncome - lastMonthTotalIncome) / lastMonthTotalIncome) * 100 
    : 0;

  // Find highest expense category
  const categoryTotals = currentMonthExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const highestCategory = Object.entries(categoryTotals).reduce(
    (max, [category, amount]) => amount > max.amount ? { category: category as ExpenseCategory, amount } : max,
    { category: 'other' as ExpenseCategory, amount: 0 }
  );

  return {
    totalExpenses,
    totalIncome,
    savings,
    savingsRate,
    expenseChange,
    incomeChange,
    highestCategory,
    transactionCount: currentMonthExpenses.length,
    currentMonthExpenses,
  };
};

// Generate monthly trend data
export const generateMonthlyData = (expenses: Expense[], income: Income[]): MonthlyData[] => {
  const months: MonthlyData[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    const monthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    }).reduce((sum, e) => sum + e.amount, 0);

    const monthIncome = income.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    }).reduce((sum, i) => sum + i.amount, 0);

    months.push({
      month: monthName,
      expenses: Math.round(monthExpenses),
      income: Math.round(monthIncome),
    });
  }

  return months;
};

// Generate category breakdown data
export const generateCategoryData = (expenses: Expense[]): CategoryData[] => {
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount: Math.round(amount),
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: getCategoryColor(category as ExpenseCategory),
    }))
    .sort((a, b) => b.amount - a.amount);
};
