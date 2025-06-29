import React from 'react';
import { FileText, Building, Target, MessageSquare, Lightbulb, Eye, Sparkles } from 'lucide-react';

const ExampleReport: React.FC = () => {
  const appleReport = {
    companyName: 'Apple Inc.',
    generatedAt: 'January 15, 2025, 2:30 PM',
    summary: 'Apple Inc. continues to dominate the premium consumer technology market with a focus on ecosystem integration and services revenue growth. Recent quarterly results show strong iPhone sales despite market saturation, with services revenue reaching record highs. The company is heavily investing in AI capabilities, spatial computing with Vision Pro, and sustainable manufacturing. Apple\'s strategic shift toward services and recurring revenue streams positions them well for long-term growth, though they face increasing regulatory scrutiny and competition in key markets.',
    companyInfo: 'Apple Inc. is the world\'s most valuable company by market capitalization, employing over 164,000 people globally. Headquartered in Cupertino, California, Apple generates over $380 billion in annual revenue across hardware, software, and services. The company operates 500+ retail stores worldwide and maintains a robust supply chain primarily centered in Asia. Recent focus areas include health technology, autonomous systems, and expanding their services ecosystem including App Store, iCloud, Apple Music, and Apple Pay.',
    painPoints: [
      'Increasing regulatory pressure in EU and US markets affecting App Store policies',
      'Market saturation in key iPhone markets leading to longer upgrade cycles',
      'Supply chain vulnerabilities exposed during recent global disruptions'
    ],
    conversationStarters: [
      'How is Apple\'s focus on services revenue impacting your technology procurement strategy?',
      'What role does device ecosystem lock-in play in your organization\'s mobile device decisions?',
      'How are you preparing for Apple\'s push into spatial computing and AR/VR applications?'
    ],
    keyInsights: [
      'Apple\'s services revenue now represents 22% of total revenue, up from 15% five years ago',
      'Recent job postings show heavy investment in AI/ML engineering roles',
      'Vision Pro launch indicates serious commitment to spatial computing despite mixed reception'
    ]
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-5 w-5 text-blue-300" />
              <span className="text-sm text-blue-300">Example Report</span>
            </div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">{appleReport.companyName}</h3>
            <p className="text-gray-300 text-sm mt-1">{appleReport.generatedAt}</p>
          </div>
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <Sparkles className="h-6 w-6 text-blue-300" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Executive Summary</h4>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
            {appleReport.summary}
          </p>
        </div>

        {/* Company Info */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Building className="h-4 w-4 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Company Information</h4>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
            {appleReport.companyInfo}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Pain Points */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <Target className="h-4 w-4 text-red-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Pain Points</h4>
            </div>
            <ul className="space-y-2">
              {appleReport.painPoints.slice(0, 2).map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{point}</span>
                </li>
              ))}
              <li className="text-gray-500 text-sm italic">+ 1 more insight...</li>
            </ul>
          </div>

          {/* Conversation Starters */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <MessageSquare className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Conversation Starters</h4>
            </div>
            <ul className="space-y-2">
              {appleReport.conversationStarters.slice(0, 2).map((starter, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{starter}</span>
                </li>
              ))}
              <li className="text-gray-500 text-sm italic">+ 1 more starter...</li>
            </ul>
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-yellow-100 rounded-lg">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Key Insights</h4>
          </div>
          <div className="space-y-2">
            {appleReport.keyInsights.slice(0, 2).map((insight, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
                <p className="text-gray-700 text-sm">{insight}</p>
              </div>
            ))}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-gray-500 text-sm italic">+ 1 more insight...</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              See how detailed insights can transform your sales meetings
            </p>
            <p className="text-xs text-gray-500">
              ← Enter your company details to generate a full report
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleReport;