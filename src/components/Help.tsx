import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Search, 
  ChevronRight, 
  ExternalLink,
  FileText,
  Settings,
  Database,
  Globe,
  Zap,
  Target,
  Users,
  Mail,
  Phone,
  Clock,
  CreditCard,
  Check,
  X
} from 'lucide-react';

const Help: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'pricing' | 'faq' | 'support'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    { id: 'overview', label: 'Getting Started', icon: BookOpen },
    { id: 'pricing', label: 'Pricing & Plans', icon: CreditCard },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'support', label: 'Support', icon: MessageCircle }
  ];

  const quickStartSteps = [
    {
      icon: FileText,
      title: 'Enter Company Information',
      description: 'Start by entering the company name and relevant URLs (LinkedIn, website, news articles)',
      time: '1 min'
    },
    {
      icon: Zap,
      title: 'Generate Research Report',
      description: 'Our AI analyzes the content and generates comprehensive insights and conversation starters',
      time: '2-3 mins'
    },
    {
      icon: Target,
      title: 'Review & Customize',
      description: 'Edit insights, add feedback, and customize the report to match your needs',
      time: '2-5 mins'
    },
    {
      icon: Database,
      title: 'Export to CRM',
      description: 'Export your research to Salesforce, HubSpot, Pipedrive, or other CRM systems',
      time: '1 min'
    }
  ];

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      reportsPerMonth: 5,
      popular: false,
      features: {
        basicReports: true,
        aiInsights: true,
        webScraping: true,
        leadScore: false,
        contactInfo: false,
        crmExport: false,
        slackIntegration: false,
        teamDashboard: false,
        talkingPoints: false
      }
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 15,
      reportsPerMonth: 20,
      popular: false,
      features: {
        basicReports: true,
        aiInsights: true,
        webScraping: true,
        leadScore: true,
        contactInfo: true,
        crmExport: false,
        slackIntegration: false,
        teamDashboard: false,
        talkingPoints: true
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 79,
      reportsPerMonth: 100,
      popular: true,
      features: {
        basicReports: true,
        aiInsights: true,
        webScraping: true,
        leadScore: true,
        contactInfo: true,
        crmExport: true,
        slackIntegration: false,
        teamDashboard: false,
        talkingPoints: true
      }
    },
    {
      id: 'team',
      name: 'Team',
      price: 299,
      reportsPerMonth: 500,
      popular: false,
      features: {
        basicReports: true,
        aiInsights: true,
        webScraping: true,
        leadScore: true,
        contactInfo: true,
        crmExport: true,
        slackIntegration: true,
        teamDashboard: true,
        talkingPoints: true
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      reportsPerMonth: 'Unlimited',
      popular: false,
      features: {
        basicReports: true,
        aiInsights: true,
        webScraping: true,
        leadScore: true,
        contactInfo: true,
        crmExport: true,
        slackIntegration: true,
        teamDashboard: true,
        talkingPoints: true,
        whiteLabel: true,
        prioritySupport: true
      }
    }
  ];

  const creditPacks = [
    {
      id: 'credits_100',
      name: '100 Report Credits',
      price: 25,
      reports: 100,
      pricePerReport: 0.25
    },
    {
      id: 'credits_500',
      name: '500 Report Credits',
      price: 99,
      reports: 500,
      pricePerReport: 0.198
    },
    {
      id: 'credits_1000',
      name: '1,000 Report Credits',
      price: 179,
      reports: 1000,
      pricePerReport: 0.179
    }
  ];

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'What types of URLs should I use for research?',
          a: 'Use LinkedIn company pages, official websites, recent news articles, press releases, and social media profiles. The more diverse your sources, the better the insights.'
        },
        {
          q: 'How long does it take to generate a report?',
          a: 'Report generation typically takes 2-3 minutes, depending on the number of URLs and content complexity. Real-time progress tracking keeps you informed.'
        },
        {
          q: 'Can I edit the generated insights?',
          a: 'Yes! All insight blocks are editable. You can modify content, add your own insights, and provide feedback to improve future reports.'
        }
      ]
    },
    {
      category: 'Pricing & Billing',
      questions: [
        {
          q: 'What happens when I reach my monthly report limit?',
          a: 'You\'ll receive a notification at 80% usage. Once you reach your limit, you can upgrade your plan or purchase credit packs to continue generating reports.'
        },
        {
          q: 'Do unused reports roll over to the next month?',
          a: 'No, monthly report allowances reset each billing cycle. However, purchased credit packs never expire and can be used anytime.'
        },
        {
          q: 'Can I change my plan anytime?',
          a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay by invoice.'
        }
      ]
    },
    {
      category: 'Features & Functionality',
      questions: [
        {
          q: 'What\'s the difference between plans?',
          a: 'Plans differ in monthly report limits and features. Higher tiers include lead scoring, contact extraction, CRM export, team collaboration, and priority support.'
        },
        {
          q: 'Which CRM systems are supported?',
          a: 'We support Salesforce, HubSpot, Pipedrive, plus Universal CSV, JSON, and vCard formats for compatibility with any CRM system.'
        },
        {
          q: 'Can I use the app without configuring external services?',
          a: 'Yes! The app works in demo mode without configuration. However, configuring Supabase enables report saving and Firecrawl enables real web scraping.'
        }
      ]
    },
    {
      category: 'Troubleshooting',
      questions: [
        {
          q: 'Why is my report showing mock data?',
          a: 'This happens when Firecrawl isn\'t configured. The app works in demo mode with realistic mock data. Configure Firecrawl for real web scraping.'
        },
        {
          q: 'My reports aren\'t being saved. Why?',
          a: 'Reports are only saved when Supabase is configured. In demo mode, reports are temporary. Set up Supabase for persistent storage.'
        },
        {
          q: 'Some URLs failed to scrape. What should I do?',
          a: 'Try different URLs, ensure they\'re publicly accessible, and avoid URLs that require login. The app will work with whatever content it can extract.'
        }
      ]
    }
  ];

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      qa => 
        qa.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qa.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const getFeatureLabel = (feature: string) => {
    const labels: { [key: string]: string } = {
      basicReports: 'Basic Research Reports',
      aiInsights: 'AI-Powered Insights',
      webScraping: 'Real-time Web Scraping',
      leadScore: 'Lead Scoring',
      contactInfo: 'Contact Information Extraction',
      crmExport: 'CRM Export',
      slackIntegration: 'Slack Integration',
      teamDashboard: 'Team Dashboard',
      talkingPoints: 'Talking Points Generation',
      whiteLabel: 'White-label Solution',
      prioritySupport: 'Priority Support'
    };
    return labels[feature] || feature;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about using PreSales AI Research Agent effectively. 
          From getting started to pricing and advanced features.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                  <ExternalLink className="h-4 w-4" />
                  <span>API Documentation</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                  <ExternalLink className="h-4 w-4" />
                  <span>GitHub Repository</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                  <ExternalLink className="h-4 w-4" />
                  <span>Community Forum</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
                  <p className="text-gray-600 mb-6">
                    Welcome to PreSales AI! Follow these steps to create your first research report and start transforming your sales meetings.
                  </p>
                </div>

                {/* Quick Start Guide */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
                  <div className="space-y-4">
                    {quickStartSteps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Icon className="h-5 w-5 text-gray-600" />
                              <h4 className="font-semibold text-gray-900">{step.title}</h4>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {step.time}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <Globe className="h-6 w-6 text-blue-600 mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">Real Web Scraping</h4>
                      <p className="text-sm text-gray-600">Extract actual content from websites using Firecrawl API</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <Zap className="h-6 w-6 text-green-600 mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">AI-Powered Analysis</h4>
                      <p className="text-sm text-gray-600">Generate detailed insights and conversation starters</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <Database className="h-6 w-6 text-purple-600 mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">CRM Integration</h4>
                      <p className="text-sm text-gray-600">Export to Salesforce, HubSpot, Pipedrive, and more</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <Users className="h-6 w-6 text-yellow-600 mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">Team Collaboration</h4>
                      <p className="text-sm text-gray-600">Share insights and collaborate with your team</p>
                    </div>
                  </div>
                </div>

                {/* Configuration Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Configuration Status</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    The app works in demo mode without configuration, but setting up these services unlocks full functionality:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800"><strong>Supabase:</strong> Enables user authentication and report saving</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800"><strong>Firecrawl:</strong> Enables real web scraping instead of mock data</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'pricing' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing & Plans</h2>
                  <p className="text-gray-600 mb-6">
                    Choose the plan that fits your research needs. All plans include core AI analysis and web scraping capabilities.
                  </p>
                </div>

                {/* Pricing Plans */}
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {pricingPlans.map((plan) => (
                    <div key={plan.id} className={`relative border rounded-2xl p-6 ${
                      plan.popular 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white'
                    }`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="mb-2">
                          {typeof plan.price === 'number' ? (
                            <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                          ) : (
                            <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                          )}
                          {typeof plan.price === 'number' && (
                            <span className="text-gray-600">/month</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {typeof plan.reportsPerMonth === 'number' 
                            ? `${plan.reportsPerMonth} reports/month`
                            : `${plan.reportsPerMonth} reports`
                          }
                        </p>
                      </div>

                      <div className="space-y-3 mb-6">
                        {Object.entries(plan.features).map(([feature, included]) => (
                          <div key={feature} className="flex items-center space-x-2">
                            {included ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-gray-300" />
                            )}
                            <span className={`text-sm ${included ? 'text-gray-700' : 'text-gray-400'}`}>
                              {getFeatureLabel(feature)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Credit Packs */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Credit Packs</h3>
                  <p className="text-gray-600 mb-6">
                    Need extra reports? Purchase credit packs that never expire and can be used anytime.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {creditPacks.map((pack) => (
                      <div key={pack.id} className="border border-gray-200 rounded-xl p-6 bg-white">
                        <div className="text-center mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{pack.name}</h4>
                          <div className="text-2xl font-bold text-gray-900 mb-1">${pack.price}</div>
                          <p className="text-sm text-gray-600">${pack.pricePerReport.toFixed(3)} per report</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{pack.reports}</div>
                            <div className="text-sm text-gray-600">Report Credits</div>
                          </div>
                        </div>
                        <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                          Purchase Credits
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage Information */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Usage & Billing</h3>
                  <div className="space-y-2 text-sm text-yellow-800">
                    <p>• Monthly report limits reset at the beginning of each billing cycle</p>
                    <p>• You'll receive notifications when you reach 80% of your monthly limit</p>
                    <p>• Credit packs never expire and can be used across any billing period</p>
                    <p>• Upgrade or downgrade your plan anytime with prorated billing</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'faq' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {filteredFAQs.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
                      <div className="space-y-3">
                        {category.questions.map((qa, qaIndex) => (
                          <details key={qaIndex} className="group border border-gray-200 rounded-xl">
                            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                              <span className="font-medium text-gray-900">{qa.q}</span>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                            </summary>
                            <div className="px-4 pb-4">
                              <p className="text-gray-600 text-sm leading-relaxed">{qa.a}</p>
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredFAQs.length === 0 && searchTerm && (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">Try different search terms or browse all categories above.</p>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'support' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Support & Contact</h2>
                  <p className="text-gray-600 mb-6">
                    Need help? We're here to assist you with any questions or issues you might have.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Methods */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Get in Touch</h3>
                    
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Email Support</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Get help via email</p>
                      <a href="mailto:support@presalesai.com" className="text-blue-600 hover:text-blue-700 text-sm">
                        support@presalesai.com
                      </a>
                      <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Response within 24 hours</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-gray-900">Live Chat</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Chat with our support team</p>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Start Chat
                      </button>
                      <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Mon-Fri, 9 AM - 6 PM EST</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Phone className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold text-gray-900">Phone Support</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Speak directly with our team</p>
                      <a href="tel:+1-555-PRESALES" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        +1 (555) PRESALES
                      </a>
                      <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Mon-Fri, 9 AM - 6 PM EST</span>
                      </div>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
                    
                    <div className="space-y-3">
                      <a href="#" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-900">Documentation</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>
                      
                      <a href="#" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">Community Forum</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>
                      
                      <a href="#" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-gray-900">API Reference</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                      <h4 className="font-semibold text-blue-900 mb-2">Enterprise Support</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Need dedicated support for your organization? Contact us about enterprise plans.
                      </p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Contact Sales
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Page */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">System Status</h3>
                      <p className="text-sm text-gray-600">Check the current status of our services</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700 font-medium">All Systems Operational</span>
                    </div>
                  </div>
                  <a href="#" className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm mt-3">
                    <span>View Status Page</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;