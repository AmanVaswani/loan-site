'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Clock, BadgePercent } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center gradient-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white animate-fade-in-up">
            {/* Cashback Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500 text-yellow-900 rounded-full mb-6 font-semibold">
              <BadgePercent className="mr-2" size={20} />
              10-20% Cashback on First 3 EMIs!
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Get the Best Loan Rates in the Market
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Quick approval, minimal documentation, and lowest interest rates starting from just 8.5% p.a.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors group"
              >
                Apply for Loan
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                href="#loans"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore Loan Types
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="text-green-400" size={24} />
                <span className="text-sm text-blue-100">100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="text-green-400" size={24} />
                <span className="text-sm text-blue-100">24hr Approval</span>
              </div>
              <div className="flex items-center space-x-2">
                <BadgePercent className="text-green-400" size={24} />
                <span className="text-sm text-blue-100">Best Rates</span>
              </div>
            </div>
          </div>

          {/* Right Content - Quick Calculator Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Check Your Eligibility</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                <span className="text-gray-600">Loan Amount</span>
                <span className="font-bold text-blue-600">Up to 1 Crore</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                <span className="text-gray-600">Interest Rate</span>
                <span className="font-bold text-green-600">From 8.5% p.a.</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                <span className="text-gray-600">Tenure</span>
                <span className="font-bold text-yellow-600">Up to 30 Years</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                <span className="text-gray-600">Processing Fee</span>
                <span className="font-bold text-purple-600">Minimal</span>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-center mb-6">
              <p className="text-sm mb-1">Special Offer</p>
              <p className="font-bold text-lg">Get 10-20% Cashback on First 3 EMIs</p>
            </div>

            <Link
              href="/apply"
              className="block w-full py-4 bg-blue-600 text-white rounded-xl text-center font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply Now - Free Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Wave Shape */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
