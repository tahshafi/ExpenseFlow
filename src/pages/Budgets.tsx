import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { AddBudgetDialog } from '@/components/budgets/AddBudgetDialog';
import { budgets as budgetsApi } from '@/lib/api';
import { Budget } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { Plus, PiggyBank, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { toast } from 'sonner';

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const { data } = await budgetsApi.getAll();
      setBudgets(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch budgets');
    }
  };

  const handleAddBudget = async (budget: any) => {
    try {
      let response;
      if (budget.id) {
        response = await budgetsApi.update(budget.id, budget);
      } else {
        response = await budgetsApi.createOrUpdate(budget);
      }
      
      const { data } = response;
      
      const existingIndex = budgets.findIndex(b => b.id === data.id);
      if (existingIndex >= 0) {
        const newBudgets = [...budgets];
        newBudgets[existingIndex] = data;
        setBudgets(newBudgets);
        toast.success('Budget updated successfully');
      } else {
        setBudgets([data, ...budgets]);
        toast.success('Budget created successfully');
      }
      
      setIsDialogOpen(false);
      setEditingBudget(null);
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to save budget';
      toast.error(message);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleDelete = async (budget: Budget) => {
     try {
        await budgetsApi.delete(budget.id);
        setBudgets(budgets.filter(i => i.id !== budget.id));
        toast.success('Budget deleted successfully');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete budget');
      }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCount = budgets.filter(b => b.spent > b.amount).length;
  const onTrackCount = budgets.filter(b => b.spent <= b.amount).length;

  return (
    <MainLayout>
      <PageHeader 
        title="Budgets" 
        description="Set and monitor your spending limits"
        actions={
          <Button className="btn-primary" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Budget
          </Button>
        }
      />

      <AddBudgetDialog 
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingBudget(null);
        }}
        budgetToEdit={editingBudget}
        onAdd={handleAddBudget}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard
          title="Total Budget"
          value={totalBudget}
          icon={PiggyBank}
          variant="default"
          delay={0}
        />
        <StatCard
          title="Total Spent"
          value={totalSpent}
          icon={PiggyBank}
          variant={totalSpent > totalBudget ? 'expense' : 'income'}
          delay={100}
        />
        <StatCard
          title="Over Budget"
          value={overBudgetCount}
          icon={AlertTriangle}
          variant="expense"
          isCurrency={false}
          delay={200}
        />
        <StatCard
          title="On Track"
          value={onTrackCount}
          icon={CheckCircle}
          variant="income"
          isCurrency={false}
          delay={300}
        />
      </div>

      {/* Budget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, index) => (
          <div
            key={budget.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BudgetCard 
              budget={budget}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      {budgets.length === 0 && (
        <div className="glass-card p-12 text-center">
          <PiggyBank className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No budgets set
          </h3>
          <p className="text-muted-foreground mb-6">
            Create your first budget to start tracking your spending limits.
          </p>
          <Button className="btn-primary" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Budget
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default Budgets;
