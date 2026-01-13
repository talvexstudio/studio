'use server';

/**
 * @fileOverview A transaction category suggestion AI agent.
 *
 * - suggestTransactionCategories - A function that suggests categories for transactions based on their description.
 * - SuggestTransactionCategoriesInput - The input type for the suggestTransactionCategories function.
 * - SuggestTransactionCategoriesOutput - The return type for the suggestTransactionCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTransactionCategoriesInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction.'),
  transactionAmount: z
    .number()
    .describe('The amount of the transaction.'),
  existingRules: z
    .string()
    .optional()
    .describe('Existing categorization rules to guide the suggestion.'),
});
export type SuggestTransactionCategoriesInput = z.infer<
  typeof SuggestTransactionCategoriesInputSchema
>;

const SuggestTransactionCategoriesOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe('The suggested category for the transaction.'),
  confidence: z
    .number()
    .describe(
      'A number between 0 and 1 indicating the confidence level of the suggested category.'
    ),
});
export type SuggestTransactionCategoriesOutput = z.infer<
  typeof SuggestTransactionCategoriesOutputSchema
>;

export async function suggestTransactionCategories(
  input: SuggestTransactionCategoriesInput
): Promise<SuggestTransactionCategoriesOutput> {
  return suggestTransactionCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTransactionCategoriesPrompt',
  input: {schema: SuggestTransactionCategoriesInputSchema},
  output: {schema: SuggestTransactionCategoriesOutputSchema},
  prompt: `You are a personal finance assistant helping users categorize their transactions.

  Given the following transaction description, amount, and existing categorization rules, suggest a category for it.

  Transaction Description: {{{transactionDescription}}}
  Transaction Amount: {{{transactionAmount}}}
  Existing Categorization Rules: {{{existingRules}}}

  Respond in a JSON format with the suggested category and a confidence level between 0 and 1.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const suggestTransactionCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestTransactionCategoriesFlow',
    inputSchema: SuggestTransactionCategoriesInputSchema,
    outputSchema: SuggestTransactionCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
