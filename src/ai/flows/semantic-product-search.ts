
'use server';
/**
 * @fileOverview This file implements a Genkit flow for semantic product search.
 * It provides intelligent, semantic auto-suggestions and understands natural language queries
 * to help users find products more accurately and efficiently.
 *
 * - semanticProductSearch - A function that handles the semantic product search process.
 * - SemanticProductSearchInput - The input type for the semanticProductSearch function.
 * - SemanticProductSearchOutput - The return type for the semanticProductSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SemanticProductSearchInputSchema = z.object({
  query: z.string().describe('The user\'s natural language search query for gaming products.'),
});
export type SemanticProductSearchInput = z.infer<typeof SemanticProductSearchInputSchema>;

const ProductSuggestionSchema = z.object({
  name: z.string().describe('The name of the suggested gaming product.'),
  description: z.string().describe('A short description of the suggested gaming product.'),
  category: z.string().optional().describe('The category of the gaming product (e.g., "PlayStation Redeem Codes", "Xbox Gift Cards", "Steam Cards").'),
});

const SemanticProductSearchOutputSchema = z.object({
  suggestions: z.array(ProductSuggestionSchema).describe('A list of semantic product suggestions based on the user\'s query.'),
});
export type SemanticProductSearchOutput = z.infer<typeof SemanticProductSearchOutputSchema>;

const semanticSearchPrompt = ai.definePrompt({
  name: 'semanticProductSearchPrompt',
  input: { schema: SemanticProductSearchInputSchema },
  output: { schema: SemanticProductSearchOutputSchema },
  prompt: `You are an intelligent product search assistant for "Castro Nepal", an e-commerce website selling console game redeem codes, digital gaming cards, and gaming products. Your goal is to provide semantic auto-suggestions and understand natural language queries.

Based on the user's query, suggest relevant gaming products or categories that a user might be looking for, even if the query is not an exact keyword match.
Think broadly about common gaming products, platforms, and redeem codes.
Provide a minimum of 3 and a maximum of 7 distinct suggestions.
For each suggestion, provide a name, a short description, and optionally a category.

User Query: "{{{query}}}"

Examples of products you might suggest:
- PlayStation Plus 12-Month Subscription
- Xbox Gift Card $50
- Nintendo eShop Card
- Steam Wallet Code
- Apex Legends Coins
- Valorant Points
- Roblox Gift Card
- Call of Duty: Modern Warfare III
- FIFA 24 Ultimate Team Points
- Google Play Gift Card

Return the suggestions in a JSON array format, strictly adhering to the output schema.`,
});

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
      console.error('Semantic Search Flow failed, using fallback suggestions:', error);
      // Fallback data ensures functionality without an API key
      return {
        suggestions: [
          {
            name: 'PlayStation Plus Subscription',
            description: 'Access online multiplayer and monthly free games.',
            category: 'PlayStation'
          },
          {
            name: 'Xbox Game Pass Ultimate',
            description: 'The ultimate gaming subscription for console and PC.',
            category: 'Xbox'
          },
          {
            name: 'Steam Wallet $50',
            description: 'Digital gift card to add funds to your Steam account.',
            category: 'Steam'
          }
        ]
      };
    }
  }
);

export async function semanticProductSearch(
  input: SemanticProductSearchInput
):
  Promise<SemanticProductSearchOutput> {
  return semanticProductSearchFlow(input);
}
