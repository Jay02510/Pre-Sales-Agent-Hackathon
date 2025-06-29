import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Database, 
  Globe, 
  DollarSign, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  Zap,
  BarChart3,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { AdminService, SystemStatus } from '../services/adminService';
import { Card, Button, LoadingSpinner } from './ui';

const AdminDashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [status, activity, systemAlerts] = await Promise.all([
        AdminService.getSystemStatus(),
        AdminService.getRecentActivity(),
        AdminService.getSystemAlerts()
      ]);

      setSystemStatus(status);
      setRecentActivity(activity);
      setAlerts(systemAlerts);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    loadDashboardData();
  };

  if (loading && !systemStatus) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!systemStatus) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
        <p className="text-gray-600 mb-4">Unable to retrieve system status</p>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">System monitoring and performance metrics</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            loading={loading}
            icon={RefreshCw}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* System Alerts */}
      {alerts.length > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">System Alerts</h3>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                alert.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                    alert.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <div>
                    <h4 className={`font-medium ${
                      alert.type === 'error' ? 'text-red-900' : 'text-yellow-900'
                    }`}>
                      {alert.title}
                    </h4>
                    <p className={`text-sm ${
                      alert.type === 'error' ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Database Status */}
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${
              systemStatus.database.connected ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Database className={`h-5 w-5 ${
                systemStatus.database.connected ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
            <h3 className="font-semibold text-gray-900">Database</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <div className="flex items-center space-x-2">
                {systemStatus.database.connected ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  systemStatus.database.connected ? 'text-green-700' : 'text-red-700'
                }`}>
                  {systemStatus.database.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time:</span>
              <span className="text-sm font-medium">{systemStatus.database.responseTime}ms</span>
            </div>
          </div>
        </Card>

        {/* Web Scraping Status */}
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${
              systemStatus.webScraping.active ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Globe className={`h-5 w-5 ${
                systemStatus.webScraping.active ? 'text-green-600' : 'text-yellow-600'
              }`} />
            </div>
            <h3 className="font-semibold text-gray-900">Web Scraping</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`text-sm font-medium ${
                systemStatus.webScraping.active ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {systemStatus.webScraping.active ? 'Active' : 'Mock Mode'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Success Rate:</span>
              <span className="text-sm font-medium">
                {(systemStatus.webScraping.successRate * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        {/* AI Analysis Status */}
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${
              systemStatus.aiAnalysis.active ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Sparkles className={`h-5 w-5 ${
                systemStatus.aiAnalysis.active ? 'text-green-600' : 'text-yellow-600'
              }`} />
            </div>
            <h3 className="font-semibold text-gray-900">AI Analysis</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Service:</span>
              <span className={`text-sm font-medium ${
                systemStatus.aiAnalysis.active ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {systemStatus.aiAnalysis.service}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Success Rate:</span>
              <span className="text-sm font-medium">
                {(systemStatus.aiAnalysis.successRate * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        {/* API Costs */}
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${
              systemStatus.costs.daily > 10 ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <DollarSign className={`h-5 w-5 ${
                systemStatus.costs.daily > 10 ? 'text-red-600' : 'text-green-600'
              }`} />
            </div>
            <h3 className="font-semibold text-gray-900">API Costs</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Today:</span>
              <span className="text-sm font-medium">${systemStatus.costs.daily.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Monthly Proj:</span>
              <span className="text-sm font-medium">${systemStatus.costs.monthly.toFixed(0)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Cache Hit Rate</span>
                <span className="text-sm font-bold text-gray-900">
                  {(systemStatus.performance.cacheHitRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${systemStatus.performance.cacheHitRate * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Error Rate</span>
                <span className="text-sm font-bold text-gray-900">
                  {(systemStatus.performance.errorRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    systemStatus.performance.errorRate > 0.1 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(systemStatus.performance.errorRate * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {systemStatus.performance.avgResponseTime}ms
                </div>
                <div className="text-sm text-gray-600">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  ${(systemStatus.costs.breakdown.firecrawl + systemStatus.costs.breakdown.openai).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">API Costs</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Firecrawl</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                ${systemStatus.costs.breakdown.firecrawl.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-900">OpenAI</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                ${systemStatus.costs.breakdown.openai.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Total</span>
              </div>
              <span className="text-xl font-bold text-blue-900">
                ${systemStatus.costs.total.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Usage Statistics */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Usage Statistics</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{systemStatus.users.total}</div>
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-xs text-green-600 mt-1">
              +{systemStatus.users.newToday} today
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{systemStatus.users.active}</div>
            <div className="text-sm text-gray-600">Active Users</div>
            <div className="text-xs text-blue-600 mt-1">
              {((systemStatus.users.active / systemStatus.users.total) * 100).toFixed(0)}% active
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <FileText className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{systemStatus.reports.total}</div>
            <div className="text-sm text-gray-600">Total Reports</div>
            <div className="text-xs text-green-600 mt-1">
              +{systemStatus.reports.today} today
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Zap className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{systemStatus.reports.avgPerUser}</div>
            <div className="text-sm text-gray-600">Avg per User</div>
            <div className="text-xs text-blue-600 mt-1">
              {systemStatus.reports.thisWeek} this week
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <div className="font-medium text-gray-900">
                    Report generated for {activity.company_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    User ID: {activity.user_id?.substring(0, 8)}...
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(activity.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent activity
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;