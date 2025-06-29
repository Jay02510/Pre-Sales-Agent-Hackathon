import React from 'react';
import { BookOpen, CheckCircle, ExternalLink, Database, FileText, Zap } from 'lucide-react';

const CRMGuide: React.FC = () => {
  const crmPlatforms = [
    {
      name: 'Salesforce',
      logo: '☁️',
      steps: [
        'Go to Setup → Data → Data Import Wizard',
        'Select "Leads" or "Accounts" as your object',
        'Upload your CSV file',
        'Map the columns to Salesforce fields',
        'Review and start import'
      ],
      tips: 'Use custom fields for research data like Pain Points and Key Insights'
    },
    {
      name: 'HubSpot',
      logo: '🧡',
      steps: [
        'Navigate to Contacts → Import',
        'Choose "File from computer"',
        'Upload your CSV file',
        'Map columns to HubSpot properties',
        'Review and finish import'
      ],
      tips: 'HubSpot automatically creates custom properties for unmapped columns'
    },
    {
      name: 'Pipedrive',
      logo: '🟢',
      steps: [
        'Go to Settings → Import data',
        'Select "Organizations" or "Deals"',
        'Upload your CSV file',
        'Match fields with Pipedrive fields',
        'Complete the import process'
      ],
      tips: 'Create custom fields beforehand for better data organization'
    },
    {
      name: 'Other CRMs',
      logo: '📊',
      steps: [
        'Look for "Import", "Upload", or "Data Import" in settings',
        'Select the appropriate data type (Contacts/Companies)',
        'Upload the Universal CSV format',
        'Map columns to your CRM fields',
        'Review and confirm import'
      ],
      tips: 'Most CRMs support CSV import - use the Universal format for compatibility'
    }
  ];

  const bestPractices = [
    {
      icon: FileText,
      title: 'Prepare Your Data',
      description: 'Review the exported data before importing to ensure accuracy and completeness.'
    },
    {
      icon: Database,
      title: 'Map Fields Correctly',
      description: 'Take time to properly map columns to the right CRM fields during import.'
    },
    {
      icon: Zap,
      title: 'Set Up Automation',
      description: 'Create follow-up tasks and workflows based on the research insights.'
    },
    {
      icon: CheckCircle,
      title: 'Verify Import',
      description: 'Always review imported records to ensure data integrity and completeness.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">CRM Import Guide</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn how to import your PreSales AI research data into popular CRM platforms. 
          Follow these step-by-step instructions for seamless integration.
        </p>
      </div>

      {/* Platform-Specific Guides */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {crmPlatforms.map((platform, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{platform.logo}</span>
              <h3 className="text-xl font-bold text-gray-900">{platform.name}</h3>
            </div>
            
            <div className="space-y-3 mb-4">
              {platform.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {stepIndex + 1}
                  </div>
                  <p className="text-gray-700 text-sm">{step}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-sm">
                <strong>💡 Tip:</strong> {platform.tips}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Best Practices */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Best Practices</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {bestPractices.map((practice, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <practice.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{practice.title}</h4>
                <p className="text-gray-600 text-sm">{practice.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Issues */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-yellow-900 mb-4">Common Import Issues & Solutions</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-yellow-800">Issue: Fields not mapping correctly</h4>
            <p className="text-yellow-700 text-sm">Solution: Use the field mapping feature during import to match columns with CRM fields</p>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800">Issue: Special characters causing errors</h4>
            <p className="text-yellow-700 text-sm">Solution: Ensure your CSV is UTF-8 encoded and remove any problematic characters</p>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800">Issue: Duplicate records being created</h4>
            <p className="text-yellow-700 text-sm">Solution: Use your CRM's duplicate detection settings or merge rules before importing</p>
          </div>
        </div>
      </div>

      {/* Migration Tips */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🔄 Switching Between CRMs?</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Export First:</strong> Always export your data from the current CRM before switching.
          </p>
          <p>
            <strong>Use Universal Format:</strong> Our Universal CSV format works with most CRM platforms.
          </p>
          <p>
            <strong>Test Import:</strong> Import a small sample first to verify field mapping and data integrity.
          </p>
          <p>
            <strong>Clean Data:</strong> Remove duplicates and standardize data formats before importing.
          </p>
        </div>
      </div>

      {/* Support */}
      <div className="text-center mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-600 mb-4">Need additional help with CRM integration?</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto">
          <span>Contact Support</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CRMGuide;