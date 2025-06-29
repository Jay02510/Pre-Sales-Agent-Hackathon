import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { CostOptimizationService } from '../services/costOptimizationService';
import { Card } from './ui';

const CostMonitor: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(CostOptimizationService.getUsageStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const { total, efficiency } = stats;
  const isHighCost = total.costs > 5;
  const isApproachingLimit = total.costs > 8;

  // Minimized view for regular users
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Card className="p-3 bg-white shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-1 rounded ${isHighCost ? 'bg-red-100' : 'bg-green-100'}`}>
              <DollarSign className={`h-4 w-4 ${isHighCost ? 'text-red-600' : 'text-green-600'}`} />
            </div>
            <div className="text-sm">
              <span className="font-medium">${total.costs.toFixed(2)}</span>
              <span className="text-gray-500 ml-1">cost</span>
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="mb-6" padding="md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isHighCost ? 'bg-red-100' : 'bg-green-100'}`}>
            <DollarSign className={`h-5 w-5 ${isHighCost ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Cost Optimization</h3>
            <p className="text-sm text-gray-600">Real-time usage tracking</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Minimize"
          >
            <EyeOff className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            ${total.costs.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Total Cost</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {total.count}
          </div>
          <div className="text-sm text-gray-600">API Calls</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {(efficiency.cacheHitRate * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">Cache Hit Rate</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            ${efficiency.projectedMonthlyCost.toFixed(0)}
          </div>
          <div className="text-sm text-gray-600">Monthly Proj.</div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center space-x-4 mb-4">
        {isApproachingLimit ? (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Approaching cost limit</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Cost optimized</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-blue-600">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm">
            {efficiency.cacheHitRate > 0.7 ? 'Excellent' : 'Good'} cache performance
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Service Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Firecrawl:</span>
                  <span>${stats.firecrawl.costs.toFixed(2)} ({stats.firecrawl.count} calls)</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Analysis:</span>
                  <span>${stats.ai.costs.toFixed(2)} ({stats.ai.count} calls)</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Optimization Tips</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>• Use fewer URLs per report</div>
                <div>• Enable caching for repeated requests</div>
                <div>• Prioritize high-value content sources</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CostMonitor;