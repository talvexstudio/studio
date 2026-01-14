
'use client';

import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Transaction, Category, Subcategory, Account } from '@/lib/types';
import { TransactionFormValues, transactionSchema } from '@/lib/schemas';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';

interface TransactionFormSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  transaction: Partial<Transaction> | null;
  onSave: (updatedTransaction: Partial<Transaction>, createRule: boolean) => void;
  categories: (Category & { subcategories: Subcategory[] })[];
  accounts: Account[];
}

export function TransactionFormSheet({
  isOpen,
  onOpenChange,
  transaction,
  onSave,
  categories,
  accounts,
}: TransactionFormSheetProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      accountId: '',
      date: new Date(),
      description: '',
      amountBase: 0,
      type: 'Expense',
      categoryId: undefined,
      subcategoryId: undefined,
      createRule: false,
    },
  });

  const isEditing = !!transaction?.id;

  useEffect(() => {
    if (isOpen) {
        if (transaction) {
          form.reset({
            ...transaction,
            date: transaction.date ? new Date(transaction.date) : new Date(),
            createRule: false,
          });
        } else {
          form.reset({
            accountId: accounts[0]?.id || '',
            date: new Date(),
            description: '',
            amountBase: 0,
            type: 'Expense',
            categoryId: undefined,
            subcategoryId: undefined,
            createRule: false,
          });
        }
    }
  }, [transaction, isOpen, form, accounts]);

  const selectedCategoryId = form.watch('categoryId');

  const subcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    const category = categories.find((c) => c.id === selectedCategoryId);
    return category?.subcategories || [];
  }, [selectedCategoryId, categories]);

  const onSubmit = (data: TransactionFormValues) => {
    const transactionToSave: Partial<Transaction> = {
      ...transaction,
      ...data,
      amountOriginal: data.amountBase, // simplifying for now
      currencyOriginal: 'EUR',
      needsReview: false, 
    };
    onSave(transactionToSave, data.createRule);
  };
  
  const handleCategoryChange = (categoryId: string) => {
    form.setValue('categoryId', categoryId);
    form.setValue('subcategoryId', undefined);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Transaction' : 'New Transaction'}</SheetTitle>
          <SheetDescription>
            {isEditing ? 'Update the details for this transaction.' : 'Enter the details for your new transaction.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            
            {!isEditing && (
                 <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((acc) => (
                            <SelectItem key={acc.id} value={acc.id}>
                              {acc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            )}

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dinner with friends" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
                <FormField
                control={form.control}
                name="amountBase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
             
             {!isEditing && (
                 <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Expense">Expense</SelectItem>
                                <SelectItem value="Income">Income</SelectItem>
                                <SelectItem value="InternalTransfer">Internal Transfer</SelectItem>
                                <SelectItem value="Adjustment">Adjustment</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
             )}


            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={handleCategoryChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {subcategories.length > 0 && (
              <FormField
                control={form.control}
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subcategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

           {isEditing && (<FormField
              control={form.control}
              name="createRule"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Create Classification Rule</FormLabel>
                    <FormDescription>
                      Apply this classification to similar future transactions.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />)}

            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Save Changes</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
