import { AIAnalysisService, AnalysisResult } from './aiAnalysisService';
import { ScrapedContent } from './firecrawlService';

export class OptimizedAIService extends AIAnalysisService {
  static async analyzeContent(
    companyName: string,
    scrapedContent: ScrapedContent[]
  ): Promise<AnalysisResult> {
    // Use the existing analysis logic with optimized content
    return super.generateEnhancedAnalysis(
      companyName,
      scrapedContent.map(c => ({
        url: c.url,
        title: c.title,
        content: c.content.substring(0, 8000), // Limit content length
        metadata: c.metadata
      }))
    );
  }
}