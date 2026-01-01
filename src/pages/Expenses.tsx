import { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { ExpenseTable } from '@/components/expenses/ExpenseTable';
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters';
import { AddExpenseDialog } from '@/components/expenses/AddExpenseDialog';
import { WorthyAnalytics } from '@/components/expenses/WorthyAnalytics';
import { expenses as expensesApi } from '@/lib/api';
import { TimeFilter, Expense } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

const Expenses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await expensesApi.getAll();
      setExpenses(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch expenses');
    }
  };

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        e => e.description.toLowerCase().includes(query) ||
             e.category.toLowerCase().includes(query) ||
             e.notes?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(e => e.category === categoryFilter);
    }

    // Time filter
    const now = new Date();
    const filterDays: Record<TimeFilter, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
      'all': Infinity,
    };
    
    if (timeFilter !== 'all') {
      const daysBack = filterDays[timeFilter];
      const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(e => new Date(e.date) >= cutoffDate);
    }

    return filtered;
  }, [expenses, searchQuery, categoryFilter, timeFilter]);

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = async (expense: any) => {
    try {
      const { data } = await expensesApi.create(expense);
      setExpenses([data, ...expenses]);
      toast.success('Expense added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add expense');
    }
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Expenses" 
        description={`${filteredExpenses.length} transactions • Total: ${formatCurrency(totalAmount)}`}
        actions={<AddExpenseDialog onAdd={handleAddExpense} />}
      />

      <ExpenseFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
      />

      <WorthyAnalytics expenses={filteredExpenses} />

      <ExpenseTable 
        expenses={filteredExpenses}
        onEdit={(expense) => console.log('Edit:', expense)}
        onDelete={async (expense) => {
          try {
            await expensesApi.delete(expense.id);
            setExpenses(expenses.filter(e => e.id !== expense.id));
            toast.success('Expense deleted successfully');
          } catch (error) {
            console.error(error);
            toast.error('Failed to delete expense');
          }
        }}
      />
    </MainLayout>
  );
};

export default Expenses;
