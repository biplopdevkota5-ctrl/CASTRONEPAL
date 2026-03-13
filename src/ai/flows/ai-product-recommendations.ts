
'use server';
/**
 * @fileOverview This file implements a Genkit flow for providing AI-powered product recommendations.
 *
 * - aiProductRecommendations - A function that generates AI-powered product recommendations.
 * - AIProductRecommendationsInput - The input type for the aiProductRecommendations function.
 * - AIProductRecommendationsOutput - The return type for the aiProductRecommendations function.
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
  recommendationType: z.enum(['trending', 'customersAlsoBought', 'similarProducts']).describe('The type of product recommendation requested. Can be "trending", "customersAlsoBought", or "similarProducts".'),
  productId: z.string().optional().describe('The ID of the product for which recommendations are needed (required for "customersAlsoBought" and "similarProducts" types).'),
  productCategory: z.string().optional().describe('The category of the product, used to refine "similarProducts" recommendations.'),
});
export type AIProductRecommendationsInput = z.infer<typeof AIProductRecommendationsInputSchema>;

const AIProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendedProductSchema).describe('An array of AI-generated product recommendations.'),
});
export type AIProductRecommendationsOutput = z.infer<typeof AIProductRecommendationsOutputSchema>;

// Internal schema for the prompt that includes boolean flags for easier Handlebars templating
const InternalPromptInputSchema = AIProductRecommendationsInputSchema.extend({
  isTrending: z.boolean(),
  isCustomersAlsoBought: z.boolean(),
  isSimilarProducts: z.boolean(),
});

export async function aiProductRecommendations(input: AIProductRecommendationsInput): Promise<AIProductRecommendationsOutput> {
  return aiProductRecommendationsFlow(input);
}

const recommendationPrompt = ai.definePrompt({
  name: 'aiProductRecommendationPrompt',
  input: {schema: InternalPromptInputSchema},
  output: {schema: AIProductRecommendationsOutputSchema},
  prompt: `You are a highly intelligent AI assistant specializing in gaming e-commerce product recommendations for Castro Nepal, "Nepal’s Trusted Gaming Redeem Code Store". Your goal is to provide relevant and engaging gaming product suggestions based on user context.

Generate a JSON array of recommended products. Each product in the array must be an object with the following properties:
- 'id': A unique string identifier for the product (e.g., "game-code-001").
- 'name': The name of the product (e.g., "PlayStation Store Gift Card $50").
- 'description': A short, compelling description of the product.
- 'price': A numeric value representing the price (e.g., 49.99).
- 'imageUrl': A placeholder URL for the recommended product image.

Ensure the recommendations are suitable for a gaming store selling console game redeem codes, digital gaming cards, and gaming products. The recommendations should sound appealing to gamers.

{{#if isTrending}}
  Provide a list of 5 currently trending and most popular gaming products or redeem codes for a gaming e-commerce store. 
{{/if}}

{{#if isCustomersAlsoBought}}
  Considering a customer is interested in product with ID "{{{productId}}}", suggest 3 other gaming products that customers who bought "{{{productId}}}" often also purchase.
{{/if}}

{{#if isSimilarProducts}}
  Suggest 4 gaming products that are similar to the product with ID "{{{productId}}}" {{#if productCategory}} (which is in the "{{{productCategory}}}" category){{/if}}. Focus on items that would appeal to someone interested in that specific product.
{{/if}}

Your response MUST be a valid JSON array of product objects, and nothing else. Always respond in JSON. Do not include any additional text or formatting.`,
});

const aiProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiProductRecommendationsFlow',
    inputSchema: AIProductRecommendationsInputSchema,
    outputSchema: AIProductRecommendationsOutputSchema,
  },
  async (input) => {
    try {
      // Map the input to include boolean flags to avoid using unsupported Handlebars helpers like 'eq'
      const promptInput = {
        ...input,
        isTrending: input.recommendationType === 'trending',
        isCustomersAlsoBought: input.recommendationType === 'customersAlsoBought',
        isSimilarProducts: input.recommendationType === 'similarProducts',
      };
      
      const {output} = await recommendationPrompt(promptInput);
      return output!;
    } catch (error) {
      console.error('AI Recommendation Flow failed, using fallback data:', error);
      // Fallback data ensures the prototype remains functional without an API key
      return {
        recommendations: [
          {
            id: 'ps-plus-12',
            name: 'PlayStation Plus 12-Month',
            description: 'Nepal\'s most popular gaming subscription card. Get access to online multiplayer and free games.',
            price: 119.99,
            imageUrl: 'https://picsum.photos/seed/psn-fallback/400/600'
          },
          {
            id: 'steam-50',
            name: 'Steam Wallet $50',
            description: 'Instantly add $50 to your Steam account. Works with all games in the Steam store.',
            price: 50.00,
            imageUrl: 'https://picsum.photos/seed/steam-fallback/400/600'
          },
          {
            id: 'xbox-pass',
            name: 'Xbox Game Pass Ultimate',
            description: 'Access hundreds of high-quality games on console and PC. Includes EA Play.',
            price: 14.99,
            imageUrl: 'https://picsum.photos/seed/xbox-fallback/400/600'
          },
          {
            id: 'nintendo-20',
            name: 'Nintendo eShop $20',
            description: 'The perfect gift for any Nintendo Switch owner. Redeem for games and DLC.',
            price: 20.00,
            imageUrl: 'https://picsum.photos/seed/nintendo-fallback/400/600'
          },
          {
            id: 'valorant-vps',
            name: 'Valorant 2050 Points',
            description: 'Get your favorite weapon skins and agents in Valorant with instant VP delivery.',
            price: 19.99,
            imageUrl: 'https://picsum.photos/seed/valorant-fallback/400/600'
          }
        ]
      };
    }
  },
);
