'use client';

import { RadialBar, RadialBarChart, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const data = [
  { name: 'Groceries', value: 850.50, fill: 'hsl(var(--chart-1))' },
  { name: 'Restaurants', value: 450.75, fill: 'hsl(var(--chart-2))' },
  { name: 'Transport', value: 250.00, fill: 'hsl(var(--chart-3))' },
  { name: 'Shopping', value: 600.25, fill: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 300.00, fill: 'hsl(var(--chart-5))' },
];

export function ExpensesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Breakdown of spending this month.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
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
      </CardContent>
    </Card>
  );
}
