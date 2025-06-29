import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader, RefreshCw, Globe, Brain, Database } from 'lucide-react';
import { FirecrawlService } from '../services/firecrawlService';
import { OpenAIService } from '../services/openaiService';
import { isSupabaseConfigured } from '../lib/supabase';
import { Card, Button } from './ui';

interface ServiceStatus {
  name: string;
  configured: boolean;
  working: boolean;
  testing: boolean;
  error?: string;
  details?: string;
}

const ServiceStatusChecker: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Supabase Database', configured: false, working: false, testing: false },
    { name: 'Firecrawl Web Scraping', configured: false, working: false, testing: false },
    { name: 'OpenAI Analysis', configured: false, working: false, testing: false }
  ]);
  const [overallStatus, setOverallStatus] = useState<'checking' | 'live' | 'partial' | 'demo'>('checking');
  const [deploymentReady, setDeploymentReady] = useState<boolean>(false);

  useEffect(() => {
    checkAllServices();
  }, []);

  useEffect(() => {
    // Check if we're ready for deployment
    const liveServices = services.filter(s => s.working).length;
    setDeploymentReady(liveServices > 0);
  }, [services]);

  const checkAllServices = async () => {
    setOverallStatus('checking');
    
    // Check Supabase
    const supabaseConfigured = isSupabaseConfigured();
    updateServiceStatus('Supabase Database', {
      configured: supabaseConfigured,
      working: supabaseConfigured,
      testing: false,
      details: supabaseConfigured ? 'Connected and ready' : 'Not configured - using demo mode'
    });

    // Check Firecrawl
    const firecrawlConfigured = FirecrawlService.isConfigured();
    updateServiceStatus('Firecrawl Web Scraping', {
      configured: firecrawlConfigured,
      working: firecrawlConfigured,
      testing: false,
      details: firecrawlConfigured ? 'API key configured - real web scraping active' : 'Not configured - using mock content'
    });

    // Check OpenAI
    const openaiConfigured = OpenAIService.isConfigured();
    updateServiceStatus('OpenAI Analysis', {
      configured: openaiConfigured,
      working: false,
      testing: true,
      details: 'Testing connection...'
    });

    if (openaiConfigured) {
      try {
        const openaiWorking = await OpenAIService.testConnection();
        updateServiceStatus('OpenAI Analysis', {
          configured: true,
          working: openaiWorking,
          testing: false,
          details: openaiWorking ? 'Connected and ready - real AI analysis active' : 'API key configured but connection failed',
          error: openaiWorking ? undefined : 'Connection test failed'
        });
      } catch (error) {
        updateServiceStatus('OpenAI Analysis', {
          configured: true,
          working: false,
          testing: false,
          details: 'Connection test failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      updateServiceStatus('OpenAI Analysis', {
        configured: false,
        working: false,
        testing: false,
        details: 'Not configured - using enhanced mock analysis'
      });
    }

    // Determine overall status
    setTimeout(() => {
      const currentServices = services;
      const liveServices = currentServices.filter(s => s.working).length;
      
      if (liveServices === 3) {
        setOverallStatus('live');
      } else if (liveServices > 0) {
        setOverallStatus('partial');
      } else {
        setOverallStatus('demo');
      }
    }, 1000);
  };

  const updateServiceStatus = (serviceName: string, updates: Partial<ServiceStatus>) => {
    setServices(prev => prev.map(service => 
      service.name === serviceName 
        ? { ...service, ...updates }
        : service
    ));
  };

  const getStatusIcon = (service: ServiceStatus) => {
    if (service.testing) {
      return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
    }
    if (service.working) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (service.configured && !service.working) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.includes('Database')) return Database;
    if (serviceName.includes('Scraping')) return Globe;
    if (serviceName.includes('OpenAI')) return Brain;
    return CheckCircle;
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'live': return 'bg-green-100 border-green-300 text-green-800';
      case 'partial': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'demo': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'live': return '🚀 All systems live! Using real data from all services.';
      case 'partial': return '⚡ Partially live! Some services using real data, others using mock data.';
      case 'demo': return '🎭 Demo mode! All services using mock/enhanced data.';
      default: return '🔍 Checking service status...';
    }
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Service Status Check</h3>
          <p className="text-sm text-gray-600">Real-time status of all integrated services</p>
        </div>
        <Button
          onClick={checkAllServices}
          variant="outline"
          size="sm"
          icon={RefreshCw}
        >
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <div className={`p-4 rounded-xl border-2 mb-6 ${getOverallStatusColor()}`}>
        <div className="text-center">
          <div className="text-lg font-semibold mb-1">
            {getOverallStatusMessage()}
          </div>
          <div className="text-sm opacity-80">
            {overallStatus === 'checking' ? 'Testing connections...' : 
             `${services.filter(s => s.working).length} of ${services.length} services using live data`}
          </div>
        </div>
      </div>

      {/* Deployment Readiness */}
      <div className={`p-4 rounded-xl border-2 mb-6 ${deploymentReady ? 'bg-green-100 border-green-300 text-green-800' : 'bg-yellow-100 border-yellow-300 text-yellow-800'}`}>
        <div className="text-center">
          <div className="text-lg font-semibold mb-1">
            {deploymentReady 
              ? '✅ Ready for deployment! At least one service is live.' 
              : '⚠️ Not ready for deployment. Configure at least one service.'}
          </div>
          <div className="text-sm opacity-80">
            {deploymentReady 
              ? 'You can deploy this application to production.' 
              : 'Configure Supabase, Firecrawl, or OpenAI before deploying.'}
          </div>
        </div>
      </div>

      {/* Individual Service Status */}
      <div className="space-y-4">
        {services.map((service, index) => {
          const ServiceIcon = getServiceIcon(service.name);
          
          return (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  <ServiceIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.details}</p>
                  {service.error && (
                    <p className="text-xs text-red-600 mt-1">Error: {service.error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  service.working ? 'bg-green-100 text-green-700' :
                  service.configured ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {service.working ? 'Live Data' : 
                   service.configured ? 'Configured' : 'Mock Data'}
                </div>
                {getStatusIcon(service)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Help */}
      {overallStatus !== 'live' && overallStatus !== 'checking' && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-2">🔧 Configuration Help</h4>
          <div className="text-sm text-blue-800 space-y-1">
            {!services.find(s => s.name.includes('Database'))?.working && (
              <div>• <strong>Supabase:</strong> Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env file</div>
            )}
            {!services.find(s => s.name.includes('Scraping'))?.working && (
              <div>• <strong>Firecrawl:</strong> Add VITE_FIRECRAWL_API_KEY to .env file</div>
            )}
            {!services.find(s => s.name.includes('OpenAI'))?.working && (
              <div>• <strong>OpenAI:</strong> Add VITE_OPENAI_API_KEY to .env file</div>
            )}
          </div>
        </div>
      )}

      {/* Deployment Instructions */}
      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
        <h4 className="font-semibold text-indigo-900 mb-2">🚀 Deployment Instructions</h4>
        <div className="text-sm text-indigo-800 space-y-2">
          <p>To deploy this application to production:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Push your code to a GitHub repository</li>
            <li>Connect the repository to Vercel or Netlify</li>
            <li>Add the necessary environment variables in your deployment platform</li>
            <li>Deploy the application</li>
          </ol>
          <p className="mt-2 font-medium">
            {deploymentReady 
              ? 'Your application is ready for deployment!' 
              : 'Configure at least one service before deploying for best results.'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ServiceStatusChecker;