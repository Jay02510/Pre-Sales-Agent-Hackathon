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

export interface AnalysisContext {
  reportPurpose?: string;
}

export class AIAnalysisService {
  static async analyzeContent(
    companyName: string,
    scrapedContent: ScrapedContent[],
    context?: AnalysisContext
  ): Promise<AnalysisResult> {
    // Try OpenAI first if configured
    if (OpenAIService.isConfigured()) {
      try {
        console.log('Using OpenAI for real AI analysis...');
        const openaiResult = await OpenAIService.analyzeContent(companyName, scrapedContent, context);
        return openaiResult;
      } catch (error) {
        console.warn('OpenAI analysis failed, falling back to enhanced mock analysis:', error);
        // Fall through to mock analysis
      }
    } else {
      console.log('OpenAI not configured, using enhanced mock analysis...');
    }

    // Fallback to enhanced mock analysis
    return this.generateEnhancedMockAnalysis(companyName, scrapedContent, context);
  }

  private static async generateEnhancedMockAnalysis(
    companyName: string,
    scrapedContent: ScrapedContent[],
    context?: AnalysisContext
  ): Promise<AnalysisResult> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const allContent = scrapedContent.map(content => ({
      url: content.url,
      title: content.title,
      content: content.content.substring(0, 2000),
      metadata: content.metadata
    }));

    return this.generateEnhancedAnalysis(companyName, allContent, context);
  }

  static generateEnhancedAnalysis(
    companyName: string,
    content: Array<{ url: string; title: string; content: string; metadata?: any }>,
    context?: AnalysisContext
  ): AnalysisResult {
    // Extract key information from scraped content
    const titles = content.map(c => c.title).join(' ');
    const allText = content.map(c => c.content).join(' ');
    
    // Simple keyword extraction for more realistic analysis
    const hasLinkedIn = content.some(c => c.url.includes('linkedin.com'));
    const hasCompanyWebsite = content.some(c => !c.url.includes('linkedin.com') && !c.url.includes('news'));
    const hasNewsArticles = content.some(c => c.url.includes('news') || c.url.includes('article'));
    
    // Extract industry indicators
    const industryKeywords = {
      technology: ['software', 'tech', 'digital', 'cloud', 'saas', 'platform', 'app', 'data'],
      healthcare: ['health', 'medical', 'patient', 'care', 'hospital', 'clinic', 'pharma'],
      finance: ['finance', 'banking', 'investment', 'insurance', 'fintech', 'payment'],
      manufacturing: ['manufacturing', 'production', 'factory', 'industrial', 'supply chain'],
      retail: ['retail', 'ecommerce', 'store', 'shop', 'consumer', 'product']
    };
    
    let detectedIndustry = 'business';
    let industryConfidence = 0;
    
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const matches = keywords.filter(keyword => 
        allText.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      
      if (matches > industryConfidence) {
        detectedIndustry = industry;
        industryConfidence = matches;
      }
    }
    
    // Generate contextual insights based on scraped content
    const insights = [];
    if (hasLinkedIn) {
      insights.push(`${companyName}'s professional LinkedIn presence indicates strategic focus on industry networking and thought leadership`);
    }
    if (hasCompanyWebsite) {
      insights.push(`Analysis of ${companyName}'s website reveals emphasis on ${detectedIndustry}-specific solutions and customer experience optimization`);
    }
    if (hasNewsArticles) {
      insights.push(`Recent media coverage suggests ${companyName} is actively expanding market presence with newsworthy developments`);
    }
    
    // Add content-based insights
    if (allText.toLowerCase().includes('growth') || allText.toLowerCase().includes('expand')) {
      insights.push(`${companyName} is prioritizing growth initiatives and market expansion based on strategic communications`);
    }
    if (allText.toLowerCase().includes('technology') || allText.toLowerCase().includes('digital')) {
      insights.push(`Strong emphasis on technology investment and digital transformation to maintain competitive advantage`);
    }
    if (allText.toLowerCase().includes('customer') || allText.toLowerCase().includes('client')) {
      insights.push(`Customer-centric approach is central to ${companyName}'s business strategy and market positioning`);
    }

    // Generate specific pain points based on industry and content
    const painPoints = [];
    
    if (detectedIndustry === 'technology') {
      painPoints.push(`Managing rapid product development cycles while maintaining quality and security standards`);
      painPoints.push(`Scaling technical infrastructure to support business growth without increasing operational complexity`);
      painPoints.push(`Balancing innovation investments with immediate revenue-generating activities`);
    } else if (detectedIndustry === 'healthcare') {
      painPoints.push(`Navigating complex regulatory compliance while maintaining operational efficiency`);
      painPoints.push(`Implementing digital transformation initiatives in traditional healthcare environments`);
      painPoints.push(`Balancing quality patient care with cost optimization pressures`);
    } else if (detectedIndustry === 'finance') {
      painPoints.push(`Managing cybersecurity and compliance requirements in an evolving regulatory landscape`);
      painPoints.push(`Modernizing legacy systems while maintaining operational continuity`);
      painPoints.push(`Competing with fintech disruptors while preserving traditional revenue streams`);
    } else if (detectedIndustry === 'manufacturing') {
      painPoints.push(`Optimizing supply chain resilience while controlling operational costs`);
      painPoints.push(`Implementing Industry 4.0 technologies within established production environments`);
      painPoints.push(`Addressing skilled labor shortages while increasing automation`);
    } else if (detectedIndustry === 'retail') {
      painPoints.push(`Balancing online and physical retail channels for seamless customer experience`);
      painPoints.push(`Managing inventory efficiency across multiple sales channels`);
      painPoints.push(`Personalizing customer experiences while respecting privacy concerns`);
    } else {
      painPoints.push(`Optimizing operational efficiency while maintaining service quality standards`);
      painPoints.push(`Implementing digital transformation initiatives that deliver measurable ROI`);
      painPoints.push(`Attracting and retaining top talent in a competitive market environment`);
    }
    
    // Add content-specific pain points
    if (hasLinkedIn) {
      painPoints.push(`Maintaining consistent brand messaging across multiple digital touchpoints and platforms`);
    }
    if (content.length > 3) {
      painPoints.push(`Coordinating strategic initiatives across multiple business units and stakeholders`);
    }

    // Adjust based on report purpose if provided
    let purposeAdjustedConversationStarters = [
      `What specific metrics are you using to measure success in your ${detectedIndustry} initiatives this year?`,
      `How is your leadership team prioritizing between immediate operational needs and longer-term strategic goals?`,
      `What's been your biggest challenge in implementing your current business strategy?`,
      `How are you currently addressing ${painPoints[0].toLowerCase()}?`,
      `What would be the business impact of solving ${painPoints[1].toLowerCase()}?`
    ];

    // Adjust recommendations based on report purpose
    let purposeAdjustedRecommendations = `Approach ${companyName} with solutions that directly address their ${detectedIndustry}-specific challenges, particularly focusing on ${painPoints[0].toLowerCase()}. ${hasLinkedIn ? 'Leverage their thought leadership positioning by demonstrating industry expertise and peer success stories. ' : 'Establish credibility by sharing relevant industry insights and case studies. '}Position your solution as a strategic enabler for their ${allText.toLowerCase().includes('growth') ? 'growth objectives' : 'optimization initiatives'}, with clear ROI metrics aligned to their business priorities.`;

    // If report purpose is provided, adjust the analysis
    if (context?.reportPurpose) {
      const purpose = context.reportPurpose.toLowerCase();
      
      // Adjust conversation starters based on purpose
      if (purpose.includes('sales call') || purpose.includes('meeting')) {
        purposeAdjustedConversationStarters = [
          `I noticed ${companyName} has been focusing on ${detectedIndustry}-specific challenges. What's been your biggest priority in this area?`,
          `How is your team currently addressing ${painPoints[0].toLowerCase()}?`,
          `What would success look like for you in solving these challenges over the next 6-12 months?`,
          `Who else in your organization is involved in decisions around these initiatives?`,
          `What solutions have you tried in the past to address these challenges?`
        ];
      } else if (purpose.includes('competitive') || purpose.includes('competitor')) {
        purposeAdjustedConversationStarters = [
          `How do you differentiate from competitors in addressing ${detectedIndustry} challenges?`,
          `What unique approaches has your team developed to solve ${painPoints[0].toLowerCase()}?`,
          `Which competitors do you most often encounter in your sales process?`,
          `What competitive advantages do you believe your solution offers?`,
          `How do customers typically compare your offering to alternatives?`
        ];
      } else if (purpose.includes('proposal') || purpose.includes('pitch')) {
        purposeAdjustedConversationStarters = [
          `What specific metrics would you use to evaluate the success of our proposed solution?`,
          `Beyond the technical requirements, what business outcomes are most important to you?`,
          `Who will be involved in the evaluation and decision-making process?`,
          `What timeline are you working with for implementation?`,
          `What concerns do you have about implementing a new solution?`
        ];
      }
      
      // Adjust recommendations based on purpose
      if (purpose.includes('sales call') || purpose.includes('meeting')) {
        purposeAdjustedRecommendations = `For your upcoming meeting with ${companyName}, focus on demonstrating understanding of their ${detectedIndustry}-specific challenges, particularly ${painPoints[0].toLowerCase()}. Come prepared with specific examples of how you've helped similar companies overcome these challenges. Ask open-ended questions about their current approach and pain points before presenting solutions.`;
      } else if (purpose.includes('competitive') || purpose.includes('competitor')) {
        purposeAdjustedRecommendations = `When positioning against competitors, emphasize your unique approach to solving ${companyName}'s specific challenges in ${painPoints[0].toLowerCase()} and ${painPoints[1].toLowerCase()}. Highlight case studies from their industry showing measurable outcomes. Be prepared to directly address how your solution differs from key competitors they may be considering.`;
      } else if (purpose.includes('proposal') || purpose.includes('pitch')) {
        purposeAdjustedRecommendations = `Structure your proposal around ${companyName}'s specific business challenges, particularly ${painPoints[0].toLowerCase()}. Include clear ROI calculations, implementation timeline, and success metrics. Address potential objections proactively and include customer testimonials from their industry. Focus on business outcomes rather than technical features.`;
      }
    }

    return {
      companyName,
      summary: `${companyName} is a ${detectedIndustry}-focused organization demonstrating strategic emphasis on ${hasLinkedIn ? 'professional networking and thought leadership' : 'market presence'}, with ${hasCompanyWebsite ? 'a comprehensive digital presence' : 'targeted digital strategy'}. Analysis indicates they're prioritizing ${allText.toLowerCase().includes('growth') ? 'aggressive growth' : 'operational optimization'} while addressing ${detectedIndustry}-specific challenges related to ${allText.toLowerCase().includes('customer') ? 'customer experience enhancement' : 'market competitiveness'}.`,
      
      companyInfo: `${companyName} operates in the ${detectedIndustry} sector with a ${content.length > 2 ? 'multi-channel' : 'focused'} digital presence across ${content.length} analyzed sources. ${hasLinkedIn ? 'Their professional network engagement suggests emphasis on industry thought leadership. ' : ''}${hasCompanyWebsite ? 'Their website demonstrates a sophisticated approach to digital customer engagement. ' : ''}${hasNewsArticles ? 'Recent media coverage indicates active market developments and strategic initiatives. ' : ''}`,
      
      painPoints: painPoints.slice(0, 5),
      
      conversationStarters: purposeAdjustedConversationStarters,
      
      keyInsights: insights.length > 0 ? insights : [
        `${companyName}'s digital presence reveals opportunities for enhanced market positioning`,
        `Content analysis indicates focus on ${detectedIndustry}-specific solutions and expertise`,
        `Strategic communications emphasize ${allText.toLowerCase().includes('innovation') ? 'innovation leadership' : 'operational excellence'}`
      ],
      
      recommendations: purposeAdjustedRecommendations
    };
  }
}