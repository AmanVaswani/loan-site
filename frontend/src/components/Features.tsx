'use client';

import { CheckCircle, Clock, Shield, Percent, FileText, Headphones } from 'lucide-react';

const features = [
  {
    icon: Percent,
    title: 'Best Interest Rates',
    description: 'We compare rates from 25+ banks to get you the lowest interest rates in the market.',
  },
  {
    icon: Clock,
    title: 'Quick Approval',
    description: 'Get your loan approved within 24-48 hours with minimal documentation required.',
  },
  {
    icon: Shield,
    title: '100% Secure',
    description: 'Your personal and financial data is protected with bank-grade security.',
  },
  {
    icon: FileText,
    title: 'Minimal Documentation',
    description: 'Simple document requirements - just PAN, Aadhaar, ITR, and Bank Statement.',
  },
  {
    icon: CheckCircle,
    title: 'High Approval Rate',
    description: 'Our expert team ensures maximum approval rate with best loan terms.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support via phone and WhatsApp throughout your loan journey.',
  },
];

const benefits = [
  'Lowest interest rates starting from 8.5%',
  '10-20% cashback on first 3 EMIs',
  'Zero prepayment charges',
  'Flexible EMI options',
  'No hidden charges',
  'Dedicated relationship manager',
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The LoanEase Advantage
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make the loan process simple, fast, and transparent
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg card-hover"
            >
              <div className="inline-flex p-3 bg-blue-100 rounded-xl mb-4">
                <feature.icon className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Benefits of Choosing LoanEase
              </h3>
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
                    <span className="text-white text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">8.5%</div>
              <p className="text-gray-600 mb-4">Starting Interest Rate</p>
              <div className="bg-yellow-100 rounded-xl p-4 mb-6">
                <p className="text-yellow-800 font-semibold">
                  Special Offer: 10-20% Cashback on First 3 EMIs
                </p>
              </div>
              <a
                href="/apply"
                className="block w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
