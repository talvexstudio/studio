import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccountCard } from '@/components/accounts/account-card';
import { mockAccounts } from '@/lib/data';

export default function AccountsPage() {
  // In a real app, you'd fetch this data.
  const accounts = mockAccounts;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">Manage your financial accounts.</p>
        </div>
        <Button>
          <PlusCircle />
          Add Account
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
