'use server';
/**
 * @fileOverview A Genkit flow for generating detailed product descriptions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category the product belongs to.'),
  shortDescription: z.string().describe('A brief description of the product.'),
  price: z.number().describe('The price of the product.'),
  features: z.array(z.string()).optional().describe('Key features of the product.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  detailedDescription: z.string().describe('The AI-generated detailed product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const generateProductDescriptionPrompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: { schema: GenerateProductDescriptionInputSchema },
  output: { schema: GenerateProductDescriptionOutputSchema },
  prompt: `You are an expert marketing copywriter for 'Castro Nepal', a premium gaming store.

Create an engaging description for:
Product Name: {{{productName}}}
Category: {{{category}}}
Short Description: {{{shortDescription}}}
Price: NPR {{{price}}}

{{#if features}}
Key Features:
{{#each features}}
- {{{this}}}
{{/each}}
{{/if}}

Craft a captivating description that entices gamers. Ensure your response is a valid JSON object matching the GenerateProductDescriptionOutputSchema.`,
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
        detailedDescription: `Elevate your gaming experience with ${input.productName}. As a trusted provider in Nepal, Castro Nepal ensures you get 100% genuine digital codes and hardware delivered instantly. Secured, fast, and built for champions.`
      };
    }
  }
);