export interface CRMExportData {
  companyName: string;
  contactInfo: {
    companyName: string;
    website?: string;
    industry?: string;
    size?: string;
  };
  leadData: {
    leadSource: string;
    leadStatus: 'New' | 'Qualified' | 'Contacted' | 'Opportunity';
    leadScore: number;
    priority: 'High' | 'Medium' | 'Low';
  };
  researchData: {
    summary: string;
    painPoints: string[];
    conversationStarters: string[];
    keyInsights: string[];
    recommendations: string;
    researchDate: string;
    sourceUrls: string[];
  };
  salesData: {
    nextSteps: string[];
    followUpDate: string;
    estimatedValue?: number;
    probability?: number;
  };
}

export interface CRMFormat {
  name: string;
  description: string;
  fileExtension: string;
  mimeType: string;
  supportsCustomFields: boolean;
  popularWith: string[];
}

export class CRMService {
  private static readonly CRM_FORMATS: CRMFormat[] = [
    {
      name: 'Salesforce CSV',
      description: 'Standard CSV format for Salesforce import',
      fileExtension: 'csv',
      mimeType: 'text/csv',
      supportsCustomFields: true,
      popularWith: ['Salesforce', 'Salesforce Essentials']
    },
    {
      name: 'HubSpot CSV',
      description: 'HubSpot-compatible CSV with contact and company data',
      fileExtension: 'csv',
      mimeType: 'text/csv',
      supportsCustomFields: true,
      popularWith: ['HubSpot', 'HubSpot CRM Free']
    },
    {
      name: 'Pipedrive CSV',
      description: 'Pipedrive format for leads and organizations',
      fileExtension: 'csv',
      mimeType: 'text/csv',
      supportsCustomFields: true,
      popularWith: ['Pipedrive', 'Pipedrive Essential']
    },
    {
      name: 'Universal CSV',
      description: 'Generic CSV format compatible with most CRMs',
      fileExtension: 'csv',
      mimeType: 'text/csv',
      supportsCustomFields: false,
      popularWith: ['Any CRM', 'Excel', 'Google Sheets']
    },
    {
      name: 'JSON Export',
      description: 'Structured JSON for API integrations',
      fileExtension: 'json',
      mimeType: 'application/json',
      supportsCustomFields: true,
      popularWith: ['Custom integrations', 'API connections']
    },
    {
      name: 'vCard Format',
      description: 'Standard contact format for address books',
      fileExtension: 'vcf',
      mimeType: 'text/vcard',
      supportsCustomFields: false,
      popularWith: ['Outlook', 'Apple Contacts', 'Google Contacts']
    }
  ];

  static getSupportedFormats(): CRMFormat[] {
    return this.CRM_FORMATS;
  }

  static async exportToCRM(reportData: any, format: string): Promise<{ data: string; filename: string; mimeType: string }> {
    const crmData = this.transformReportToCRMData(reportData);
    
    switch (format) {
      case 'salesforce':
        return this.exportToSalesforceCSV(crmData);
      case 'hubspot':
        return this.exportToHubSpotCSV(crmData);
      case 'pipedrive':
        return this.exportToPipedriveCSV(crmData);
      case 'universal':
        return this.exportToUniversalCSV(crmData);
      case 'json':
        return this.exportToJSON(crmData);
      case 'vcard':
        return this.exportToVCard(crmData);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private static transformReportToCRMData(report: any): CRMExportData {
    // Extract domain from first URL for company website
    const website = report.sourceUrls?.[0] ? 
      new URL(report.sourceUrls[0]).origin : undefined;

    // Calculate lead score based on research quality
    const leadScore = this.calculateLeadScore(report);

    return {
      companyName: report.companyName,
      contactInfo: {
        companyName: report.companyName,
        website,
        industry: this.extractIndustry(report.companyInfo),
        size: this.extractCompanySize(report.companyInfo)
      },
      leadData: {
        leadSource: 'PreSales AI Research',
        leadStatus: 'Qualified',
        leadScore,
        priority: leadScore >= 80 ? 'High' : leadScore >= 60 ? 'Medium' : 'Low'
      },
      researchData: {
        summary: report.summary,
        painPoints: report.painPoints || [],
        conversationStarters: report.conversationStarters || [],
        keyInsights: report.keyInsights || [],
        recommendations: report.recommendations,
        researchDate: report.generatedAt,
        sourceUrls: report.sourceUrls || []
      },
      salesData: {
        nextSteps: this.generateNextSteps(report),
        followUpDate: this.calculateFollowUpDate(),
        estimatedValue: this.estimateOpportunityValue(report),
        probability: this.estimateProbability(report)
      }
    };
  }

  private static exportToSalesforceCSV(data: CRMExportData): { data: string; filename: string; mimeType: string } {
    const headers = [
      'Company',
      'Website',
      'Industry',
      'Lead_Source__c',
      'Lead_Status__c',
      'Lead_Score__c',
      'Priority__c',
      'Research_Summary__c',
      'Pain_Points__c',
      'Key_Insights__c',
      'Next_Steps__c',
      'Follow_Up_Date__c',
      'Estimated_Value__c',
      'Probability__c'
    ];

    const row = [
      this.escapeCSV(data.companyName),
      this.escapeCSV(data.contactInfo.website || ''),
      this.escapeCSV(data.contactInfo.industry || ''),
      this.escapeCSV(data.leadData.leadSource),
      this.escapeCSV(data.leadData.leadStatus),
      data.leadData.leadScore.toString(),
      this.escapeCSV(data.leadData.priority),
      this.escapeCSV(data.researchData.summary),
      this.escapeCSV(data.researchData.painPoints.join('; ')),
      this.escapeCSV(data.researchData.keyInsights.join('; ')),
      this.escapeCSV(data.salesData.nextSteps.join('; ')),
      data.salesData.followUpDate,
      (data.salesData.estimatedValue || 0).toString(),
      (data.salesData.probability || 0).toString()
    ];

    const csvContent = [headers.join(','), row.join(',')].join('\n');
    
    return {
      data: csvContent,
      filename: `${data.companyName}_Salesforce_Export.csv`,
      mimeType: 'text/csv'
    };
  }

  private static exportToHubSpotCSV(data: CRMExportData): { data: string; filename: string; mimeType: string } {
    const headers = [
      'Company name',
      'Company domain name',
      'Industry',
      'Lead Status',
      'HubSpot Score',
      'Research Summary',
      'Pain Points',
      'Conversation Starters',
      'Key Insights',
      'Next Steps',
      'Follow-up Date',
      'Deal Amount',
      'Deal Probability'
    ];

    const row = [
      this.escapeCSV(data.companyName),
      this.escapeCSV(data.contactInfo.website?.replace('https://', '').replace('http://', '') || ''),
      this.escapeCSV(data.contactInfo.industry || ''),
      this.escapeCSV(data.leadData.leadStatus),
      data.leadData.leadScore.toString(),
      this.escapeCSV(data.researchData.summary),
      this.escapeCSV(data.researchData.painPoints.join('; ')),
      this.escapeCSV(data.researchData.conversationStarters.join('; ')),
      this.escapeCSV(data.researchData.keyInsights.join('; ')),
      this.escapeCSV(data.salesData.nextSteps.join('; ')),
      data.salesData.followUpDate,
      (data.salesData.estimatedValue || 0).toString(),
      (data.salesData.probability || 0).toString()
    ];

    const csvContent = [headers.join(','), row.join(',')].join('\n');
    
    return {
      data: csvContent,
      filename: `${data.companyName}_HubSpot_Export.csv`,
      mimeType: 'text/csv'
    };
  }

  private static exportToPipedriveCSV(data: CRMExportData): { data: string; filename: string; mimeType: string } {
    const headers = [
      'Organization Name',
      'Website',
      'Industry',
      'Lead Source',
      'Status',
      'Priority',
      'Research Summary',
      'Pain Points',
      'Next Activity',
      'Next Activity Date',
      'Deal Value',
      'Probability %'
    ];

    const row = [
      this.escapeCSV(data.companyName),
      this.escapeCSV(data.contactInfo.website || ''),
      this.escapeCSV(data.contactInfo.industry || ''),
      this.escapeCSV(data.leadData.leadSource),
      this.escapeCSV(data.leadData.leadStatus),
      this.escapeCSV(data.leadData.priority),
      this.escapeCSV(data.researchData.summary),
      this.escapeCSV(data.researchData.painPoints.join('; ')),
      this.escapeCSV(data.salesData.nextSteps[0] || 'Follow up call'),
      data.salesData.followUpDate,
      (data.salesData.estimatedValue || 0).toString(),
      (data.salesData.probability || 0).toString()
    ];

    const csvContent = [headers.join(','), row.join(',')].join('\n');
    
    return {
      data: csvContent,
      filename: `${data.companyName}_Pipedrive_Export.csv`,
      mimeType: 'text/csv'
    };
  }

  private static exportToUniversalCSV(data: CRMExportData): { data: string; filename: string; mimeType: string } {
    const headers = [
      'Company Name',
      'Website',
      'Industry',
      'Lead Source',
      'Status',
      'Priority',
      'Lead Score',
      'Summary',
      'Pain Points',
      'Key Insights',
      'Next Steps',
      'Follow Up Date',
      'Research Date',
      'Source URLs'
    ];

    const row = [
      this.escapeCSV(data.companyName),
      this.escapeCSV(data.contactInfo.website || ''),
      this.escapeCSV(data.contactInfo.industry || ''),
      this.escapeCSV(data.leadData.leadSource),
      this.escapeCSV(data.leadData.leadStatus),
      this.escapeCSV(data.leadData.priority),
      data.leadData.leadScore.toString(),
      this.escapeCSV(data.researchData.summary),
      this.escapeCSV(data.researchData.painPoints.join('; ')),
      this.escapeCSV(data.researchData.keyInsights.join('; ')),
      this.escapeCSV(data.salesData.nextSteps.join('; ')),
      data.salesData.followUpDate,
      data.researchData.researchDate,
      this.escapeCSV(data.researchData.sourceUrls.join('; '))
    ];

    const csvContent = [headers.join(','), row.join(',')].join('\n');
    
    return {
      data: csvContent,
      filename: `${data.companyName}_Universal_CRM_Export.csv`,
      mimeType: 'text/csv'
    };
  }

  private static exportToJSON(data: CRMExportData): { data: string; filename: string; mimeType: string } {
    const jsonData = {
      exportDate: new Date().toISOString(),
      source: 'PreSales AI Research Agent',
      version: '1.0',
      data: data
    };

    return {
      data: JSON.stringify(jsonData, null, 2),
      filename: `${data.companyName}_CRM_Export.json`,
      mimeType: 'application/json'
    };
  }

  private static exportToVCard(data: CRMExportData): { data: string; filename: string; mimeType: string } {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `ORG:${data.companyName}`,
      `URL:${data.contactInfo.website || ''}`,
      `NOTE:Research Summary: ${data.researchData.summary}\\n\\nPain Points: ${data.researchData.painPoints.join(', ')}\\n\\nKey Insights: ${data.researchData.keyInsights.join(', ')}`,
      `CATEGORIES:${data.leadData.priority} Priority,${data.leadData.leadStatus}`,
      'END:VCARD'
    ].join('\n');

    return {
      data: vcard,
      filename: `${data.companyName}_Contact.vcf`,
      mimeType: 'text/vcard'
    };
  }

  private static escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private static calculateLeadScore(report: any): number {
    let score = 50; // Base score
    
    // Add points for comprehensive research
    if (report.painPoints?.length > 2) score += 15;
    if (report.keyInsights?.length > 2) score += 15;
    if (report.conversationStarters?.length > 2) score += 10;
    if (report.sourceUrls?.length > 2) score += 10;
    
    return Math.min(100, score);
  }

  private static extractIndustry(companyInfo: string): string {
    const industries = [
      'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
      'Education', 'Real Estate', 'Consulting', 'Media', 'Transportation'
    ];
    
    for (const industry of industries) {
      if (companyInfo.toLowerCase().includes(industry.toLowerCase())) {
        return industry;
      }
    }
    
    return 'Other';
  }

  private static extractCompanySize(companyInfo: string): string {
    if (companyInfo.toLowerCase().includes('startup') || companyInfo.toLowerCase().includes('small')) {
      return 'Small (1-50)';
    } else if (companyInfo.toLowerCase().includes('medium') || companyInfo.toLowerCase().includes('growing')) {
      return 'Medium (51-200)';
    } else if (companyInfo.toLowerCase().includes('large') || companyInfo.toLowerCase().includes('enterprise')) {
      return 'Large (201+)';
    }
    
    return 'Unknown';
  }

  private static generateNextSteps(report: any): string[] {
    const steps = ['Schedule discovery call'];
    
    if (report.painPoints?.length > 0) {
      steps.push('Prepare pain point discussion');
    }
    
    if (report.conversationStarters?.length > 0) {
      steps.push('Review conversation starters');
    }
    
    steps.push('Send follow-up email with insights');
    
    return steps;
  }

  private static calculateFollowUpDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 days from now
    return date.toISOString().split('T')[0];
  }

  private static estimateOpportunityValue(report: any): number {
    // Simple estimation based on company indicators
    const companyInfo = report.companyInfo?.toLowerCase() || '';
    
    if (companyInfo.includes('enterprise') || companyInfo.includes('large')) {
      return 50000;
    } else if (companyInfo.includes('medium') || companyInfo.includes('growing')) {
      return 25000;
    } else {
      return 10000;
    }
  }

  private static estimateProbability(report: any): number {
    let probability = 20; // Base probability
    
    if (report.painPoints?.length > 2) probability += 20;
    if (report.keyInsights?.length > 2) probability += 15;
    if (report.sourceUrls?.length > 2) probability += 10;
    
    return Math.min(75, probability);
  }
}