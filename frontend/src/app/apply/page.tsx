'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ApplicationForm from '@/components/ApplicationForm';
import Footer from '@/components/Footer';
import { Shield, Clock, BadgePercent, Phone, MessageCircle } from 'lucide-react';

function ApplyContent() {
  const searchParams = useSearchParams();
  const loanType = searchParams.get('type') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="gradient-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Apply for Your Loan Today
          </h1>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Get the best loan rates with quick approval and minimal documentation
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center space-x-2">
              <Shield className="text-green-400" size={24} />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-green-400" size={24} />
              <span>24hr Approval</span>
            </div>
            <div className="flex items-center space-x-2">
              <BadgePercent className="text-green-400" size={24} />
              <span>10-20% Cashback</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <ApplicationForm defaultLoanType={loanType} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-4">
                <a
                  href="tel:+919876543210"
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Phone className="text-blue-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">Call Us</p>
                    <p className="text-sm text-gray-500">+91 98765 43210</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/919876543210?text=Hi, I want to apply for a loan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <MessageCircle className="text-green-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-500">24/7 Available</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Documents Required */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Documents Required</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">PAN Card</p>
                    <p className="text-sm text-gray-500">Valid PAN card copy</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Aadhaar Card</p>
                    <p className="text-sm text-gray-500">Front and back copy</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">ITR (Last 2 Years)</p>
                    <p className="text-sm text-gray-500">Income tax returns</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Bank Statement</p>
                    <p className="text-sm text-gray-500">Last 6 months</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Cashback Offer */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Special Offer!</h3>
              <p className="text-2xl font-bold mb-2">10-20% Cashback</p>
              <p className="text-yellow-100">On your first 3 EMIs when you get a loan through us!</p>
            </div>

            {/* Process Steps */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Submit Application</p>
                    <p className="text-sm text-gray-500">Fill the form with your details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Get a Call</p>
                    <p className="text-sm text-gray-500">Our team contacts you within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Document Verification</p>
                    <p className="text-sm text-gray-500">Quick verification process</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Loan Disbursement</p>
                    <p className="text-sm text-gray-500">Get your loan with best rates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application form...</p>
        </div>
      </div>
    }>
      <ApplyContent />
    </Suspense>
  );
}
