// API Cost Optimization Service
import { cacheService } from './cacheService';
import { ErrorService } from './errorService';

interface RequestMetrics {
  count: number;
  lastReset: number;
  costs: number;
}

interface CostTracker {
  firecrawl: RequestMetrics;
  ai: RequestMetrics;
  openai: RequestMetrics;
  total: RequestMetrics;
}

export class CostOptimizationService {
  private static readonly RATE_LIMITS = {
    firecrawl: {
      requestsPerMinute: 10,
      requestsPerHour: 100,
      costPerRequest: 0.01, // $0.01 per request
    },
    ai: {
      requestsPerMinute: 20,
      requestsPerHour: 200,
      costPerRequest: 0.002, // $0.002 per request (fallback)
    },
    openai: {
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      costPerRequest: 0.005, // $0.005 per request (estimated)
    },
  };

  private static costTracker: CostTracker = {
    firecrawl: { count: 0, lastReset: Date.now(), costs: 0 },
    ai: { count: 0, lastReset: Date.now(), costs: 0 },
    openai: { count: 0, lastReset: Date.now(), costs: 0 },
    total: { count: 0, lastReset: Date.now(), costs: 0 },
  };

  // 1. REQUEST BATCHING & DEDUPLICATION
  static async batchRequests<T>(
    requests: Array<() => Promise<T>>,
    batchSize: number = 3,
    delayMs: number = 1000
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      
      try {
        const batchResults = await Promise.allSettled(
          batch.map(request => request())
        );
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            ErrorService.logError(
              new Error(result.reason), 
              `Batch request ${i + index} failed`
            );
          }
        });
        
        // Add delay between batches to respect rate limits
        if (i + batchSize < requests.length) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        ErrorService.logError(error as Error, 'Batch processing failed');
      }
    }
    
    return results;
  }

  // 2. INTELLIGENT CACHING
  static getCacheKey(type: string, params: any): string {
    try {
      return `${type}:${JSON.stringify(params)}`;
    } catch (error) {
      return `${type}:${String(params)}`;
    }
  }

  static async withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 3600000 // 1 hour default
  ): Promise<T> {
    // Check cache first
    const cached = cacheService.get<T>(key);
    if (cached) {
      console.log(`Cache hit for ${key}`);
      return cached;
    }

    // Fetch and cache
    const data = await fetcher();
    cacheService.set(key, data, ttl);
    console.log(`Cache miss for ${key} - data cached`);
    
    return data;
  }

  // 3. CONTENT OPTIMIZATION
  static optimizeContentForAnalysis(content: string): string {
    if (!content || typeof content !== 'string') {
      return '';
    }
    
    // Remove unnecessary content to reduce AI processing costs
    const optimized = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '') // Remove navigation
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '') // Remove footers
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '') // Remove asides
      .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '') // Remove forms
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '') // Remove iframes
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Extract the most relevant sections
    const sections = this.extractRelevantSections(optimized);
    
    // If we have relevant sections, use those; otherwise use the original optimized content
    const finalContent = sections.length > 0 
      ? sections.join('\n\n')
      : optimized;
    
    // Limit content length
    return finalContent.substring(0, 10000);
  }
  
  private static extractRelevantSections(content: string): string[] {
    const relevantSections: string[] = [];
    
    // Priority keywords that indicate important content
    const priorityKeywords = [
      'about us', 'company', 'mission', 'vision', 'values', 'team', 'leadership',
      'products', 'services', 'solutions', 'offerings', 'features',
      'customers', 'clients', 'partners', 'testimonials',
      'industry', 'market', 'technology', 'innovation',
      'challenges', 'problems', 'issues', 'pain points',
      'strategy', 'growth', 'expansion', 'roadmap',
      'news', 'press release', 'announcement'
    ];
    
    // Try to extract sections with h1, h2, h3 headers
    const headerRegex = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi;
    let match;
    let lastIndex = 0;
    
    while ((match = headerRegex.exec(content)) !== null) {
      const headerText = match[1].replace(/<[^>]*>/g, '').trim();
      const headerIndex = match.index + match[0].length;
      lastIndex = headerRegex.lastIndex;
      
      // Find the next header or end of content
      headerRegex.lastIndex = headerIndex;
      const nextHeaderMatch = headerRegex.exec(content);
      const nextHeaderIndex = nextHeaderMatch ? nextHeaderMatch.index : content.length;
      
      // Reset lastIndex for the next iteration
      headerRegex.lastIndex = lastIndex;
      
      // Extract the section content
      const sectionContent = content.substring(headerIndex, nextHeaderIndex).trim();
      
      // Check if this section contains priority keywords
      const isPrioritySection = priorityKeywords.some(keyword => 
        headerText.toLowerCase().includes(keyword) || 
        sectionContent.toLowerCase().includes(keyword)
      );
      
      if (isPrioritySection) {
        relevantSections.push(`${headerText}:\n${sectionContent.replace(/<[^>]*>/g, ' ')}`);
      }
    }
    
    // If no relevant sections found with headers, try to extract paragraphs with priority content
    if (relevantSections.length === 0) {
      const paragraphs = content.split(/<p[^>]*>|<\/p>/).filter(p => p.trim().length > 100);
      
      for (const paragraph of paragraphs) {
        const isPriorityParagraph = priorityKeywords.some(keyword => 
          paragraph.toLowerCase().includes(keyword)
        );
        
        if (isPriorityParagraph) {
          relevantSections.push(paragraph.replace(/<[^>]*>/g, ' ').trim());
        }
      }
    }
    
    return relevantSections;
  }

  // 4. SMART URL FILTERING
  static prioritizeUrls(urls: string[]): string[] {
    if (!Array.isArray(urls)) {
      return [];
    }

    const priority: Record<string, number> = {
      'linkedin.com/company': 10,
      'about.': 9,
      'company.': 8,
      '.com': 7,
      'news': 6,
      'blog': 5,
      'press': 4,
      'investor': 3,
      'careers': 2
    };

    return urls
      .filter(url => url && typeof url === 'string' && this.isHighValueUrl(url))
      .sort((a, b) => {
        const scoreA = Object.entries(priority).reduce((score, [pattern, points]) => 
          a.includes(pattern) ? score + points : score, 0
        );
        const scoreB = Object.entries(priority).reduce((score, [pattern, points]) => 
          b.includes(pattern) ? score + points : score, 0
        );
        return scoreB - scoreA;
      })
      .slice(0, 5); // Limit to top 5 URLs
  }

  private static isHighValueUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    const highValuePatterns = [
      /linkedin\.com\/company/,
      /about\./,
      /company\./,
      /\.com$/,
      /news/,
      /blog/,
      /press/,
      /investor/,
      /careers/
    ];

    return highValuePatterns.some(pattern => pattern.test(url));
  }

  // 5. RATE LIMITING
  static async enforceRateLimit(service: 'firecrawl' | 'ai' | 'openai'): Promise<void> {
    const limits = this.RATE_LIMITS[service];
    const tracker = this.costTracker[service];
    
    const now = Date.now();
    const timeSinceReset = now - tracker.lastReset;
    
    // Reset counters every hour
    if (timeSinceReset > 3600000) {
      tracker.count = 0;
      tracker.lastReset = now;
    }
    
    // Check rate limits
    if (tracker.count >= limits.requestsPerHour) {
      const waitTime = 3600000 - timeSinceReset;
      throw new Error(`Rate limit exceeded for ${service}. Try again in ${Math.ceil(waitTime / 60000)} minutes.`);
    }
    
    // Add delay if approaching limits
    if (tracker.count > limits.requestsPerHour * 0.8) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // 6. COST TRACKING
  static trackRequest(service: 'firecrawl' | 'ai' | 'openai', success: boolean = true, actualCost?: number): void {
    if (!success) return;
    
    const cost = actualCost || this.RATE_LIMITS[service].costPerRequest;
    
    this.costTracker[service].count++;
    this.costTracker[service].costs += cost;
    this.costTracker.total.count++;
    this.costTracker.total.costs += cost;
    
    // Log cost warnings
    if (this.costTracker.total.costs > 10) { // $10 threshold
      console.warn(`API costs have exceeded $10. Current total: $${this.costTracker.total.costs.toFixed(2)}`);
    }
  }

  // 7. FALLBACK STRATEGIES
  static async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>,
    condition: (error: any) => boolean = () => true
  ): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      if (condition(error)) {
        console.warn('Primary service failed, using fallback:', error);
        return await fallback();
      }
      throw error;
    }
  }

  // 8. USAGE ANALYTICS
  static getUsageStats() {
    return {
      ...this.costTracker,
      efficiency: {
        cacheHitRate: this.calculateCacheHitRate(),
        avgCostPerReport: this.costTracker.total.costs / Math.max(1, this.costTracker.total.count),
        projectedMonthlyCost: this.costTracker.total.costs * 30,
      }
    };
  }

  private static calculateCacheHitRate(): number {
    // This would be implemented with actual cache hit/miss tracking
    return 0.75; // Placeholder
  }

  // 9. CONTENT DEDUPLICATION
  static deduplicateContent(contents: Array<{ url: string; content: string }>): Array<{ url: string; content: string }> {
    if (!Array.isArray(contents)) {
      return [];
    }

    const seen = new Set<string>();
    const unique: Array<{ url: string; content: string }> = [];
    
    for (const item of contents) {
      if (!item || typeof item !== 'object' || !item.content) {
        continue;
      }

      // Create a hash of the content for comparison
      const contentHash = this.simpleHash(item.content.substring(0, 1000));
      
      if (!seen.has(contentHash)) {
        seen.add(contentHash);
        unique.push(item);
      }
    }
    
    return unique;
  }

  private static simpleHash(str: string): string {
    if (!str || typeof str !== 'string') {
      return '0';
    }

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // 10. PROGRESSIVE ENHANCEMENT
  static async progressiveAnalysis(
    urls: string[],
    onProgress: (step: string, progress: number) => void
  ): Promise<any[]> {
    const results: any[] = [];
    
    if (!Array.isArray(urls) || urls.length === 0) {
      return results;
    }
    
    // Start with most important URL
    const prioritizedUrls = this.prioritizeUrls(urls);
    
    for (let i = 0; i < prioritizedUrls.length; i++) {
      const url = prioritizedUrls[i];
      const progress = ((i + 1) / prioritizedUrls.length) * 100;
      
      onProgress(`Processing ${url}...`, progress);
      
      try {
        // Check if we have enough data to stop early
        if (results.length >= 2 && this.hasMinimumRequiredData(results)) {
          onProgress('Sufficient data collected, optimizing costs...', 100);
          break;
        }
        
        // Process URL with cost optimization
        const result = await this.processUrlWithOptimization(url);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        ErrorService.logError(error as Error, `Failed to process ${url}`);
      }
    }
    
    return results;
  }

  private static hasMinimumRequiredData(results: any[]): boolean {
    if (!Array.isArray(results) || results.length === 0) {
      return false;
    }

    // Check if we have enough data for a quality report
    const totalContent = results.reduce((acc, r) => {
      if (r && r.content && typeof r.content === 'string') {
        return acc + r.content.length;
      }
      return acc;
    }, 0);
    
    return totalContent > 5000 && results.length >= 2;
  }

  private static async processUrlWithOptimization(url: string): Promise<any> {
    const cacheKey = this.getCacheKey('url-content', { url });
    
    return this.withCache(cacheKey, async () => {
      await this.enforceRateLimit('firecrawl');
      // Actual URL processing would go here
      this.trackRequest('firecrawl', true);
      return { url, content: 'processed content' };
    }, 7200000); // 2 hour cache
  }
}