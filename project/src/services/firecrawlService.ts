export interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  metadata?: {
    description?: string;
    keywords?: string[];
    author?: string;
    publishedDate?: string;
  };
}

export class FirecrawlService {
  private static readonly API_BASE_URL = 'https://api.firecrawl.dev/v0';
  private static readonly API_KEY = import.meta.env.VITE_FIRECRAWL_API_KEY;

  // List of domains that are commonly restricted by Firecrawl
  private static readonly RESTRICTED_DOMAINS = [
    'instagram.com',
    'facebook.com',
    'twitter.com',
    'x.com',
    'tiktok.com',
    'snapchat.com',
    'pinterest.com',
    'reddit.com',
    'youtube.com',
    'discord.com',
    'telegram.org',
    'whatsapp.com'
  ];

  static isConfigured(): boolean {
    return !!this.API_KEY;
  }

  static isUrlSupported(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Check if the domain is in our restricted list
      return !this.RESTRICTED_DOMAINS.some(domain => 
        hostname === domain || hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  }

  static async scrapeUrl(url: string): Promise<ScrapedContent> {
    if (!this.API_KEY) {
      throw new Error('Firecrawl API key not configured');
    }

    // Check if URL is supported before attempting to scrape
    if (!this.isUrlSupported(url)) {
      const hostname = new URL(url).hostname;
      throw new Error(`${hostname} is not supported by Firecrawl. Please use company websites, LinkedIn company pages, or news articles instead.`);
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          url,
          formats: ['markdown', 'html'],
          includeTags: ['title', 'meta'],
          excludeTags: ['nav', 'footer', 'aside', 'script', 'style'],
          waitFor: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific error cases
        if (response.status === 403) {
          const hostname = new URL(url).hostname;
          throw new Error(`${hostname} is restricted by Firecrawl. Try using the company's official website or LinkedIn company page instead.`);
        }
        
        throw new Error(`Firecrawl API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Scraping failed: ${data.error || 'Unknown error'}`);
      }

      return {
        url,
        title: data.data.metadata?.title || 'Untitled',
        content: data.data.markdown || data.data.html || '',
        metadata: {
          description: data.data.metadata?.description,
          keywords: data.data.metadata?.keywords,
          author: data.data.metadata?.author,
          publishedDate: data.data.metadata?.publishedTime,
        },
      };
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      throw error;
    }
  }

  static async scrapeMultipleUrls(urls: string[]): Promise<ScrapedContent[]> {
    const results: ScrapedContent[] = [];
    const errors: string[] = [];
    const skippedUrls: string[] = [];

    // First, filter out unsupported URLs
    const supportedUrls = urls.filter(url => {
      if (this.isUrlSupported(url)) {
        return true;
      } else {
        const hostname = new URL(url).hostname;
        skippedUrls.push(`${url} (${hostname} not supported)`);
        return false;
      }
    });

    if (supportedUrls.length === 0) {
      throw new Error(`No supported URLs found. Skipped: ${skippedUrls.join(', ')}. Please use company websites, LinkedIn company pages, or news articles.`);
    }

    // Process supported URLs in parallel with a reasonable limit
    const batchSize = 3;
    for (let i = 0; i < supportedUrls.length; i += batchSize) {
      const batch = supportedUrls.slice(i, i + batchSize);
      const batchPromises = batch.map(async (url) => {
        try {
          return await this.scrapeUrl(url);
        } catch (error) {
          errors.push(`${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter((result): result is ScrapedContent => result !== null));
    }

    // If we have some results, return them even if some URLs failed
    if (results.length > 0) {
      if (errors.length > 0 || skippedUrls.length > 0) {
        console.warn('Some URLs failed or were skipped:', [...errors, ...skippedUrls]);
      }
      return results;
    }

    // If no results, provide helpful error message
    const allIssues = [...errors, ...skippedUrls];
    throw new Error(`All URLs failed to scrape: ${allIssues.join('; ')}. Please try using company websites, LinkedIn company pages, or news articles instead.`);
  }

  static getSupportedUrlExamples(): string[] {
    return [
      'https://company.com',
      'https://linkedin.com/company/company-name',
      'https://news.site.com/article',
      'https://blog.company.com',
      'https://about.company.com'
    ];
  }

  static getRestrictedDomains(): string[] {
    return [...this.RESTRICTED_DOMAINS];
  }
}