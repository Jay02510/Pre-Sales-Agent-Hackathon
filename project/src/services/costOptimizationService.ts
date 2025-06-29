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
    return content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 8000); // Limit content length
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