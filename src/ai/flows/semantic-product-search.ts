'use server';
/**
 * @fileOverview This file implements a Genkit flow for semantic product search suggestions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SemanticProductSearchInputSchema = z.object({
  query: z.string().describe('The user\'s search query.'),
});
export type SemanticProductSearchInput = z.infer<typeof SemanticProductSearchInputSchema>;

const ProductSuggestionSchema = z.object({
  name: z.string().describe('The name of the suggested product.'),
  description: z.string().describe('A short description.'),
  category: z.string().optional().describe('The category.'),
});

const SemanticProductSearchOutputSchema = z.object({
  suggestions: z.array(ProductSuggestionSchema).describe('A list of semantic product suggestions.'),
});
export type SemanticProductSearchOutput = z.infer<typeof SemanticProductSearchOutputSchema>;

const semanticSearchPrompt = ai.definePrompt({
  name: 'semanticProductSearchPrompt',
  input: { schema: SemanticProductSearchInputSchema },
  output: { schema: SemanticProductSearchOutputSchema },
  prompt: `You are an intelligent search assistant for "Castro Nepal" gaming store.
Suggest relevant gaming products or categories based on: "{{{query}}}".
Provide 3 to 7 distinct suggestions in JSON format.`,
});

export async function semanticProductSearch(input: SemanticProductSearchInput): Promise<SemanticProductSearchOutput> {
  return semanticProductSearchFlow(input);
}

const semanticProductSearchFlow = ai.defineFlow(
  {
    name: 'semanticProductSearchFlow',
    inputSchema: SemanticProductSearchInputSchema,
    outputSchema: SemanticProductSearchOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await semanticSearchPrompt(input);
      return output!;
    } catch (error) {
      // Return empty instead of fake hardcoded suggestions
      return { suggestions: [] };
    }
  }
);
