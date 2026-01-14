'use client';

import { Pie, PieChart, Legend, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useFlowLedger } from '@/hooks/use-flow-ledger';
import { useMemo } from 'react';

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(240, 60%, 60%)',
  'hsl(300, 60%, 60%)',
  'hsl(0, 60%, 60%)',
];

export function ExpensesChart() {
  const { transactions, categories } = useFlowLedger();

  const data = useMemo(() => {
    const expenseData = transactions
      .filter(t => t.type === 'Expense' && !t.needsReview && t.categoryId)
      .reduce((acc, t) => {
        const categoryId = t.categoryId!;
        acc[categoryId] = (acc[categoryId] || 0) + Math.abs(t.amountBase);
        return acc;
      }, {} as { [key: string]: number });

    const totalExpenses = Object.values(expenseData).reduce((sum, value) => sum + value, 0);

    const sortedData = Object.entries(expenseData)
      .map(([categoryId, value]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          name: category?.name || 'Uncategorized',
          value: value,
        };
      })
      .sort((a, b) => b.value - a.value);

    // Group small slices into "Other"
    const finalData = [];
    let otherValue = 0;
    const otherThreshold = totalExpenses * 0.03; // Categories making up less than 3% go into "Other"

    for (const item of sortedData) {
      if (item.value < otherThreshold && sortedData.length > 5) {
        otherValue += item.value;
      } else {
        finalData.push(item);
      }
    }

    if (otherValue > 0) {
      finalData.push({ name: 'Other', value: otherValue });
    }

    return finalData.slice(0, 8); // Max 8 slices
      
  }, [transactions, categories]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Breakdown of spending this month.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                formatter={(value: number) => `€${value.toFixed(2)}`}
              />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ right: -20, lineHeight: '24px' }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return percent > 0.05 ? (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  ) : null;
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No expense data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
