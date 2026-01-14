'use client';

import { RadialBar, RadialBarChart, Legend, ResponsiveContainer, Tooltip } from 'recharts';
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

    const sortedData = Object.entries(expenseData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5) // Take top 5
      .map(([categoryId, value], index) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          name: category?.name || 'Other',
          value: value,
          fill: CHART_COLORS[index % CHART_COLORS.length],
        };
      });

      return sortedData;
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
            <RadialBarChart
              innerRadius="30%"
              outerRadius="100%"
              data={data}
              startAngle={90}
              endAngle={-270}
            >
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
                wrapperStyle={{ right: -10 }}
              />
              <RadialBar
                background
                dataKey="value"
                nameKey="name"
                label={{ position: 'insideStart', fill: '#fff', fontSize: '12px' }}
              />
            </RadialBarChart>
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
