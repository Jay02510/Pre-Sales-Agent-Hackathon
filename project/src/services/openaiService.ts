import OpenAI, { APIError } from 'openai';
import { ScrapedContent } from './firecrawlService';
import { CostOptimizationService } from './costOptimizationService';
import { ErrorService } from './errorService';

export interface OpenAIAnalysisResult {
  companyName: string;
  summary: string;
  companyInfo: string;
  painPoints: string[];
  conversationStarters: string[];
  keyInsights: string[];
  recommendations: string;
}

export class OpenAIService {
  private static client: OpenAI | null = null;
  private static readonly API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  static isConfigured(): boolean {
    return !!this.API_KEY;
  }

  private static getClient(): OpenAI {
    if (!this.client && this.API_KEY) {
      this.client = new OpenAI({
        apiKey: this.API_KEY,
        dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
      });
    }
    
    if (!this.client) {
      throw new Error('OpenAI not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }
    
    return this.client;
  }

  static async analyzeContent(
    companyName: string,
    scrapedContent: ScrapedContent[]
  ): Promise<OpenAIAnalysisResult> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      // Apply rate limiting
      await CostOptimizationService.enforceRateLimit('ai');

      // Prepare content for analysis
      const contentSummary = this.prepareContentForAnalysis(scrapedContent);
      
      // Create the analysis prompt
      const prompt = this.createAnalysisPrompt(companyName, contentSummary);

      // Call OpenAI API
      const client = this.getClient();
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini', // Cost-effective model
        messages: [
          {
            role: 'system',
            content: 'You are an expert sales research analyst. Analyze the provided company information and generate comprehensive pre-sales insights. Always respond with valid JSON in the exact format requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No response from OpenAI');
      }

      // Parse and validate the response
      const analysis = JSON.parse(result);
      const validatedAnalysis = this.validateAndCleanResponse(analysis, companyName);

      // Track successful API call
      CostOptimizationService.trackRequest('ai', true);

      return validatedAnalysis;

    } catch (error) {
      // Track failed API call
      CostOptimizationService.trackRequest('ai', false);
      
      ErrorService.logError(error as Error, 'OpenAI analysis failed');
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static prepareContentForAnalysis(scrapedContent: ScrapedContent[]): string {
    return scrapedContent.map((content, index) => {
      // Optimize content length for cost control
      const optimizedContent = CostOptimizationService.optimizeContentForAnalysis(content.content);
      
      return `
SOURCE ${index + 1}: ${content.url}
TITLE: ${content.title}
CONTENT: ${optimizedContent}
${content.metadata?.description ? `DESCRIPTION: ${content.metadata.description}` : ''}
---`;
    }).join('\n');
  }

  private static createAnalysisPrompt(companyName: string, contentSummary: string): string {
    return `
Analyze the following information about "${companyName}" and provide comprehensive pre-sales research insights.

COMPANY INFORMATION:
${contentSummary}

Please analyze this information and provide a JSON response with the following structure:

{
  "summary": "A comprehensive 2-3 sentence executive summary of the company's current situation, market position, and strategic focus",
  "companyInfo": "Detailed company information including size, industry, key offerings, and recent developments (3-4 sentences)",
  "painPoints": [
    "List 3-5 specific business challenges or pain points this company likely faces based on the content",
    "Focus on operational, strategic, or market challenges that a solution provider could address"
  ],
  "conversationStarters": [
    "List 3-5 thoughtful questions that would be excellent conversation starters for a sales meeting",
    "Questions should be specific to this company and demonstrate research knowledge"
  ],
  "keyInsights": [
    "List 3-5 key business insights about the company that would be valuable for sales preparation",
    "Include market trends, competitive positioning, or strategic initiatives"
  ],
  "recommendations": "Strategic recommendations for how a solution provider should approach this company, including positioning, timing, and key value propositions (2-3 sentences)"
}

IMPORTANT GUIDELINES:
- Base all insights on the actual content provided
- Be specific and actionable
- Focus on business value and strategic implications
- Avoid generic statements
- Ensure all arrays contain 3-5 items
- Keep individual items concise but informative
`;
  }

  private static validateAndCleanResponse(analysis: any, companyName: string): OpenAIAnalysisResult {
    // Ensure all required fields exist with defaults
    const validated: OpenAIAnalysisResult = {
      companyName,
      summary: analysis.summary || `Analysis of ${companyName} based on available research data.`,
      companyInfo: analysis.companyInfo || `${companyName} is a company with active digital presence and market engagement.`,
      painPoints: Array.isArray(analysis.painPoints) ? analysis.painPoints.slice(0, 5) : [
        'Market competition and differentiation challenges',
        'Digital transformation and technology adoption',
        'Customer acquisition and retention optimization'
      ],
      conversationStarters: Array.isArray(analysis.conversationStarters) ? analysis.conversationStarters.slice(0, 5) : [
        `How is ${companyName} approaching current market challenges?`,
        'What are your key priorities for business growth this year?',
        'How do you measure success in your current initiatives?'
      ],
      keyInsights: Array.isArray(analysis.keyInsights) ? analysis.keyInsights.slice(0, 5) : [
        'Active digital presence indicates growth-focused organization',
        'Market positioning suggests strategic business approach',
        'Content analysis reveals customer-centric focus'
      ],
      recommendations: analysis.recommendations || `Approach ${companyName} with solutions that address their strategic priorities and demonstrate clear business value.`
    };

    // Clean up any empty or invalid entries
    validated.painPoints = validated.painPoints.filter(item => item && typeof item === 'string' && item.trim().length > 0);
    validated.conversationStarters = validated.conversationStarters.filter(item => item && typeof item === 'string' && item.trim().length > 0);
    validated.keyInsights = validated.keyInsights.filter(item => item && typeof item === 'string' && item.trim().length > 0);

    return validated;
  }

  // Get cost estimation for OpenAI usage
  static estimateCost(contentLength: number): number {
    // GPT-4o-mini pricing: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
    // Rough estimation: ~4 characters per token
    const inputTokens = Math.ceil(contentLength / 4);
    const outputTokens = 500; // Estimated output tokens
    
    const inputCost = (inputTokens / 1000000) * 0.15;
    const outputCost = (outputTokens / 1000000) * 0.60;
    
    return inputCost + outputCost;
  }

  // Test the OpenAI connection with retry mechanism for rate limits
  static async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const client = this.getClient();
        const response = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Test connection. Respond with "OK".' }],
          max_tokens: 5
        });

        return response.choices[0]?.message?.content?.includes('OK') || false;
      } catch (error) {
        attempt++;
        
        // Check if it's a rate limit error
        if (error instanceof APIError && error.status === 429) {
          if (attempt < maxRetries) {
            // Exponential backoff: wait 2^attempt seconds
            const waitTime = Math.pow(2, attempt) * 1000;
            console.log(`Rate limit hit, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        
        // If it's not a rate limit error or we've exhausted retries, log and return false
        ErrorService.logError(error as Error, 'OpenAI connection test failed');
        return false;
      }
    }

    return false;
  }
}