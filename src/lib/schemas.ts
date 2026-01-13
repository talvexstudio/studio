import { z } from 'zod';

export const editTransactionSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  createRule: z.boolean().default(false),
});

export type EditTransactionFormValues = z.infer<typeof editTransactionSchema>;
