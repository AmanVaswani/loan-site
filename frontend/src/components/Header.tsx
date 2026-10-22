'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone } from 'lucide-react';
import { trackPhoneClick, trackCTAClick } from '@/lib/analytics';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F5F0E4]/90 backdrop-blur-md border-b border-[#0E4A2C]/10 transition-all duration-300">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[84px]">
          {/* Brand Logo */}
          <Link href="/#/home" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex-shrink-0 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
              <Image
                src="/logo.png"
                alt="Loan ki Baat Logo"
                fill
                className="object-cover rounded-full shadow-sm"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#062015]">
                Loan <i className="font-serif italic font-normal bg-gradient-to-r from-[#8A6118] via-[#C8942E] to-[#F2DFAC] bg-clip-text text-transparent">ki</i> Baat
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#8A9A91] mt-1.5 font-medium">
                Baat hai paiso ki
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 font-sans">
            <Link href="/#/home" className="px-4 py-2 rounded-full text-[14.5px] font-medium text-[#2C4134] hover:text-[#062015] hover:bg-black/[0.03] transition-colors">
              Home
            </Link>
            <Link href="/#/loans" className="px-4 py-2 rounded-full text-[14.5px] font-medium text-[#2C4134] hover:text-[#062015] hover:bg-black/[0.03] transition-colors">
              Loans
            </Link>
            <Link href="/#/rates" className="px-4 py-2 rounded-full text-[14.5px] font-medium text-[#2C4134] hover:text-[#062015] hover:bg-black/[0.03] transition-colors">
              Rates
            </Link>
            <Link href="/#/tools" className="px-4 py-2 rounded-full text-[14.5px] font-medium text-[#2C4134] hover:text-[#062015] hover:bg-black/[0.03] transition-colors">
              Calculators
            </Link>
            <Link href="/#/about" className="px-4 py-2 rounded-full text-[14.5px] font-medium text-[#2C4134] hover:text-[#062015] hover:bg-black/[0.03] transition-colors">
              About
            </Link>
            <Link href="/#/contact" className="px-4 py-2 rounded-full text-[14.5px] font-medium text-[#2C4134] hover:text-[#062015] hover:bg-black/[0.03] transition-colors">
              Contact
            </Link>
          </nav>

          {/* Header CTA & Phone */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href="tel:+917389672476"
              onClick={() => trackPhoneClick('Header')}
              className="flex flex-col text-right leading-tight"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8A9A91]">Loan Expert</span>
              <strong className="text-[15px] font-semibold text-[#0E4A2C]">+91 73896 72476</strong>
            </a>
            <Link
              href="/apply"
              onClick={() => trackCTAClick('Apply for Loan', 'Header')}
              className="px-5 py-2.5 rounded-full text-[13.5px] font-semibold text-[#062015] shadow-md transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-[#8A6118] via-[#C8942E] to-[#F2DFAC]"
            >
              Apply for Loan
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#0E4A2C] border border-[#0E4A2C]/20 rounded-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#0E4A2C]/10 bg-[#FCF9F1] rounded-b-2xl shadow-xl px-2">
            <nav className="flex flex-col space-y-1">
              <Link href="/#/home" onClick={() => setIsMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#062015] hover:bg-[#0E4A2C]/5">
                Home
              </Link>
              <Link href="/#/loans" onClick={() => setIsMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#062015] hover:bg-[#0E4A2C]/5">
                Loans
              </Link>
              <Link href="/#/rates" onClick={() => setIsMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#062015] hover:bg-[#0E4A2C]/5">
                Rates
              </Link>
              <Link href="/#/tools" onClick={() => setIsMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#062015] hover:bg-[#0E4A2C]/5">
                Calculators
              </Link>
              <Link href="/#/about" onClick={() => setIsMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#062015] hover:bg-[#0E4A2C]/5">
                About
              </Link>
              <Link href="/#/contact" onClick={() => setIsMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#062015] hover:bg-[#0E4A2C]/5">
                Contact
              </Link>
              <div className="pt-3 mt-2 border-t border-[#0E4A2C]/10 flex flex-col gap-2">
                <a
                  href="tel:+917389672476"
                  onClick={() => trackPhoneClick('Header Mobile')}
                  className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#0E4A2C] bg-[#0E4A2C]/5 rounded-lg"
                >
                  <Phone size={16} />
                  <span>+91 73896 72476</span>
                </a>
                <Link
                  href="/apply"
                  onClick={() => { setIsMenuOpen(false); trackCTAClick('Apply for Loan', 'Header Mobile'); }}
                  className="py-2.5 text-center text-sm font-semibold text-[#062015] rounded-lg shadow-sm bg-gradient-to-r from-[#8A6118] via-[#C8942E] to-[#F2DFAC]"
                >
                  Apply for Loan
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
