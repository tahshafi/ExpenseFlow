import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { IncomeTable } from '@/components/income/IncomeTable';
import { AddIncomeDialog } from '@/components/income/AddIncomeDialog';
import { IncomeFilters } from '@/components/income/IncomeFilters';
import { IncomeAnalytics } from '@/components/income/IncomeAnalytics';
import { income as incomeApi } from '@/lib/api';
import type { Income, TimeFilter } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Income = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('this-month');
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const { data } = await incomeApi.getAll();
      setIncomes(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch incomes');
    }
  };

  const filteredIncomes = useMemo(() => {
    let filtered = [...incomes];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        i => i.description.toLowerCase().includes(query) ||
             i.source.toLowerCase().includes(query)
      );
    }

    // Time filter
    const now = new Date();
    
    if (timeFilter === 'this-month') {
      filtered = filtered.filter(i => {
        const d = new Date(i.date);
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
        filtered = filtered.filter(i => new Date(i.date) >= cutoffDate);
      }
    }

    return filtered;
  }, [incomes, searchQuery, timeFilter]);

  const totalAmount = filteredIncomes.reduce((sum, i) => sum + i.amount, 0);

  const handleAddIncome = async (income: any) => {
    try {
      let response;
      if (income.id) {
        response = await incomeApi.update(income.id, income);
      } else {
        response = await incomeApi.create(income);
      }

      const { data } = response;
      
      if (income.id) {
        setIncomes(incomes.map(i => i.id === data.id ? data : i));
        toast.success('Income updated successfully');
      } else {
        setIncomes([data, ...incomes]);
        toast.success('Income added successfully');
      }
      setIsDialogOpen(false);
      setEditingIncome(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save income');
    }
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setIsDialogOpen(true);
  };

  const handleDelete = async (income: Income) => {
    try {
      const incomeId = income.id || income._id;
      if (!incomeId) {
        toast.error('Invalid income ID');
        return;
      }
      await incomeApi.delete(incomeId);
      setIncomes(incomes.filter(i => i.id !== incomeId && i._id !== incomeId));
      toast.success('Income deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete income');
    }
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Income" 
        description={`${filteredIncomes.length} transactions • Total: ${formatCurrency(totalAmount)}`}
        actions={
          <Button className="btn-primary" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Income
          </Button>
        }
      />

      <AddIncomeDialog 
        onAdd={handleAddIncome}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingIncome(null);
        }}
        incomeToEdit={editingIncome}
      />

      <IncomeFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
      />

      <IncomeAnalytics incomes={filteredIncomes} />

      <IncomeTable 
        incomes={filteredIncomes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </MainLayout>
  );
};

export default Income;
