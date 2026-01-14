'use client';

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccountCard } from '@/components/accounts/account-card';
import { useFlowLedger } from '@/hooks/use-flow-ledger';
import { AccountFormSheet } from '@/components/accounts/account-form-sheet';
import { useState } from 'react';
import type { Account } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { archiveAccount, deleteAccount, saveAccount } from '@/lib/services/accounts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function AccountsPage() {
  const { accounts, workspaceId, reloadAccounts } = useFlowLedger();
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsSheetOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsSheetOpen(true);
  };

  const handleSaveAccount = async (values: Partial<Account>) => {
    if (!workspaceId) return;

    try {
      await saveAccount(workspaceId, values);
      toast({
        title: `Account ${values.id ? 'updated' : 'created'}`,
        description: `The account "${values.name}" has been successfully saved.`,
      });
      reloadAccounts();
      setIsSheetOpen(false);
    } catch (error) {
      console.error('Failed to save account:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'An error occurred while saving the account. Please try again.',
      });
    }
  };

  const handleArchiveAccount = async (account: Account) => {
    try {
      await archiveAccount(account.id);
      toast({
        title: 'Account Archived',
        description: `The account "${account.name}" has been archived.`,
      });
      reloadAccounts();
    } catch (error) {
      console.error('Failed to archive account:', error);
      toast({
        variant: 'destructive',
        title: 'Archive Failed',
        description: 'Could not archive the account. Please try again.',
      });
    }
  };

  const handleDeleteAccount = async (account: Account) => {
    try {
      await deleteAccount(account.id);
      toast({
        title: 'Account Deleted',
        description: `The account "${account.name}" has been deleted.`,
      });
      reloadAccounts();
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: error.message || 'Could not delete the account. Please try again.',
      });
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">Manage your financial accounts.</p>
        </div>
        <Button onClick={handleAddAccount}>
          <PlusCircle />
          Add Account
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {accounts.filter(a => !a.archived).map((account) => (
          <AccountCard 
            key={account.id} 
            account={account}
            onEdit={() => handleEditAccount(account)}
            onArchive={() => handleArchiveAccount(account)}
            onDelete={() => handleDeleteAccount(account)}
          />
        ))}
      </div>

       <AccountFormSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        account={editingAccount}
        onSave={handleSaveAccount}
      />
    </div>
  );
}
