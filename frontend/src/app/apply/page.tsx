'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ApplicationForm from '@/components/ApplicationForm';
import Footer from '@/components/Footer';
import { ShieldCheck, Zap, BadgePercent, Phone, MessageCircle, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

function ApplyContent() {
  const searchParams = useSearchParams();
  const loanType = searchParams.get('type') || '';

  return (
    <div className="min-h-screen bg-[#F5F0E4] text-[#12261B] relative">
      {/* Paper texture overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='.32'/%3E%3C/svg%3E")`
        }}
      />

      {/* Subpage Hero - Dark Ink & Gold Theme matching code.html .page-hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#062015] via-[#0B3222] to-[#0E4A2C] text-white pt-16 pb-20 border-b border-[#0E4A2C]/20">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: `radial-gradient(880px 500px at 82% -8%, rgba(200,148,46,0.35), transparent 62%), repeating-linear-gradient(to bottom, transparent 0 43px, rgba(255,255,255,0.05) 43px 44px)`
          }}
        />

        {/* Ambient watermarks */}
        <div className="absolute right-6 -bottom-10 pointer-events-none select-none font-serif font-bold text-[140px] md:text-[220px] text-white/[0.03] leading-none">
          ₹
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 mb-6">
            <Link href="/#/home" className="hover:text-[#E2BC6A] transition-colors">Home</Link>
            <span className="opacity-40">/</span>
            <span className="text-[#E2BC6A]">Apply Online</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#E2BC6A] font-mono text-[10px] uppercase tracking-[0.2em] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#E2BC6A] animate-pulse" />
                <span>Zero Brokerage · Free Loan Advisory</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.12]">
                Apply for the <em className="italic font-serif font-normal bg-gradient-to-r from-[#8A6118] via-[#F2DFAC] to-[#C8942E] bg-clip-text text-transparent">Cheapest Loan</em> You Qualify For
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
                Compare verified rates across 25+ partner banks and NBFCs. Minimal documentation, lightning-fast processing, and dedicated expert guidance.
              </p>
            </div>

            {/* Quick stats strip */}
            <div className="flex gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-white/15 pt-4 md:pt-0 md:pl-8">
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#8A6118] via-[#F2DFAC] to-[#C8942E] bg-clip-text text-transparent">
                  8.4%
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-white/50 mt-1">Starting Rate</div>
              </div>
              <div className="w-[1px] bg-white/10" />
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#8A6118] via-[#F2DFAC] to-[#C8942E] bg-clip-text text-transparent">
                  24 Hrs
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-white/50 mt-1">Quick Decision</div>
              </div>
              <div className="w-[1px] bg-white/10" />
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#8A6118] via-[#F2DFAC] to-[#C8942E] bg-clip-text text-transparent">
                  ₹0
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-white/50 mt-1">Borrower Fee</div>
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-white/10 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-[#E2BC6A]" size={18} />
              <span>100% RBI Registered Partners</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-[#E2BC6A]" size={18} />
              <span>Instant Digital Pre-Approval</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgePercent className="text-[#E2BC6A]" size={18} />
              <span>Exclusive EMI Cashback Benefit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form + Sidebar Grid */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Application Form Container */}
          <div className="lg:col-span-8">
            <ApplicationForm defaultLoanType={loanType} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct Expert Assistance Card */}
            <div className="bg-[#FCF9F1] rounded-2xl p-6 border border-[#0E4A2C]/15 shadow-sm">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A6118] mb-2 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8942E]" />
                <span>Personal Advisor</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#062015] mb-2">Need Guidance?</h3>
              <p className="text-sm text-[#5E7266] mb-5 leading-relaxed">
                Unsure which loan tier or lender suits your credit profile? Speak with a certified loan advisor directly.
              </p>
              
              <div className="space-y-3">
                <a
                  href="tel:+917389672476"
                  className="flex items-center justify-between p-3.5 bg-white border border-[#0E4A2C]/10 rounded-xl hover:border-[#0E4A2C]/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E6F0E7] flex items-center justify-center text-[#0E4A2C]">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-[#8A9A91]">Call Direct</p>
                      <p className="font-semibold text-sm text-[#062015]">+91 73896 72476</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-[#8A9A91] group-hover:text-[#0E4A2C] group-hover:translate-x-1 transition-all" />
                </a>

                <a
                  href="https://wa.me/917389672476?text=Hi%20Loan%20ki%20Baat,%20I%20need%20help%20with%20a%20loan%20application"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-white border border-[#0E4A2C]/10 rounded-xl hover:border-[#0E4A2C]/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E6F0E7] flex items-center justify-center text-[#0E4A2C]">
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-[#8A9A91]">WhatsApp Desk</p>
                      <p className="font-semibold text-sm text-[#062015]">Instant Response (24/7)</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-[#8A9A91] group-hover:text-[#0E4A2C] group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>

            {/* Required Documents Card */}
            <div className="bg-[#FCF9F1] rounded-2xl p-6 border border-[#0E4A2C]/15 shadow-sm">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A6118] mb-2 font-semibold">
                <FileText size={14} className="text-[#C8942E]" />
                <span>Checklist</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#062015] mb-4">Required Documents</h3>
              
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#E6F0E7] border border-[#0E4A2C]/20 text-[#0E4A2C] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-[#062015] block font-medium">Identity Proof (PAN Card)</strong>
                    <span className="text-xs text-[#5E7266]">Mandatory for tax and credit score validation</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#E6F0E7] border border-[#0E4A2C]/20 text-[#0E4A2C] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-[#062015] block font-medium">Address Proof (Aadhaar / Passport)</strong>
                    <span className="text-xs text-[#5E7266]">Front and back digital copy</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#E6F0E7] border border-[#0E4A2C]/20 text-[#0E4A2C] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-[#062015] block font-medium">Income Verification</strong>
                    <span className="text-xs text-[#5E7266]">Salaried: 3 mos salary slips · Self-Employed: 2 yrs ITR</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#E6F0E7] border border-[#0E4A2C]/20 text-[#0E4A2C] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <strong className="text-[#062015] block font-medium">Bank Statement (Last 6 Months)</strong>
                    <span className="text-xs text-[#5E7266]">Primary bank account statement (PDF)</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Process Timeline Card */}
            <div className="bg-[#08291B] text-white rounded-2xl p-6 border border-white/10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8942E]/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="font-serif text-lg font-bold text-white mb-4">How Approval Works</h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <CheckCircle2 size={16} className="text-[#E2BC6A] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Step 1: Application Review</span>
                    <span className="text-white/60">We evaluate qualification criteria with zero credit score impact.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 size={16} className="text-[#E2BC6A] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Step 2: Best Rate Match</span>
                    <span className="text-white/60">We compare 25+ lenders to identify lowest APR & fees.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 size={16} className="text-[#E2BC6A] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Step 3: Direct Sanction</span>
                    <span className="text-white/60">Sanction letter issued directly by chosen bank or NBFC.</span>
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
      <div className="min-h-screen bg-[#F5F0E4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#0E4A2C] border-t-transparent mx-auto mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#062015]">Loading application ledger...</p>
        </div>
      </div>
    }>
      <ApplyContent />
    </Suspense>
  );
}
