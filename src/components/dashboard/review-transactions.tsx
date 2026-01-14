'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Edit, MoreVertical } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { TransactionFormSheet } from '../transactions/transaction-form-sheet';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFlowLedger } from '@/hooks/use-flow-ledger';
import { confirmTransaction, saveTransaction } from '@/lib/services/transactions';

interface ReviewTransactionsProps {
  transactions: Transaction[];
}

export function ReviewTransactions({ transactions: initialTransactions }: ReviewTransactionsProps) {
  const { toast } = useToast();
  const { categories, accounts, reloadTransactions, workspaceId } = useFlowLedger();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const getCategoryName = (catId?: string) => categories.find(c => c.id === catId)?.name || 'Uncategorized';
  const getSubcategoryName = (subcatId?: string) => {
    for (const cat of categories) {
        const sub = cat.subcategories.find(s => s.id === subcatId);
        if (sub) return sub.name;
    }
    return '';
  }
  const getAccountName = (accId: string) => accounts.find(a => a.id === accId)?.name || 'Unknown Account';
  
  const handleApprove = async (transactionId: string) => {
    if (!workspaceId) return;
    try {
      await confirmTransaction(workspaceId, transactionId);
      await reloadTransactions();
      toast({
        title: "Transaction Approved",
        description: "The transaction has been successfully categorized.",
      });
    } catch(error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Approval failed',
        description: 'Could not approve transaction.'
      });
    }
  };
  
  const handleSave = async (updatedTransaction: Partial<Transaction>, createRule: boolean) => {
    if (!workspaceId) return;
    try {
        await saveTransaction(workspaceId, updatedTransaction);
        setEditingTransaction(null);
        await reloadTransactions();
        toast({
          title: "Transaction Updated",
          description: "Your changes have been saved.",
        });
        if (createRule) {
          toast({
            title: "Classification Rule Created",
            description: "A new rule has been created for similar transactions.",
          });
          // In a real app, you would call the generateClassificationRule AI flow.
          console.log('Creating classification rule for:', updatedTransaction);
        }
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Update failed',
            description: 'Could not save transaction changes.',
        });
    }
  };

  if (initialTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions to Review</CardTitle>
          <CardDescription>All your transactions are categorized. Great job!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground p-8">
            No transactions to review.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transactions to Review</CardTitle>
          <CardDescription>Confirm or edit the classification for these transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="hidden md:table-cell">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{getAccountName(transaction.accountId)}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <Badge variant="outline" className="mb-1 w-fit">{getCategoryName(transaction.categoryId)}</Badge>
                        {transaction.subcategoryId && <span className="text-xs text-muted-foreground">{getSubcategoryName(transaction.subcategoryId)}</span>}
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${transaction.amountBase > 0 ? 'text-green-600' : ''}`}>€{transaction.amountBase.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="hidden md:flex items-center justify-end">
                      <Button variant="ghost" size="icon" onClick={() => handleApprove(transaction.id)}>
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="sr-only">Approve</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingTransaction(transaction)}>
                          <Edit className="h-4 w-4 text-primary" />
                          <span className="sr-only">Edit</span>
                      </Button>
                    </div>
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleApprove(transaction.id)}>
                                    <Check className="mr-2 h-4 w-4 text-green-500" />
                                    Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditingTransaction(transaction)}>
                                    <Edit className="mr-2 h-4 w-4 text-primary" />
                                    Edit
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <TransactionFormSheet 
        isOpen={!!editingTransaction}
        onOpenChange={(open) => { if (!open) setEditingTransaction(null) }}
        transaction={editingTransaction}
        onSave={handleSave}
        categories={categories}
        accounts={accounts}
      />
    </>
  );
}
