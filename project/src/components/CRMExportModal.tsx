import React, { useState } from 'react';
import { X, Download, FileText, Database, Zap, CheckCircle, ExternalLink } from 'lucide-react';
import { CRMService, type CRMFormat } from '../services/crmService';

interface CRMExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
}

const CRMExportModal: React.FC<CRMExportModalProps> = ({ isOpen, onClose, report }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('universal');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  const formats = CRMService.getSupportedFormats();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exportData = await CRMService.exportToCRM(report, selectedFormat);
      
      // Create and download file
      const blob = new Blob([exportData.data], { type: exportData.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportData.filename;
      a.click();
      URL.revokeObjectURL(url);
      
      setExportComplete(true);
      setTimeout(() => {
        setExportComplete(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const selectedFormatInfo = formats.find(f => f.name.toLowerCase().includes(selectedFormat));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Export to CRM</h2>
              <p className="text-gray-600">Choose your CRM format and download</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!exportComplete ? (
          <>
            {/* Format Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select CRM Format</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formats.map((format) => {
                  const formatKey = format.name.toLowerCase().split(' ')[0];
                  const isSelected = selectedFormat === formatKey;
                  
                  return (
                    <button
                      key={formatKey}
                      onClick={() => setSelectedFormat(formatKey)}
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{format.name}</h4>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          .{format.fileExtension}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{format.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {format.popularWith.slice(0, 2).map((crm, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {crm}
                          </span>
                        ))}
                        {format.popularWith.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{format.popularWith.length - 2} more
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Format Info */}
            {selectedFormatInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      {selectedFormatInfo.name} Export
                    </h4>
                    <p className="text-sm text-blue-700 mb-2">
                      {selectedFormatInfo.description}
                    </p>
                    <div className="text-xs text-blue-600">
                      <strong>Compatible with:</strong> {selectedFormatInfo.popularWith.join(', ')}
                    </div>
                    {selectedFormatInfo.supportsCustomFields && (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ Includes custom fields for research data
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Export Preview */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Export Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{report.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Research Date:</span>
                  <span className="font-medium">{report.generatedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pain Points:</span>
                  <span className="font-medium">{report.painPoints?.length || 0} identified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Key Insights:</span>
                  <span className="font-medium">{report.keyInsights?.length || 0} insights</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Source URLs:</span>
                  <span className="font-medium">{report.sourceUrls?.length || 0} sources</span>
                </div>
              </div>
            </div>

            {/* Import Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Import Instructions</h4>
                  <p className="text-sm text-yellow-700 mb-2">
                    After downloading, import the file into your CRM:
                  </p>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Most CRMs have an "Import" or "Upload" feature in settings</li>
                    <li>• Map the columns to your CRM fields during import</li>
                    <li>• Review and confirm the data before finalizing</li>
                    <li>• Set up follow-up tasks based on the next steps</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Export to CRM</span>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Export Complete!</h3>
            <p className="text-gray-600 mb-4">
              Your CRM file has been downloaded successfully.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                Import the file into your CRM and start following up with {report.companyName}!
              </p>
            </div>
          </div>
        )}

        {/* Help Link */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>Need help with CRM import?</span>
            <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
              <span>View Guide</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMExportModal;