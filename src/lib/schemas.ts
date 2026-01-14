import { z } from 'zod';

export const editTransactionSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  createRule: z.boolean().default(false),
});

export type EditTransactionFormValues = z.infer<typeof editTransactionSchema>;

export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required."),
  type: z.enum(['bank', 'credit_card', 'fintech', 'cash', 'investment', 'other']),
  currency: z.string().length(3, "Currency must be a 3-letter code."),
  institution: z.string().min(1, "Institution is required."),
  openingBalance: z.number().default(0),
});

export const workspaceSchema = z.object({
    name: z.string().min(1, 'Workspace name is required.'),
});
