import React from 'react';
import { Rocket, Check, ArrowRight, User, Sparkles } from 'lucide-react';
import { Card, Button } from './ui';

interface FreeTrialProps {
  onContinue: () => void;
  onSignIn: () => void;
}

const FreeTrial: React.FC<FreeTrialProps> = ({ onContinue, onSignIn }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl" padding="lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Try Glance for Free</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the power of AI-driven sales intelligence with our 7-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Free Trial Includes:</h2>
            <ul className="space-y-3">
              {[
                'Generate up to 5 research reports',
                'AI-powered insights and analysis',
                'Pain points identification',
                'Conversation starters',
                'Basic CRM export functionality',
                'No credit card required'
              ].map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded-full mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Button 
                onClick={onContinue}
                fullWidth
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
              >
                Continue with Free Trial
              </Button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                No credit card required. 7-day free trial.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Already have an account?</h2>
            <p className="text-gray-600 mb-6">
              Sign in to access your reports, settings, and premium features.
            </p>
            
            <Button
              onClick={onSignIn}
              variant="outline"
              fullWidth
              icon={User}
            >
              Sign In to Your Account
            </Button>

            <div className="mt-8 pt-6 border-t border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">Why Users Love Glance:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>✓ "Saved me hours of research before client meetings"</p>
                <p>✓ "The conversation starters are incredibly valuable"</p>
                <p>✓ "Helped me close 30% more deals this quarter"</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </Card>
    </div>
  );
};

export default FreeTrial;