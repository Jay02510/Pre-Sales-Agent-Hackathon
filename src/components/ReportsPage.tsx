import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Download, Trash2, Eye, Calendar } from 'lucide-react';
import { ReportService } from '../services/reportService';
import { Report } from '../types/database';
import { isSupabaseConfigured } from '../lib/supabase';

interface ReportsPageProps {
  onViewReport: (report: Report) => void;
  onNewReport: () => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ onViewReport, onNewReport }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'company'>('date');

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterAndSortReports();
  }, [reports, searchTerm, sortBy]);

  const loadReports = async () => {
    if (!isSupabaseConfigured()) {
      // Demo mode - show mock reports
      const mockReports = [
        {
          id: 'demo-1',
          companyName: 'Apple Inc.',
          generatedAt: 'January 15, 2025, 2:30 PM',
          summary: 'Apple Inc. continues to dominate the premium consumer technology market with a focus on ecosystem integration and services revenue growth.',
          companyInfo: 'Apple Inc. is the world\'s most valuable company by market capitalization, employing over 164,000 people globally.',
          painPoints: ['Regulatory pressure in EU markets', 'Market saturation in key iPhone markets', 'Supply chain vulnerabilities'],
          conversationStarters: ['How is Apple\'s focus on services revenue impacting your strategy?', 'What role does device ecosystem lock-in play in your decisions?'],
          keyInsights: ['Services revenue now represents 22% of total revenue', 'Heavy investment in AI/ML engineering roles', 'Vision Pro launch indicates spatial computing commitment'],
          recommendations: 'Position your solution as a strategic enabler for Apple\'s digital presence optimization.',
          sourceUrls: ['https://apple.com', 'https://linkedin.com/company/apple']
        },
        {
          id: 'demo-2',
          companyName: 'Microsoft Corporation',
          generatedAt: 'January 14, 2025, 10:15 AM',
          summary: 'Microsoft continues its cloud-first transformation with Azure leading growth initiatives and AI integration across all product lines.',
          companyInfo: 'Microsoft Corporation is a multinational technology company headquartered in Redmond, Washington.',
          painPoints: ['Legacy system integration challenges', 'Competition in cloud infrastructure', 'AI ethics and governance'],
          conversationStarters: ['How is Microsoft\'s AI integration affecting your technology roadmap?', 'What are your thoughts on hybrid cloud strategies?'],
          keyInsights: ['Azure revenue growth exceeding 30% annually', 'Copilot integration across Office suite', 'Major investments in quantum computing'],
          recommendations: 'Focus on how your solution complements Microsoft\'s ecosystem and AI initiatives.',
          sourceUrls: ['https://microsoft.com', 'https://linkedin.com/company/microsoft']
        }
      ];
      setReports(mockReports);
      setLoading(false);
      return;
    }

    try {
      const userReports = await ReportService.getReports();
      setReports(userReports);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReports = () => {
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort reports
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
      } else {
        return a.companyName.localeCompare(b.companyName);
      }
    });

    setFilteredReports(filtered);
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    if (!isSupabaseConfigured()) {
      // Demo mode - just remove from local state
      setReports(reports.filter(r => r.id !== reportId));
      return;
    }

    try {
      await ReportService.deleteReport(reportId);
      setReports(reports.filter(r => r.id !== reportId));
    } catch (err) {
      alert('Failed to delete report');
    }
  };

  const exportReport = (report: Report) => {
    const content = `
# Pre-Sales Research Report - ${report.companyName}

## Executive Summary
${report.summary}

## Company Information
${report.companyInfo}

## Pain Points
${report.painPoints.map(point => `• ${point}`).join('\n')}

## Conversation Starters
${report.conversationStarters.map(starter => `• ${starter}`).join('\n')}

## Key Insights
${report.keyInsights.map(insight => `• ${insight}`).join('\n')}

## Recommendations
${report.recommendations}

Generated on: ${report.generatedAt}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.companyName}-research-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Manage and view all your research reports</p>
        </div>
        <button
          onClick={onNewReport}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          New Report
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by company name or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'company')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="company">Sort by Company</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No reports found' : 'No reports yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first research report to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={onNewReport}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Create First Report
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{report.companyName}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{report.generatedAt}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-3">{report.summary}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>{report.painPoints.length} pain points</span>
                      <span>{report.keyInsights.length} insights</span>
                      <span>{report.conversationStarters.length} conversation starters</span>
                      <span>{report.sourceUrls.length} sources</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onViewReport(report)}
                      className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                      title="View Report"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => exportReport(report)}
                      className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors"
                      title="Export Report"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isSupabaseConfigured() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> Configure Supabase to save and manage your reports permanently.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;