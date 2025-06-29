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

  useEffect(() => {
    const checkAuth = async () => {
      if (!isSupabaseConfigured()) {
        setAuthLoading(false);
        return;
      }

      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const role = await AdminService.getCurrentUserRole();
          setUserRole(role);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
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

  const handleAnalyze = async (urls: string[], companyName: string) => {
    if (isSupabaseConfigured() && !user) {
      setShowAuthModal(true);
      return;
    }

    setState('loading');
    setLoadingStep('Starting analysis...');
    setLoadingProgress(0);
    
    try {
      const report = await ReportService.generateReport(
        companyName,
        urls,
        (step: string, progress: number) => {
          setLoadingStep(step);
          setLoadingProgress(progress);
        }
      );
      
      setCurrentReport(report);
      setState('report');
    } catch (error) {
      console.error('Error generating report:', error);
      alert(`Error generating report: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setState('input');
    }
  };

  const handleNewReport = () => {
    setState('input');
    setCurrentReport(null);
    setLoadingStep('');
    setLoadingProgress(0);
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
        {/* Service Status Checker - Show on input page */}
        {state === 'input' && <ServiceStatusChecker />}

        {/* Cost Monitor - Show for regular users, hide for admin dashboard */}
        {state !== 'admin' && <CostMonitor />}

        {state === 'input' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                AI-Powered Pre-Sales Research
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Transform your meeting preparation with comprehensive AI analysis. 
                Input company URLs and get detailed insights, pain points, and conversation starters.
              </p>
              
              {/* Configuration Status */}
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
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <URLInput onAnalyze={handleAnalyze} isLoading={false} />
              </div>
              <div>
                <ExampleReport />
              </div>
            </div>
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
            © 2025 PreSales AI. Empowering sales teams with intelligent research.
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