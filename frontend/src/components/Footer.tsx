'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Get Your Loan?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Apply now and get up to 20% cashback on your first 3 EMIs. Our team will contact you within 24 hours!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/apply"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              Apply for Loan
            </Link>
            <a
              href="https://wa.me/919876543210?text=Hi, I want to apply for a loan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-8 py-4 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="mr-2" size={20} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <span className="text-xl font-bold">LoanEase</span>
              </div>
              <p className="text-gray-400 mb-6">
                Your trusted partner for all loan needs. We help you find the best loan rates from India&apos;s leading banks.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-400 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-700 transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {/* Loan Types */}
            <div>
              <h3 className="text-lg font-bold mb-6">Loan Types</h3>
              <ul className="space-y-3">
                <li><Link href="/apply?type=personal" className="text-gray-400 hover:text-white transition-colors">Personal Loan</Link></li>
                <li><Link href="/apply?type=home" className="text-gray-400 hover:text-white transition-colors">Home Loan</Link></li>
                <li><Link href="/apply?type=business" className="text-gray-400 hover:text-white transition-colors">Business Loan</Link></li>
                <li><Link href="/apply?type=car" className="text-gray-400 hover:text-white transition-colors">Car Loan</Link></li>
                <li><Link href="/apply?type=education" className="text-gray-400 hover:text-white transition-colors">Education Loan</Link></li>
                <li><Link href="/apply?type=gold" className="text-gray-400 hover:text-white transition-colors">Gold Loan</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="#loans" className="text-gray-400 hover:text-white transition-colors">Our Loans</Link></li>
                <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Why Choose Us</Link></li>
                <li><Link href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</Link></li>
                <li><Link href="/apply" className="text-gray-400 hover:text-white transition-colors">Apply Now</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Phone className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white">+91 98765 43210</p>
                    <p className="text-gray-400 text-sm">Mon-Sat: 9AM - 7PM</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <MessageCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white">WhatsApp</p>
                    <p className="text-gray-400 text-sm">24/7 Available</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Mail className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white">support@loanease.com</p>
                    <p className="text-gray-400 text-sm">We reply within 24 hours</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="text-red-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white">Mumbai, Maharashtra</p>
                    <p className="text-gray-400 text-sm">India</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} LoanEase. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
