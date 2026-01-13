'use client';

import { mockCategories, mockTransactions } from '@/lib/data';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMemo } from 'react';

export function BudgetLines() {
  const budgetData = useMemo(() => {
    const expenseCategories = mockCategories.filter(c => c.type === 'expense');

    return expenseCategories.map(category => {
      const spent = mockTransactions
        .filter(t => t.categoryId === category.id && t.type === 'Expense')
        .reduce((sum, t) => sum + Math.abs(t.amountBase), 0);

      const budgeted = spent > 0 ? spent * 1.25 + 50 : 100; // Mock budget
      const progress = budgeted > 0 ? (spent / budgeted) * 100 : 0;
      const remaining = budgeted - spent;

      return {
        id: category.id,
        name: category.name,
        spent,
        budgeted,
        progress,
        remaining,
      };
    });
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Category</TableHead>
          <TableHead>Spending Progress</TableHead>
          <TableHead className="text-right">Spent</TableHead>
          <TableHead className="text-right">Budgeted</TableHead>
          <TableHead className="text-right">Remaining</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgetData.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-4">
                <Progress value={item.progress} className="w-[60%]" />
                <span className="text-sm text-muted-foreground">{item.progress.toFixed(0)}%</span>
              </div>
            </TableCell>
            <TableCell className="text-right">€{item.spent.toFixed(2)}</TableCell>
            <TableCell className="text-right">€{item.budgeted.toFixed(2)}</TableCell>
            <TableCell className={`text-right font-medium ${item.remaining < 0 ? 'text-destructive' : ''}`}>
              €{item.remaining.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
