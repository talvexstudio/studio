'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListFilter } from 'lucide-react';
import { mockTransactions, mockAccounts, mockCategories } from '@/lib/data';
import type { Transaction } from '@/lib/types';

export function TransactionsDataTable() {
  const [transactions] = React.useState<Transaction[]>(mockTransactions);
  const [accountFilter, setAccountFilter] = React.useState<string[]>([]);

  const getCategoryName = (catId?: string) => mockCategories.find(c => c.id === catId)?.name || 'Uncategorized';
  const getAccountName = (accId: string) => mockAccounts.find(a => a.id === accId)?.name || 'Unknown';

  const filteredTransactions = React.useMemo(() => {
    let data = [...transactions];
    if (accountFilter.length > 0) {
      data = data.filter(t => accountFilter.includes(t.accountId));
    }
    return data.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, accountFilter]);

  const toggleAccountFilter = (accountId: string) => {
    setAccountFilter(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };
  
  const activeFiltersCount = accountFilter.length > 0 ? 1 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction(s) found.
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="absolute -right-2 -top-2 rounded-full p-1 h-5 w-5 justify-center">{activeFiltersCount}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockAccounts.map(account => (
              <DropdownMenuCheckboxItem
                key={account.id}
                checked={accountFilter.includes(account.id)}
                onCheckedChange={() => toggleAccountFilter(account.id)}
              >
                {account.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <TableRow key={t.id} data-state={t.needsReview ? 'selected' : ''}>
                    <TableCell className="text-muted-foreground">{new Date(t.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getAccountName(t.accountId)}</TableCell>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>
                      <Badge variant={t.isInternalTransfer ? "secondary" : "outline"}>{getCategoryName(t.categoryId)}</Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${t.amountBase > 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(t.amountBase)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* A real implementation would have pagination controls here */}
      </CardContent>
    </Card>
  );
}
