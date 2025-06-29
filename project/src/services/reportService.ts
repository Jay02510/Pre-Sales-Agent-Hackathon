import { supabase } from '../lib/supabase';
import { Report } from '../types/database';
import { FirecrawlService } from './firecrawlService';
import { AIAnalysisService } from './aiAnalysisService';

export class ReportService {
  static async generateReport(
    companyName: string,
    urls: string[],
    onProgress?: (step: string, progress: number) => void
  ): Promise<Report> {
    try {
      // Step 1: Validate URLs
      onProgress?.('Validating URLs...', 10);
      
      const validUrls = urls.filter(url => url.trim() !== '').slice(0, 5); // Limit to 5 URLs
      
      // Step 2: Extract content
      onProgress?.('Extracting content from web sources...', 25);
      
      let scrapedContent;
      if (FirecrawlService.isConfigured()) {
        try {
          scrapedContent = await FirecrawlService.scrapeMultipleUrls(validUrls);
        } catch (error) {
          console.warn('Firecrawl scraping failed, using fallback:', error);
          scrapedContent = validUrls.map(url => ({
            url,
            title: `Fallback content for ${new URL(url).hostname}`,
            content: `Fallback content for ${url}`,
            metadata: { description: 'Fallback content' }
          }));
        }
      } else {
        scrapedContent = validUrls.map(url => ({
          url,
          title: `Mock content for ${new URL(url).hostname}`,
          content: `Mock content extracted from ${url}.`,
          metadata: { description: `Mock description for ${url}` }
        }));
      }

      // Step 3: AI analysis
      onProgress?.('Performing AI analysis...', 60);
      
      const analysis = await AIAnalysisService.analyzeContent(companyName, scrapedContent);

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
      };

      // Step 5: Save to database
      onProgress?.('Finalizing and saving report...', 95);
      
      let savedReport: Report;
      
      if (supabase) {
        const dbReport = await this.createReport(reportData);
        if (dbReport) {
          savedReport = dbReport;
        } else {
          throw new Error('Failed to save report to database');
        }
      } else {
        savedReport = {
          id: Math.random().toString(36).substring(7),
          companyName: reportData.companyName,
          generatedAt: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          summary: reportData.summary,
          companyInfo: reportData.companyInfo,
          painPoints: reportData.painPoints,
          conversationStarters: reportData.conversationStarters,
          keyInsights: reportData.keyInsights,
          recommendations: reportData.recommendations,
          sourceUrls: reportData.sourceUrls,
        };
      }

      onProgress?.('Report generated successfully!', 100);
      
      return savedReport;
      
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
  }): Promise<Report | null> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

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
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return this.transformDatabaseReport(report);
  }

  static async getReports(): Promise<Report[]> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

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
  }

  static async getReport(id: string): Promise<Report | null> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

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
  }

  static async deleteReport(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

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
  }

  private static transformDatabaseReport(dbReport: any): Report {
    return {
      id: dbReport.id,
      companyName: dbReport.company_name,
      generatedAt: new Date(dbReport.generated_at).toLocaleDateString('en-US', {
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
    };
  }
}