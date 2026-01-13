'use server';

/**
 * @fileOverview This file defines a Genkit flow for importing classification rules from a text prompt.
 *
 * The flow takes a text prompt containing classification rules and returns an array of rule strings.
 *
 * @exported importRulesFromPrompt - An async function that imports classification rules from a prompt.
 * @exported ImportRulesFromPromptInput - The input type for the importRulesFromPrompt function.
 * @exported ImportRulesFromPromptOutput - The output type for the importRulesFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImportRulesFromPromptInputSchema = z.string().describe(
  'A text prompt containing classification rules, each rule on a new line.'
);

export type ImportRulesFromPromptInput = z.infer<
  typeof ImportRulesFromPromptInputSchema
>;

const ImportRulesFromPromptOutputSchema = z.array(
  z.string().describe('A classification rule extracted from the prompt.')
);

export type ImportRulesFromPromptOutput = z.infer<
  typeof ImportRulesFromPromptOutputSchema
>;

export async function importRulesFromPrompt(
  input: ImportRulesFromPromptInput
): Promise<ImportRulesFromPromptOutput> {
  return importRulesFromPromptFlow(input);
}

const importRulesFromPromptPrompt = ai.definePrompt({
  name: 'importRulesFromPromptPrompt',
  input: {schema: ImportRulesFromPromptInputSchema},
  output: {schema: ImportRulesFromPromptOutputSchema},
  prompt: `You are an expert at extracting classification rules from text.

  Given the following text, extract all classification rules. Each rule is a concise string that captures the essence of a transaction and can be used to match similar transactions based on description, amount, and source account name.

  The rules should be specific enough to avoid misclassifying unrelated transactions, but also general enough to capture variations of the same type of transaction.

  Text:
  {{input}}

  Return an array of classification rules.
  `,
});

const importRulesFromPromptFlow = ai.defineFlow(
  {
    name: 'importRulesFromPromptFlow',
    inputSchema: ImportRulesFromPromptInputSchema,
    outputSchema: ImportRulesFromPromptOutputSchema,
  },
  async input => {
    const {output} = await importRulesFromPromptPrompt(input);
    return output!;
  }
);
