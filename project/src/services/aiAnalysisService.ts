import { ScrapedContent } from './firecrawlService';
import { OpenAIService, OpenAIAnalysisResult } from './openaiService';
import { CostOptimizationService } from './costOptimizationService';

export interface AnalysisResult {
  companyName: string;
  summary: string;
  companyInfo: string;
  painPoints: string[];
  conversationStarters: string[];
  keyInsights: string[];
  recommendations: string;
}

export class AIAnalysisService {
  static async analyzeContent(
    companyName: string,
    scrapedContent: ScrapedContent[]
  ): Promise<AnalysisResult> {
    // Try OpenAI first if configured
    if (OpenAIService.isConfigured()) {
      try {
        console.log('Using OpenAI for real AI analysis...');
        const openaiResult = await OpenAIService.analyzeContent(companyName, scrapedContent);
        return openaiResult;
      } catch (error) {
        console.warn('OpenAI analysis failed, falling back to enhanced mock analysis:', error);
        // Fall through to mock analysis
      }
    } else {
      console.log('OpenAI not configured, using enhanced mock analysis...');
    }

    // Fallback to enhanced mock analysis
    return this.generateEnhancedMockAnalysis(companyName, scrapedContent);
  }

  private static async generateEnhancedMockAnalysis(
    companyName: string,
    scrapedContent: ScrapedContent[]
  ): Promise<AnalysisResult> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const allContent = scrapedContent.map(content => ({
      url: content.url,
      title: content.title,
      content: content.content.substring(0, 2000),
      metadata: content.metadata
    }));

    return this.generateEnhancedAnalysis(companyName, allContent);
  }

  static generateEnhancedAnalysis(
    companyName: string,
    content: Array<{ url: string; title: string; content: string; metadata?: any }>
  ): AnalysisResult {
    // Extract key information from scraped content
    const titles = content.map(c => c.title).join(' ');
    const allText = content.map(c => c.content).join(' ');
    
    // Simple keyword extraction for more realistic analysis
    const hasLinkedIn = content.some(c => c.url.includes('linkedin.com'));
    const hasCompanyWebsite = content.some(c => !c.url.includes('linkedin.com') && !c.url.includes('news'));
    const hasNewsArticles = content.some(c => c.url.includes('news') || c.url.includes('article'));
    
    // Generate contextual insights based on scraped content
    const insights = [];
    if (hasLinkedIn) {
      insights.push('Professional LinkedIn presence indicates active networking and thought leadership');
    }
    if (hasCompanyWebsite) {
      insights.push('Company website analysis reveals focus on customer experience and service offerings');
    }
    if (hasNewsArticles) {
      insights.push('Recent media coverage suggests active market presence and newsworthy developments');
    }
    
    // Add content-based insights
    if (allText.toLowerCase().includes('growth') || allText.toLowerCase().includes('expand')) {
      insights.push('Content analysis indicates focus on growth and expansion initiatives');
    }
    if (allText.toLowerCase().includes('technology') || allText.toLowerCase().includes('digital')) {
      insights.push('Strong emphasis on technology and digital transformation initiatives');
    }
    if (allText.toLowerCase().includes('customer') || allText.toLowerCase().includes('client')) {
      insights.push('Customer-centric approach evident in communications and content');
    }

    return {
      companyName,
      summary: `Based on analysis of ${content.length} sources, ${companyName} demonstrates strong market positioning with active digital presence across multiple channels. The scraped content reveals a company focused on ${hasLinkedIn ? 'professional networking and thought leadership' : 'market presence'}, with ${hasCompanyWebsite ? 'comprehensive web presence' : 'focused digital strategy'}. Recent analysis suggests they are at a strategic point where they're looking to ${allText.toLowerCase().includes('growth') ? 'accelerate growth' : 'optimize operations'} while maintaining their commitment to ${allText.toLowerCase().includes('customer') ? 'customer satisfaction' : 'market excellence'}.`,
      
      companyInfo: `${companyName} maintains an active digital presence across ${content.length} analyzed sources. ${hasLinkedIn ? 'Their LinkedIn presence shows professional engagement and industry participation. ' : ''}${hasCompanyWebsite ? 'Company website demonstrates comprehensive service offerings and customer focus. ' : ''}${hasNewsArticles ? 'Recent media coverage indicates active market participation and newsworthy developments. ' : ''}The organization appears to prioritize ${allText.toLowerCase().includes('innovation') ? 'innovation and forward-thinking approaches' : 'operational excellence and customer service'}.`,
      
      painPoints: [
        hasLinkedIn ? 'Managing professional brand consistency across multiple digital touchpoints' : 'Limited professional networking presence may impact thought leadership opportunities',
        content.length > 3 ? 'Coordinating messaging across multiple communication channels and platforms' : 'Limited digital presence may restrict market reach and visibility',
        allText.toLowerCase().includes('growth') ? 'Scaling operations while maintaining quality and customer satisfaction' : 'Optimizing current operations for improved efficiency and performance',
        hasNewsArticles ? 'Managing public perception and media relations during periods of change' : 'Building market awareness and establishing thought leadership position',
        'Integrating various digital platforms and tools for cohesive customer experience'
      ],
      
      conversationStarters: [
        `How is ${companyName} currently managing its digital presence across multiple platforms?`,
        hasLinkedIn ? 'What role does thought leadership play in your current marketing and business development strategy?' : 'How important is establishing thought leadership in your industry for your growth plans?',
        content.length > 2 ? 'How do you ensure consistent messaging across all your communication channels?' : 'What are your priorities for expanding your digital presence and market reach?',
        allText.toLowerCase().includes('customer') ? 'How do you measure and optimize customer experience across all touchpoints?' : 'What are your key metrics for measuring business success and growth?',
        hasNewsArticles ? 'How do you leverage media coverage and public relations for business development?' : 'What strategies are you considering for increasing market visibility and brand awareness?'
      ],
      
      keyInsights: insights.length > 0 ? insights : [
        'Digital footprint analysis reveals opportunities for enhanced online presence',
        'Content strategy appears focused on professional communication and market positioning',
        'Multiple touchpoints suggest coordinated approach to market engagement'
      ],
      
      recommendations: `Position your solution as a strategic enabler for ${companyName}'s digital presence optimization. ${hasLinkedIn ? 'Leverage their existing thought leadership position to discuss advanced professional networking and brand management solutions. ' : 'Focus on how your offering can help establish stronger thought leadership and professional presence. '}${content.length > 2 ? 'Emphasize integration capabilities that can unify their multi-channel approach. ' : 'Highlight solutions that can expand their digital reach and market presence. '}Consider proposing a comprehensive digital strategy that addresses their ${allText.toLowerCase().includes('growth') ? 'growth objectives' : 'operational optimization goals'} while ${allText.toLowerCase().includes('customer') ? 'enhancing customer experience' : 'improving market positioning'}. Be prepared to discuss ROI metrics and measurable outcomes that align with their current digital initiatives.`
    };
  }
}