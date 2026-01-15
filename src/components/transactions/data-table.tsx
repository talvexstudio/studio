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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListFilter, Calendar as CalendarIcon, Check, Edit, MoreVertical, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { useFlowLedger } from '@/hooks/use-flow-ledger';
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuCheckboxItem } from '../ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import type { DateRange } from 'react-day-picker';
import { endOfDay, format } from 'date-fns';

const ITEMS_PER_PAGE = 20;

interface TransactionsDataTableProps {
  onEdit: (transaction: Transaction) => void;
  onConfirm: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionsDataTable({ onEdit, onConfirm, onDelete }: TransactionsDataTableProps) {
  const { accounts, categories, transactions } = useFlowLedger();
  const [accountFilter, setAccountFilter] = React.useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  const getCategoryName = (catId?: string) => categories.find(c => c.id === catId)?.name || 'Uncategorized';
  const getAccountName = (accId: string) => accounts.find(a => a.id === accId)?.name || 'Unknown';
  
  const activeAccounts = React.useMemo(() => accounts.filter(a => !a.archived), [accounts]);

  const filteredTransactions = React.useMemo(() => {
    let data = [...transactions];
    if (accountFilter.length > 0) {
      data = data.filter(t => accountFilter.includes(t.accountId));
    }
    if (categoryFilter.length > 0) {
      data = data.filter(t => t.categoryId && categoryFilter.includes(t.categoryId));
    }
    if (dateRange?.from) {
      data = data.filter(t => new Date(t.date) >= dateRange.from!);
    }
    if (dateRange?.to) {
      // Set time to end of day to include all transactions on the 'to' date
      const toDate = endOfDay(dateRange.to);
      data = data.filter(t => new Date(t.date) <= toDate);
    }
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, accountFilter, categoryFilter, dateRange]);
  
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleAccountFilter = (accountId: string) => {
    setAccountFilter(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const toggleCategoryFilter = (categoryId: string) => {
    setCategoryFilter(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  const clearFilters = () => {
    setAccountFilter([]);
    setCategoryFilter([]);
    setDateRange(undefined);
    setCurrentPage(1);
  };
  
  const activeFiltersCount = [accountFilter, categoryFilter, dateRange].filter(f => f && (Array.isArray(f) ? f.length > 0 : f.from)).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction(s) found.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={"w-[300px] justify-start text-left font-normal"}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
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
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Accounts</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                      {activeAccounts.map(account => (
                        <DropdownMenuCheckboxItem
                            key={account.id}
                            checked={accountFilter.includes(account.id)}
                            onCheckedChange={() => toggleAccountFilter(account.id)}
                        >
                            {account.name}
                        </DropdownMenuCheckboxItem>
                        ))}
                  </DropdownMenuSubContent>
              </DropdownMenuSub>
               <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Categories</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                      {categories.map(category => (
                        <DropdownMenuCheckboxItem
                            key={category.id}
                            checked={categoryFilter.includes(category.id)}
                            onCheckedChange={() => toggleCategoryFilter(category.id)}
                        >
                            {category.name}
                        </DropdownMenuCheckboxItem>
                        ))}
                  </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
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
                <TableHead className="text-center w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((t) => (
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
                    <TableCell className="text-center">
                        <DropdownMenu
                          open={openMenuId === t.id}
                          onOpenChange={(open) => setOpenMenuId(open ? t.id : null)}
                        >
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {t.needsReview && (
                                    <DropdownMenuItem onClick={() => { setOpenMenuId(null); onConfirm(t); }}>
                                        <Check className="mr-2 h-4 w-4 text-green-500" />
                                        Confirm
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => { setOpenMenuId(null); onEdit(t); }}>
                                    <Edit className="mr-2 h-4 w-4 text-primary" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { setOpenMenuId(null); onDelete(t); }} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
         <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages || 1}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
