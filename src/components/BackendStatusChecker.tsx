import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Loader, Database, Globe, Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { FirecrawlService } from '../services/firecrawlService';
import { OpenAIService } from '../services/openaiService';

interface BackendStatusCheckerProps {
  onStatusChange?: (status: 'connected' | 'disconnected' | 'checking') => void;
}

const BackendStatusChecker: React.FC<BackendStatusCheckerProps> = ({ onStatusChange }) => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [services, setServices] = useState({
    database: false,
    webScraping: false,
    aiAnalysis: false
  });

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    setStatus('checking');
    
    // Check Supabase
    const databaseConnected = isSupabaseConfigured();
    
    // Check Firecrawl
    const webScrapingConnected = FirecrawlService.isConfigured();
    
    // Check OpenAI
    const aiAnalysisConnected = OpenAIService.isConfigured();
    
    // Update services status
    setServices({
      database: databaseConnected,
      webScraping: webScrapingConnected,
      aiAnalysis: aiAnalysisConnected
    });
    
    // Determine overall status
    const newStatus = (databaseConnected || webScrapingConnected || aiAnalysisConnected) 
      ? 'connected' 
      : 'disconnected';
    
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const getStatusIcon = (isConnected: boolean) => {
    if (status === 'checking') {
      return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    return isConnected 
      ? <CheckCircle className="h-4 w-4 text-green-500" /> 
      : <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className={`p-4 rounded-lg text-sm ${
      status === 'connected' 
        ? 'bg-green-50 border border-green-200' 
        : status === 'disconnected'
          ? 'bg-yellow-50 border border-yellow-200'
          : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {status === 'connected' 
            ? <CheckCircle className="h-5 w-5 text-green-600" />
            : status === 'disconnected'
              ? <AlertTriangle className="h-5 w-5 text-yellow-600" />
              : <Loader className="h-5 w-5 text-blue-600 animate-spin" />
          }
          <span className="font-medium">
            {status === 'connected' 
              ? 'Backend Connected' 
              : status === 'disconnected'
                ? 'Running in Demo Mode'
                : 'Checking Connection...'}
          </span>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          status === 'connected' 
            ? 'bg-green-100 text-green-800' 
            : status === 'disconnected'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
        }`}>
          {status === 'connected' 
            ? 'Live' 
            : status === 'disconnected'
              ? 'Demo'
              : 'Checking'}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between p-2 bg-white rounded">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-gray-500" />
            <span className="text-xs">Database</span>
          </div>
          {getStatusIcon(services.database)}
        </div>
        <div className="flex items-center justify-between p-2 bg-white rounded">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="text-xs">Web Scraping</span>
          </div>
          {getStatusIcon(services.webScraping)}
        </div>
        <div className="flex items-center justify-between p-2 bg-white rounded">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-gray-500" />
            <span className="text-xs">AI Analysis</span>
          </div>
          {getStatusIcon(services.aiAnalysis)}
        </div>
      </div>
    </div>
  );
};

export default BackendStatusChecker;