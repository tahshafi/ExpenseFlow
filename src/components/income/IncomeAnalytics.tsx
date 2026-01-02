import { Income } from '@/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { Wallet, RefreshCw, TrendingUp } from 'lucide-react';

interface IncomeAnalyticsProps {
  incomes: Income[];
}

export const IncomeAnalytics = ({ incomes }: IncomeAnalyticsProps) => {
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const recurringIncome = incomes
    .filter(i => i.isRecurring)
    .reduce((sum, i) => sum + i.amount, 0);
  const oneTimeIncome = totalIncome - recurringIncome;

  return (
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
  );
};
