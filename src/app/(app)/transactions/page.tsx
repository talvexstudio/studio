'use client';

import { TransactionsDataTable } from "@/components/transactions/data-table";
import { useFlowLedger } from "@/hooks/use-flow-ledger";
import { EditTransactionSheet } from "@/components/dashboard/edit-transaction-sheet";
import { useState } from "react";
import type { Transaction } from "@/lib/types";
import { confirmTransaction, saveTransaction } from "@/lib/services/transactions";
import { useToast } from "@/hooks/use-toast";

export default function TransactionsPage() {
    const { toast } = useToast();
    const { categories, reloadTransactions } = useFlowLedger();
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);


    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
    }
    
    const handleSave = async (updatedTransaction: Transaction, createRule: boolean) => {
        try {
            await saveTransaction(updatedTransaction);
            setEditingTransaction(null);
            reloadTransactions();
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
            toast({
                variant: 'destructive',
                title: 'Update failed',
                description: 'Could not save transaction changes.',
            });
        }
    };

    const handleConfirm = async (transaction: Transaction) => {
        try {
            await confirmTransaction(transaction.id);
            reloadTransactions();
            toast({
                title: 'Transaction Confirmed',
                description: 'The transaction has been confirmed and is no longer under review.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Confirmation failed',
                description: 'Could not confirm the transaction.',
            });
        }
    }
    
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">View and manage all your transactions.</p>
        </div>
        <TransactionsDataTable onEdit={handleEdit} onConfirm={handleConfirm}/>
      </div>
      <EditTransactionSheet 
        isOpen={!!editingTransaction}
        onOpenChange={(open) => { if (!open) setEditingTransaction(null) }}
        transaction={editingTransaction}
        onSave={handleSave}
        categories={categories}
      />
    </>
  );
}
