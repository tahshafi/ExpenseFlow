import { Expense } from '@/types';
import { getCategoryInfo } from '@/lib/categories';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
}

export const ExpenseTable = ({ expenses, onEdit, onDelete }: ExpenseTableProps) => {
  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Description</TableHead>
            <TableHead className="text-muted-foreground">Category</TableHead>
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead className="text-muted-foreground text-right">Amount</TableHead>
            <TableHead className="text-muted-foreground w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense, index) => {
            const category = getCategoryInfo(expense.category);
            
            return (
              <TableRow 
                key={expense.id}
                className="table-row-hover border-border animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <DynamicIcon 
                        name={category.icon} 
                        className="w-4 h-4"
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{expense.description}</p>
                      {expense.notes && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {expense.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span 
                    className="badge-category"
                    style={{ 
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                    }}
                  >
                    {category.name}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(expense.date)}
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold amount-negative">
                    -{formatCurrency(expense.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem 
                        onClick={() => onEdit?.(expense)}
                        className="cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete?.(expense)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {expenses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No expenses found</p>
        </div>
      )}
    </div>
  );
};
