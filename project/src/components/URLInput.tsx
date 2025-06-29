import React, { useState, useEffect } from 'react';
import { Plus, X, Globe, Search, Brain, AlertTriangle, DollarSign } from 'lucide-react';
import { FirecrawlService } from '../services/firecrawlService';
import { OpenAIService } from '../services/openaiService';
import { useDebounce } from '../hooks/useDebounce';
import { URLValidator } from '../utils/validation';
import { Button, Input } from './ui';

interface URLInputProps {
  onAnalyze: (urls: string[], companyName: string) => void;
  isLoading: boolean;
}

const URLInput: React.FC<URLInputProps> = ({ onAnalyze, isLoading }) => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [companyName, setCompanyName] = useState('');
  const [urlWarnings, setUrlWarnings] = useState<{ [index: number]: string }>({});
  const [costEstimate, setCostEstimate] = useState<any>(null);
  
  const debouncedUrls = useDebounce(urls, 500);

  // Update cost estimate when URLs change
  useEffect(() => {
    console.log('URLs changed, updating cost estimate:', debouncedUrls);
    
    const validUrls = debouncedUrls.filter(url => {
      const trimmed = url.trim();
      const isValid = trimmed && URLValidator.isValidUrl(trimmed);
      console.log(`URL "${trimmed}" is valid:`, isValid);
      return isValid;
    });
    
    console.log('Valid URLs for cost estimation:', validUrls);
    
    if (validUrls.length > 0) {
      try {
        const { supported } = URLValidator.filterSupportedUrls(validUrls);
        const estimate = {
          recommended: supported.slice(0, 5),
          skipped: supported.slice(5),
          estimatedCost: Math.min(supported.length, 5) * 0.01
        };
        console.log('Cost estimate result:', estimate);
        setCostEstimate(estimate);
      } catch (error) {
        console.error('Error validating URLs for cost:', error);
        setCostEstimate(null);
      }
    } else {
      console.log('No valid URLs, clearing cost estimate');
      setCostEstimate(null);
    }
  }, [debouncedUrls]);

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
    
    const newWarnings: { [index: number]: string } = {};
    Object.entries(urlWarnings).forEach(([key, value]) => {
      const idx = parseInt(key);
      if (idx < index) {
        newWarnings[idx] = value;
      } else if (idx > index) {
        newWarnings[idx - 1] = value;
      }
    });
    setUrlWarnings(newWarnings);
  };

  const updateUrl = (index: number, value: string) => {
    console.log(`Updating URL at index ${index} to:`, value);
    
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);

    const newWarnings = { ...urlWarnings };
    const validationMessage = URLValidator.getValidationMessage(value);
    
    if (validationMessage) {
      newWarnings[index] = validationMessage;
    } else {
      delete newWarnings[index];
    }
    
    setUrlWarnings(newWarnings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validUrls = urls.filter(url => url.trim() !== '');
    console.log('Submitting with URLs:', validUrls);
    
    if (validUrls.length > 0 && companyName.trim()) {
      onAnalyze(validUrls, companyName.trim());
    }
  };

  const supportedExamples = FirecrawlService.getSupportedUrlExamples();
  const restrictedDomains = FirecrawlService.getRestrictedDomains();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Search className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Start Your Research</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Company/Person Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company or person name"
          required
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Research Sources
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Add URLs from company websites, LinkedIn company pages, news articles, or business blogs.
          </p>
          
          <div className="space-y-3">
            {urls.map((url, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        urlWarnings[index] ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com"
                    />
                  </div>
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrlField(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {urlWarnings[index] && (
                  <div className="flex items-start space-x-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{urlWarnings[index]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addUrlField}
            className="mt-3 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Add another URL</span>
          </button>

          {/* Cost Estimate */}
          {costEstimate && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <h4 className="text-sm font-semibold text-green-900">Cost Optimization</h4>
              </div>
              <div className="text-sm text-green-800 space-y-1">
                <div>✅ {costEstimate.recommended.length} URLs will be processed</div>
                <div>💰 Estimated cost: ${costEstimate.estimatedCost.toFixed(2)}</div>
                {costEstimate.skipped.length > 0 && (
                  <div>⚡ {costEstimate.skipped.length} URLs skipped for cost optimization</div>
                )}
              </div>
            </div>
          )}

          {/* Service Status */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">🔧 Service Status:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                FirecrawlService.isConfigured() ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  FirecrawlService.isConfigured() ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span>Web Scraping: {FirecrawlService.isConfigured() ? 'Live' : 'Mock'}</span>
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                OpenAIService.isConfigured() ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  OpenAIService.isConfigured() ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span>AI Analysis: {OpenAIService.isConfigured() ? 'OpenAI' : 'Mock'}</span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-100 text-green-700">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>CRM Export: Ready</span>
              </div>
            </div>
          </div>

          {/* URL Guidelines */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">✅ Supported URL Types:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {supportedExamples.map((example, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
            
            <h4 className="text-sm font-semibold text-gray-900 mt-3 mb-2">❌ Not Supported:</h4>
            <p className="text-sm text-gray-700">
              Social media platforms ({restrictedDomains.slice(0, 4).join(', ')}, etc.) are restricted by our web scraping service.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !companyName.trim() || urls.filter(url => url.trim()).length === 0}
          loading={isLoading}
          icon={Brain}
          fullWidth
          size="lg"
        >
          {isLoading ? 'Analyzing...' : 'Generate AI Research Report'}
        </Button>
      </form>
    </div>
  );
};

export default URLInput;