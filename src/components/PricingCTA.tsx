import React from 'react';
import { CreditCard, Check, Star, Zap, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { Card, Button } from './ui';

interface PricingCTAProps {
  onSignIn: () => void;
}

const PricingCTA: React.FC<PricingCTAProps> = ({ onSignIn }) => {
  const plans = [
    {
      name: 'Starter',
      price: 15,
      period: 'month',
      description: 'Perfect for individual sales professionals',
      features: [
        '20 reports per month',
        'AI-powered insights',
        'Web scraping',
        'Lead scoring',
        'Contact information extraction'
      ],
      popular: false,
      icon: Zap,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Pro',
      price: 79,
      period: 'month',
      description: 'Ideal for serious sales professionals',
      features: [
        '100 reports per month',
        'Everything in Starter',
        'CRM export',
        'Talking points generation',
        'Priority support'
      ],
      popular: true,
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      name: 'Team',
      price: 299,
      period: 'month',
      description: 'For sales teams and organizations',
      features: [
        '500 reports per month',
        'Everything in Pro',
        'Team dashboard',
        'Slack integration',
        'Advanced analytics'
      ],
      popular: false,
      icon: Shield,
      color: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <div className="mt-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
            <CreditCard className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 ml-3">Choose Your Plan</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock the full potential of Glance with our flexible pricing plans.
          Start with a free trial and upgrade anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-2 border-purple-500 transform scale-105 shadow-xl' : ''}`}
              padding="lg"
              hover
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                  Most Popular
                </div>
              )}
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${plan.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              </div>
              
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <div className="bg-green-100 p-1 rounded-full mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={onSignIn}
                variant={plan.popular ? 'primary' : 'outline'}
                fullWidth
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
              >
                {plan.popular ? 'Get Started' : 'Choose Plan'}
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">
          All plans include a 14-day free trial. No credit card required.
        </p>
        <Button
          onClick={onSignIn}
          variant="ghost"
          size="sm"
        >
          Sign in to existing account
        </Button>
      </div>
    </div>
  );
};

export default PricingCTA;