import { useState, useEffect } from 'react';
import Header from './components/Header';
import URLInput from './components/URLInput';
import LoadingState from './components/LoadingState';
import ReportDisplay from './components/ReportDisplay';
import ExampleReport from './components/ExampleReport';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import ReportsPage from './components/ReportsPage';
import Settings from './components/Settings';
import Help from './components/Help';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import CostMonitor from './components/CostMonitor';
import ServiceStatusChecker from './components/ServiceStatusChecker';
import PricingCTA from './components/PricingCTA';
import FreeTrial from './components/FreeTrial';
import BackendStatusChecker from './components/BackendStatusChecker';
import { Report } from './types/database';
import { ReportService } from './services/reportService';
import { AuthService } from './services/authService';
import { AdminService } from './services/adminService';
import { FirecrawlService } from './services/firecrawlService';
import { OpenAIService } from './services/openaiService';
import { isSupabaseConfigured } from './lib/supabase';

type AppState = 'input' | 'loading' | 'report' | 'dashboard' | 'reports' | 'settings' | 'help' | 'admin';

function App() {
  const [state, setState] = useState<AppState>('input');
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showFreeTrialPrompt, setShowFreeTrialPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    const checkAuth = async () => {
      if (!isSupabaseConfigured()) {
        setAuthLoading(false);
        setBackendStatus('disconnected');
        return;
      }

      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        setBackendStatus('connected');
        
        if (currentUser) {
          const role = await AdminService.getCurrentUserRole();
          setUserRole(role);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setBackendStatus('disconnected');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = AuthService.onAuthStateChange(async (user) => {
        setUser(user);
        if (user) {
          const role = await AdminService.getCurrentUserRole();
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleAnalyze = async (urls: string[], companyName: string, reportPurpose?: string) => {
    if (isSupabaseConfigured() && !user) {
      setShowAuthModal(true);
      return;
    }

    // Show free trial prompt for non-admin users
    if (!user && !showFreeTrialPrompt) {
      setShowFreeTrialPrompt(true);
      return;
    }

    setState('loading');
    setLoadingStep('Starting analysis...');
    setLoadingProgress(0);
    setError(null);
    
    try {
      const report = await ReportService.generateReport(
        companyName,
        urls,
        (step: string, progress: number) => {
          setLoadingStep(step);
          setLoadingProgress(progress);
        },
        reportPurpose
      );
      
      setCurrentReport(report);
      setState('report');
    } catch (error) {
      console.error('Error generating report:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setState('input');
    }
  };

  const handleNewReport = () => {
    setState('input');
    setCurrentReport(null);
    setLoadingStep('');
    setLoadingProgress(0);
    setError(null);
  };

  const handleViewReport = (report: Report) => {
    setCurrentReport(report);
    setState('report');
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setUserRole(null);
      setState('input');
      setCurrentReport(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleNavigation = (page: 'dashboard' | 'reports' | 'settings' | 'help' | 'admin') => {
    if (page === 'admin') {
      if (userRole === 'admin') {
        setState('admin');
      } else {
        setShowAdminLogin(true);
      }
    } else if (page === 'dashboard') {
      // When dashboard is clicked, go to input/home page
      setState('input');
    } else {
      setState(page);
    }
    setCurrentReport(null);
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(false);
    setState('admin');
    // Refresh user role after admin login
    AdminService.getCurrentUserRole().then(setUserRole);
  };

  const handleFreeTrialContinue = () => {
    setShowFreeTrialPrompt(false);
  };

  const handleBackendStatusChange = (status: 'connected' | 'disconnected' | 'checking') => {
    setBackendStatus(status);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show admin login modal
  if (showAdminLogin) {
    return <AdminLogin onAdminLogin={handleAdminLogin} />;
  }

  // Show free trial prompt
  if (showFreeTrialPrompt) {
    return <FreeTrial onContinue={handleFreeTrialContinue} onSignIn={() => setShowAuthModal(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Header 
        user={user} 
        userRole={userRole}
        onSignOut={handleSignOut} 
        onSignIn={() => setShowAuthModal(true)}
        onNavigate={handleNavigation}
        currentPage={state}
      />
      
      <main className="container mx-auto px-6 py-12">
        {/* Service Status Checker - Show only for admin users */}
        {state === 'input' && userRole === 'admin' && <ServiceStatusChecker />}

        {/* Cost Monitor - Show only for admin users */}
        {userRole === 'admin' && state !== 'admin' && <CostMonitor />}

        {/* Backend Status Indicator */}
        {state === 'input' && (
          <div className="mb-4">
            <BackendStatusChecker onStatusChange={handleBackendStatusChange} />
          </div>
        )}

        {state === 'input' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              {/* Modern, sleek heading design with more concise text */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-lg mb-8 transform hover:scale-[1.01] transition-transform">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  AI-Powered Sales Intelligence at a Glance
                </h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  Generate comprehensive sales briefs with actionable insights in seconds
                </p>
              </div>
              
              {/* Improved value proposition layout - now in a grid with icons and more visual appeal */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-bold text-gray-800 text-lg">Saves 5–10 hours/week per rep</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center">
                  <div className="bg-indigo-100 p-3 rounded-full mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-bold text-gray-800 text-lg">Consistent, high-quality insights</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-3 rounded-full mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="font-bold text-gray-800 text-lg">Lead scoring & talking points</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-pink-500 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center">
                  <div className="bg-pink-100 p-3 rounded-full mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <p className="font-bold text-gray-800 text-lg">One-click CRM export</p>
                </div>
              </div>
              
              {/* Configuration Status - Only show for admin users */}
              {userRole === 'admin' && (
                <>
                  <div className="flex justify-center space-x-4 mb-8">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                      isSupabaseConfigured() ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isSupabaseConfigured() ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span>Database: {isSupabaseConfigured() ? 'Connected' : 'Demo Mode'}</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                      FirecrawlService.isConfigured() ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        FirecrawlService.isConfigured() ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span>Web Scraping: {FirecrawlService.isConfigured() ? 'Active' : 'Mock Data'}</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                      OpenAIService.isConfigured() ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        OpenAIService.isConfigured() ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span>AI Analysis: {OpenAIService.isConfigured() ? 'OpenAI' : 'Mock Data'}</span>
                    </div>
                  </div>

                  {(!isSupabaseConfigured() || !FirecrawlService.isConfigured() || !OpenAIService.isConfigured()) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mb-8">
                      <p className="text-blue-800 text-sm">
                        <strong>Configuration Status:</strong> {
                          !isSupabaseConfigured() && !FirecrawlService.isConfigured() && !OpenAIService.isConfigured()
                            ? 'Running in full demo mode with mock data and cost optimization. Configure all services for full functionality.'
                            : 'Some services not configured - using mix of live and mock data. Check service status above for details.'
                        }
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <URLInput onAnalyze={handleAnalyze} isLoading={false} />
                
                {/* Error message display */}
                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="text-red-800 font-semibold mb-2">Error Generating Report</h3>
                    <p className="text-red-700">{error}</p>
                    <p className="text-red-600 mt-2 text-sm">
                      Please try again with different URLs or check your internet connection.
                    </p>
                  </div>
                )}
              </div>
              <div>
                <ExampleReport />
              </div>
            </div>

            {/* Pricing CTA for non-admin users */}
            {!user && <PricingCTA onSignIn={() => setShowAuthModal(true)} />}
          </div>
        )}

        {state === 'dashboard' && (
          <Dashboard onNewReport={handleNewReport} onViewReport={handleViewReport} />
        )}

        {state === 'reports' && (
          <ReportsPage onViewReport={handleViewReport} onNewReport={handleNewReport} />
        )}

        {state === 'settings' && (
          <Settings />
        )}

        {state === 'help' && (
          <Help />
        )}

        {state === 'admin' && userRole === 'admin' && (
          <AdminDashboard />
        )}
        
        {state === 'loading' && (
          <div className="max-w-2xl mx-auto">
            <LoadingState currentStep={loadingStep} progress={loadingProgress} />
          </div>
        )}
        
        {state === 'report' && currentReport && (
          <div className="max-w-4xl mx-auto">
            <ReportDisplay report={currentReport} onNewReport={handleNewReport} />
          </div>
        )}
      </main>
      
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400">
            © 2025 Glance. Empowering sales teams with intelligent research.
          </p>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;