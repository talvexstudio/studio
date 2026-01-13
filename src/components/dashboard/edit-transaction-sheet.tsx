
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
import type { Transaction, Category, Subcategory } from '@/lib/types';
import { EditTransactionFormValues, editTransactionSchema } from '@/lib/schemas';

interface EditTransactionSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  transaction: Transaction | null;
  onSave: (updatedTransaction: Transaction, createRule: boolean) => void;
  categories: (Category & { subcategories: Subcategory[] })[];
}

export function EditTransactionSheet({
  isOpen,
  onOpenChange,
  transaction,
  onSave,
  categories,
}: EditTransactionSheetProps) {
  const form = useForm<EditTransactionFormValues>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      description: '',
      categoryId: undefined,
      subcategoryId: undefined,
      createRule: false,
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        description: transaction.description,
        categoryId: transaction.categoryId,
        subcategoryId: transaction.subcategoryId,
        createRule: false,
      });
    }
  }, [transaction, form]);

  const selectedCategoryId = form.watch('categoryId');

  const subcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    const category = categories.find((c) => c.id === selectedCategoryId);
    return category?.subcategories || [];
  }, [selectedCategoryId, categories]);

  const onSubmit = (data: EditTransactionFormValues) => {
    if (!transaction) return;

    const updatedTransaction: Transaction = {
      ...transaction,
      description: data.description,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId,
      needsReview: false, // Mark as reviewed
    };
    onSave(updatedTransaction, data.createRule);
  };
  
  const handleCategoryChange = (categoryId: string) => {
    form.setValue('categoryId', categoryId);
    form.setValue('subcategoryId', undefined);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>
            Update the details for this transaction.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
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
            <FormField
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
            />
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
