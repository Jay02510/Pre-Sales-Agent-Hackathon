import React from 'react';
import { Brain, Globe, FileText, CheckCircle, Zap, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  currentStep?: string;
  progress?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  currentStep = 'Analyzing your sources...', 
  progress = 25 
}) => {
  const steps = [
    { 
      icon: Globe, 
      label: 'Extracting content from web sources', 
      completed: progress > 25,
      active: progress <= 25 
    },
    { 
      icon: Sparkles, 
      label: 'Analyzing content with AI', 
      completed: progress > 50,
      active: progress > 25 && progress <= 50 
    },
    { 
      icon: FileText, 
      label: 'Generating comprehensive report', 
      completed: progress > 75,
      active: progress > 50 && progress <= 75 
    },
    { 
      icon: CheckCircle, 
      label: 'Finalizing and saving report', 
      completed: progress > 90,
      active: progress > 75 && progress <= 90 
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Research</h2>
        <p className="text-gray-600">{currentStep}</p>
      </div>

      <div className="space-y-4 mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          
          return (
            <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-500 ${
              step.completed ? 'bg-green-50 border border-green-200 transform scale-[1.02]' : 
              step.active ? 'bg-blue-50 border border-blue-200 transform scale-[1.02]' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                step.completed ? 'bg-green-100 text-green-600' :
                step.active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`font-medium flex-1 transition-colors duration-300 ${
                step.completed ? 'text-green-700' :
                step.active ? 'text-blue-700' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {step.completed && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Complete</span>
                </div>
              )}
              {step.active && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-blue-600 font-medium">Processing</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span className="font-medium">Overall Progress</span>
          <span className="font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-3 space-x-2">
          <Zap className="h-4 w-4 text-blue-500" />
          <span className="text-xs text-gray-600">
            {progress < 25 ? 'Extracting web content...' :
             progress < 50 ? 'AI analysis in progress...' :
             progress < 75 ? 'Generating insights...' :
             progress < 90 ? 'Finalizing report...' : 'Almost ready!'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;