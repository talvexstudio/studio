'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating classification rules based on a transaction.
 *
 * The flow takes transaction details as input and returns a suggested classification rule.
 *
 * @exported generateClassificationRule - An async function that generates a classification rule for a given transaction.
 * @exported GenerateClassificationRuleInput - The input type for the generateClassificationRule function.
 * @exported GenerateClassificationRuleOutput - The output type for the generateClassificationRule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateClassificationRuleInputSchema = z.object({
  description: z.string().describe('The transaction description.'),
  rawDescription: z.string().describe('The raw transaction description from the bank statement.'),
  amount: z.number().describe('The transaction amount.'),
  sourceAccountName: z.string().describe('The name of the account the transaction belongs to.'),
  categoryId: z.string().describe('The ID of the category to assign to the transaction.'),
  subcategoryId: z.string().describe('The ID of the subcategory to assign to the transaction.'),
});

export type GenerateClassificationRuleInput = z.infer<
  typeof GenerateClassificationRuleInputSchema
>;

const GenerateClassificationRuleOutputSchema = z.object({
  rule: z.string().describe('The suggested classification rule as a string.'),
});

export type GenerateClassificationRuleOutput = z.infer<
  typeof GenerateClassificationRuleOutputSchema
>;

export async function generateClassificationRule(
  input: GenerateClassificationRuleInput
): Promise<GenerateClassificationRuleOutput> {
  return generateClassificationRuleFlow(input);
}

const generateClassificationRulePrompt = ai.definePrompt({
  name: 'generateClassificationRulePrompt',
  input: {schema: GenerateClassificationRuleInputSchema},
  output: {schema: GenerateClassificationRuleOutputSchema},
  prompt: `You are an expert at generating classification rules for financial transactions.

  Given the following transaction details, create a classification rule that can be used to automatically categorize similar transactions in the future.

  Description: {{{description}}}
  Raw Description: {{{rawDescription}}}
  Amount: {{{amount}}}
  Source Account Name: {{{sourceAccountName}}}
  Category ID: {{{categoryId}}} : {{{categoryId}}}
  Subcategory ID: {{{subcategoryId}}} : {{{subcategoryId}}}

  The classification rule should be a concise string that captures the essence of the transaction and can be used to match similar transactions based on description, amount, and source account name.

  The rule should be specific enough to avoid misclassifying unrelated transactions, but also general enough to capture variations of the same type of transaction.

  Return only the classification rule string. Do not add any explanations or other text.
  `,
});

const generateClassificationRuleFlow = ai.defineFlow(
  {
    name: 'generateClassificationRuleFlow',
    inputSchema: GenerateClassificationRuleInputSchema,
    outputSchema: GenerateClassificationRuleOutputSchema,
  },
  async input => {
    const {output} = await generateClassificationRulePrompt(input);
    return output!;
  }
);
