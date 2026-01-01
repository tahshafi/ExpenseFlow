import { Expense, Income, Budget, ExpenseCategory, DashboardStats, MonthlyData, CategoryData } from '@/types';
import { getCategoryColor } from './categories';

// Helper to generate random date in last N days
const randomDate = (daysBack: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
};

// Generate mock expenses
export const generateMockExpenses = (): Expense[] => {
  const expenseData: Array<{ category: ExpenseCategory; description: string; minAmount: number; maxAmount: number }> = [
    { category: 'food', description: 'Grocery shopping', minAmount: 30, maxAmount: 150 },
    { category: 'food', description: 'Restaurant dinner', minAmount: 25, maxAmount: 80 },
    { category: 'food', description: 'Coffee shop', minAmount: 5, maxAmount: 15 },
    { category: 'transport', description: 'Uber ride', minAmount: 10, maxAmount: 35 },
    { category: 'transport', description: 'Gas station', minAmount: 40, maxAmount: 80 },
    { category: 'transport', description: 'Metro pass', minAmount: 50, maxAmount: 120 },
    { category: 'entertainment', description: 'Movie tickets', minAmount: 15, maxAmount: 40 },
    { category: 'entertainment', description: 'Streaming service', minAmount: 10, maxAmount: 20 },
    { category: 'entertainment', description: 'Concert tickets', minAmount: 50, maxAmount: 200 },
    { category: 'shopping', description: 'Online shopping', minAmount: 20, maxAmount: 150 },
    { category: 'shopping', description: 'Clothing store', minAmount: 40, maxAmount: 200 },
    { category: 'utilities', description: 'Electric bill', minAmount: 80, maxAmount: 200 },
    { category: 'utilities', description: 'Internet bill', minAmount: 50, maxAmount: 100 },
    { category: 'utilities', description: 'Water bill', minAmount: 30, maxAmount: 70 },
    { category: 'healthcare', description: 'Pharmacy', minAmount: 15, maxAmount: 60 },
    { category: 'healthcare', description: 'Doctor visit', minAmount: 50, maxAmount: 150 },
    { category: 'education', description: 'Online course', minAmount: 20, maxAmount: 100 },
    { category: 'education', description: 'Books', minAmount: 15, maxAmount: 50 },
    { category: 'travel', description: 'Hotel booking', minAmount: 100, maxAmount: 300 },
    { category: 'rent', description: 'Monthly rent', minAmount: 1200, maxAmount: 2000 },
    { category: 'subscriptions', description: 'Software subscription', minAmount: 10, maxAmount: 50 },
    { category: 'subscriptions', description: 'Gym membership', minAmount: 30, maxAmount: 80 },
  ];

  const expenses: Expense[] = [];
  
  for (let i = 0; i < 50; i++) {
    const data = expenseData[Math.floor(Math.random() * expenseData.length)];
    const amount = Math.round((Math.random() * (data.maxAmount - data.minAmount) + data.minAmount) * 100) / 100;
    
    expenses.push({
      id: `exp-${i + 1}`,
      userId: 'user-1',
      amount,
      category: data.category,
      description: data.description,
      date: randomDate(90),
      isWorthy: Math.random() > 0.4, // 60% worthy
      notes: Math.random() > 0.7 ? 'Additional notes here' : undefined,
      tags: Math.random() > 0.5 ? ['essential', 'recurring'].slice(0, Math.floor(Math.random() * 2) + 1) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Generate mock income
export const generateMockIncome = (): Income[] => {
  const incomeData = [
    { source: 'Salary', description: 'Monthly salary', amount: 5000, isRecurring: true },
    { source: 'Freelance', description: 'Web development project', amount: 1500, isRecurring: false },
    { source: 'Dividends', description: 'Stock dividends', amount: 200, isRecurring: true },
    { source: 'Rental', description: 'Property rental income', amount: 800, isRecurring: true },
    { source: 'Side Project', description: 'App revenue', amount: 300, isRecurring: false },
  ];

  const incomes: Income[] = [];
  
  for (let month = 0; month < 3; month++) {
    incomeData.forEach((data, index) => {
      if (data.isRecurring || Math.random() > 0.5) {
        const date = new Date();
        date.setMonth(date.getMonth() - month);
        date.setDate(Math.floor(Math.random() * 28) + 1);
        
        incomes.push({
          id: `inc-${month}-${index}`,
          userId: 'user-1',
          amount: data.amount + (Math.random() * 200 - 100),
          source: data.source,
          description: data.description,
          date,
          isRecurring: data.isRecurring,
          recurringFrequency: data.isRecurring ? 'monthly' : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });
  }

  return incomes.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Generate mock budgets
export const generateMockBudgets = (): Budget[] => {
  const now = new Date();
  const budgetCategories: Array<{ category: ExpenseCategory; amount: number }> = [
    { category: 'food', amount: 600 },
    { category: 'transport', amount: 300 },
    { category: 'entertainment', amount: 200 },
    { category: 'shopping', amount: 400 },
    { category: 'utilities', amount: 350 },
    { category: 'healthcare', amount: 150 },
    { category: 'subscriptions', amount: 100 },
  ];

  return budgetCategories.map((b, index) => ({
    id: `budget-${index}`,
    userId: 'user-1',
    category: b.category,
    amount: b.amount,
    spent: Math.round(b.amount * (0.3 + Math.random() * 0.9)),
    month: now.getMonth(),
    year: now.getFullYear(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
};

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
      percentage: Math.round((amount / total) * 100),
      color: getCategoryColor(category as ExpenseCategory),
    }))
    .sort((a, b) => b.amount - a.amount);
};

// Initialize mock data
export const mockExpenses = generateMockExpenses();
export const mockIncome = generateMockIncome();
export const mockBudgets = generateMockBudgets();
export const mockStats = calculateDashboardStats(mockExpenses, mockIncome);
export const mockMonthlyData = generateMonthlyData(mockExpenses, mockIncome);
export const mockCategoryData = generateCategoryData(mockExpenses);
