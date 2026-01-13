'use client';

import { KpiCard } from '@/components/dashboard/kpi-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { ExpensesChart } from '@/components/dashboard/expenses-chart';
import { ReviewTransactions } from '@/components/dashboard/review-transactions';
import { DollarSign, ArrowUp, ArrowDown, PiggyBank, Sparkles, TriangleAlert } from 'lucide-react';
import { mockTransactions, mockAccounts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { Transaction, Account } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DashboardPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState(mockTransactions);
  const [accounts, setAccounts] = useState(mockAccounts);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const loadDemoData = () => {
    try {
      // In a real app, these would be API calls.
      // We simulate success here.
      setAccounts(mockAccounts);
      setTransactions(mockTransactions);
      
      toast({
        title: 'Demo Data Loaded',
        description: 'Sample accounts and transactions have been added to your workspace.',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Failed to load demo data',
        description: 'An error occurred while loading the demo data. Please try again.',
      });
    }
  }
  
  const handleLoadDemoClick = () => {
    const isWorkspaceEmpty = accounts.length === 0 && transactions.length === 0;
    if (isWorkspaceEmpty) {
      loadDemoData();
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handleReplaceData = () => {
    // In a real app, this would be an API call to delete workspace data.
    // Here, we just clear the local state.
    setAccounts([]);
    setTransactions([]);
    
    // Use a short timeout to ensure state updates before loading new data
    setTimeout(() => {
        loadDemoData();
    }, 100);

    setShowConfirmDialog(false);
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'Income' && !t.needsReview)
    .reduce((sum, t) => sum + t.amountBase, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'Expense' && !t.needsReview)
    .reduce((sum, t) => sum + t.amountBase, 0);

  const netBalance = totalIncome + totalExpenses;
  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;
  
  const transactionsToReview = transactions.filter(t => t.needsReview);

  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex justify-end">
          <Button onClick={handleLoadDemoClick} variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            Load Demo Data
          </Button>
        </div>
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
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
               <TriangleAlert className="text-destructive mr-2" />
               Replace existing data with demo data?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This workspace already contains accounts and transactions. If you continue, all existing data in this workspace will be deleted and replaced with demo data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReplaceData} className="bg-destructive hover:bg-destructive/90">Replace Data</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
