
'use server';
/**
 * @fileOverview A Genkit flow for generating engaging and detailed product descriptions for the Castro Nepal e-commerce store.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category the product belongs to (e.g., "PlayStation Redeem Codes", "Xbox Gift Cards").'),
  shortDescription: z.string().describe('A brief, concise description of the product.'),
  price: z.number().describe('The price of the product.'),
  features: z.array(z.string()).optional().describe('A list of key features or benefits of the product (e.g., "Instant Delivery", "Digital Code").'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  detailedDescription: z.string().describe('The AI-generated, engaging, and detailed product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const generateProductDescriptionPrompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: { schema: GenerateProductDescriptionInputSchema },
  output: { schema: GenerateProductDescriptionOutputSchema },
  prompt: `You are an expert marketing copywriter for 'Castro Nepal', a premium, futuristic, gaming-themed e-commerce store specializing in digital game redeem codes and gaming products.

Your task is to create an engaging, detailed, and persuasive product description based on the provided product information. The description should sound exciting, highlight key benefits, and fit the store's aesthetic.

Product Name: {{{productName}}}
Category: {{{category}}}
Short Description: {{{shortDescription}}}
Price: \${{{price}}}

{{#if features}}
Key Features:
{{#each features}}
- {{{this}}}
{{/each}}
{{/if}}

Craft a detailed and captivating description that entices gamers. Focus on the value and excitement this product brings.
Ensure your response is a valid JSON object matching the GenerateProductDescriptionOutputSchema, containing only the 'detailedDescription' field.`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await generateProductDescriptionPrompt(input);
      return output!;
    } catch (error) {
      console.error('Generate Description Flow failed, using fallback:', error);
      return {
        detailedDescription: `Elevate your gaming experience with ${input.productName}. As a trusted provider in Nepal, Castro Nepal ensures you get 100% genuine digital codes delivered instantly to your armory. Whether you're looking to unlock new content, join multiplayer battles, or expand your game library, this is your ultimate key to the next level. Secure, fast, and built for gamers.`
      };
    }
  }
);
