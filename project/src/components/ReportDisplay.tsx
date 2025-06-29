import React, { useState } from 'react';
import { FileText, Building, Target, MessageSquare, Lightbulb, Download, Share, Database } from 'lucide-react';
import InsightBlock from './InsightBlock';
import FeedbackSystem from './FeedbackSystem';
import CRMExportModal from './CRMExportModal';
import { FeedbackService } from '../services/feedbackService';

interface Report {
  id: string;
  companyName: string;
  generatedAt: string;
  summary: string;
  companyInfo: string;
  painPoints: string[];
  conversationStarters: string[];
  keyInsights: string[];
  recommendations: string;
  sourceUrls?: string[];
}

interface ReportDisplayProps {
  report: Report;
  onNewReport: () => void;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, onNewReport }) => {
  const [reportData, setReportData] = useState(report);
  const [showCRMExport, setShowCRMExport] = useState(false);

  const handleExport = () => {
    const reportContent = `
# Pre-Sales Research Report - ${reportData.companyName}

## Executive Summary
${reportData.summary}

## Company Information
${reportData.companyInfo}

## Pain Points
${reportData.painPoints.map(point => `• ${point}`).join('\n')}

## Conversation Starters
${reportData.conversationStarters.map(starter => `• ${starter}`).join('\n')}

## Key Insights
${reportData.keyInsights.map(insight => `• ${insight}`).join('\n')}

## Recommendations
${reportData.recommendations}

Generated on: ${reportData.generatedAt}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.companyName}-research-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleInsightEdit = (insightId: string, newContent: string[] | string) => {
    setReportData(prev => {
      const updated = { ...prev };
      switch (insightId) {
        case 'summary':
          updated.summary = newContent as string;
          break;
        case 'company-info':
          updated.companyInfo = newContent as string;
          break;
        case 'pain-points':
          updated.painPoints = newContent as string[];
          break;
        case 'conversation-starters':
          updated.conversationStarters = newContent as string[];
          break;
        case 'key-insights':
          updated.keyInsights = newContent as string[];
          break;
        case 'recommendations':
          updated.recommendations = newContent as string;
          break;
      }
      return updated;
    });
  };

  const handleInsightFeedback = async (insightId: string, feedback: 'positive' | 'negative', comment?: string) => {
    try {
      await FeedbackService.submitInsightFeedback({
        reportId: reportData.id,
        insightId,
        type: feedback,
        comment,
      });
    } catch (error) {
      console.error('Failed to submit insight feedback:', error);
    }
  };

  const handleReportFeedback = async (feedback: {
    reportId: string;
    rating: number;
    comment: string;
    helpful: boolean;
  }) => {
    try {
      await FeedbackService.submitReportFeedback(feedback);
    } catch (error) {
      console.error('Failed to submit report feedback:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{reportData.companyName}</h1>
            <p className="text-blue-100">Research Report Generated</p>
            <p className="text-sm text-blue-200 mt-1">{reportData.generatedAt}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCRMExport(true)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Database className="h-4 w-4" />
              <span>Export to CRM</span>
            </button>
            <button
              onClick={handleExport}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Share className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modular Insight Blocks */}
      <InsightBlock
        id="summary"
        title="Executive Summary"
        icon={FileText}
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        content={reportData.summary}
        type="text"
        isEditable={true}
        onEdit={handleInsightEdit}
        onFeedback={handleInsightFeedback}
      />

      <InsightBlock
        id="company-info"
        title="Company Information"
        icon={Building}
        iconColor="text-green-600"
        bgColor="bg-green-100"
        content={reportData.companyInfo}
        type="text"
        isEditable={true}
        onEdit={handleInsightEdit}
        onFeedback={handleInsightFeedback}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <InsightBlock
          id="pain-points"
          title="Pain Points"
          icon={Target}
          iconColor="text-red-600"
          bgColor="bg-red-100"
          content={reportData.painPoints}
          type="list"
          isEditable={true}
          onEdit={handleInsightEdit}
          onFeedback={handleInsightFeedback}
        />

        <InsightBlock
          id="conversation-starters"
          title="Conversation Starters"
          icon={MessageSquare}
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
          content={reportData.conversationStarters}
          type="list"
          isEditable={true}
          onEdit={handleInsightEdit}
          onFeedback={handleInsightFeedback}
        />
      </div>

      <InsightBlock
        id="key-insights"
        title="Key Insights"
        icon={Lightbulb}
        iconColor="text-yellow-600"
        bgColor="bg-yellow-100"
        content={reportData.keyInsights}
        type="grid"
        isEditable={true}
        onEdit={handleInsightEdit}
        onFeedback={handleInsightFeedback}
      />

      <InsightBlock
        id="recommendations"
        title="Strategic Recommendations"
        icon={Target}
        iconColor="text-indigo-600"
        bgColor="bg-indigo-100"
        content={reportData.recommendations}
        type="text"
        isEditable={true}
        onEdit={handleInsightEdit}
        onFeedback={handleInsightFeedback}
      />

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onNewReport}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
        >
          Generate New Report
        </button>
      </div>

      {/* Feedback System */}
      <FeedbackSystem
        reportId={reportData.id}
        onFeedbackSubmit={handleReportFeedback}
      />

      {/* CRM Export Modal */}
      <CRMExportModal
        isOpen={showCRMExport}
        onClose={() => setShowCRMExport(false)}
        report={reportData}
      />
    </div>
  );
};

export default ReportDisplay;