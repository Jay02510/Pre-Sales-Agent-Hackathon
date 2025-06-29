import React, { useState, useEffect } from 'react';
import { FileText, Calendar, TrendingUp, Users, Plus, Eye } from 'lucide-react';
import { ReportService } from '../services/reportService';
import { Report } from '../types/database';
import { isSupabaseConfigured } from '../lib/supabase';

interface DashboardProps {
  onNewReport: () => void;
  onViewReport: (report: Report) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNewReport, onViewReport }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    if (!isSupabaseConfigured()) {
      // Demo mode - show mock reports
      setReports([
        {
          id: 'demo-1',
          companyName: 'Apple Inc.',
          generatedAt: 'January 15, 2025, 2:30 PM',
          summary: 'Apple Inc. continues to dominate the premium consumer technology market...',
          companyInfo: 'Apple Inc. is the world\'s most valuable company by market capitalization...',
          painPoints: ['Regulatory pressure in EU markets', 'Market saturation in key iPhone markets'],
          conversationStarters: ['How is Apple\'s focus on services revenue impacting your strategy?'],
          keyInsights: ['Services revenue now represents 22% of total revenue'],
          recommendations: 'Position your solution as a strategic enabler...',
          sourceUrls: ['https://apple.com', 'https://linkedin.com/company/apple']
        }
      ]);
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

  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'This Month',
      value: reports.filter(r => {
        const reportDate = new Date(r.generatedAt);
        const now = new Date();
        return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
      }).length,
      icon: Calendar,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Companies Researched',
      value: new Set(reports.map(r => r.companyName)).size,
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Avg. Insights per Report',
      value: reports.length > 0 ? Math.round(reports.reduce((acc, r) => acc + r.keyInsights.length, 0) / reports.length) : 0,
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your research reports and insights</p>
        </div>
        <button
          onClick={onNewReport}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Report</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
        </div>
        
        {error ? (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-600 mb-6">Create your first research report to get started</p>
            <button
              onClick={onNewReport}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Create First Report
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.companyName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{report.generatedAt}</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{report.summary}</p>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <span>{report.painPoints.length} pain points</span>
                      <span>{report.keyInsights.length} insights</span>
                      <span>{report.sourceUrls.length} sources</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewReport(report)}
                    className="ml-4 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default Dashboard;