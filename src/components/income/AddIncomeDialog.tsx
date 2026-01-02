import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Income } from '@/types';

interface AddIncomeDialogProps {
  onAdd?: (income: {
    amount: number;
    source: string;
    description: string;
    date: Date;
    isRecurring: boolean;
    recurringFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
    id?: string;
  }) => void;
  incomeToEdit?: Income | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AddIncomeDialog = ({ onAdd, incomeToEdit, open: controlledOpen, onOpenChange }: AddIncomeDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'yearly'>('monthly');

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  useEffect(() => {
    if (incomeToEdit) {
      setAmount(incomeToEdit.amount.toString());
      setSource(incomeToEdit.source);
      setDescription(incomeToEdit.description);
      setDate(new Date(incomeToEdit.date).toISOString().split('T')[0]);
      setIsRecurring(incomeToEdit.isRecurring || false);
      setRecurringFrequency(incomeToEdit.recurringFrequency || 'monthly');
    } else if (!open) {
      resetForm();
    }
  }, [incomeToEdit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !source || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    onAdd?.({
      amount: parseFloat(amount),
      source,
      description,
      date: new Date(date),
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      id: incomeToEdit?.id,
    });

    // toast.success(incomeToEdit ? 'Income updated successfully' : 'Income added successfully');
    if (setOpen) setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setSource('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsRecurring(false);
    setRecurringFrequency('monthly');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Income
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">{incomeToEdit ? 'Edit Income' : 'Add New Income'}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {incomeToEdit ? 'Update the details of your income source.' : 'Track a new income source by filling out the details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source" className="text-foreground">Source *</Label>
            <Input
              id="source"
              placeholder="e.g., Salary, Freelance, Dividends"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description *</Label>
            <Input
              id="description"
              placeholder="Brief description of this income"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
            <div>
              <p className="text-sm font-medium text-foreground">Recurring Income</p>
              <p className="text-xs text-muted-foreground">
                Enable if this income repeats regularly
              </p>
            </div>
            <Switch
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
          </div>

          {isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="frequency" className="text-foreground">Frequency</Label>
              <Select value={recurringFrequency} onValueChange={(v) => setRecurringFrequency(v as any)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-primary">
              Add Income
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
