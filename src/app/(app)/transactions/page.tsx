'use client';

import { TransactionsDataTable } from "@/components/transactions/data-table";
import { useFlowLedger } from "@/hooks/use-flow-ledger";
import { TransactionFormSheet } from "@/components/transactions/transaction-form-sheet";
import { useState } from "react";
import type { Transaction } from "@/lib/types";
import { confirmTransaction, deleteTransaction, saveTransaction } from "@/lib/services/transactions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


export default function TransactionsPage() {
    const { toast } = useToast();
    const { categories, accounts, reloadTransactions, workspaceId } = useFlowLedger();
    const [sheetState, setSheetState] = useState<{ open: boolean; transaction: Partial<Transaction> | null }>({ open: false, transaction: null });
    const [deleteState, setDeleteState] = useState<{ open: boolean; transaction: Transaction | null }>({ open: false, transaction: null });
    
    const handleNew = () => {
        setSheetState({ open: true, transaction: null });
    }

    const handleEdit = (transaction: Transaction) => {
        setSheetState({ open: true, transaction });
    }

    const handleDelete = (transaction: Transaction) => {
        setDeleteState({ open: true, transaction });
    }

    const handleConfirmDelete = async () => {
        if (!workspaceId || !deleteState.transaction) return;
        try {
            await deleteTransaction(workspaceId, deleteState.transaction.id);
            await reloadTransactions();
            toast({
              title: "Transaction Deleted",
              description: "The transaction has been successfully removed.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Delete failed',
                description: 'Could not delete the transaction.',
            });
        } finally {
            setDeleteState({ open: false, transaction: null });
        }
    };
    
    const handleSave = async (updatedTransaction: Partial<Transaction>, createRule: boolean) => {
      if (!workspaceId) return;
        try {
            await saveTransaction(workspaceId, updatedTransaction);
            await reloadTransactions();
            toast({
              title: `Transaction ${updatedTransaction.id ? 'Updated' : 'Created'}`,
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
                title: 'Save failed',
                description: 'Could not save transaction changes.',
            });
        } finally {
            setSheetState({ open: false, transaction: null });
        }
    };

    const handleConfirm = async (transaction: Transaction) => {
        if (!workspaceId || !transaction.id) return;
        try {
            await confirmTransaction(workspaceId, transaction.id);
            await reloadTransactions();
            toast({
                title: 'Transaction Confirmed',
                description: 'The transaction has been confirmed and is no longer under review.',
            });
        } catch (error) {
            console.error(error);
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
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
              <p className="text-muted-foreground">View and manage all your transactions.</p>
            </div>
             <Button onClick={handleNew}>
              <PlusCircle />
              New Transaction
            </Button>
        </div>
        <TransactionsDataTable onEdit={handleEdit} onConfirm={handleConfirm} onDelete={handleDelete} />
      </div>
      <TransactionFormSheet 
        isOpen={sheetState.open}
        onOpenChange={(open) => { if (!open) setSheetState({ open: false, transaction: null }) }}
        transaction={sheetState.transaction}
        onSave={handleSave}
        categories={categories}
        accounts={accounts.filter(a => !a.archived)}
      />
       <AlertDialog open={deleteState.open} onOpenChange={(open) => { if (!open) setDeleteState({ open: false, transaction: null })}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
