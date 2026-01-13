'use client';

import type { Account } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, CreditCard, Smartphone, Wallet, TrendingUp, HelpCircle, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const accountIcons: { [key in Account['type']]: React.ReactNode } = {
  bank: <Landmark className="h-4 w-4 text-muted-foreground" />,
  credit_card: <CreditCard className="h-4 w-4 text-muted-foreground" />,
  fintech: <Smartphone className="h-4 w-4 text-muted-foreground" />,
  cash: <Wallet className="h-4 w-4 text-muted-foreground" />,
  investment: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
  other: <HelpCircle className="h-4 w-4 text-muted-foreground" />,
};

export function AccountCard({ account }: { account: Account }) {
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);

  useEffect(() => {
    // In a real app, this balance would be calculated from transactions.
    // For this demo, we use a random value to simulate a live balance.
    setCurrentBalance(account.openingBalance + Math.random() * 5000 - 2500);
  }, [account.openingBalance]);

  return (
    <Card className="relative flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
            <CardTitle className="text-base font-medium">{account.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{account.institution}</p>
        </div>
        {accountIcons[account.type]}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        {currentBalance !== null ? (
            <div className="text-2xl font-bold">
            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: account.currency }).format(currentBalance)}
            </div>
        ) : (
            <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        )}
      </CardContent>
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
