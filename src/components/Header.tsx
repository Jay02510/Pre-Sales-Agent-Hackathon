import React, { useState } from 'react';
import { User, LogOut, HelpCircle, Shield, Menu, X, Sparkles, BarChart, ChevronDown } from 'lucide-react';

interface HeaderProps {
  user?: any;
  userRole?: 'admin' | 'user' | null;
  onSignOut?: () => void;
  onSignIn?: () => void;
  onNavigate?: (page: 'dashboard' | 'reports' | 'settings' | 'help' | 'admin') => void;
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  userRole,
  onSignOut, 
  onSignIn, 
  onNavigate, 
  currentPage 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogoClick = () => {
    // Navigate to input/home page
    if (onNavigate) {
      // We're using the dashboard navigation as a way to return to home
      // since there's no explicit 'home' or 'input' in the navigation options
      onNavigate('dashboard');
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={handleLogoClick}
            title="Return to home"
          >
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Glance</h1>
              <p className="text-blue-200 text-sm">AI Sales Intelligence</p>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg">
                    <User className="h-4 w-4 text-blue-200 mr-2" />
                    <span className="text-sm text-blue-200">{user.email}</span>
                    {userRole === 'admin' && (
                      <div className="flex items-center space-x-1 bg-red-600 px-2 py-1 rounded ml-2 text-xs">
                        <Shield className="h-3 w-3" />
                        <span>Admin</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-md"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">Sign In</span>
              </button>
            )}
            <nav className="flex space-x-6">
              <button
                onClick={() => onNavigate?.('dashboard')}
                className={`transition-colors ${
                  currentPage === 'dashboard' 
                    ? 'text-white font-medium' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate?.('reports')}
                className={`transition-colors ${
                  currentPage === 'reports' 
                    ? 'text-white font-medium' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Reports
              </button>
              <div className="relative group">
                <button
                  onClick={() => onNavigate?.('settings')}
                  className={`flex items-center space-x-1 transition-colors ${
                    currentPage === 'settings' 
                      ? 'text-white font-medium' 
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  <span>Settings</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => onNavigate?.('help')}
                className={`flex items-center space-x-1 transition-colors ${
                  currentPage === 'help' 
                    ? 'text-white font-medium' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </button>
              {userRole === 'admin' && (
                <button
                  onClick={() => onNavigate?.('admin')}
                  className={`flex items-center space-x-1 transition-colors ${
                    currentPage === 'admin' 
                      ? 'text-white font-medium' 
                      : 'text-red-200 hover:text-white'
                  }`}
                >
                  <BarChart className="h-4 w-4" />
                  <span>Analytics</span>
                </button>
              )}
            </nav>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-blue-800">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  onNavigate?.('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`transition-colors ${
                  currentPage === 'dashboard' 
                    ? 'text-white font-medium' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate?.('reports');
                  setMobileMenuOpen(false);
                }}
                className={`transition-colors ${
                  currentPage === 'reports' 
                    ? 'text-white font-medium' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => {
                  onNavigate?.('settings');
                  setMobileMenuOpen(false);
                }}
                className={`transition-colors ${
                  currentPage === 'settings' 
                    ? 'text-white font-medium' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => {
                  onNavigate?.('help');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-1 transition-colors ${
                  currentPage === 'help' 
                    ? 'text-white font-medium' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </button>
              {userRole === 'admin' && (
                <button
                  onClick={() => {
                    onNavigate?.('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-1 transition-colors ${
                    currentPage === 'admin' 
                      ? 'text-white font-medium' 
                      : 'text-red-200 hover:text-white'
                  }`}
                >
                  <BarChart className="h-4 w-4" />
                  <span>Analytics</span>
                </button>
              )}
              
              {user ? (
                <div className="pt-4 border-t border-blue-800 flex flex-col space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-200" />
                    <span className="text-sm text-blue-200">{user.email}</span>
                    {userRole === 'admin' && (
                      <div className="flex items-center space-x-1 bg-red-600 px-2 py-1 rounded text-xs">
                        <Shield className="h-3 w-3" />
                        <span>Admin</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      onSignOut?.();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onSignIn?.();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-lg transition-colors w-full"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Sign In</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;