import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { IncomeTable } from '@/components/income/IncomeTable';
import { AddIncomeDialog } from '@/components/income/AddIncomeDialog';
import { income as incomeApi } from '@/lib/api';
import { Income as IncomeType } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { StatCard } from '@/components/dashboard/StatCard';
import { Wallet, RefreshCw, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Income = () => {
  const [incomes, setIncomes] = useState<IncomeType[]>([]);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const { data } = await incomeApi.getAll();
      setIncomes(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch income');
    }
  };

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const recurringIncome = incomes
    .filter(i => i.isRecurring)
    .reduce((sum, i) => sum + i.amount, 0);
  const oneTimeIncome = totalIncome - recurringIncome;

  const handleAddIncome = async (income: any) => {
    try {
      const { data } = await incomeApi.create(income);
      setIncomes([data, ...incomes]);
      toast.success('Income added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add income');
    }
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Income" 
        description="Track and manage your income sources"
        actions={<AddIncomeDialog onAdd={handleAddIncome} />}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <StatCard
          title="Total Income"
          value={totalIncome}
          icon={Wallet}
          variant="income"
          delay={0}
        />
        <StatCard
          title="Recurring Income"
          value={recurringIncome}
          icon={RefreshCw}
          variant="accent"
          delay={100}
        />
        <StatCard
          title="One-time Income"
          value={oneTimeIncome}
          icon={TrendingUp}
          variant="default"
          delay={200}
        />
      </div>

      <IncomeTable 
        incomes={incomes}
        onEdit={(income) => console.log('Edit:', income)}
        onDelete={async (income) => {
          try {
            await incomeApi.delete(income.id);
            setIncomes(incomes.filter(i => i.id !== income.id));
            toast.success('Income deleted successfully');
          } catch (error) {
            console.error(error);
            toast.error('Failed to delete income');
          }
        }}
      />
    </MainLayout>
  );
};

export default Income;
