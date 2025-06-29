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
      // Add a random query parameter to avoid CORS issues with cached responses
      const cacheBuster = `_cb=${Date.now()}`;
      const urlWithCacheBuster = url.includes('?') 
        ? `${url}&${cacheBuster}` 
        : `${url}?${cacheBuster}`;
      
      const response = await fetch(`${this.API_BASE_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          url: url, // Don't use cache buster for actual scraping as it might affect results
          formats: ['markdown', 'html'],
          includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'table'],
          excludeTags: ['nav', 'footer', 'aside', 'script', 'style', 'iframe', 'form', 'button'],
          waitFor: 3000, // Increased wait time for better content loading
          followRedirects: true,
          extractMetadata: true,
          extractKeywords: true,
          maxContentLength: 15000, // Increased content length for more comprehensive analysis
          removeAds: true,
          removeTracking: true,
          removeNavigation: true,
          removeFooter: true,
          removeSidebar: true,
          prioritizeContent: true,
        }),
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          // If JSON parsing fails, continue with empty error data
        }
        
        // Handle specific error cases
        if (response.status === 403) {
          const hostname = new URL(url).hostname;
          throw new Error(`${hostname} is restricted by Firecrawl. Try using the company's official website or LinkedIn company page instead.`);
        }
        
        if (response.status === 429) {
          throw new Error(`Rate limit exceeded. Please try again in a few minutes.`);
        }
        
        throw new Error(`Firecrawl API error: ${response.status} - ${(errorData as any).error || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Scraping failed: ${data.error || 'Unknown error'}`);
      }

      // Extract keywords from content if not provided in metadata
      let keywords = data.data.metadata?.keywords || [];
      if ((!keywords || keywords.length === 0) && data.data.markdown) {
        keywords = this.extractKeywordsFromContent(data.data.markdown);
      }

      return {
        url,
        title: data.data.metadata?.title || 'Untitled',
        content: data.data.markdown || data.data.html || '',
        metadata: {
          description: data.data.metadata?.description,
          keywords: keywords,
          author: data.data.metadata?.author,
          publishedDate: data.data.metadata?.publishedTime,
        },
      };
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      throw error;
    }
  }

  private static extractKeywordsFromContent(content: string): string[] {
    // Simple keyword extraction from content
    // Remove common words and extract potential keywords
    if (!content) return [];
    
    const text = content.toLowerCase();
    const words = text.split(/\W+/);
    const wordCounts: Record<string, number> = {};
    
    // Common words to exclude
    const stopWords = new Set([
      'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
      'by', 'about', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'but', 'or', 'if', 'then',
      'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their',
      'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her'
    ]);
    
    // Count word frequencies
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
    
    // Convert to array and sort by frequency
    const sortedWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // Return top keywords
    return sortedWords.slice(0, 10);
  }

  static async scrapeMultipleUrls(urls: string[]): Promise<ScrapedContent[]> {
    const results: ScrapedContent[] = [];
    const errors: string[] = [];
    const skippedUrls: string[] = [];

    // First, filter out unsupported URLs
    const supportedUrls = urls.filter(url => {
      try {
        if (this.isUrlSupported(url)) {
          return true;
        } else {
          const hostname = new URL(url).hostname;
          skippedUrls.push(`${url} (${hostname} not supported)`);
          return false;
        }
      } catch (error) {
        skippedUrls.push(`${url} (invalid URL format)`);
        return false;
      }
    });

    if (supportedUrls.length === 0) {
      throw new Error(`No supported URLs found. Skipped: ${skippedUrls.join(', ')}. Please use company websites, LinkedIn company pages, or news articles.`);
    }

    // Process supported URLs in parallel with a reasonable limit
    const batchSize = 2; // Reduced batch size for more thorough processing
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

      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter((result): result is ScrapedContent => result !== null));
      } catch (error) {
        console.error('Batch processing error:', error);
      }
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < supportedUrls.length) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
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