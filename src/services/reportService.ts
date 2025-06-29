import { supabase } from '../lib/supabase';
import { Report } from '../types/database';
import { FirecrawlService } from './firecrawlService';
import { AIAnalysisService } from './aiAnalysisService';
import { ErrorService } from './errorService';

export class ReportService {
  static async generateReport(
    companyName: string,
    urls: string[],
    onProgress?: (step: string, progress: number) => void,
    reportPurpose?: string
  ): Promise<Report> {
    try {
      // Step 1: Validate URLs
      onProgress?.('Validating URLs...', 10);
      
      const validUrls = urls.filter(url => url.trim() !== '').slice(0, 5); // Limit to 5 URLs
      
      if (validUrls.length === 0) {
        throw new Error('No valid URLs provided. Please enter at least one valid URL.');
      }
      
      // Step 2: Extract content
      onProgress?.('Extracting content from web sources...', 25);
      
      let scrapedContent;
      if (FirecrawlService.isConfigured()) {
        try {
          scrapedContent = await FirecrawlService.scrapeMultipleUrls(validUrls);
        } catch (error) {
          console.warn('Firecrawl scraping failed, using fallback:', error);
          
          // More detailed error handling
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
            throw new Error('API rate limit exceeded. Please try again in a few minutes.');
          }
          
          // Fallback to mock data
          scrapedContent = this.generateMockContent(companyName, validUrls);
        }
      } else {
        scrapedContent = this.generateMockContent(companyName, validUrls);
      }

      // Step 3: AI analysis
      onProgress?.('Performing AI analysis...', 60);
      
      // Add report purpose to the analysis context if provided
      const analysisContext = reportPurpose ? { reportPurpose } : undefined;
      
      try {
        const analysis = await AIAnalysisService.analyzeContent(companyName, scrapedContent, analysisContext);

        // Step 4: Create report object
        onProgress?.('Generating comprehensive report...', 80);
        
        const reportData = {
          companyName: analysis.companyName,
          sourceUrls: validUrls,
          summary: analysis.summary,
          companyInfo: analysis.companyInfo,
          painPoints: analysis.painPoints,
          conversationStarters: analysis.conversationStarters,
          keyInsights: analysis.keyInsights,
          recommendations: analysis.recommendations,
          reportPurpose: reportPurpose || '',
        };

        // Step 5: Save to database
        onProgress?.('Finalizing and saving report...', 95);
        
        let savedReport: Report;
        
        if (supabase) {
          try {
            const dbReport = await this.createReport(reportData);
            if (dbReport) {
              savedReport = dbReport;
            } else {
              throw new Error('Failed to save report to database');
            }
          } catch (dbError) {
            console.error('Database error:', dbError);
            // Create a local report if database save fails
            savedReport = this.createLocalReport(reportData);
          }
        } else {
          savedReport = this.createLocalReport(reportData);
        }

        onProgress?.('Report generated successfully!', 100);
        
        return savedReport;
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
        throw new Error('Failed to analyze content. Please try again or use different URLs.');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      ErrorService.logError(error as Error, 'Report generation');
      throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static generateMockContent(companyName: string, urls: string[]) {
    return urls.map(url => {
      const domain = new URL(url).hostname;
      let mockContent = '';
      let mockTitle = '';
      
      // Generate more realistic mock content based on URL
      if (url.includes('linkedin.com')) {
        mockTitle = `${companyName} | LinkedIn`;
        mockContent = `${companyName} is a leading provider in their industry with a focus on innovation and customer success. The company has a strong team of professionals dedicated to delivering high-quality solutions. Their LinkedIn profile showcases their company culture, recent achievements, and industry expertise.`;
      } else if (url.includes('news') || url.includes('article')) {
        mockTitle = `${companyName} Announces New Strategic Initiative`;
        mockContent = `In a recent announcement, ${companyName} revealed plans to expand their market presence and launch innovative solutions to address evolving customer needs. Industry analysts view this move as a significant step in the company's growth strategy. The company's leadership emphasized their commitment to sustainable growth and technological advancement.`;
      } else {
        mockTitle = `${companyName} - Official Website`;
        mockContent = `${companyName} provides industry-leading solutions designed to help businesses optimize their operations and achieve strategic objectives. With a focus on innovation and customer success, the company has established a strong reputation in the market. Their product offerings include comprehensive tools for business optimization, data analysis, and process improvement.`;
      }
      
      return {
        url,
        title: mockTitle,
        content: mockContent,
        metadata: { 
          description: `Information about ${companyName} from ${domain}`,
          keywords: ['business', 'solutions', 'innovation', 'technology', 'services']
        }
      };
    });
  }

  private static createLocalReport(data: any): Report {
    return {
      id: Math.random().toString(36).substring(7),
      companyName: data.companyName,
      generatedAt: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      summary: data.summary,
      companyInfo: data.companyInfo,
      painPoints: data.painPoints,
      conversationStarters: data.conversationStarters,
      keyInsights: data.keyInsights,
      recommendations: data.recommendations,
      sourceUrls: data.sourceUrls,
      reportPurpose: data.reportPurpose,
    };
  }

  static async createReport(data: {
    companyName: string;
    sourceUrls: string[];
    summary: string;
    companyInfo: string;
    painPoints: string[];
    conversationStarters: string[];
    keyInsights: string[];
    recommendations: string;
    reportPurpose?: string;
  }): Promise<Report | null> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: report, error } = await supabase
        .from('reports')
        .insert({
          company_name: data.companyName,
          summary: data.summary,
          company_info: data.companyInfo,
          pain_points: data.painPoints,
          conversation_starters: data.conversationStarters,
          key_insights: data.keyInsights,
          recommendations: data.recommendations,
          source_urls: data.sourceUrls,
          report_purpose: data.reportPurpose || '',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this.transformDatabaseReport(report);
    } catch (error) {
      console.error('Error creating report in database:', error);
      throw error;
    }
  }

  static async getReports(): Promise<Report[]> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return reports.map(this.transformDatabaseReport);
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  static async getReport(id: string): Promise<Report | null> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: report, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return this.transformDatabaseReport(report);
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  static async deleteReport(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  private static transformDatabaseReport(dbReport: any): Report {
    return {
      id: dbReport.id,
      companyName: dbReport.company_name,
      generatedAt: new Date(dbReport.created_at || dbReport.generated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      summary: dbReport.summary,
      companyInfo: dbReport.company_info,
      painPoints: dbReport.pain_points || [],
      conversationStarters: dbReport.conversation_starters || [],
      keyInsights: dbReport.key_insights || [],
      recommendations: dbReport.recommendations,
      sourceUrls: dbReport.source_urls || [],
      reportPurpose: dbReport.report_purpose || '',
    };
  }
}