import { KpiCard } from '@/components/dashboard/kpi-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { ExpensesChart } from '@/components/dashboard/expenses-chart';
import { ReviewTransactions } from '@/components/dashboard/review-transactions';
import { DollarSign, ArrowUp, ArrowDown, PiggyBank } from 'lucide-react';
import { mockTransactions } from '@/lib/data';

export default function DashboardPage() {
  const totalIncome = mockTransactions
    .filter((t) => t.type === 'Income' && !t.needsReview)
    .reduce((sum, t) => sum + t.amountBase, 0);

  const totalExpenses = mockTransactions
    .filter((t) => t.type === 'Expense' && !t.needsReview)
    .reduce((sum, t) => sum + t.amountBase, 0);

  const netBalance = totalIncome + totalExpenses;
  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;
  
  const transactionsToReview = mockTransactions.filter(t => t.needsReview);

  return (
    <div className="flex-1 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Income"
          value={`€${totalIncome.toFixed(2)}`}
          icon={<ArrowUp className="h-4 w-4 text-muted-foreground" />}
          description="Last 30 days"
        />
        <KpiCard
          title="Total Expenses"
          value={`€${Math.abs(totalExpenses).toFixed(2)}`}
          icon={<ArrowDown className="h-4 w-4 text-muted-foreground" />}
          description="Last 30 days"
        />
        <KpiCard
          title="Net Balance"
          value={`€${netBalance.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Income - Expenses"
        />
        <KpiCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          icon={<PiggyBank className="h-4 w-4 text-muted-foreground" />}
          description="Net / Income"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-12 lg:col-span-4">
          <OverviewChart />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <ExpensesChart />
        </div>
      </div>
      <div className="grid gap-4">
        <ReviewTransactions transactions={transactionsToReview} />
      </div>
    </div>
  );
}
