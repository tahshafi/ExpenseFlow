import { Income } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { MoreHorizontal, Edit2, Trash2, RefreshCw } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface IncomeTableProps {
  incomes: Income[];
  onEdit?: (income: Income) => void;
  onDelete?: (income: Income) => void;
}

export const IncomeTable = ({ incomes, onEdit, onDelete }: IncomeTableProps) => {
  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Source</TableHead>
            <TableHead className="text-muted-foreground">Description</TableHead>
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead className="text-muted-foreground">Type</TableHead>
            <TableHead className="text-muted-foreground text-right">Amount</TableHead>
            <TableHead className="text-muted-foreground w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomes.map((income, index) => (
            <TableRow 
              key={income.id}
              className="table-row-hover border-border animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-income/10">
                    <span className="text-income font-semibold text-sm">
                      {income.source.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">{income.source}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {income.description}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(income.date)}
              </TableCell>
              <TableCell>
                {income.isRecurring ? (
                  <span className="inline-flex items-center gap-1.5 badge-category bg-accent/10 text-accent">
                    <RefreshCw className="w-3 h-3" />
                    {income.recurringFrequency}
                  </span>
                ) : (
                  <span className="badge-category bg-secondary text-muted-foreground">
                    One-time
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <span className="font-semibold amount-positive">
                  +{formatCurrency(income.amount)}
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
                      onClick={() => onEdit?.(income)}
                      className="cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(income)}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {incomes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No income entries found</p>
        </div>
      )}
    </div>
  );
};
