'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, MessageCircle, Send, Loader2, CheckCircle } from 'lucide-react';
import { trackContactFormSubmit, trackContactFormSuccess, trackPhoneClick, trackWhatsAppClick, trackCTAClick } from '@/lib/analytics';

export default function Footer() {
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    trackContactFormSubmit();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        trackContactFormSuccess();
        setContactForm({ name: '', phone: '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#062015] text-white/60 relative overflow-hidden pt-16">
      {/* Top Foil Border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0E4A2C] via-[#C8942E] to-[#0E4A2C]" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Callback Form Card inside Dark Section */}
        <div className="mb-14 p-8 rounded-2xl bg-[#08291B] border border-white/10 shadow-2xl">
          <div className="max-w-2xl mx-auto text-center mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#E2BC6A]">Have Questions?</span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">Get an Expert Callback</h3>
            <p className="text-sm text-white/70 mt-2">Fill the form and an independent advisor will call you within 24 hours.</p>
          </div>

          {submitSuccess ? (
            <div className="max-w-md mx-auto bg-[#0E4A2C] border border-[#1D8B4E] rounded-xl p-6 text-center text-white">
              <CheckCircle className="mx-auto mb-2 text-[#E2BC6A]" size={40} />
              <h4 className="font-serif text-xl font-bold">Request Received</h4>
              <p className="text-sm text-white/80 mt-1">Our loan specialist will call you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="px-4 py-3 bg-[#062015]/80 border border-white/15 rounded-xl text-white placeholder-white/40 focus:border-[#C8942E] focus:outline-none transition-all text-sm"
                />
                <input
                  type="tel"
                  required
                  placeholder="10-digit Phone Number *"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="px-4 py-3 bg-[#062015]/80 border border-white/15 rounded-xl text-white placeholder-white/40 focus:border-[#C8942E] focus:outline-none transition-all text-sm"
                />
              </div>
              <textarea
                placeholder="Loan requirement or question (Optional)"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 bg-[#062015]/80 border border-white/15 rounded-xl text-white placeholder-white/40 focus:border-[#C8942E] focus:outline-none transition-all text-sm mb-4 resize-none"
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-full font-semibold text-sm text-[#062015] bg-gradient-to-r from-[#8A6118] via-[#C8942E] to-[#F2DFAC] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Request Free Callback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div>
            <Link href="/#/home" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-11 h-11 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Loan ki Baat"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif font-bold text-xl text-white tracking-tight">
                  Loan <i className="font-serif italic text-[#C8942E]">ki</i> Baat
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mt-1">
                  Baat hai paiso ki
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              An independent loan comparison and advisory platform helping Indians find the right credit at a fair price — with honesty, clarity and zero borrower fees.
            </p>
            <ul className="space-y-3 text-xs text-white/70">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#E2BC6A]" />
                <a href="tel:+917389672476" onClick={() => trackPhoneClick('Footer')} className="hover:text-white transition-colors">
                  +91 73896 72476 · Mon–Sat, 9 AM – 9 PM IST
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={14} className="text-emerald-400" />
                <a href="https://wa.me/917389672476" onClick={() => trackWhatsAppClick('Footer')} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Support (24/7)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#E2BC6A]" />
                <span>loankibaat.jbp@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#E2BC6A] mt-0.5" />
                <span>4th Floor, Business Park, Andheri East, Mumbai 400069</span>
              </li>
            </ul>
          </div>

          {/* Loan Types */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-white font-medium mb-4">
              Loan Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/apply?type=personal" className="hover:text-[#E2BC6A] transition-colors">Personal Loan</Link></li>
              <li><Link href="/apply?type=home" className="hover:text-[#E2BC6A] transition-colors">Home Loan</Link></li>
              <li><Link href="/apply?type=business" className="hover:text-[#E2BC6A] transition-colors">Business Loan</Link></li>
              <li><Link href="/apply?type=car" className="hover:text-[#E2BC6A] transition-colors">Car Loan</Link></li>
              <li><Link href="/apply?type=education" className="hover:text-[#E2BC6A] transition-colors">Education Loan</Link></li>
              <li><Link href="/apply?type=gold" className="hover:text-[#E2BC6A] transition-colors">Gold Loan</Link></li>
            </ul>
          </div>

          {/* Tools & Company */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-white font-medium mb-4">
              Tools & Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#/tools" className="hover:text-[#E2BC6A] transition-colors">EMI Calculator</Link></li>
              <li><Link href="/#/rates" className="hover:text-[#E2BC6A] transition-colors">Live Rate Board</Link></li>
              <li><Link href="/#/about" className="hover:text-[#E2BC6A] transition-colors">About Us</Link></li>
              <li><Link href="/#/contact" className="hover:text-[#E2BC6A] transition-colors">Contact Support</Link></li>
              <li><Link href="/apply" className="hover:text-[#E2BC6A] transition-colors font-medium text-[#E2BC6A]">Apply for Loan</Link></li>
            </ul>
          </div>

          {/* Trust Badges */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.22em] text-white font-medium mb-4">
              Trust & Security
            </h4>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded border border-white/15 text-white/70">
                SSL Secured
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded border border-white/15 text-white/70">
                Data in India
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded border border-white/15 text-white/70">
                RBI Reg. Partners
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded border border-white/15 text-white/70">
                ISO 27001
              </span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              We protect your data with bank-grade encryption and partner only with RBI-registered lenders.
            </p>
          </div>
        </div>

        {/* Big Wordmark */}
        <div className="font-serif font-bold text-center text-4xl sm:text-6xl md:text-8xl tracking-tighter my-8 bg-gradient-to-r from-[#8A6118] via-[#C8942E] to-[#F2DFAC] bg-clip-text text-transparent select-none opacity-90">
          Loan ki Baat
        </div>

        {/* Legal Disclaimer */}
        <div className="text-[11px] leading-relaxed text-white/40 border-t border-white/10 pt-6 pb-6">
          <strong className="text-white/60">Disclaimer: </strong>
          Loan ki Baat is an independent loan comparison and advisory platform and is not a bank or NBFC lender. We do not sanction, disburse or service credit directly. Interest rates and loan terms are indicative based on partner bank guidelines; actual offers depend on credit evaluation by respective lending institutions. Borrow responsibly.
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-5 border-t border-white/10 text-[11px] font-mono uppercase tracking-wider text-white/40 gap-3">
          <div>© {new Date().getFullYear()} Loan ki Baat · All rights reserved · Proudly Indian</div>
          <div className="flex gap-4">
            <Link href="/#/contact" className="hover:text-[#E2BC6A]">Privacy</Link>
            <Link href="/#/contact" className="hover:text-[#E2BC6A]">Terms</Link>
            <Link href="/#/home" className="hover:text-[#E2BC6A]">Home</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
