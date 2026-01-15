import { eachMonthOfInterval, format, isSameMonth, startOfMonth, subDays, subMonths } from 'date-fns';
import type { Transaction } from '@/lib/types';

export function getLast30DaysRange(): { start: Date; end: Date } {
  const end = new Date();
  const start = subDays(end, 29);
  return { start, end };
}

export function getLast12MonthsRange(): { start: Date; end: Date } {
  const end = new Date();
  const start = startOfMonth(subMonths(end, 11));
  return { start, end };
}

export function toDate(value: string | Date | undefined | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export type MonthlyOverviewPoint = {
  year: number;
  month: number;
  label: string;
  income: number;
  expenses: number;
};

export function buildMonthlyOverviewData(transactions: Transaction[]): MonthlyOverviewPoint[] {
  const { start, end } = getLast12MonthsRange();
  const months = eachMonthOfInterval({ start, end });

  return months.map((monthDate) => {
    const monthTransactions = transactions.filter((t) => {
      const date = toDate(t.date);
      return date ? isSameMonth(date, monthDate) : false;
    });

    const income = monthTransactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amountBase, 0);

    const expenses = monthTransactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + Math.abs(t.amountBase), 0);

    return {
      year: monthDate.getFullYear(),
      month: monthDate.getMonth(),
      label: format(monthDate, 'MMM yy'),
      income,
      expenses,
    };
  });
}
