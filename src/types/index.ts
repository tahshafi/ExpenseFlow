export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  _id?: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  notes?: string;
  isWorthy?: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Income {
  id: string;
  _id?: string;
  userId: string;
  amount: number;
  source: string;
  description: string;
  date: Date;
  isRecurring: boolean;
  recurringFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  _id?: string;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  spent: number;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'healthcare'
  | 'education'
  | 'travel'
  | 'rent'
  | 'subscriptions'
  | 'other';

export interface CategoryInfo {
  id: ExpenseCategory;
  name: string;
  icon: string;
  color: string;
}

export interface DashboardStats {
  totalExpenses: number;
  totalIncome: number;
  savings: number;
  savingsRate: number;
  expenseChange: number;
  incomeChange: number;
  highestCategory: {
    category: ExpenseCategory;
    amount: number;
  };
  transactionCount: number;
  currentMonthExpenses: Expense[];
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export type TimeFilter = '7d' | '30d' | '90d' | '1y' | 'all' | 'this-month';
