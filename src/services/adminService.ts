import { supabase } from '../lib/supabase';
import { CostOptimizationService } from './costOptimizationService';
import { FirecrawlService } from './firecrawlService';
import { OpenAIService } from './openaiService';
import { isSupabaseConfigured } from '../lib/supabase';

export interface SystemStatus {
  database: {
    connected: boolean;
    responseTime: number;
    lastCheck: string;
  };
  webScraping: {
    active: boolean;
    apiKey: boolean;
    lastRequest: string;
    successRate: number;
  };
  aiAnalysis: {
    active: boolean;
    service: 'OpenAI' | 'Mock';
    apiKey: boolean;
    lastRequest: string;
    successRate: number;
  };
  costs: {
    total: number;
    daily: number;
    monthly: number;
    breakdown: {
      firecrawl: number;
      openai: number;
      ai: number;
    };
  };
  performance: {
    cacheHitRate: number;
    avgResponseTime: number;
    errorRate: number;
  };
  users: {
    total: number;
    active: number;
    newToday: number;
  };
  reports: {
    total: number;
    today: number;
    thisWeek: number;
    avgPerUser: number;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin: string;
}

export class AdminService {
  private static readonly ADMIN_EMAILS = [
    'admin@glance.com',
    'support@glance.com',
    'admin@finalsalesai.com',
    'support@finalsalesai.com',
    'admin@presalesai.com',
    'support@presalesai.com'
    // Add more admin emails as needed
  ];

  static async isAdmin(userEmail: string): Promise<boolean> {
    return this.ADMIN_EMAILS.includes(userEmail.toLowerCase());
  }

  static async getCurrentUserRole(): Promise<'admin' | 'user' | null> {
    if (!supabase) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const isAdminUser = await this.isAdmin(user.email || '');
      return isAdminUser ? 'admin' : 'user';
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  static async getSystemStatus(): Promise<SystemStatus> {
    try {
      const [
        databaseStatus,
        webScrapingStatus,
        aiAnalysisStatus,
        costData,
        performanceData,
        userData,
        reportData
      ] = await Promise.all([
        this.checkDatabaseStatus(),
        this.checkWebScrapingStatus(),
        this.checkAIAnalysisStatus(),
        this.getCostData(),
        this.getPerformanceData(),
        this.getUserData(),
        this.getReportData()
      ]);

      return {
        database: databaseStatus,
        webScraping: webScrapingStatus,
        aiAnalysis: aiAnalysisStatus,
        costs: costData,
        performance: performanceData,
        users: userData,
        reports: reportData
      };
    } catch (error) {
      console.error('Error getting system status:', error);
      // Return default status on error
      return this.getDefaultSystemStatus();
    }
  }

  private static getDefaultSystemStatus(): SystemStatus {
    return {
      database: { connected: false, responseTime: 0, lastCheck: new Date().toISOString() },
      webScraping: { active: false, apiKey: false, lastRequest: new Date().toISOString(), successRate: 0 },
      aiAnalysis: { active: false, service: 'Mock', apiKey: false, lastRequest: new Date().toISOString(), successRate: 0 },
      costs: { total: 0, daily: 0, monthly: 0, breakdown: { firecrawl: 0, openai: 0, ai: 0 } },
      performance: { cacheHitRate: 0, avgResponseTime: 0, errorRate: 0 },
      users: { total: 0, active: 0, newToday: 0 },
      reports: { total: 0, today: 0, thisWeek: 0, avgPerUser: 0 }
    };
  }

  private static async checkDatabaseStatus() {
    const startTime = Date.now();
    
    try {
      if (!isSupabaseConfigured()) {
        return {
          connected: false,
          responseTime: 0,
          lastCheck: new Date().toISOString()
        };
      }

      // Simple health check query
      await supabase!.from('reports').select('count', { count: 'exact', head: true });
      
      return {
        connected: true,
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        connected: false,
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString()
      };
    }
  }

  private static async checkWebScrapingStatus() {
    return {
      active: FirecrawlService.isConfigured(),
      apiKey: !!import.meta.env.VITE_FIRECRAWL_API_KEY,
      lastRequest: new Date().toISOString(),
      successRate: 0.85
    };
  }

  private static async checkAIAnalysisStatus() {
    const isOpenAIConfigured = OpenAIService.isConfigured();
    
    return {
      active: isOpenAIConfigured,
      service: isOpenAIConfigured ? 'OpenAI' as const : 'Mock' as const,
      apiKey: !!import.meta.env.VITE_OPENAI_API_KEY,
      lastRequest: new Date().toISOString(),
      successRate: isOpenAIConfigured ? 0.92 : 1.0
    };
  }

  private static async getCostData() {
    try {
      const stats = CostOptimizationService.getUsageStats();
      
      return {
        total: stats.total.costs,
        daily: stats.total.costs,
        monthly: stats.efficiency.projectedMonthlyCost,
        breakdown: {
          firecrawl: stats.firecrawl.costs,
          openai: stats.openai?.costs || 0,
          ai: stats.ai.costs
        }
      };
    } catch (error) {
      return {
        total: 0,
        daily: 0,
        monthly: 0,
        breakdown: { firecrawl: 0, openai: 0, ai: 0 }
      };
    }
  }

  private static async getPerformanceData() {
    try {
      const stats = CostOptimizationService.getUsageStats();
      
      return {
        cacheHitRate: stats.efficiency.cacheHitRate,
        avgResponseTime: 1200,
        errorRate: 0.05
      };
    } catch (error) {
      return {
        cacheHitRate: 0.75,
        avgResponseTime: 1200,
        errorRate: 0.05
      };
    }
  }

  private static async getUserData() {
    if (!supabase) {
      return {
        total: 0,
        active: 0,
        newToday: 0
      };
    }

    try {
      // Mock data since we don't have admin access to auth.users
      return {
        total: 150,
        active: 45,
        newToday: 3
      };
    } catch (error) {
      return {
        total: 0,
        active: 0,
        newToday: 0
      };
    }
  }

  private static async getReportData() {
    if (!supabase) {
      return {
        total: 0,
        today: 0,
        thisWeek: 0,
        avgPerUser: 0
      };
    }

    try {
      // Get total reports
      const { count: totalReports } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true });

      // Get reports created today
      const today = new Date().toISOString().split('T')[0];
      const { count: reportsToday } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // Get reports this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: reportsThisWeek } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      const userData = await this.getUserData();
      const avgPerUser = userData.total > 0 ? (totalReports || 0) / userData.total : 0;

      return {
        total: totalReports || 0,
        today: reportsToday || 0,
        thisWeek: reportsThisWeek || 0,
        avgPerUser: Math.round(avgPerUser * 10) / 10
      };
    } catch (error) {
      return {
        total: 0,
        today: 0,
        thisWeek: 0,
        avgPerUser: 0
      };
    }
  }

  static async getRecentActivity() {
    if (!supabase) return [];

    try {
      const { data: reports } = await supabase
        .from('reports')
        .select('id, company_name, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(10);

      return reports || [];
    } catch (error) {
      return [];
    }
  }

  static async getErrorLogs() {
    // Mock data for error logs
    return [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        level: 'error',
        message: 'Firecrawl API rate limit exceeded',
        service: 'firecrawl',
        count: 3
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        level: 'warning',
        message: 'High API costs detected',
        service: 'cost-monitor',
        count: 1
      }
    ];
  }

  static async getSystemAlerts() {
    try {
      const status = await this.getSystemStatus();
      const alerts: any[] = [];

      // Database alerts
      if (!status.database.connected) {
        alerts.push({
          type: 'error',
          title: 'Database Connection Failed',
          message: 'Unable to connect to Supabase database',
          timestamp: new Date().toISOString()
        });
      }

      // AI Analysis alerts
      if (!status.aiAnalysis.active) {
        alerts.push({
          type: 'warning',
          title: 'AI Analysis in Mock Mode',
          message: 'OpenAI not configured - using enhanced mock analysis',
          timestamp: new Date().toISOString()
        });
      }

      // Cost alerts
      if (status.costs.daily > 10) {
        alerts.push({
          type: 'warning',
          title: 'High Daily Costs',
          message: `Daily API costs have exceeded $10 (current: $${status.costs.daily.toFixed(2)})`,
          timestamp: new Date().toISOString()
        });
      }

      // Performance alerts
      if (status.performance.errorRate > 0.1) {
        alerts.push({
          type: 'warning',
          title: 'High Error Rate',
          message: `Error rate is ${(status.performance.errorRate * 100).toFixed(1)}%`,
          timestamp: new Date().toISOString()
        });
      }

      return alerts;
    } catch (error) {
      return [];
    }
  }
}