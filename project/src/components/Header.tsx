import React from 'react';
import { Brain, User, LogOut, HelpCircle, Shield } from 'lucide-react';

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
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PreSales AI</h1>
              <p className="text-blue-200 text-sm">Research Agent</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
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
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
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
                Dashboard
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
              <button
                onClick={() => onNavigate?.('settings')}
                className={`transition-colors ${
                  currentPage === 'settings' 
                    ? 'text-white font-medium' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Settings
              </button>
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
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;