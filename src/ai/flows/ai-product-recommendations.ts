'use server';
/**
 * @fileOverview This file implements a Genkit flow for providing AI-powered product recommendations.
 *
 * - aiProductRecommendations - A function that generates AI-powered product recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendedProductSchema = z.object({
  id: z.string().describe('A unique identifier for the recommended product (AI-generated placeholder).'),
  name: z.string().describe('The name of the recommended product.'),
  description: z.string().describe('A short description of the recommended product.'),
  price: z.number().describe('The price of the recommended product.'),
  imageUrl: z.string().url().describe('A placeholder URL for the recommended product image.'),
});

const AIProductRecommendationsInputSchema = z.object({
  recommendationType: z.enum(['trending', 'customersAlsoBought', 'similarProducts']).describe('The type of product recommendation requested.'),
  productId: z.string().optional().describe('The ID of the product for which recommendations are needed.'),
  productCategory: z.string().optional().describe('The category of the product.'),
});
export type AIProductRecommendationsInput = z.infer<typeof AIProductRecommendationsInputSchema>;

const AIProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendedProductSchema).describe('An array of AI-generated product recommendations.'),
});
export type AIProductRecommendationsOutput = z.infer<typeof AIProductRecommendationsOutputSchema>;

const InternalPromptInputSchema = AIProductRecommendationsInputSchema.extend({
  isTrending: z.boolean(),
  isCustomersAlsoBought: z.boolean(),
  isSimilarProducts: z.boolean(),
});

const recommendationPrompt = ai.definePrompt({
  name: 'aiProductRecommendationPrompt',
  input: {schema: InternalPromptInputSchema},
  output: {schema: AIProductRecommendationsOutputSchema},
  prompt: `You are a highly intelligent AI assistant for Castro Nepal gaming store.
Generate a JSON array of recommended products based on the context.

{{#if isTrending}}
  Provide 5 trending gaming products or redeem codes.
{{/if}}

{{#if isCustomersAlsoBought}}
  Suggest 3 products often bought with ID "{{{productId}}}".
{{/if}}

{{#if isSimilarProducts}}
  Suggest 4 products similar to ID "{{{productId}}}" {{#if productCategory}} (category: "{{{productCategory}}}"){{/if}}.
{{/if}}

Your response MUST be a valid JSON array matching the output schema.`,
});

export async function aiProductRecommendations(input: AIProductRecommendationsInput): Promise<AIProductRecommendationsOutput> {
  return aiProductRecommendationsFlow(input);
}

const aiProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiProductRecommendationsFlow',
    inputSchema: AIProductRecommendationsInputSchema,
    outputSchema: AIProductRecommendationsOutputSchema,
  },
  async (input) => {
    try {
      const promptInput = {
        ...input,
        isTrending: input.recommendationType === 'trending',
        isCustomersAlsoBought: input.recommendationType === 'customersAlsoBought',
        isSimilarProducts: input.recommendationType === 'similarProducts',
      };
      
      const {output} = await recommendationPrompt(promptInput);
      return output!;
    } catch (error) {
      // Removed hardcoded fallback list to prevent showing "fake" products.
      return { recommendations: [] };
    }
  },
);
