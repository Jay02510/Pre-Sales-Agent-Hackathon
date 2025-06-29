import OpenAI, { APIError } from 'openai';
import { ScrapedContent } from './firecrawlService';
import { CostOptimizationService } from './costOptimizationService';
import { ErrorService } from './errorService';
import { AnalysisContext } from './aiAnalysisService';

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
    scrapedContent: ScrapedContent[],
    context?: AnalysisContext
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
      const prompt = this.createAnalysisPrompt(companyName, contentSummary, context);

      // Call OpenAI API
      const client = this.getClient();
      
      try {
        const response = await client.chat.completions.create({
          model: 'gpt-4o-mini', // Cost-effective model
          messages: [
            {
              role: 'system',
              content: 'You are an expert sales research analyst with 15+ years of experience in B2B sales. Your analysis is always concise, actionable, and focused on business value. You identify specific pain points that can be addressed by solutions, and provide strategic conversation starters that demonstrate deep industry knowledge. Your insights are evidence-based, drawing directly from the source material provided.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.5, // Lower temperature for more focused, consistent outputs
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        });

        const result = response.choices[0]?.message?.content;
        if (!result) {
          throw new Error('No response from OpenAI');
        }

        // Parse and validate the response
        try {
          const analysis = JSON.parse(result);
          const validatedAnalysis = this.validateAndCleanResponse(analysis, companyName);

          // Track successful API call
          CostOptimizationService.trackRequest('ai', true);

          return validatedAnalysis;
        } catch (parseError) {
          console.error('Error parsing OpenAI response:', parseError);
          throw new Error('Failed to parse AI response. Please try again.');
        }
      } catch (apiError) {
        // Check for specific API errors
        if (apiError instanceof APIError) {
          if (apiError.status === 429) {
            throw new Error('OpenAI rate limit exceeded. Please try again in a few minutes.');
          } else if (apiError.status === 400) {
            throw new Error('Invalid request to OpenAI. Please try with different content.');
          } else if (apiError.status === 401) {
            throw new Error('OpenAI authentication failed. Please check your API key.');
          }
        }
        
        // Generic error
        throw new Error(`OpenAI API error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`);
      }
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
${content.metadata?.keywords ? `KEYWORDS: ${content.metadata.keywords.join(', ')}` : ''}
${content.metadata?.publishedDate ? `PUBLISHED: ${content.metadata.publishedDate}` : ''}
---`;
    }).join('\n');
  }

  private static createAnalysisPrompt(companyName: string, contentSummary: string, context?: AnalysisContext): string {
    let prompt = `
Analyze the following information about "${companyName}" and provide a concise, actionable pre-sales research report.

COMPANY INFORMATION:
${contentSummary}
`;

    // Add report purpose context if provided
    if (context?.reportPurpose) {
      prompt += `
REPORT PURPOSE:
${context.reportPurpose}

This report will be used for the purpose described above. Please tailor your analysis to be most useful for this specific purpose.
`;
    }

    prompt += `
Provide a JSON response with the following structure:

{
  "summary": "A concise 2-3 sentence executive summary focusing on the company's current market position, strategic priorities, and business challenges",
  
  "companyInfo": "Factual information about the company including size, industry, key offerings, and recent developments (2-3 sentences, be specific and avoid generalities)",
  
  "painPoints": [
    "3-5 specific business challenges this company faces, based on evidence from the content",
    "Each pain point should be concrete, specific to this company (not generic), and actionable",
    "Focus on operational, strategic, or market challenges that a solution provider could address"
  ],
  
  "conversationStarters": [
    "3-5 insightful questions that demonstrate research knowledge and industry expertise",
    "Questions should be specific to this company's situation, not generic sales questions",
    "Each question should connect to a specific pain point or strategic initiative mentioned in the content"
  ],
  
  "keyInsights": [
    "3-5 strategic insights about the company that would be valuable for sales preparation",
    "Each insight should be evidence-based, drawing from specific content in the sources",
    "Include competitive positioning, market trends, or strategic initiatives when evident"
  ],
  
  "recommendations": "Specific, actionable advice for approaching this company, including value proposition positioning, timing considerations, and key stakeholders to target (2-3 sentences)"
}

CRITICAL GUIDELINES:
1. Be extremely specific and avoid generic statements that could apply to any company
2. Base all insights directly on evidence from the provided content
3. Focus on business value and strategic implications, not technical details
4. Keep all points concise, clear, and actionable
5. Prioritize quality over quantity - fewer high-quality insights are better than many generic ones
6. Ensure recommendations are specific to this company's situation and challenges
`;

    return prompt;
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

    // Ensure we have at least some content in each array
    if (validated.painPoints.length === 0) {
      validated.painPoints = ['Competitive market positioning challenges', 'Operational efficiency optimization'];
    }
    
    if (validated.conversationStarters.length === 0) {
      validated.conversationStarters = [`What are your key strategic priorities at ${companyName} this year?`, 'How do you measure success for your initiatives?'];
    }
    
    if (validated.keyInsights.length === 0) {
      validated.keyInsights = ['Company demonstrates focus on market growth and expansion', 'Digital presence indicates customer-centric approach'];
    }

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