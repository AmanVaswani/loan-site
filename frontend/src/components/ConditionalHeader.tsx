'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  // Don't show the duplicate Next.js header on the main landing page because code.html has its own ledger header
  if (pathname === '/') {
    return null;
  }
  return <Header />;
}
