import { Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/formatters';

interface WorthyAnalyticsProps {
  expenses: Expense[];
}

export const WorthyAnalytics = ({ expenses }: WorthyAnalyticsProps) => {
  const worthyTotal = expenses
    .filter(e => e.isWorthy !== false)
    .reduce((sum, e) => sum + e.amount, 0);

  const notWorthyTotal = expenses
    .filter(e => e.isWorthy === false)
    .reduce((sum, e) => sum + e.amount, 0);

  const total = worthyTotal + notWorthyTotal;
  const worthyPercentage = total > 0 ? (worthyTotal / total) * 100 : 0;
  const notWorthyPercentage = total > 0 ? (notWorthyTotal / total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Worthy Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {formatCurrency(worthyTotal)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={worthyPercentage} className="h-2 bg-secondary" indicatorClassName="bg-green-500" />
            <span className="text-xs text-muted-foreground w-12 text-right">{Math.round(worthyPercentage)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Not Worthy Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {formatCurrency(notWorthyTotal)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={notWorthyPercentage} className="h-2 bg-secondary" indicatorClassName="bg-red-500" />
            <span className="text-xs text-muted-foreground w-12 text-right">{Math.round(notWorthyPercentage)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
