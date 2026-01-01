import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Expense } from '@/types';
import { formatCompactCurrency, formatDateShort } from '@/lib/formatters';

interface DailyActivityChartProps {
  expenses: Expense[];
  days?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-border">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <p className="text-sm text-expense">
          {formatCompactCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export const DailyActivityChart = ({ expenses, days = 30 }: DailyActivityChartProps) => {
  const data = useMemo(() => {
    const now = new Date();
    const dailyData: { date: string; amount: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayExpenses = expenses.filter(e => {
        const expDate = new Date(e.date).toISOString().split('T')[0];
        return expDate === dateStr;
      });

      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      dailyData.push({
        date: formatDateShort(date),
        amount: total,
      });
    }

    return dailyData;
  }, [expenses, days]);

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Daily Spending Activity</h3>
        <p className="text-sm text-muted-foreground">Last {days} days</p>
      </div>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(238, 84%, 67%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(238, 84%, 67%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              tickFormatter={(value) => formatCompactCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(238, 84%, 67%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDaily)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
