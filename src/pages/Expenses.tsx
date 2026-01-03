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

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Expenses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('this-month');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    
    if (timeFilter === 'this-month') {
      filtered = filtered.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (timeFilter !== 'all') {
      const filterDays: Record<string, number> = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365,
      };
      
      const daysBack = filterDays[timeFilter];
      if (daysBack) {
        const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(e => new Date(e.date) >= cutoffDate);
      }
    }

    return filtered;
  }, [expenses, searchQuery, categoryFilter, timeFilter]);

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = async (expense: any) => {
    try {
      const expenseId = expense.id || expense._id;
      let response;
      if (expenseId) {
        response = await expensesApi.update(expenseId, expense);
      } else {
        response = await expensesApi.create(expense);
      }

      const { data } = response;
      
      if (expenseId) {
        setExpenses(expenses.map(e => (e.id === data.id || e._id === data.id) ? data : e));
        toast.success('Expense updated successfully');
      } else {
        setExpenses([data, ...expenses]);
        toast.success('Expense added successfully');
      }
      setIsDialogOpen(false);
      setEditingExpense(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save expense');
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDelete = async (expense: Expense) => {
    try {
      const expenseId = expense.id || expense._id;
      if (!expenseId) {
        toast.error('Invalid expense ID');
        return;
      }
      await expensesApi.delete(expenseId);
      setExpenses(expenses.filter(e => e.id !== expenseId && e._id !== expenseId));
      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete expense');
    }
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Expenses" 
        description={`${filteredExpenses.length} transactions • Total: ${formatCurrency(totalAmount)}`}
        actions={
          <Button className="btn-primary" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        }
      />

      <AddExpenseDialog 
        onAdd={handleAddExpense} 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingExpense(null);
        }}
        expenseToEdit={editingExpense}
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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </MainLayout>
  );
};

export default Expenses;
